import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class NonceDto {
  @ApiProperty({
    example: '0x7115240a3d2b58112C74968fEA7cdea944D9b10c',
    description: 'Wallet address',
  })
  @IsString()
  @IsNotEmpty()
  wallet: string;
}
