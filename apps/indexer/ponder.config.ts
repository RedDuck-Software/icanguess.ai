import { createConfig } from "ponder";
import { http } from "viem";
import { Queue } from "bullmq";

import { guessInstanceAbi } from "./abis/guessInstanceAbi";
import { EventNotification } from "./src/common";

import dotenv from "dotenv";

dotenv.config();

const redisUrl = process.env.REDIS_QUEUE ?? "redis://localhost:6379";

if (!redisUrl) {
  throw new Error("REDIS_QUEUE should be set");
}

export const eventsQueue = new Queue<EventNotification>("event-notifications", {
  connection: {
    url: redisUrl,
  },
  defaultJobOptions: {
    attempts: 100,
    backoff: { type: "fixed", delay: 10000 },
    removeOnComplete: {
      count: 1000,
    },
    removeOnFail: {
      count: 5000,
    },
  },
});

export default createConfig({
  networks: {
    sepolia: {
      chainId: 11155111,
      transport: http(process.env.PONDER_RPC_URL_11155111),
    },
  },
  contracts: {
    UnverifiedContract: {
      abi: guessInstanceAbi,
      startBlock: 7617291,
      address: "0xe5957f88bB8dfF49960285710624B61d76484237",
      network: "sepolia",
    },
  },
});
