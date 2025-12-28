import { PartialType } from '@nestjs/swagger';
import { CreateAgentPromptDto } from './create-agent-prompt.dto';

export class UpdateAgentPromptDto extends PartialType(CreateAgentPromptDto) {}
