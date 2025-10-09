import { MqCurrentStatusSheet } from "@/models/sheets/mq_current_status";

const data = {};

const mqCurrentStatusSeed = async () => {
  await MqCurrentStatusSheet.updateOne({}, { $set: data }, { upsert: true });
};
