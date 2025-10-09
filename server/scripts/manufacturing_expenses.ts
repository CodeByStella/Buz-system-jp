import { ManufacturingExpensesSheet } from "@/models/sheets/manufacturing_expenses";

const data = {};

const manufacturingExpensesSeed = async () => {
  await ManufacturingExpensesSheet.updateOne({}, { $set: data }, { upsert: true });
};
