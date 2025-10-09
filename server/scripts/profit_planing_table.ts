import { ProfitPlaningTableSheet } from "@/models/sheets/profit_planing_table";

const data = {};

const profitPlaningTableSeed = async () => {
  await ProfitPlaningTableSheet.updateOne({}, { $set: data }, { upsert: true });
};
