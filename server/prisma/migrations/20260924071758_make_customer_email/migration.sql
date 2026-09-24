/*
  Warnings:

  - You are about to drop the column `customerEmail` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "email" TEXT;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "customerEmail";
