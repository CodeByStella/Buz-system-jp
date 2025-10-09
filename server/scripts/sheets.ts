//スタート Start
//MQ（現状） MQCurrentStatus
//①利益 Profit
//②⑧MQ（未来） MQFuture
//③給料 Salary
//④経費 Expenses
//⑤製造原価(人) ManufacturingCostPerson
//⑥製造（経費) ManufacturingExpenses
//⑦原価詳細 CostDetail
//損益分岐点 BreakEvenPoint
//進捗実績値入力シート ProgressResultInput
//部門別販売計画 SalesPlanByDepartment
//利益計画表 ProfitPlaningTable

import { Data, DataType } from "@/models/data";

// Helper function to build sheet data
const buildSheetData = (
  sheetName: string,
  data: { [cell: string]: string | number }
): DataType[] => {
  return Object.entries(data).map(
    ([cell, val]): DataType => ({
      user: "",
      sheet: sheetName,
      cell,
      value: typeof val === "number" ? val : 0,
      formula: typeof val === "string" ? val : "",
    })
  );
};

// Sheet data definitions
const sheetsData: Record<string, { [cell: string]: string | number }> = {
  start: {
    A1: 0,
    A2: 0,
    A3: 0,
    A4: 0,
    A5: 0,
  },
  mq_current_status: { A1: 0 },
  profit: { A1: 0 },
  mq_future: { A1: 0 },
  salary: { A1: 0 },
  expenses: { A1: 0 },
  manufacturing_labor: { A1: 0 },
  manufacturing_expenses: { A1: 0 },
  manufacturing_income: { A1: 0 },
  break_even_point: { A1: 0 },
  progress_result_input: { A1: 0 },
  sales_plan_by_department: { A1: 0 },
  profit_planing_table: { A1: 0 },
};

export const seedAllSheets = async () => {
  // Build all sheet data
  const allData: DataType[] = Object.entries(sheetsData).flatMap(
    ([sheetName, data]) => buildSheetData(sheetName, data)
  );

  // Use bulkWrite for efficient upsert operations
  const bulkOps = allData.map((item) => ({
    updateOne: {
      filter: { user: item.user, sheet: item.sheet, cell: item.cell },
      update: { $set: item },
      upsert: true,
    },
  }));

  await Data.bulkWrite(bulkOps);
};
