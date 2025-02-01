import { Module } from '@nestjs/common';
import { GameService, INDEXER_URL } from './game.service';
import { ConfigService } from '@nestjs/config';
import { GraphqlModule } from 'src/graphql/graphql.module';
import { GameController } from './game.controller';
import { SignaturesModule } from 'src/signatures/signatures.module';

@Module({
  controllers: [GameController],
  imports: [GraphqlModule, SignaturesModule],
  exports: [GameService],
  providers: [
    GameService,
    {
      provide: INDEXER_URL,
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const url = await config.get('INDEXER_URL', 'http://localhost:42070');

        return url;
      },
    },
  ],
})
export class GameModule {}
