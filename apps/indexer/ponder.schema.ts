import { onchainTable } from "ponder";

export const round = onchainTable("round", (t) => ({
  id: t.text().primaryKey(),
  target: t.hex().notNull(),

  contract: t.hex().notNull(),
  totalDeposited: t.bigint().notNull(),
  claimed: t.boolean().notNull(),
  claimedAt: t.bigint(),

  roundId: t.bigint().notNull(),
  roundStartTs: t.bigint().notNull(),
  roundEndTs: t.bigint().notNull(),
  roundStartBufferEndTs: t.bigint().notNull(),
}));

export const claim = onchainTable("claim", (t) => ({
  id: t.text().primaryKey(),
  roundId: t.bigint().notNull(),
  receiver: t.hex().notNull(),
}));

export const deposit = onchainTable("deposit", (t) => ({
  id: t.text().primaryKey(),
  roundId: t.bigint().notNull(),
  user: t.hex().notNull(),
  amount: t.bigint().notNull(),
}));
