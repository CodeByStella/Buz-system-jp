import { Request, Response } from "express";
import path from "path";
import {
  writeFileSync,
  unlinkSync,
  readFileSync,
  existsSync,
  mkdirSync,
} from "fs";
import AdmZip from "adm-zip";
import { XMLParser, XMLBuilder } from "fast-xml-parser";
import { Data } from "@/models/data";
import ConvertAPI from "convertapi";

interface CellData {
  sheet: string;
  cell: string;
  value: string | number;
}

const sheetPaths: Record<string, string> = {
  start: "xl/worksheets/sheet1.xml",
  mq_current_status: "xl/worksheets/sheet2.xml",
  profit: "xl/worksheets/sheet3.xml",
  mq_future: "xl/worksheets/sheet4.xml",
  salary: "xl/worksheets/sheet5.xml",
  expenses: "xl/worksheets/sheet6.xml",
  manufacturing_labor: "xl/worksheets/sheet7.xml",
  manufacturing_expenses: "xl/worksheets/sheet8.xml",
  manufacturing_income: "xl/worksheets/sheet9.xml",
  break_even_point: "xl/worksheets/sheet10.xml",
  progress_result_input: "xl/worksheets/sheet11.xml",
  sales_plan_by_department: "xl/worksheets/sheet12.xml",
  profit_planing_table: "xl/worksheets/sheet13.xml",
};

function setCellValueInSheetXml(
  sheetXml: string,
  cellRef: string,
  newValue: string | number
): string {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
  });
  const builder = new XMLBuilder({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
  });
  const obj = parser.parse(sheetXml);

  const sheetData = obj.worksheet.sheetData;
  if (!sheetData) return sheetXml;

  const rows = Array.isArray(sheetData.row) ? sheetData.row : [sheetData.row];
  const rowNum = parseInt(cellRef.replace(/[^0-9]/g, ""), 10);

  // Find or create the target row
  let targetRow = rows.find((r: any) => parseInt(r["@_r"], 10) === rowNum);
  if (!targetRow) {
    targetRow = { "@_r": rowNum.toString(), c: [] };
    if (Array.isArray(sheetData.row)) sheetData.row.push(targetRow);
    else sheetData.row = [targetRow];
  }

  // Find or create the cell
  const cells = Array.isArray(targetRow.c)
    ? targetRow.c
    : [targetRow.c].filter(Boolean);
  let targetCell = cells.find((c: any) => c["@_r"] === cellRef);
  if (!targetCell) {
    targetCell = { "@_r": cellRef };
    cells.push(targetCell);
  }

  // Write the new value as inline string (preserves sharedStrings integrity)
  if (typeof newValue === "number") {
    delete targetCell["@_t"];
    targetCell.v = newValue.toString();
    delete targetCell.is;
  } else {
    targetCell["@_t"] = "inlineStr";
    targetCell.is = { t: newValue.toString() };
    delete targetCell.v;
  }

  targetRow.c = cells;
  return builder.build(obj);
}

export const exportPDF = async (req: Request, res: Response) => {
  try {
    // Query data
    const data4Exp: CellData[] = (
      await Data.find(
        {
          $or: [
            { value: { $type: "number", $ne: 0 } }, // number and not 0
            {
              value: {
                $type: "string",
                $not: /^=/,
                $nin: ["0", ""],
              },
            },
          ],
        },
        "cell sheet value"
      )
    ).map((item: CellData) => ({
      sheet: item.sheet,
      cell: item.cell,
      value:
        typeof item.value === "string" && !isNaN(Number(item.value))
          ? Number(item.value)
          : item.value,
    }));

    const templatePath = path.join(
      process.cwd(),
      "templates/base_template.xlsx"
    );
    const zip = new AdmZip(templatePath);

    // Modify each sheet directly in the zip
    for (const item of data4Exp) {
      const sheetPath = sheetPaths[item.sheet];
      if (!sheetPath) continue;

      const entry = zip.getEntry(sheetPath);
      if (!entry) continue;

      const xml = entry.getData().toString("utf8");
      const modifiedXml = setCellValueInSheetXml(xml, item.cell, item.value);
      zip.updateFile(sheetPath, Buffer.from(modifiedXml, "utf8"));
    }

    // ⚙️ Force Excel to recalc formulas when opened
    const workbookEntry = zip.getEntry("xl/workbook.xml");
    if (workbookEntry) {
      const workbookXml = workbookEntry.getData().toString("utf8");
      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "@_",
      });
      const builder = new XMLBuilder({
        ignoreAttributes: false,
        attributeNamePrefix: "@_",
      });
      const workbookObj = parser.parse(workbookXml);

      if (!workbookObj.workbook.calcPr) {
        workbookObj.workbook.calcPr = { "@_fullCalcOnLoad": "1" };
      } else {
        workbookObj.workbook.calcPr["@_fullCalcOnLoad"] = "1";
      }

      const modifiedWorkbookXml = builder.build(workbookObj);
      zip.updateFile(
        "xl/workbook.xml",
        Buffer.from(modifiedWorkbookXml, "utf8")
      );
    }

    // Generate Excel buffer and save to temporary file
    const excelBuffer = zip.toBuffer();
    const tempExcelPath = path.join(
      process.cwd(),
      "temp",
      `export_${Date.now()}.xlsx`
    );

    // Ensure temp directory exists
    const tempDir = path.dirname(tempExcelPath);
    if (!existsSync(tempDir)) {
      mkdirSync(tempDir, { recursive: true });
    }

    // Write Excel buffer to temporary file
    writeFileSync(tempExcelPath, excelBuffer);

    // Convert Excel to PDF using ConvertAPI
    const convertapi = new ConvertAPI(process.env.CONVERTAPI_SECRET || "");
    // keep-alive headers to prevent proxy timeouts
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Keep-Alive", "timeout=120");
    // extend server-side timeout for long conversions
    res.setTimeout(180000);

    const result = await convertapi.convert(
      "pdf",
      {
        File: tempExcelPath,
      },
      "xlsx"
    );

    // Save the PDF to a temporary file and read it back
    const tempPdfPath = path.join(
      process.cwd(),
      "temp",
      `export_${Date.now()}.pdf`
    );
    await result.file.save(tempPdfPath);
    const pdfBuffer = readFileSync(tempPdfPath);

    // Clean up PDF temporary file
    try {
      unlinkSync(tempPdfPath);
    } catch (error) {
      console.warn("Failed to delete PDF temporary file:", error);
    }

    // Clean up temporary file
    try {
      unlinkSync(tempExcelPath);
    } catch (error) {
      console.warn("Failed to delete temporary file:", error);
    }

    // Send PDF response
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="result.pdf"');
    res.send(pdfBuffer);
  } catch (error) {
    console.error("PDF export failed:", error);
    res.status(500).send("Failed to export PDF");
  }
};
