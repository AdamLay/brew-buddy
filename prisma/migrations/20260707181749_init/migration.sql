-- CreateEnum
CREATE TYPE "BrewType" AS ENUM ('CIDER', 'WINE', 'BEER', 'OTHER');

-- CreateEnum
CREATE TYPE "BatchStatus" AS ENUM ('PLANNING', 'FERMENTING', 'CONDITIONING', 'BOTTLED', 'COMPLETE');

-- CreateTable
CREATE TABLE "Recipe" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "brewType" "BrewType" NOT NULL,
    "originalGravity" DOUBLE PRECISION,
    "finalGravity" DOUBLE PRECISION,
    "batchSize" DOUBLE PRECISION,
    "instructions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ingredient" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT,

    CONSTRAINT "Ingredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeIngredient" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "ingredientId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecipeIngredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Batch" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "status" "BatchStatus" NOT NULL DEFAULT 'PLANNING',
    "notes" TEXT,
    "ogReading" DOUBLE PRECISION,
    "fgReading" DOUBLE PRECISION,
    "currentGravity" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Batch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RecipeIngredient_recipeId_ingredientId_key" ON "RecipeIngredient"("recipeId", "ingredientId");

-- AddForeignKey
ALTER TABLE "RecipeIngredient" ADD CONSTRAINT "RecipeIngredient_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeIngredient" ADD CONSTRAINT "RecipeIngredient_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Batch" ADD CONSTRAINT "Batch_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
