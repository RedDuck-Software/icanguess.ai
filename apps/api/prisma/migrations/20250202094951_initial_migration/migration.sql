CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "user" (
    "wallet" TEXT NOT NULL,
    "roles" "Role"[] DEFAULT ARRAY[]::"Role"[],
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("wallet")
);

-- CreateTable
CREATE TABLE "round" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "roundId" INTEGER NOT NULL,
    "contract" TEXT NOT NULL,
    "words" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "round_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_round" (
    "attemptsBought" INTEGER NOT NULL DEFAULT 0,
    "attemptsUsed" INTEGER NOT NULL DEFAULT 0,
    "userWallet" TEXT NOT NULL,
    "roundId" UUID NOT NULL,

    CONSTRAINT "user_round_pkey" PRIMARY KEY ("userWallet","roundId")
);

-- CreateTable
CREATE TABLE "user_round_guess" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "userPromt" TEXT NOT NULL,
    "temperature" INTEGER NOT NULL,
    "guessesWord" TEXT,
    "userRoundUserWallet" TEXT NOT NULL,
    "userRoundRoundId" UUID NOT NULL,

    CONSTRAINT "user_round_guess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "indexed_event" (
    "id" TEXT NOT NULL,

    CONSTRAINT "indexed_event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_wallet_key" ON "user"("wallet");

-- AddForeignKey
ALTER TABLE "user_round" ADD CONSTRAINT "user_round_userWallet_fkey" FOREIGN KEY ("userWallet") REFERENCES "user"("wallet") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_round" ADD CONSTRAINT "user_round_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "round"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_round_guess" ADD CONSTRAINT "user_round_guess_userRoundUserWallet_userRoundRoundId_fkey" FOREIGN KEY ("userRoundUserWallet", "userRoundRoundId") REFERENCES "user_round"("userWallet", "roundId") ON DELETE RESTRICT ON UPDATE CASCADE;
