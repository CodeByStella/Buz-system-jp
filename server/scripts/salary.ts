import { SalarySheet } from "@/models/sheets/salary";

const data = {};

const salarySeed = async () => {
  await SalarySheet.updateOne({}, { $set: data }, { upsert: true });
};
