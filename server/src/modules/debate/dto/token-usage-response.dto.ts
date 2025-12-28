import { ApiProperty } from '@nestjs/swagger';

export class TokenUsageResponseDto {
  @ApiProperty()
  totalTokens: number;

  @ApiProperty()
  promptTokens: number;

  @ApiProperty()
  completionTokens: number;
}
