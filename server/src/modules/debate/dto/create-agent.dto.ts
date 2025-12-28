import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsArray,
  Min,
  Max,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAgentDto {
  @ApiProperty({
    description: '에이전트 고유 식별자',
    example: 'value_investor',
  })
  @IsString()
  @IsNotEmpty()
  agentId: string;

  @ApiProperty({
    description: '에이전트 이름',
    example: 'Value Investor',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: '에이전트 설명',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: '전문 분야',
    example: 'Valuation',
  })
  @IsString()
  @IsNotEmpty()
  specialization: string;

  @ApiProperty({
    description: '전문 카테고리 배열',
    example: ['valuation'],
    type: [String],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  expertiseCategories?: string[];

  @ApiProperty({
    description: '활성화 여부',
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    description: '우선순위',
    default: 0,
  })
  @IsNumber()
  @IsOptional()
  priority?: number;

  @ApiProperty({
    description: 'LLM 모델',
    example: 'gpt-4o-mini',
    required: false,
  })
  @IsString()
  @IsOptional()
  model?: string;

  @ApiProperty({
    description: '모델 온도',
    default: 0.7,
    minimum: 0,
    maximum: 2,
  })
  @IsNumber()
  @Min(0)
  @Max(2)
  @IsOptional()
  temperature?: number;

  @ApiProperty({
    description: '최대 토큰 수',
    default: 1000,
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  maxTokens?: number;

  @ApiProperty({
    description: '추가 메타데이터',
    required: false,
  })
  @IsOptional()
  metadata?: any;
}
