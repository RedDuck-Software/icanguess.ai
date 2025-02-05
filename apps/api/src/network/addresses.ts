import { Address, getAddress } from 'viem';
import { sepolia } from 'viem/chains';

export enum GameMode {
  EASY = 'easy',
  HARD = 'hard',
}

export type NetworkAddresses = {
  guessInstances: Record<GameMode, Address>;
};

export const networkAddresses: Record<number, NetworkAddresses> = {
  [sepolia.id]: {
    guessInstances: {
      [GameMode.EASY]: getAddress('0xD46D8f9e1B03bC0BFDa065A1797d45c64d66902c'),
      [GameMode.HARD]: getAddress('0xD46D8f9e1B03bC0BFDa065A1797d45c64d66902c'), // FIXME:
    },
  },
};
