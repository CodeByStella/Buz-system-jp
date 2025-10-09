import { CostDetailSheet } from "@/models/sheets/cost_detail";

const data = {};

const costDetailSeed = async () => {
  await CostDetailSheet.updateOne({}, { $set: data }, { upsert: true });
};
