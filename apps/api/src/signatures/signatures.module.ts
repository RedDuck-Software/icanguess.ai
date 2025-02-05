import { Module } from '@nestjs/common';
import { SignaturesService } from './signatures.service';
import { NetworkModule } from 'src/network/network.module';

@Module({
  imports: [NetworkModule],
  providers: [SignaturesService],
  exports: [SignaturesService],
})
export class SignaturesModule {}
