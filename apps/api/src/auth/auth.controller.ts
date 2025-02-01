import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from './guards/public.decorator';
import { AuthService } from './auth.service';
import { VerifyDto } from './dtos/verify.dto';
import { NonceDto } from './dtos/nonce.dto';
import { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt.guard';

@Public()
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
  @ApiOperation({ summary: 'Verify SIWE message and return JWT token' })
  async verify(@Body() dto: VerifyDto) {
    console.log(1);
    const token = await this.authService.verify(
      dto.message,
      dto.signature,
      dto.wallet,
    );
    return { token };
  }

  @UseGuards(JwtAuthGuard)
  @Get('session')
  @ApiOperation({ summary: 'Get the SIWE session' })
  getSession(@Req() req: Request) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('signout')
  @ApiOperation({ summary: 'Sign out and clear the session' })
  signOut(@Req() req: Request) {
    return { message: 'Signed out' };
  }
}
