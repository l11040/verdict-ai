import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAgentPromptDto {
  @ApiProperty({
    description: '시스템 프롬프트',
    example: '당신은 가치 투자 전문가입니다.',
  })
  @IsString()
  @IsNotEmpty()
  systemPrompt: string;

  @ApiProperty({
    description: '발언 지시 템플릿',
    example: '다음 주식 데이터를 분석하세요: {{factSheet}}',
  })
  @IsString()
  @IsNotEmpty()
  instructionTemplate: string;

  @ApiProperty({
    description: '프롬프트 버전',
    default: 1,
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  version?: number;

  @ApiProperty({
    description: '활성화 여부',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    description: '프롬프트 설명',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
