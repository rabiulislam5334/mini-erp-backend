import mongoose from "mongoose";
import { env } from "../config/env";
import { User } from "../modules/user/user.model";
import { USER_ROLE } from "../constants/roles";

async function seedAdmin() {
  await mongoose.connect(env.DATABASE_URL);

  const existingAdmin = await User.findOne({ email: env.ADMIN_EMAIL });
  if (existingAdmin) {
    console.log("⚠️  Admin already exists:", env.ADMIN_EMAIL);
    await mongoose.disconnect();
    return;
  }

  await User.create({
    name: env.ADMIN_NAME,
    email: env.ADMIN_EMAIL,
    password: env.ADMIN_PASSWORD,
    role: USER_ROLE.ADMIN,
  });

  console.log("✅ Admin created successfully");
  console.log("   Email:", env.ADMIN_EMAIL);
  console.log("   Password:", env.ADMIN_PASSWORD);

  await mongoose.disconnect();
}

seedAdmin().catch((err) => {
  console.error("❌ Failed to seed admin:", err);
  process.exit(1);
});
