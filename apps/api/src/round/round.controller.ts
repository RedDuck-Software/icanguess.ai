import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RoundService } from './round.service';
import { StartRoundDto } from './dtos/start-round.dto';

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
}
