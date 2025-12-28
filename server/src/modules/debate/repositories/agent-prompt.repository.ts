import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgentPrompt } from '../../../entities/agent-prompt.entity';

@Injectable()
export class AgentPromptRepository {
  constructor(
    @InjectRepository(AgentPrompt)
    private readonly repository: Repository<AgentPrompt>,
  ) {}

  async save(prompt: AgentPrompt): Promise<AgentPrompt> {
    return this.repository.save(prompt);
  }

  async findByAgentId(agentId: number): Promise<AgentPrompt[]> {
    return this.repository.find({
      where: { agentId },
      order: { version: 'DESC' },
    });
  }

  async findActiveByAgentId(agentId: number): Promise<AgentPrompt | null> {
    return this.repository.findOne({
      where: { agentId, isActive: true },
    });
  }

  async findById(id: number): Promise<AgentPrompt | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['agent'],
    });
  }

  async update(id: number, data: Partial<AgentPrompt>): Promise<void> {
    await this.repository.update(id, data);
  }

  async deactivateAllByAgentId(agentId: number): Promise<void> {
    await this.repository.update({ agentId }, { isActive: false });
  }
}
