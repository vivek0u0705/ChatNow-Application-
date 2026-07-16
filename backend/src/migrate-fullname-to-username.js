/**
 * ONE-TIME MIGRATION SCRIPT
 * Renames `fullName` → `username` for all existing users in MongoDB.
 * Run once: node src/migrate-fullname-to-username.js
 * Safe to delete after running.
 */

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✅ Connected to MongoDB");

  const result = await mongoose.connection.collection("users").updateMany(
    { fullName: { $exists: true } },         // only docs that still have fullName
    [{ $set: { username: "$fullName" } },    // copy fullName value into username
     { $unset: "fullName" }]                 // remove the old fullName field
  );

  console.log(`✅ Migration done: ${result.modifiedCount} users updated`);
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
