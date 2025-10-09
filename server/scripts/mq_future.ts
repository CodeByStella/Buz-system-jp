import { MQFutureSheet } from "@/models/sheets/mq_future";

const data = {};

const mqFutureSeed = async () => {
  await MQFutureSheet.updateOne({}, { $set: data }, { upsert: true });
};
