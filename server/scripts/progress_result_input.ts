import { ProgressResultInputSheet } from "@/models/sheets/progress_result_input";

const data = {};

const progressResultInputSeed = async () => {
  await ProgressResultInputSheet.updateOne({}, { $set: data }, { upsert: true });
};
