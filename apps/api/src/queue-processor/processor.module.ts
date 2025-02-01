import { Module } from '@nestjs/common';
import { EventProcessorService } from './events-processor.service';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [EventProcessorService],
  exports: [EventProcessorService],
})
export class QueueProcessorModule {}
