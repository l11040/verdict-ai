import { ApiProperty } from '@nestjs/swagger';
import { VerdictDecision } from '../../../entities/verdict.entity';

export class VerdictResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  symbol: string;

  @ApiProperty()
  userId: number;

  @ApiProperty({ enum: VerdictDecision })
  decision: VerdictDecision;

  @ApiProperty({ nullable: true })
  targetPrice: number | null;

  @ApiProperty()
  confidence: number;

  @ApiProperty({ nullable: true })
  reasoning: string | null;

  @ApiProperty()
  factSheet: any;

  @ApiProperty()
  totalTokens: number;

  @ApiProperty()
  promptTokens: number;

  @ApiProperty()
  completionTokens: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
