/*
  Warnings:

  - You are about to drop the column `original_price` on the `OrderItem` table. All the data in the column will be lost.
  - Added the required column `price` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "original_price",
ADD COLUMN     "price" DECIMAL(10,2) NOT NULL;
