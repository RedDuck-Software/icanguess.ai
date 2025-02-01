import { ponder } from "ponder:registry";
import { getCurrentRoundInfo } from "./common";
import { guessInstanceAbi } from "../abis/guessInstanceAbi";
import { claim, deposit, round } from "ponder:schema";

ponder.on("UnverifiedContract:RoundInitialized", async ({ context, event }) => {
  const [roundStartBuffer, roundDuration] = await context.client.multicall({
    allowFailure: false,
    contracts: [
      {
        abi: guessInstanceAbi,
        functionName: "roundStartBuffer",
        args: [],
        address: event.log.address,
      },
      {
        abi: guessInstanceAbi,
        functionName: "roundDuration",
        args: [],
        address: event.log.address,
      },
    ],
  });

  const { currentRoundId, roundEnd, roundStart, roundStartBufferEnd } =
    getCurrentRoundInfo(event.block.timestamp, roundDuration, roundStartBuffer);

  await context.db.insert(round).values({
    id: currentRoundId.toString(),
    claimed: false,
    roundEndTs: roundEnd,
    roundStartTs: roundStart,
    roundId: currentRoundId,
    totalDeposited: 0n,
    target: event.args.target,
    roundStartBufferEndTs: roundStartBufferEnd,
  });
});

ponder.on("UnverifiedContract:Deposited", async ({ context, event }) => {
  await context.db.insert(deposit).values({
    id: event.log.id,
    amount: event.args.amount,
    roundId: event.args.roundId,
    user: event.args.user,
  });
});

ponder.on("UnverifiedContract:Claim", async ({ context, event }) => {
  await context.db.insert(claim).values({
    id: event.log.id,
    receiver: event.args.receiver,
    roundId: event.args.roundId,
  });
});
