/*
  Warnings:

  - You are about to drop the column `repairDate` on the `RepairHistory` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `RepairHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RepairHistory" DROP CONSTRAINT "RepairHistory_productId_fkey";

-- AlterTable
ALTER TABLE "RepairHistory" DROP COLUMN "repairDate",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AddForeignKey
ALTER TABLE "RepairHistory" ADD CONSTRAINT "RepairHistory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
