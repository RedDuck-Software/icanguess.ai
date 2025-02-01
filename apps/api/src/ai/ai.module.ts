import { Module } from '@nestjs/common';
import { User } from '@prisma/client';
import { AiService } from './ai.service';

@Module({
  imports: [AiService],
  providers: [AiService],
})
export class AiModule {}
