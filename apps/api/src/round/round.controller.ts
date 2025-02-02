import {
  Controller,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Get,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RoundService } from './round.service';
import { StartRoundDto } from './dtos/start-round.dto';
import { TryGuessDto } from './dtos/try-guess.dto';
import { Request } from 'express';

@ApiTags('Rounds')
@Controller('rounds')
export class RoundController {
  constructor(private readonly roundService: RoundService) {}

  @Post('start')
  @ApiOperation({ summary: 'Start a new round and generate secret words' })
  @ApiResponse({
    status: 201,
    description: 'Secret words generated successfully.',
  })
  startRound(@Body() startRoundDto: StartRoundDto) {
    return this.roundService.startRound(startRoundDto.mode);
  }

  @Post(':roundId/guess')
  async tryGuess(
    @Param('roundId', ParseIntPipe) roundId: number,
    @Body() tryGuessDto: TryGuessDto,
  ): Promise<{
    word: string | null;
    temperature: number;
  }> {
    const { prompt, walletAddress } = tryGuessDto;
    return await this.roundService.tryGuess(roundId, walletAddress, prompt);
  }

  @Get(':roundId/guess/history')
  async getGuessingHistory(
    @Param('roundId', ParseIntPipe) roundId: number,
    @Req() req: Request,
  ) {
    return {
      history: await this.roundService.getGuessingHistory(
        roundId,
        req.user.wallet,
      ),
    };
  }
}
