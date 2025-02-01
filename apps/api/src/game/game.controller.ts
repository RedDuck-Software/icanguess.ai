import { Controller, Post, Body, Get, Query, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { SignaturesService } from '../signatures/signatures.service';
import { StartGameDto } from './dtos/start-game.dto';
import { GetSessionsDto } from './dtos/get-sessions.dto';
import { GameService } from './game.service';

@ApiTags('Game')
@Controller('game')
export class GameController {
  constructor(
    private readonly signaturesService: SignaturesService,
    private readonly gameService: GameService,
  ) {}

  @Post('start')
  @ApiOperation({ summary: 'Starts a game round by signing the game start' })
  @ApiBody({ type: StartGameDto })
  @ApiResponse({ status: 201, description: 'Signature created successfully.' })
  async startGame(@Body() startGameDto: StartGameDto) {
    const { roundId, targetAddress } = startGameDto;
    const signature = await this.signaturesService.signGameStart(
      roundId,
      targetAddress,
    );
    return { signature };
  }

  @Get('sessions')
  @ApiOperation({ summary: 'Gets all game sessions for a mode' })
  @ApiResponse({ status: 201, description: 'Signature created successfully.' })
  async getAllSession(@Query() startGameDto: GetSessionsDto) {
    const sessions = await this.gameService.getSessions(startGameDto.mode);
    return { sessions };
  }
}
