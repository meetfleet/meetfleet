/*
  Warnings:

  - The `interests` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "company" TEXT,
ADD COLUMN     "job" TEXT,
ADD COLUMN     "photos" TEXT[] DEFAULT ARRAY[]::TEXT[],
DROP COLUMN "interests",
ADD COLUMN     "interests" TEXT[] DEFAULT ARRAY[]::TEXT[];
