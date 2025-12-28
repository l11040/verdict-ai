import { ApiProperty } from '@nestjs/swagger';

export class AgentResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  agentId: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ nullable: true })
  description: string | null;

  @ApiProperty()
  specialization: string;

  @ApiProperty({ nullable: true, type: [String] })
  expertiseCategories: string[] | null;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  priority: number;

  @ApiProperty({ nullable: true })
  model: string | null;

  @ApiProperty()
  temperature: number;

  @ApiProperty()
  maxTokens: number;

  @ApiProperty({ nullable: true })
  metadata: any;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
