import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  UseGuards,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from './guards/public.decorator';
import { AuthService } from './auth.service';
import { VerifyDto } from './dtos/verify.dto';
import { NonceDto } from './dtos/nonce.dto';
import { Request, Response } from 'express';
import { sepolia } from 'viem/chains';
import { ConfigService } from '@nestjs/config';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('nonce')
  @Public()
  @ApiOperation({ summary: 'Get a nonce' })
  async generateNonce(@Body() dto: NonceDto) {
    return { nonce: await this.authService.generateNonce(dto.wallet) };
  }

  @Post('verify')
  @Public()
  async verify(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: VerifyDto,
  ) {
    const token = await this.authService.verify(
      dto.message,
      dto.signature,
      dto.wallet,
    );

    return { token };
  }

  @Get('session')
  getSession(@Req() req: Request) {
    if (!req.user) return null;

    const chainId = Number(
      this.configService.get<string>('CHAIN_ID') || sepolia.id,
    );

    const user = req.user as { wallet: string };
    return {
      address: user.wallet,
      chainId,
    };
  }

  @Get('signout')
  @ApiOperation({ summary: 'Sign out and clear the session' })
  signOut(@Req() req: Request) {
    return { message: 'Signed out' };
  }
}
