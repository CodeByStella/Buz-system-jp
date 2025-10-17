import "dotenv/config";
import { connectToDatabase } from "../lib/mongo";
import { User } from "../models/user";
import { hashPassword } from "../lib/auth";
import { seedSheetsForUser } from "./sheets";

async function main() {
  await connectToDatabase();

  // Upsert admin
  const adminPassword = await hashPassword("admin123");
  const adminUpsert = await User.updateOne(
    { email: "admin@example.com" },
    {
      $setOnInsert: { 
        name: "管理者", 
        password: adminPassword, 
        role: "ADMIN",
        status: "ACTIVE"
      },
    },
    { upsert: true }
  );

  // Upsert user
  const userPassword = await hashPassword("user123");
  const userUpsert = await User.updateOne(
    { email: "user@example.com" },
    {
      $setOnInsert: {
        name: "一般ユーザー",
        password: userPassword,
        role: "USER",
        status: "ACTIVE"
      },
    },
    { upsert: true }
  );

  // Fetch ids and seed sheets for both users
  const admin = await User.findOne({ email: "admin@example.com" }).lean();
  const user = await User.findOne({ email: "user@example.com" }).lean();
  if (admin?._id) await seedSheetsForUser(String(admin._id));
  if (user?._id) await seedSheetsForUser(String(user._id));

  console.log("✅ Mongo seed complete");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
