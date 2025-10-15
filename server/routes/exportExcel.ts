import { Request, Response } from "express";
import Excel from "exceljs";
import path from "path";
import fs from "fs";

interface CellData {
  sheet: string;
  cell: string;
  value: string | number;
}

// Example mock data from DB
const mockData: CellData[] = [
  { sheet: "スタート", cell: "B3", value: "ひながた" },
  { sheet: "スタート", cell: "E5", value: 355 },
  { sheet: "スタート", cell: "E6", value: "=E5*0.36" },
  { sheet: "スタート", cell: "E7", value: "36.6%" },
];

export const exportExcel = async (req: Request, res: Response) => {
  try {
    const templatePath = path.join(
      __dirname,
      "../templates/base_template.xlsx"
    );
    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(templatePath);

    // Here, you'd fetch DB data like: const data = await prisma.inputs.findMany();
    const data = mockData;

    // Fill cells
    data.forEach((item) => {
      const sheet = workbook.getWorksheet(item.sheet);
      if (!sheet) return;
      const cell = sheet.getCell(item.cell);
      cell.value = item.value;
    });

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
