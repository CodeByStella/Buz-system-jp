/**
 * One-time migration: set workbook: 'pdca' for all existing documents
 * that do not have the workbook field (legacy data).
 */
import "dotenv/config";
import mongoose from "mongoose";
import { Data } from "@/models/data";

async function main() {
  const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/buz-sys-jp";
  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB");

  const result = await Data.updateMany(
    { workbook: { $exists: false } },
    { $set: { workbook: "pdca" } }
  );
  console.log(`Migration complete: ${result.modifiedCount} documents updated with workbook: 'pdca'`);

  await mongoose.disconnect();
  console.log("Disconnected from MongoDB");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
