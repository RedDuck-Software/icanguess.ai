import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from '@app/database';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
