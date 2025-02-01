/*
  Warnings:

  - The primary key for the `user_round` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `user_round` table. All the data in the column will be lost.
  - You are about to drop the column `userRoundId` on the `user_round_guess` table. All the data in the column will be lost.
  - Added the required column `userRoundRoundId` to the `user_round_guess` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userRoundUserWallet` to the `user_round_guess` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "user_round_guess" DROP CONSTRAINT "user_round_guess_userRoundId_fkey";

-- DropIndex
DROP INDEX "user_round_userWallet_roundId_key";

-- AlterTable
ALTER TABLE "user_round" DROP CONSTRAINT "user_round_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "user_round_pkey" PRIMARY KEY ("userWallet", "roundId");

-- AlterTable
ALTER TABLE "user_round_guess" DROP COLUMN "userRoundId",
ADD COLUMN     "userRoundRoundId" UUID NOT NULL,
ADD COLUMN     "userRoundUserWallet" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "user_round_guess" ADD CONSTRAINT "user_round_guess_userRoundUserWallet_userRoundRoundId_fkey" FOREIGN KEY ("userRoundUserWallet", "userRoundRoundId") REFERENCES "user_round"("userWallet", "roundId") ON DELETE RESTRICT ON UPDATE CASCADE;
