CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateTable
CREATE TABLE "round" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "roundId" INTEGER NOT NULL,
    "contract" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "round_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_round" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "attemptsBought" INTEGER NOT NULL,
    "attemptsUsed" INTEGER NOT NULL,
    "userWallet" TEXT NOT NULL,
    "roundId" UUID NOT NULL,

    CONSTRAINT "user_round_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_round_guess" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "userPromt" TEXT NOT NULL,
    "temperature" INTEGER NOT NULL,
    "userRoundId" UUID NOT NULL,

    CONSTRAINT "user_round_guess_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_round_userWallet_roundId_key" ON "user_round"("userWallet", "roundId");

-- AddForeignKey
ALTER TABLE "user_round" ADD CONSTRAINT "user_round_userWallet_fkey" FOREIGN KEY ("userWallet") REFERENCES "user"("wallet") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_round" ADD CONSTRAINT "user_round_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "round"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_round_guess" ADD CONSTRAINT "user_round_guess_userRoundId_fkey" FOREIGN KEY ("userRoundId") REFERENCES "user_round"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
