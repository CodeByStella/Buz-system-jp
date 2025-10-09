import { ManufacturingCostPersonSheet } from "@/models/sheets/manufacturing_cost_person";

const data = {};

const manufacturingCostPersonSeed = async () => {
  await ManufacturingCostPersonSheet.updateOne({}, { $set: data }, { upsert: true });
};
