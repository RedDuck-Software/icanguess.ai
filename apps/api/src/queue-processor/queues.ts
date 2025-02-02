import { Address, Hex } from 'viem';

export type EventNotification<TEventData = Object> = {
  eventType: 'round-initialized' | 'deposited' | 'claim';
  eventData: TEventData;
  chainId: number;
  txCaller: Address;
  txHash: Hex;
  contract: string;
  logIndex: string;
  txTimestamp: number;
};

export const EVENTS_QUEUE_NAME = 'event-notifications';
