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
import { ConfigService } from '@nestjs/config';
import { RequestUser, UserClaims } from 'src/auth/decorators/request-user';

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
      +dto.chainId,
    );

    return { token };
  }

  @Get('session')
  getSession(@RequestUser() user: UserClaims) {
    return {
      address: user.wallet,
      chainId: user.chainId,
    };
  }

  @Get('signout')
  @ApiOperation({ summary: 'Sign out and clear the session' })
  signOut(@Req() req: Request) {
    return { message: 'Signed out' };
  }
}
