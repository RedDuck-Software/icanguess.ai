import { ponder } from 'ponder:registry';
import { getCurrentRoundInfo, notifyEvent } from './common';
import { guessInstanceAbi } from '../abis/guessInstanceAbi';
import { claim, deposit, round } from 'ponder:schema';

ponder.on('UnverifiedContract:RoundInitialized', async ({ context, event }) => {
  const [roundStartBuffer, roundDuration, guessPassAmount] =
    await context.client.multicall({
      allowFailure: false,
      contracts: [
        {
          abi: guessInstanceAbi,
          functionName: 'roundStartBuffer',
          args: [],
          address: event.log.address,
        },
        {
          abi: guessInstanceAbi,
          functionName: 'roundDuration',
          args: [],
          address: event.log.address,
        },
        {
          abi: guessInstanceAbi,
          functionName: 'guessPassAmount',
          args: [],
          address: event.log.address,
        },
      ],
    });

  const { currentRoundId, roundEnd, roundStart, roundStartBufferEnd } =
    getCurrentRoundInfo(event.block.timestamp, roundDuration, roundStartBuffer);

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
    guessPassAmount: guessPassAmount,
  });

  await notifyEvent('round-initialized', evData, event, context);
});

ponder.on('UnverifiedContract:Deposited', async ({ context, event }) => {
  const evData = await context.db.insert(deposit).values({
    id: event.log.id,
    amount: event.args.amount,
    roundId: event.args.roundId,
    user: event.args.user,
  });

  const updatedRound = await context.db
    .update(round, { id: event.args.roundId.toString() + event.log.address })
    .set((v) => ({
      totalDeposited: v.totalDeposited + event.args.amount,
    }));

  await notifyEvent(
    'deposited',
    { ...evData, boughtAttempts: updatedRound.guessPassAmount },
    event,
    context,
  );
});

ponder.on('UnverifiedContract:Claim', async ({ context, event }) => {
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
