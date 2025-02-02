import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QueueProcessorModule } from './queue-processor/processor.module';
import { BullModule } from '@nestjs/bullmq';
import { AiModule } from './ai/ai.module';
import { GraphqlModule } from './graphql/graphql.module';
import { SignaturesModule } from './signatures/signatures.module';
import { GameModule } from './game/game.module';
import { EVENTS_QUEUE_NAME } from './queue-processor/queues';
import { WordsModule } from './words/words.module';
import { RoundModule } from './round/round.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    SignaturesModule,
    QueueProcessorModule,
    AiModule,
    GraphqlModule,
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const redisUrl = config.get('REDIS_QUEUE', 'redis://localhost:6379');

        return {
          connection: {
            url: redisUrl,
          },
        };
      },
    }),
    BullModule.registerQueue({
      name: EVENTS_QUEUE_NAME,
      defaultJobOptions: {
        removeOnFail: false,
        removeOnComplete: true,
        attempts: 100,
        backoff: { type: 'fixed', delay: 10000 },
      },
    }),
    GameModule,
    WordsModule,
    RoundModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
