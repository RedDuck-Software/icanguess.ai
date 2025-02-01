import { onchainTable } from "ponder";

export const round = onchainTable("round", (t) => ({
  id: t.text().primaryKey(),
  target: t.hex(),

  totalDeposited: t.bigint(),
  claimed: t.boolean(),

  roundId: t.bigint(),
  roundStartTs: t.bigint(),
  roundEndTs: t.bigint(),
  roundStartBufferEndTs: t.bigint(),
}));

export const claim = onchainTable("claim", (t) => ({
  id: t.text().primaryKey(),
  roundId: t.bigint(),
  receiver: t.hex(),
}));

export const deposit = onchainTable("deposit", (t) => ({
  id: t.text().primaryKey(),
  roundId: t.bigint(),
  user: t.hex(),
  amount: t.bigint(),
}));
