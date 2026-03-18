/**
 * Remove all non-formula values for the company_rating workbook from the database.
 * Keeps only records whose value is a formula (string starting with "=").
 * Run: npm run db:clear-company-rating-values
 */
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { Data } from "@/models/data";

const WORKBOOK = "company_rating";

function isFormula(value: unknown): boolean {
  return typeof value === "string" && value.trim().startsWith("=");
}

async function clearNonFormulaValues() {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error("Missing MONGO_URI or MONGODB_URI");
    process.exit(1);
  }

  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB\n");

  try {
    const all = await Data.find({ workbook: WORKBOOK }).lean();
    const toDelete = all.filter((doc: any) => !isFormula(doc.value));
    const toKeep = all.filter((doc: any) => isFormula(doc.value));

    console.log(`[${WORKBOOK}] Total records: ${all.length}`);
    console.log(`[${WORKBOOK}] Formula records (kept): ${toKeep.length}`);
    console.log(`[${WORKBOOK}] Non-formula records (will delete): ${toDelete.length}`);

    if (toDelete.length === 0) {
      console.log("\nNothing to delete.");
      return;
    }

    const ids = toDelete.map((d: any) => d._id);
    const result = await Data.deleteMany({ _id: { $in: ids } });
    console.log(`\nDeleted ${result.deletedCount} non-formula record(s).`);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

clearNonFormulaValues()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
