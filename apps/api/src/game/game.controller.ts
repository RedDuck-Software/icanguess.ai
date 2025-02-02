import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetSessionsDto } from './dtos/get-sessions.dto';
import { GameService } from './game.service';
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
}
