import { ponder } from 'ponder:registry';
import {
  constructId,
  getCurrentRoundInfo,
  notifyEvent,
  upsertNetwork,
} from './common';
import { guessInstanceAbi } from '../abis/guessInstanceAbi';
import { claim, deposit, guessInstance, round, userRound } from 'ponder:schema';
import { addresses } from '../ponder.config';

ponder.on('guessInstance:setup', async ({ context, event }) => {
  for (const address of addresses[context.network.chainId]) {
    const [
      roundDuration,
      roundStartBuffer,
      platformFee,
      platformFeeReceiver,
      depositPrice,
      guessPassAmount,
    ] = await context.client.multicall({
      allowFailure: false,
      contracts: [
        {
          abi: guessInstanceAbi,
          functionName: 'roundDuration',
          args: [],
          address: address,
        },
        {
          abi: guessInstanceAbi,
          functionName: 'roundStartBuffer',
          args: [],
          address: address,
        },
        {
          abi: guessInstanceAbi,
          functionName: 'platformFee',
          args: [],
          address: address,
        },
        {
          abi: guessInstanceAbi,
          functionName: 'platformFeeReceiver',
          args: [],
          address: address,
        },
        {
          abi: guessInstanceAbi,
          functionName: 'depositPrice',
          args: [],
          address: address,
        },
        {
          abi: guessInstanceAbi,
          functionName: 'guessPassAmount',
          args: [],
          address: address,
        },
      ],
    });

    await context.db.insert(guessInstance).values({
      id: address,
      contract: address,
      roundDuration,
      roundStartBuffer,
      platformFee,
      platformFeeReceiver,
      depositPrice,
      guessPassAmount,
      ...(await upsertNetwork(context)),
    });
  }
});

ponder.on('guessInstance:RoundInitialized', async ({ context, event }) => {
  const res = await context.db.find(guessInstance, {
    contract: event.log.address,
    networkId: context.network.chainId,
  });

  const { currentRoundId, roundEnd, roundStart, roundStartBufferEnd } =
    getCurrentRoundInfo(
      event.block.timestamp,
      res!.roundDuration,
      res!.roundStartBuffer,
    );

  const id = constructId(
    context,
    event.args.roundId.toString() + event.log.address,
  );
  const existing = await context.db.find(round, {
    id,
  });

  if (existing) return;

  const evData = await context.db.insert(round).values({
    id,
    claimed: false,
    contract: event.log.address,
    roundEndTs: roundEnd,
    roundStartTs: roundStart,
    roundId: event.args.roundId,
    totalDeposited: 0n,
    target: event.args.target,
    roundStartBufferEndTs: roundStartBufferEnd,
    guessContract: event.log.address,
    participants: 0n,
    ...(await upsertNetwork(context)),
  });

  await notifyEvent('round-initialized', evData, event, context);
});

ponder.on('guessInstance:Deposited', async ({ context, event }) => {
  const guessInstanceRes = await context.db.find(guessInstance, {
    contract: event.log.address,
    networkId: context.network.chainId,
  });

  const evData = await context.db.insert(deposit).values({
    id: event.log.id,
    amount: event.args.amount,
    roundId: event.args.roundId,
    user: event.args.user,
    ...(await upsertNetwork(context)),
  });

  const rId = constructId(
    context,
    event.args.roundId.toString() + event.log.address,
  );

  const userRoundEntity = await context.db.find(userRound, {
    id: rId + event.args.user,
  });

  if (!userRoundEntity) {
    await context.db.insert(userRound).values({
      id: rId + event.args.user,
      roundId: rId,
      user: event.transaction.from,
      ...(await upsertNetwork(context)),
    });
  }

  await context.db.update(round, { id: rId }).set((v) => ({
    totalDeposited: v.totalDeposited + event.args.amount,
    participants: v.participants + (userRoundEntity ? 0n : 1n),
  }));

  await notifyEvent(
    'deposited',
    { ...evData, boughtAttempts: guessInstanceRes!.guessPassAmount },
    event,
    context,
  );
});

ponder.on('guessInstance:Claim', async ({ context, event }) => {
  const evData = await context.db.insert(claim).values({
    id: event.log.id,
    receiver: event.args.receiver,
    roundId: event.args.roundId,
    ...(await upsertNetwork(context)),
  });

  await context.db
    .update(round, {
      id: constructId(
        context,
        event.args.roundId.toString() + event.log.address,
      ),
    })
    .set(() => ({
      claimed: true,
      claimedAt: event.block.timestamp,
    }));

  await notifyEvent('claim', evData, event, context);
});
