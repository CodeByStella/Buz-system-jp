import { ProfitSheet } from "@/models/sheets/profit";

const data = {};

const profitSeed = async () => {
  await ProfitSheet.updateOne({}, { $set: data }, { upsert: true });
};
