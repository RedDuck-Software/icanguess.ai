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
import { JwtAuthGuard } from './guards/jwt.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('nonce')
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

    const isProd = process.env.NODE_ENV === 'production';
    const domain = process.env.COOKIE_DOMAIN || 'localhost';

    res.cookie('token', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      domain: domain,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      path: '/',
    });

    return { success: true };
  }

  @Get('session')
  @UseGuards(JwtAuthGuard)
  getSession(@Req() req: Request) {
    if (!req.user) {
      return null;
    }

    const user = req.user as { wallet: string };
    return {
      address: user.wallet,
      chainId: 1,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('signout')
  @ApiOperation({ summary: 'Sign out and clear the session' })
  signOut(@Req() req: Request) {
    return { message: 'Signed out' };
  }
}
