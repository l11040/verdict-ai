import { ApiProperty } from '@nestjs/swagger';

export class AgentPromptResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  agentId: number;

  @ApiProperty()
  systemPrompt: string;

  @ApiProperty()
  instructionTemplate: string;

  @ApiProperty()
  version: number;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty({ nullable: true })
  description: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
