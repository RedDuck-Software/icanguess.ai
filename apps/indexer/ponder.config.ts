import { createConfig } from 'ponder';
import { getAddress, http } from 'viem';
import { Queue } from 'bullmq';

import { guessInstanceAbi } from './abis/guessInstanceAbi';
import { EventNotification } from './src/common';

import dotenv from 'dotenv';
import { auroraTestnet, sepolia } from 'viem/chains';

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
  [sepolia.id]: [getAddress('0xD46D8f9e1B03bC0BFDa065A1797d45c64d66902c')],
  [auroraTestnet.id]: [
    getAddress('0x2f755809cFC4a83bc15E287f99426Fc6F8716c28'),
  ],
};

auroraTestnet.contracts = {
  multicall3: {
    address: '0x65f957Da089fe87CB977BeC8179c93446F4a8D4F',
    blockCreated: 188950192,
  },
};

export default createConfig({
  networks: {
    auroraTestnet: {
      chainId: auroraTestnet.id,
      transport: http(process.env.PONDER_RPC_URL_1313161555),
    },
  },
  contracts: {
    guessInstance: {
      abi: guessInstanceAbi,
      network: {
        auroraTestnet: {
          startBlock: 188950192,
          address: addresses[auroraTestnet.id],
        },
      },
    },
  },
});
