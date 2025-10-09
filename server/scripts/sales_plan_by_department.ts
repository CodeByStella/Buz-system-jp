import { SalesPlanByDepartmentSheet } from "@/models/sheets/sales_plan_by_department";

const data = {};

const salesPlanByDepartmentSeed = async () => {
  await SalesPlanByDepartmentSheet.updateOne({}, { $set: data }, { upsert: true });
};
