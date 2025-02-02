import { Injectable, UnauthorizedException } from '@nestjs/common';
import { generateNonce, SiweMessage } from 'siwe';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private nonces: Record<string, string> = {};

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateNonce(wallet: string): Promise<string> {
    const normalizedWallet = wallet.toLowerCase();

    const user = await this.prisma.user.findFirst({
      where: { wallet: normalizedWallet },
    });

    if (!user) {
      await this.prisma.user.create({
        data: {
          wallet: normalizedWallet,
          roles: ['USER'],
          isBlocked: false,
        },
      });
    }

    const nonce = generateNonce();
    this.nonces[normalizedWallet] = nonce;
    return nonce;
  }

  async verify(
    message: string,
    signature: string,
    wallet: string,
  ): Promise<string> {
    const normalizedWallet = wallet.toLowerCase();
    let siweMessage: SiweMessage;

    try {
      siweMessage = new SiweMessage(message);
    } catch {
      throw new UnauthorizedException('Invalid SIWE message');
    }

    const expectedNonce = this.nonces[normalizedWallet];
    if (!expectedNonce || siweMessage.nonce !== expectedNonce) {
      throw new UnauthorizedException('Invalid nonce');
    }

    const expectedDomain =
      this.configService.get<string>('SIWE_DOMAIN') || 'localhost:5173';
    if (siweMessage.domain !== expectedDomain) {
      throw new UnauthorizedException(
        `Invalid domain. Expected ${expectedDomain} but got ${siweMessage.domain}`,
      );
    }

    try {
      await siweMessage.verify({ signature });
    } catch {
      throw new UnauthorizedException('Signature validation failed');
    }

    delete this.nonces[normalizedWallet];

    const user = await this.prisma.user.findFirst({
      where: { wallet: normalizedWallet },
    });
    if (!user || user.isBlocked) {
      throw new UnauthorizedException('User is blocked or does not exist');
    }

    const payload = { wallet: normalizedWallet, roles: user.roles };
    return this.jwtService.sign(payload);
  }
}
