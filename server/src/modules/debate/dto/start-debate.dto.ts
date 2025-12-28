import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StartDebateDto {
  @ApiProperty({
    description: '주식 심볼',
    example: 'AAPL',
  })
  @IsString()
  @IsNotEmpty()
  symbol: string;
}
