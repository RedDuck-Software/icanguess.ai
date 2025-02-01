import { Module } from '@nestjs/common';
import { GameService, INDEXER_URL } from './game.service';
import { ConfigService } from '@nestjs/config';
import { GraphqlModule } from 'src/graphql/graphql.module';
import { GameController } from './game.controller';

@Module({
  controllers: [GameController],
  imports: [GameService, GraphqlModule],
  providers: [
    GameService,
    {
      provide: INDEXER_URL,
      useFactory: async (config: ConfigService) => {
        const url = await config.get('INDEXER_URL', 'http://localhost:42069');

        return url;
      },
    },
  ],
})
export class GameModule {}
