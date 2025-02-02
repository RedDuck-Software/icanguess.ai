import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetSessionsDto } from './dtos/get-sessions.dto';
import { GameService } from './game.service';
import { AiService } from 'src/ai/ai.service';
import { Request, Response } from 'express';
import { GetUserAttemptsDto } from './dtos/get-attempts.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Public } from '../auth/guards/public.decorator';

@ApiTags('Game')
@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('sessions')
  @Public()
  @ApiOperation({ summary: 'Gets all game sessions for a mode' })
  @ApiResponse({ status: 201, description: 'Signature created successfully.' })
  async getAllSession(@Query() startGameDto: GetSessionsDto) {
    const sessions = await this.gameService.getSessions(startGameDto.mode);
    return { sessions };
  }

  @Get('users/attempts')
  async getUserAttempts(@Query() dto: GetUserAttemptsDto, @Req() req: Request) {
    const attempts = await this.gameService.getUserAttempts(
      req.user.wallet,
      +dto.roundId,
      dto.mode,
    );
    return { attempts };
  }
}
