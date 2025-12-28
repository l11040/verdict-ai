import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agent } from '../../../entities/agent.entity';

@Injectable()
export class AgentRepository {
  constructor(
    @InjectRepository(Agent)
    private readonly repository: Repository<Agent>,
  ) {}

  async save(agent: Agent): Promise<Agent> {
    return this.repository.save(agent);
  }

  async findAll(): Promise<Agent[]> {
    return this.repository.find({
      order: { priority: 'ASC', createdAt: 'ASC' },
    });
  }

  async findActive(): Promise<Agent[]> {
    return this.repository.find({
      where: { isActive: true },
      order: { priority: 'ASC', createdAt: 'ASC' },
      relations: ['prompts'],
    });
  }

  async findById(id: number): Promise<Agent | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['prompts'],
    });
  }

  async findByAgentId(agentId: string): Promise<Agent | null> {
    return this.repository.findOne({
      where: { agentId },
      relations: ['prompts'],
    });
  }

  async update(id: number, data: Partial<Agent>): Promise<void> {
    await this.repository.update(id, data);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
