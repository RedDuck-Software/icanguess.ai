import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { z } from 'zod';
import { devSupportedNetworks, prodSupportedNetworks } from './networks';
import { networkAddresses } from './addresses';
export const ENVIRONMENT = 'ENVIRONMENT' as const;

export const SupportedEnvironmentSchema = z.enum(['production', 'development']);
export type SupportedEnvironment = z.infer<typeof SupportedEnvironmentSchema>;

@Injectable()
export class NetworkService {
  constructor(
    @Inject(ENVIRONMENT) private readonly environment: SupportedEnvironment,
  ) {
    SupportedEnvironmentSchema.parse(environment);
  }

  getContractAddresses(chainId: number) {
    if (!this.isNetworkSupported(chainId)) {
      // TODO: create a custom error class
      throw new BadRequestException('Network is not supported');
    }

    return networkAddresses[chainId];
  }

  getNetwork(chainId: number) {
    if (!this.isNetworkSupported(chainId)) {
      // TODO: create a custom error class
      throw new BadRequestException('Network is not supported');
    }

    return this.getEnvironmentNetworks().find((v) => v.id === chainId)!;
  }

  isNetworkSupported(chainId: number) {
    return !!this.getEnvironmentNetworks().find((v) => v.id === chainId);
  }

  getEnvironmentNetworks() {
    return this.environment === 'development'
      ? devSupportedNetworks
      : prodSupportedNetworks;
  }
}
