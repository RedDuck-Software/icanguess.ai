/*
  Warnings:

  - Added the required column `chainId` to the `round` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "round" ADD COLUMN     "chainId" INTEGER NOT NULL;
