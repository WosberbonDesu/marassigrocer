import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  const user = await db.adminUser.findFirst();
  if (!user) {
    console.log("NO USER FOUND - running seed...");
    const hash = await bcrypt.hash("Admin123!", 12);
    await db.adminUser.create({
      data: {
        email: "admin@marassigroup.com",
        password: hash,
        name: "Admin",
      },
    });
    console.log("Admin user created!");
  } else {
    console.log("User found:", user.email);
    // Test password
    const valid = await bcrypt.compare("Admin123!", user.password);
    console.log("Password 'Admin123!' valid:", valid);
  }
  await db.$disconnect();
}

main();
