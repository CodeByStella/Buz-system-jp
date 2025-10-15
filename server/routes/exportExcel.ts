import { Request, Response } from "express";
import Excel from "exceljs";
import path from "path";
import { Data } from "@/models/data";
import { writeFileSync } from "fs";

interface CellData {
  sheet: string;
  cell: string;
  value: string | number;
}

const sheetNames = {
  start: "スタート",
  mq_current_status: "MQ（現状）",
  profit: "①利益",
  mq_future: "②⑧MQ（未来）",
  salary: "③給料",
  expenses: "④経費",
  manufacturing_labor: "⑤製造原価 (人）",
  manufacturing_expenses: "⑥製造（経費)",
  manufacturing_income: "⑦原価詳細",
  break_even_point: "損益分岐点",
  progress_result_input: "進捗実績値入力シート",
  sales_plan_by_department: "部門別販売計画",
  profit_planing_table: "利益計画表",
};

export const exportExcel = async (req: Request, res: Response) => {
  try {
    // Only Mongoose query to get cell, sheet, value where value is number or does not start with "="
    const data4Exp: CellData[] = (
      await Data.find(
        {
          $and: [
            {
              $or: [
                { value: { $type: "number" } },
                { value: { $type: "string", $not: /^=/ } },
              ],
            },
            { $and: [{ value: { $ne: 0 } }, { value: { $ne: "0" } }] },
          ],
        },
        "cell sheet value"
      )
    ).map((item: CellData) => ({
      sheet: sheetNames[item.sheet as keyof typeof sheetNames],
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
    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(templatePath);

    // Fill cells
    data4Exp.forEach((item) => {
      const sheet = workbook.getWorksheet(item.sheet);
      if (!sheet) return;
      const cell = sheet.getCell(item.cell);
      cell.value = item.value;
    });

    // Instead of saving Excel, save data4Exp to JSON
    const jsonSavePath = path.join(process.cwd(), "templates/data_export.json");
    writeFileSync(jsonSavePath, JSON.stringify(data4Exp, null, 2), "utf-8");
    // Export file
    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=result.xlsx");
    res.send(buffer);
  } catch (error) {
    console.error("Excel export failed:", error);
    res.status(500).send("Failed to export Excel");
  }
};
