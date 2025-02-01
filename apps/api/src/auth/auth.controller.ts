import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { Public } from './guards/public.decorator';
import { AuthService } from './auth.service';
import { VerifyDto } from './dtos/verify.dto';

@Public()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('nonce')
  @ApiOperation({ summary: 'Get a none' })
  generateNonce() {
    return this.authService.generateNonce();
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify' })
  async login(@Body() dto: VerifyDto) {
    return this.authService.verify(dto.message, dto.signature);
  }
}
