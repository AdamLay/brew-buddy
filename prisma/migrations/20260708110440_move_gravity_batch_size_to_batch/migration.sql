/*
  Warnings:

  - You are about to drop the column `batchSize` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `finalGravity` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `originalGravity` on the `Recipe` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Batch" ADD COLUMN     "batchSize" DOUBLE PRECISION,
ADD COLUMN     "finalGravity" DOUBLE PRECISION,
ADD COLUMN     "originalGravity" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "batchSize",
DROP COLUMN "finalGravity",
DROP COLUMN "originalGravity";
