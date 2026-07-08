/*
  Warnings:

  - You are about to drop the column `finalGravity` on the `Batch` table. All the data in the column will be lost.
  - You are about to drop the column `originalGravity` on the `Batch` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Batch" DROP COLUMN "finalGravity",
DROP COLUMN "originalGravity";
