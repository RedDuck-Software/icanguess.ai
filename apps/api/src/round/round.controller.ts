import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RoundService } from './round.service';
import { StartRoundDto } from './dtos/start-round.dto';
import { TryGuessDto } from './dtos/try-guess.dto';
import { GetUserAttemptsDto } from './dtos/get-attempts.dto';
import { RequestUser, UserClaims } from 'src/auth/decorators/request-user';
import { getAddress } from 'ethers';
import { GetHistoryDto } from './dtos/get-history-dto.dto';

@ApiTags('Rounds')
@Controller('round')
export class RoundController {
  constructor(private readonly roundService: RoundService) {}

  @Post('start')
  @ApiOperation({ summary: 'Start a new round and generate secret words' })
  @ApiResponse({
    status: 201,
    description: 'Secret words generated successfully.',
  })
  startRound(@Body() dto: StartRoundDto) {
    return this.roundService.startRound({
      chainId: +dto.chainId,
      mode: dto.mode,
    });
  }

  @Post('guess')
  async tryGuess(
    @RequestUser() user: UserClaims,
    @Body() dto: TryGuessDto,
  ): Promise<{
    word: string | null;
    temperature: number;
  }> {
    return await this.roundService.tryGuess({
      roundId: +dto.roundId,
      userWallet: getAddress(user.wallet),
      prompt: dto.prompt,
      chainId: +dto.chainId,
    });
  }

  @Get('guess/history')
  async getGuessingHistory(
    @RequestUser() user: UserClaims,
    @Query() dto: GetHistoryDto,
  ) {
    return {
      history: await this.roundService.getGuessingHistory({
        roundId: +dto.roundId,
        userWallet: user.wallet,
        chainId: +dto.chainId,
      }),
    };
  }

  @Get('user/attempts')
  async getUserAttempts(
    @RequestUser() user: UserClaims,
    @Query() dto: GetUserAttemptsDto,
  ) {
    const attempts = await this.roundService.getUserAttempts({
      user: user.wallet,
      roundId: +dto.roundId,
      mode: dto.mode,
      chainId: +dto.chainId,
    });
    return { attempts };
  }
}
