/*
  Warnings:

  - You are about to drop the column `sale_price` on the `OrderItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "sale_price";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "sale_price" DECIMAL(10,2);
