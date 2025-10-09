import { ExpensesSheet } from "@/models/sheets/expenses";

const data = {};

const expensesSeed = async () => {
  await ExpensesSheet.updateOne({}, { $set: data }, { upsert: true });
};
