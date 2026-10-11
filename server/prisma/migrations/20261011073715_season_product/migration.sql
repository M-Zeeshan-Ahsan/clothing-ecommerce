-- CreateEnum
CREATE TYPE "Season" AS ENUM ('SUMMER', 'WINTER', 'ALL_SEASON');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "season" "Season" NOT NULL DEFAULT 'ALL_SEASON';
