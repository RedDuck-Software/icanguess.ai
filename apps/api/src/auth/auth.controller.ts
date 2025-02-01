import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { Public } from './guards/public.decorator';
import { AuthService } from './auth.service';
import { VerifyDto } from './dtos/verify.dto';
import { NonceDto } from './dtos/nonce.dto';

@Public()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('nonce')
  @ApiOperation({ summary: 'Get a nonce' })
  generateNonce(@Body() dto: NonceDto) {
    return this.authService.generateNonce(dto.wallet);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify' })
  async verify(@Body() dto: VerifyDto) {
    return this.authService.verify(dto.message, dto.signature, dto.wallet);
  }
}
