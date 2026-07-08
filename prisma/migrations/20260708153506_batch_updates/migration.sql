-- CreateTable
CREATE TABLE "BatchUpdate" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BatchUpdate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BatchUpdate" ADD CONSTRAINT "BatchUpdate_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
