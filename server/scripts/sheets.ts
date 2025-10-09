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

let initialData: DataType[] = [];

const buildStartSheetData = () => {
  initialData = [
    {
      user:"",
      sheet: "start",
      cell: "A1",
      value: 0,
    },
  ];
};

const  buildMQCurrentStatusSheetData = () => {
  initialData = [
    {
      user:"",
      sheet: "mq_current_status",
      cell: "A1",
      value: 0,
    },
  ];
};

const buildProfitSheetData = () => {
  initialData = [
    {
      user:"",
      sheet: "profit",
      cell: "A1",
      value: 0,
    },
  ];
};

const buildMQFutureSheetData = () => {
  initialData = [
    {
      user:"",
      sheet: "mq_future",
      cell: "A1",
      value: 0,
    },
  ];
};

const buildSalarySheetData = () => {
  initialData = [
    {
      user:"",
      sheet: "salary",
      cell: "A1",
      value: 0,
    },
  ];
};

const buildExpensesSheetData = () => {
  initialData = [
    {
      user:"",
      sheet: "expenses",
      cell: "A1",
      value: 0,
    },
  ];
};

const buildManufacturingCostPersonSheetData = () => {
  initialData = [
    {
      user:"",
      sheet: "manufacturing_labor",
      cell: "A1",
      value: 0,
    },
  ];
};

const buildManufacturingExpensesSheetData = () => {
  initialData = [
    {
      user:"",
      sheet: "manufacturing_expenses",
      cell: "A1",
      value: 0,
    },
  ];
};

const buildCostDetailSheetData = () => {
  initialData = [
    {
      user:"",
      sheet: "manufacturing_income",
      cell: "A1",
      value: 0,
    },
  ];
};

const buildBreakEvenPointSheetData = () => {
  initialData = [
    {
      user:"",
      sheet: "break_even_point",
      cell: "A1",
      value: 0,
    },
  ];
};

const buildProgressResultInputSheetData = () => {
  initialData = [
    {
      user:"",
      sheet: "progress_result_input",
      cell: "A1",
      value: 0,
    },
  ];
};

const buildSalesPlanByDepartmentSheetData = () => {
  initialData = [
    {
      user:"",
      sheet: "sales_plan_by_department",
      cell: "A1",
      value: 0,
    },
  ];
};

const buildProfitPlaningTableSheetData = () => {
  initialData = [
    {
      user:"",
      sheet: "profit_planing_table",
      cell: "A1",
      value: 0,
    },
  ];
};



export const startDataSeed = async () => {
  await Data.updateOne({}, { $set: initialData }, { upsert: true });
};
