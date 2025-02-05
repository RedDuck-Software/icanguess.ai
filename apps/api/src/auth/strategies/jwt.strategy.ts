import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../database/prisma.service';
import { ConfigService } from '@nestjs/config';
import { NetworkService } from 'src/network/network.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);
  constructor(
    configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly networkService: NetworkService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('JWT_SECRET'),
    });
  }

  async validate(payload: {
    wallet: string;
    chainId: number;
  }): Promise<unknown> {
    const user: User | null = await this.prismaService.user
      .findFirst({ where: { wallet: payload.wallet } })
      .catch((err) => {
        this.logger.error(err);
        return null;
      });

    if (!user || user.isBlocked) {
      throw new UnauthorizedException();
    }

    if (!this.networkService.isNetworkSupported(payload.chainId)) {
      throw new UnauthorizedException('Incorrect authorized chainId');
    }

    return payload;
  }
}
