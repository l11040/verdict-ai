import { Agent } from '../../../entities/agent.entity';
import { AgentPrompt } from '../../../entities/agent-prompt.entity';

export interface AgentProfile {
  agent: Agent;
  prompt: AgentPrompt;
  score: number;
}
