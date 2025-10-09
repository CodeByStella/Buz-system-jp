import { BreakEvenPointSheet } from "@/models/sheets/break_even_point";

const data = {};

const breakEvenPointSeed = async () => {
  await BreakEvenPointSheet.updateOne({}, { $set: data }, { upsert: true });
};
