import { Context, Event } from 'ponder:registry';
import { replaceBigInts } from '@ponder/utils';
import { Hex, Address } from 'viem';
import { eventsQueue } from '../ponder.config';

export const getCurrentRoundInfo = (
  timestamp: bigint,
  roundDuration: bigint,
  roundStartBuffer: bigint,
) => {
  const currentRoundId = timestamp / roundDuration;
  const roundStart = currentRoundId * roundDuration;
  const roundEnd = roundStart + roundDuration;
  const roundStartBufferEnd = roundStart + roundStartBuffer;

  return { currentRoundId, roundStart, roundEnd, roundStartBufferEnd };
};

export type EventNotification = {
  eventType: 'round-initialized' | 'deposited' | 'claim';
  eventData: any;
  chainId: number;
  txCaller: Address;
  txHash: Hex;
  logIndex: number;
  txTimestamp: number;
};

export const notifyEvent = async <TEvData extends Object>(
  evType: EventNotification['eventType'],
  data: TEvData,
  ev: Event,
  context: Context,
) => {
  const payload = {
    eventType: evType,
    eventData: data,
    chainId: context.network.chainId,
    txCaller: ev.transaction.from,
    txHash: ev.transaction.hash,
    logIndex: ev.transaction.transactionIndex,
    txTimestamp: +ev.block.timestamp.toString(),
  } as EventNotification;

  const payloadSerialized = replaceBigInts(payload, (v) => String(v));

  await eventsQueue.add('event-notifications', payloadSerialized);
};
