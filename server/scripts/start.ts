import { StartSheet } from "@/models/sheets/start";

const data = {};

const startSeed = async () => {
  await StartSheet.updateOne({}, { $set: data }, { upsert: true });
};
