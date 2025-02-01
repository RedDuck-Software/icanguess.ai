import { ponder } from 'ponder:registry';
import { getCurrentRoundInfo, notifyEvent } from './common';
import { guessInstanceAbi } from '../abis/guessInstanceAbi';
import { claim, deposit, guessInstance, round } from 'ponder:schema';
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
    });
  }
});

ponder.on('guessInstance:RoundInitialized', async ({ context, event }) => {
  const res = await context.db.find(guessInstance, {
    id: event.log.address,
  });

  const { currentRoundId, roundEnd, roundStart, roundStartBufferEnd } =
    getCurrentRoundInfo(
      event.block.timestamp,
      res!.roundDuration,
      res!.roundStartBuffer,
    );

  const evData = await context.db.insert(round).values({
    id: currentRoundId.toString() + event.log.address,
    claimed: false,
    contract: event.log.address,
    roundEndTs: roundEnd,
    roundStartTs: roundStart,
    roundId: currentRoundId,
    totalDeposited: 0n,
    target: event.args.target,
    roundStartBufferEndTs: roundStartBufferEnd,
    guessInstanceId: event.log.address,
    participants: 0n,
  });

  await notifyEvent('round-initialized', evData, event, context);
});

ponder.on('guessInstance:Deposited', async ({ context, event }) => {
  const guessInstanceRes = await context.db.find(guessInstance, {
    id: event.log.address,
  });

  const evData = await context.db.insert(deposit).values({
    id: event.log.id,
    amount: event.args.amount,
    roundId: event.args.roundId,
    user: event.args.user,
  });

  await context.db
    .update(round, { id: event.args.roundId.toString() + event.log.address })
    .set((v) => ({
      totalDeposited: v.totalDeposited + event.args.amount,
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
  });

  await context.db
    .update(round, { id: event.args.roundId.toString() + event.log.address })
    .set(() => ({
      claimed: true,
      claimedAt: event.block.timestamp,
    }));

  await notifyEvent('claim', evData, event, context);
});
