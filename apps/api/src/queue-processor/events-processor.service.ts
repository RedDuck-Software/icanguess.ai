import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

import { PrismaService } from 'src/database/prisma.service';
import { EventNotification, EVENTS_QUEUE_NAME } from './queues';
import { Address } from 'viem';

type DepositedEventPayload = {
  id: string;
  amount: string;
  roundId: string;
  user: Address;
  boughtAttempts: string;
};

@Processor(EVENTS_QUEUE_NAME)
export class EventProcessorService extends WorkerHost {
  private readonly logger = new Logger(EventProcessorService.name);

  constructor(private readonly db: PrismaService) {
    super();
    console.log('INITED');
  }

  async process(job: Job<EventNotification, any, string>): Promise<any> {
    if (job.data.eventType === 'deposited') {
      await this.processDepositedEvent(
        job.data as EventNotification<DepositedEventPayload>,
      );
    } else {
      this.logger.warn('Unsupported log  type');
    }
  }

  async processDepositedEvent(ev: EventNotification<DepositedEventPayload>) {
    await this.db.$transaction(
      async (db) => {
        let indexedEv = await db.indexedEvent.findUnique({
          where: {
            id: ev.logIndex.toString(),
          },
        });

        if (indexedEv) {
          this.logger.warn(
            `Event ${ev.logIndex} was already processed, skipping`,
          );
          return;
        }

        indexedEv = await db.indexedEvent.create({
          data: {
            id: ev.logIndex.toString(),
          },
        });

        let user = await db.user.findUnique({
          where: {
            wallet: ev.eventData.user,
          },
        });

        if (!user) {
          user = await db.user.create({
            data: {
              wallet: ev.eventData.user,
            },
          });
        }

        let round = await db.round.findFirst({
          where: {
            roundId: +ev.eventData.roundId,
            contract: ev.contract,
          },
        });

        if (!round) {
          round = await db.round.create({
            data: {
              roundId: +ev.eventData.roundId,
              contract: ev.contract,
            },
          });
        }

        let userRound = await db.userRound.findFirst({
          where: {
            roundId: round.id,
            userWallet: ev.eventData.user,
          },
        });

        if (!userRound) {
          userRound = await db.userRound.create({
            data: {
              roundId: round.id,
              userWallet: ev.eventData.user,
            },
          });
        }

        await db.userRound.update({
          where: {
            userWallet_roundId: {
              roundId: round.id,
              userWallet: ev.eventData.user,
            },
          },
          data: {
            attemptsBought:
              userRound.attemptsBought + +ev.eventData.boughtAttempts,
          },
        });
      },
      { isolationLevel: 'RepeatableRead' },
    );
  }

  @OnWorkerEvent('progress')
  onProgress(job: Job) {
    const { id, name, progress } = job;
    this.logger.log(`Job id: ${id}, name: ${name} completes ${progress}%`);
  }

  @OnWorkerEvent('failed')
  async onFailed(job: Job) {
    const { id, name, queueName, failedReason, attemptsMade, opts } = job;

    this.logger.error(
      `Job id: ${id}, name: ${name} failed in queue ${queueName}. Failed reason: ${failedReason}. Attempt ${attemptsMade}/${opts.attempts}`,
    );
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    const { id, name, queueName, timestamp } = job;
    const startTime = timestamp ? new Date(timestamp).toISOString() : '';
    this.logger.log(
      `Job id: ${id}, name: ${name} starts in queue ${queueName} on ${startTime}.`,
    );
  }
}
