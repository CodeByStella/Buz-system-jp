import { Response } from "express";
import path from "path";
import {
  writeFileSync,
  unlinkSync,
  readFileSync,
  existsSync,
  mkdirSync,
} from "fs";
import { exec } from "child_process";
import { promisify } from "util";
import AdmZip from "adm-zip";
import { XMLParser, XMLBuilder } from "fast-xml-parser";
import { Data } from "@/models/data";
import { AuthenticatedRequest } from "@/middleware/auth";

const execAsync = promisify(exec);

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

// ---------------------------------------------------------------------------
// Utility: Modify Excel XML directly
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

  let targetRow = rows.find((r: any) => parseInt(r["@_r"], 10) === rowNum);
  if (!targetRow) {
    targetRow = { "@_r": rowNum.toString(), c: [] };
    if (Array.isArray(sheetData.row)) sheetData.row.push(targetRow);
    else sheetData.row = [targetRow];
  }

  const cells = Array.isArray(targetRow.c)
    ? targetRow.c
    : [targetRow.c].filter(Boolean);
  let targetCell = cells.find((c: any) => c["@_r"] === cellRef);
  if (!targetCell) {
    targetCell = { "@_r": cellRef };
    cells.push(targetCell);
  }

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

// ---------------------------------------------------------------------------
// Utility: Get LibreOffice executable path
function getLibreOfficePath(): string {
  switch (process.platform) {
    case "win32":
      return "C:\\Program Files\\LibreOffice\\program\\soffice.exe";
    case "darwin":
      return "/Applications/LibreOffice.app/Contents/MacOS/soffice";
    case "linux":
      return "libreoffice";
    default:
      return "soffice";
  }
}

// ---------------------------------------------------------------------------
// Utility: Get Windows-specific headless flags
function getWindowsHeadlessFlags(): string {
  if (process.platform === "win32") {
    return "--headless --invisible --nologo --nodefault --nofirststartwizard --norestore --nocrashreport --nofirststartwizard --minimized --norestore";
  }
  return "--headless --invisible --nologo --nodefault --nofirststartwizard --norestore --nocrashreport";
}

// ---------------------------------------------------------------------------
// Utility: Check if LibreOffice is available
async function checkLibreOfficeAvailable(): Promise<boolean> {
  try {
    const sofficePath = getLibreOfficePath();
    // Use headless flags even for version check to prevent GUI
    await execAsync(`"${sofficePath}" --headless --invisible --version`, {
      timeout: 10000,
      env: {
        ...process.env,
        DISPLAY: "",
        LIBREOFFICE_HEADLESS: "1",
        ...(process.platform === "win32" && {
          LIBREOFFICE_NO_GUI: "1",
          LIBREOFFICE_SILENT: "1"
        })
      }
    });
    return true;
  } catch (error) {
    console.warn("LibreOffice not found, trying alternative paths...");
    
    // Try alternative paths
    const alternatives = [
      "soffice",
      "libreoffice",
      "/usr/bin/libreoffice",
      "/usr/local/bin/libreoffice"
    ];
    
    for (const alt of alternatives) {
      try {
        await execAsync(`"${alt}" --headless --invisible --version`, {
          timeout: 10000,
          env: {
            ...process.env,
            DISPLAY: "",
            LIBREOFFICE_HEADLESS: "1",
            ...(process.platform === "win32" && {
              LIBREOFFICE_NO_GUI: "1",
              LIBREOFFICE_SILENT: "1"
            })
          }
        });
        return true;
      } catch (e) {
        // Continue trying
      }
    }
    
    return false;
  }
}

// ---------------------------------------------------------------------------
// Utility: Create LibreOffice profile with formula recalculation enabled
async function createLibreOfficeProfile(profileDir: string): Promise<void> {
  const userDir = path.join(profileDir, "user");
  mkdirSync(userDir, { recursive: true });
  
  // Create registrymodifications.xcu with formula recalculation enabled
  const registryContent = `<?xml version="1.0" encoding="UTF-8"?>
<oor:component-data xmlns:oor="http://openoffice.org/2001/registry" xmlns:xs="http://www.w3.org/2001/XMLSchema" oor:name="Calc" oor:package="org.openoffice.Office">
  <node oor:name="Formula">
    <node oor:name="Load">
      <prop oor:name="ODFRecalcMode" oor:type="xs:int">
        <value>0</value>
      </prop>
      <prop oor:name="OOXMLRecalcMode" oor:type="xs:int">
        <value>0</value>
      </prop>
    </node>
  </node>
</oor:component-data>`;

  writeFileSync(path.join(userDir, "registrymodifications.xcu"), registryContent, "utf8");
  
  // Create basic directory structure
  mkdirSync(path.join(userDir, "basic"), { recursive: true });
  mkdirSync(path.join(userDir, "config"), { recursive: true });
  mkdirSync(path.join(userDir, "database"), { recursive: true });
  mkdirSync(path.join(userDir, "gallery"), { recursive: true });
  mkdirSync(path.join(userDir, "palette"), { recursive: true });
  mkdirSync(path.join(userDir, "template"), { recursive: true });
}

