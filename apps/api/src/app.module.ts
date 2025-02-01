import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QueueProcessorModule } from './queue-processor/processor.module';
import { BullModule } from '@nestjs/bullmq';
import { SignaturesModule } from './signatures/signatures.module';
import { GameModule } from './game/game.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    SignaturesModule,
    QueueProcessorModule,
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
    GameModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
