import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { Agent } from './agent.entity';

@Entity('agent_prompts')
@Index(['agentId', 'isActive'])
@Index(['agentId', 'version'])
export class AgentPrompt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  agentId: number;

  @ManyToOne(() => Agent, (agent) => agent.prompts, {
    onDelete: 'CASCADE',
  })
  agent: Agent;

  @Column({ type: 'text' })
  systemPrompt: string;

  @Column({ type: 'text' })
  instructionTemplate: string;

  @Column({ type: 'int', default: 1 })
  version: number;

  @Column({ type: 'boolean', default: false })
  isActive: boolean;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