// ---------------------------------------------------------------------------
// Utility: Create LibreOffice macro for formula recalculation and PDF export
async function createRecalcMacro(profileDir: string): Promise<void> {
  const basicDir = path.join(profileDir, "user", "basic", "Standard");
  mkdirSync(basicDir, { recursive: true });

  const macroCode = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE script:module PUBLIC "-//OpenOffice.org//DTD OfficeDocument 1.0//EN" "script.dtd">
<script:module xmlns:script="http://openoffice.org/2000/script" script:name="Module1" script:language="StarBasic">
Sub ForceRecalcAndExportPDF
    Dim oDoc As Object
    Dim args()
    Dim pdfProps(1) As New com.sun.star.beans.PropertyValue
    Dim inputFile As String
    Dim outputFile As String
    
    inputFile = Environ("INPUT_FILE")
    outputFile = Environ("OUTPUT_FILE")
    
    ' Load the document
    oDoc = StarDesktop.loadComponentFromURL(ConvertToURL(inputFile), "_blank", 0, args())
    If IsNull(oDoc) Then 
        Print "Failed to open document: " & inputFile
        Exit Sub
    End If
    
    ' Force recalculation of all formulas
    oDoc.calculateAll()
    
    ' Wait a moment for calculation to complete
    Wait 1000
    
    ' Set PDF export properties
    pdfProps(0).Name = "FilterName"
    pdfProps(0).Value = "calc_pdf_Export"
    pdfProps(1).Name = "FilterData"
    pdfProps(1).Value = Array()
    
    ' Export to PDF
    oDoc.storeToURL(ConvertToURL(outputFile), pdfProps())
    
    ' Close document
    oDoc.close(True)
    
    Print "PDF export completed: " & outputFile
End Sub
</script:module>`;

  writeFileSync(path.join(basicDir, "Module1.xba"), macroCode, "utf8");
}

// ---------------------------------------------------------------------------
// Main export logic
export const exportPDF = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    // Query dynamic data
    const data4Exp: CellData[] = (
      await Data.find(
        {
          user: userId,
          $or: [
            { value: { $type: "number", $ne: 0 } },
            { value: { $type: "string", $not: /^=/, $nin: ["0", ""] } },
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

    // Load Excel template
    const templatePath = path.join(process.cwd(), "templates/template.xlsx");
    const zip = new AdmZip(templatePath);

    // Inject new data into Excel XML
    for (const item of data4Exp) {
      const sheetPath = sheetPaths[item.sheet];
      if (!sheetPath) continue;
      const entry = zip.getEntry(sheetPath);
      if (!entry) continue;
      const xml = entry.getData().toString("utf8");
      const modifiedXml = setCellValueInSheetXml(xml, item.cell, item.value);
      zip.updateFile(sheetPath, Buffer.from(modifiedXml, "utf8"));
    }

    // Mark workbook to recalc on open
    const workbookEntry = zip.getEntry("xl/workbook.xml");
    if (workbookEntry) {
      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "@_",
      });
      const builder = new XMLBuilder({
        ignoreAttributes: false,
        attributeNamePrefix: "@_",
      });
      const workbookXml = workbookEntry.getData().toString("utf8");
      const workbookObj = parser.parse(workbookXml);
      workbookObj.workbook.calcPr = { "@_fullCalcOnLoad": "1" };
      zip.updateFile(
        "xl/workbook.xml",
        Buffer.from(builder.build(workbookObj), "utf8")
      );
    }

    // Save modified Excel file
    const tempDir = path.join(process.cwd(), "temp");
    mkdirSync(tempDir, { recursive: true });
    const tempExcelPath = path.join(tempDir, `export_${Date.now()}.xlsx`);
    writeFileSync(tempExcelPath, zip.toBuffer());

    // Skip LibreOffice availability check to avoid GUI windows
    // We'll handle errors during the actual conversion process
    console.log("Skipping LibreOffice availability check to prevent GUI windows...");

    // Create LibreOffice profile with formula recalculation enabled
    const userProfileDir = path.join(tempDir, "libreoffice-profile");
    await createLibreOfficeProfile(userProfileDir);
    await createRecalcMacro(userProfileDir);

    // Get LibreOffice path
    const sofficePath = getLibreOfficePath();
    const tempPdfPath = tempExcelPath.replace(".xlsx", ".pdf");

    console.log(`Converting Excel to PDF with formula recalculation: ${tempExcelPath} -> ${tempPdfPath}`);

    // Try method 1: Registry-based recalculation with direct conversion
    let conversionSuccessful = false;
    try {
      console.log("Attempting registry-based formula recalculation...");
      const headlessFlags = getWindowsHeadlessFlags();
      await execAsync(
        `"${sofficePath}" ${headlessFlags} ` +
        `-env:UserInstallation="file:///${userProfileDir.replace(/\\/g, "/")}" ` +
        `--convert-to pdf:calc_pdf_Export --outdir "${tempDir}" "${tempExcelPath}"`,
        {
          timeout: 60000, // 60 second timeout
          env: {
            ...process.env,
            // Additional environment variables for formula calculation
            LIBREOFFICE_CALC_RECALC: "1",
            LIBREOFFICE_CALC_FORCE_RECALC: "1",
            // Force headless mode
            DISPLAY: "",
            LIBREOFFICE_HEADLESS: "1",
            // Windows-specific environment variables
            ...(process.platform === "win32" && {
              LIBREOFFICE_NO_GUI: "1",
              LIBREOFFICE_SILENT: "1"
            })
          }
        }
      );
      
      if (existsSync(tempPdfPath)) {
        conversionSuccessful = true;
        console.log("Registry-based conversion successful");
      }
    } catch (error) {
      console.warn("Registry-based conversion failed, trying macro method...", error);
    }

    // Try method 2: Macro-based recalculation if method 1 failed
    if (!conversionSuccessful) {
      try {
        console.log("Attempting macro-based formula recalculation...");
        const headlessFlags = getWindowsHeadlessFlags();
        await execAsync(
          `"${sofficePath}" ${headlessFlags} ` +
          `-env:UserInstallation="file:///${userProfileDir.replace(/\\/g, "/")}" ` +
          `"macro:///Standard.Module1.ForceRecalcAndExportPDF()"`,
          {
            timeout: 60000, // 60 second timeout
            env: {
              ...process.env,
              INPUT_FILE: tempExcelPath.replace(/\\/g, "/"),
              OUTPUT_FILE: tempPdfPath.replace(/\\/g, "/"),
              // Force headless mode
              DISPLAY: "",
              LIBREOFFICE_HEADLESS: "1",
              // Windows-specific environment variables
              ...(process.platform === "win32" && {
                LIBREOFFICE_NO_GUI: "1",
                LIBREOFFICE_SILENT: "1"
              })
            }
          }
        );
        
        if (existsSync(tempPdfPath)) {
          conversionSuccessful = true;
          console.log("Macro-based conversion successful");
        }
      } catch (error) {
        console.warn("Macro-based conversion failed", error);
      }
    }

    // Check if PDF was created
    if (!conversionSuccessful || !existsSync(tempPdfPath)) {
      throw new Error("PDF conversion failed - both registry and macro methods failed");
    }

    console.log(`PDF conversion successful: ${tempPdfPath}`);

    // Serve PDF
    const pdfBuffer = readFileSync(tempPdfPath);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="result.pdf"');
    res.send(pdfBuffer);

    // Cleanup temporary files
    try {
      if (existsSync(tempExcelPath)) {
        unlinkSync(tempExcelPath);
      }
      if (existsSync(tempPdfPath)) {
        unlinkSync(tempPdfPath);
      }
    } catch (cleanupError) {
      console.warn("Failed to clean up temporary files:", cleanupError);
    }
  } catch (error) {
    console.error("PDF export failed:", error);
    res.status(500).send("Failed to export PDF");
  }
};
