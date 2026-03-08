import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash("Admin123!", 12);
  await db.adminUser.updateMany({
    where: { email: "admin@marassigroup.com" },
    data: { password: hash },
  });
  console.log("Password reset to: Admin123!");

  // Verify
  const user = await db.adminUser.findFirst({ where: { email: "admin@marassigroup.com" } });
  const valid = await bcrypt.compare("Admin123!", user!.password);
  console.log("Verification:", valid);

  await db.$disconnect();
}

main();
