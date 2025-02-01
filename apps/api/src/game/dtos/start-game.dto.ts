import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class StartGameDto {
  @ApiProperty({
    description: 'The ID of the game round',
    example: 123,
  })
  @IsNumber()
  roundId: number;

  @ApiProperty({
    description: 'The target Ethereum address',
    example: '0xAbC123...XYZ',
  })
  @IsString()
  targetAddress: string;
}
