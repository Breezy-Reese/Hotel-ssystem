require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");
const Branch = require("../models/Branch");

(async () => {
  await connectDB();

  const branchName = "Aurelia Suites — Main Branch";
  let branch = await Branch.findOne({ name: branchName });
  if (!branch) {
    branch = await Branch.create({
      name: branchName,
      location: "Nairobi, Kenya",
      status: "Active",
    });
    console.log(`Created branch: ${branch.name}`);
  } else {
    console.log(`Branch already exists: ${branch.name}`);
  }

  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@aureliasuites.com";
  const existingAdmin = await User.findOne({ email: adminEmail });

  if (!existingAdmin) {
    const admin = await User.create({
      name: process.env.SEED_ADMIN_NAME || "System Administrator",
      email: adminEmail,
      password: process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!",
      role: "Admin",
      branch: branch._id,
      status: "Active",
    });
    console.log(`Created admin user: ${admin.email}`);
    console.log(`Login with password: ${process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!"}`);
    console.log("⚠️  Change this password immediately after first login.");
  } else {
    console.log(`Admin user already exists: ${existingAdmin.email}`);
  }

  await mongoose.disconnect();
  console.log("Seed complete.");
  process.exit(0);
})().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
