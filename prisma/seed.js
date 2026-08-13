const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function ensureDefaultAdmin() {
  const email = "admin@example.com";
  const password = "password123";

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: {
      name: "Admin",
      role: "ADMIN",
      password: hashedPassword,
    },
    create: {
      name: "Admin",
      email,
      password: hashedPassword,
      role: "ADMIN",
    },
  });
}

async function ensureProductWarrantyStatus() {
  const products = [
    { serialNumber: "BOAT001", name: "Boat Airpodes 141", model: "141" },
    { serialNumber: "BOAT002", name: "Boat Airpodes 129", model: "129" },
    { serialNumber: "BOAT004", name: "Boat Airpodes 69", model: "69" },
    { serialNumber: "BOAT005", name: "Boat Nividea 99", model: "99" },
    { serialNumber: "BOAT014", name: "Boat Samsung 200", model: "200" },
  ];

  const admin = await prisma.user.findFirst({
    where: { email: "admin@example.com" },
  });

  const futureDate = new Date();
  futureDate.setFullYear(futureDate.getFullYear() + 2);

  for (const product of products) {
    await prisma.product.upsert({
      where: { serialNumber: product.serialNumber },
      update: {
        name: product.name,
        model: product.model,
        adminId: admin ? admin.id : 1,
        purchaseDate: new Date("2025-08-05T00:00:00.000Z"),
        warrantyExpiry: futureDate,
      },
      create: {
        serialNumber: product.serialNumber,
        name: product.name,
        model: product.model,
        purchaseDate: new Date("2025-08-05T00:00:00.000Z"),
        warrantyExpiry: futureDate,
        adminId: admin ? admin.id : 1,
      },
    });
  }
}

async function main() {
  await ensureDefaultAdmin();
  await ensureProductWarrantyStatus();
  console.log("Default admin and warranty products restored successfully.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
