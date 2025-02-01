import { createConfig } from 'ponder';
import { getAddress, http } from 'viem';
import { Queue } from 'bullmq';

import { guessInstanceAbi } from './abis/guessInstanceAbi';
import { EventNotification } from './src/common';

import dotenv from 'dotenv';
import { sepolia } from 'viem/chains';

dotenv.config();

const redisUrl = process.env.REDIS_QUEUE ?? 'redis://localhost:6379';

if (!redisUrl) {
  throw new Error('REDIS_QUEUE should be set');
}

export const eventsQueue = new Queue<EventNotification>('event-notifications', {
  connection: {
    url: redisUrl,
  },
  defaultJobOptions: {
    attempts: 100,
    backoff: { type: 'fixed', delay: 10000 },
    removeOnComplete: {
      count: 1000,
    },
    removeOnFail: {
      count: 5000,
    },
  },
});

export const addresses = {
  [sepolia.id]: [getAddress('0x2D445088ddA9dcAcDFc9b8e49C3aAb88c348a6EC')],
};

export default createConfig({
  networks: {
    sepolia: {
      chainId: 11155111,
      transport: http(process.env.PONDER_RPC_URL_11155111),
    },
  },
  contracts: {
    guessInstance: {
      abi: guessInstanceAbi,
      network: {
        sepolia: {
          startBlock: 7617754,
          address: addresses[sepolia.id],
        },
      },
    },
  },
});
