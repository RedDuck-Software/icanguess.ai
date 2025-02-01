import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { SignaturesService } from '../signatures/signatures.service';
import { StartGameDto } from './dtos/start-game.dto';

@ApiTags('Game')
@Controller('game')
export class GameController {
  constructor(private readonly signaturesService: SignaturesService) {}

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
}
