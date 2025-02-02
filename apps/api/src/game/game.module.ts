import { Module } from '@nestjs/common';
import { GameService, INDEXER_URL } from './game.service';
import { ConfigService } from '@nestjs/config';
import { GraphqlModule } from 'src/graphql/graphql.module';
import { GameController } from './game.controller';
import { SignaturesModule } from '../signatures/signatures.module';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  imports: [GraphqlModule, SignaturesModule, PrismaModule],
  exports: [GameService],
  controllers: [GameController],
  providers: [
    GameService,
    GraphqlModule,
    {
      provide: INDEXER_URL,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return config.get<string>('INDEXER_URL', 'http://localhost:42070');
      },
    },
  ],
})
export class GameModule {}
