import { onchainTable, relations } from 'ponder';

export const guessInstance = onchainTable('guessInstance', (t) => ({
  id: t.text().primaryKey(),

  contract: t.hex().notNull(),

  guessPassAmount: t.bigint().notNull(),

  roundDuration: t.bigint().notNull(),
  roundStartBuffer: t.bigint().notNull(),
  platformFee: t.bigint().notNull(),
  platformFeeReceiver: t.hex().notNull(),
  depositPrice: t.bigint().notNull(),
}));

export const round = onchainTable('round', (t) => ({
  id: t.text().primaryKey(),
  target: t.hex().notNull(),
  guessInstanceId: t.hex().notNull(),
  contract: t.hex().notNull(),
  totalDeposited: t.bigint().notNull(),
  claimed: t.boolean().notNull(),
  claimedAt: t.bigint(),

  participants: t.bigint().notNull(),
  roundId: t.bigint().notNull(),
  roundStartTs: t.bigint().notNull(),
  roundEndTs: t.bigint().notNull(),
  roundStartBufferEndTs: t.bigint().notNull(),
}));

export const userRound = onchainTable('userRound', (t) => ({
  id: t.text().primaryKey(),
  user: t.hex(),
  roundId: t.text(),
}));

export const guessInstanceRelations = relations(guessInstance, ({ many }) => ({
  rounds: many(round),
}));

export const roundRelations = relations(round, ({ one, many }) => ({
  userRounds: many(userRound),
  guessInstance: one(guessInstance, {
    fields: [round.guessInstanceId],
    references: [guessInstance.id],
  }),
}));
export const userRoundRelations = relations(userRound, ({ one }) => ({
  round: one(round, {
    fields: [userRound.roundId],
    references: [round.id],
  }),
}));

export const claim = onchainTable('claim', (t) => ({
  id: t.text().primaryKey(),
  roundId: t.bigint().notNull(),
  receiver: t.hex().notNull(),
}));

export const deposit = onchainTable('deposit', (t) => ({
  id: t.text().primaryKey(),
  roundId: t.bigint().notNull(),
  user: t.hex().notNull(),
  amount: t.bigint().notNull(),
}));
