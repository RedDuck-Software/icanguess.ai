import { Module } from '@nestjs/common';
import { ENVIRONMENT, NetworkService } from './network.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    NetworkService,
    {
      provide: ENVIRONMENT,
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return config.get('ENVIRONMENT', 'development');
      },
    },
  ],
  exports: [NetworkService],
})
export class NetworkModule {}
