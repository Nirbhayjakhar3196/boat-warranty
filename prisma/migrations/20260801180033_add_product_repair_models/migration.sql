-- CreateEnum
CREATE TYPE "RepairStatus" AS ENUM ('PENDING', 'APPROVED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED');

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "purchaseDate" TIMESTAMP(3) NOT NULL,
    "warrantyExpiry" TIMESTAMP(3) NOT NULL,
    "warrantyPdfUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "adminId" INTEGER NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RepairHistory" (
    "id" SERIAL NOT NULL,
    "issue" TEXT NOT NULL,
    "repairDate" TIMESTAMP(3) NOT NULL,
    "status" "RepairStatus" NOT NULL,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "RepairHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_serialNumber_key" ON "Product"("serialNumber");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepairHistory" ADD CONSTRAINT "RepairHistory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
