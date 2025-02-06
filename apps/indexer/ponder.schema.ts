import { primaryKey, onchainTable, relations } from 'ponder';
import { getPgColumnBuilders } from 'drizzle-orm/pg-core/columns/all';
import { SQL } from 'drizzle-orm';
import { ExtraConfigColumn } from 'drizzle-orm/pg-core';

const withNetworkId = () => ({
  networkId: getPgColumnBuilders().integer().notNull(),
});

export const network = onchainTable('network', (t) => ({
  id: t.numeric().primaryKey(),
}));

const buildNetworkRelation = (schema: any, one: any) => {
  return one(schema, {
    fields: [network.id],
    references: [schema.networkId],
  });
};

export const guessInstance = onchainTable(
  'guessInstance',
  (t) => ({
    contract: t.hex().notNull(),

    guessPassAmount: t.bigint().notNull(),

    roundDuration: t.bigint().notNull(),
    roundStartBuffer: t.bigint().notNull(),
    platformFee: t.bigint().notNull(),
    platformFeeReceiver: t.hex().notNull(),
    depositPrice: t.bigint().notNull(),
    ...withNetworkId(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.contract, table.networkId] }),
  }),
);

export const round = onchainTable('round', (t) => ({
  id: t.text().primaryKey(),
  target: t.hex().notNull(),
  guessContract: t.hex().notNull(),
  contract: t.hex().notNull(),
  totalDeposited: t.bigint().notNull(),
  claimed: t.boolean().notNull(),
  claimedAt: t.bigint(),

  participants: t.bigint().notNull(),
  roundId: t.bigint().notNull(),
  roundStartTs: t.bigint().notNull(),
  roundEndTs: t.bigint().notNull(),
  roundStartBufferEndTs: t.bigint().notNull(),

  ...withNetworkId(),
}));

export const userRound = onchainTable('userRound', (t) => ({
  id: t.text().primaryKey(),
  user: t.hex(),
  roundId: t.text(),
  ...withNetworkId(),
}));

export const claim = onchainTable('claim', (t) => ({
  id: t.text().primaryKey(),
  roundId: t.bigint().notNull(),
  receiver: t.hex().notNull(),
  ...withNetworkId(),
}));

export const deposit = onchainTable('deposit', (t) => ({
  id: t.text().primaryKey(),
  roundId: t.bigint().notNull(),
  user: t.hex().notNull(),
  amount: t.bigint().notNull(),
  ...withNetworkId(),
}));

export const guessInstanceRelations = relations(guessInstance, ({ many }) => ({
  rounds: many(round),
}));

export const roundRelations = relations(round, ({ one, many }) => ({
  userRounds: many(userRound),
  guessInstance: one(guessInstance, {
    fields: [round.guessContract, round.networkId],
    references: [guessInstance.contract, guessInstance.networkId],
  }),
}));

export const userRoundRelations = relations(userRound, ({ one }) => ({
  round: one(round, {
    fields: [userRound.roundId],
    references: [round.id],
  }),
}));
