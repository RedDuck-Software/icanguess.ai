import { Module } from '@nestjs/common';
import { RoundService } from './round.service';
import { RoundController } from './round.controller';
import { WordsModule } from '../words/words.module';
import { AiModule } from '../ai/ai.module';
import { PrismaModule } from '../database/prisma.module';
import { SignaturesModule } from '../signatures/signatures.module';
import { GameModule } from '../game/game.module';

@Module({
  imports: [PrismaModule, WordsModule, AiModule, SignaturesModule, GameModule],
  providers: [RoundService],
  controllers: [RoundController],
})
export class RoundModule {}
