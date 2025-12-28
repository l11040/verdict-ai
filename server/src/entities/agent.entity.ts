import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
  Unique,
  ValueTransformer,
} from 'typeorm';
import { AgentPrompt } from './agent-prompt.entity';

const jsonArrayTransformer: ValueTransformer = {
  to: (value: string[] | null): string | null => {
    return value ? JSON.stringify(value) : null;
  },
  from: (value: string | null): string[] | null => {
    return value ? JSON.parse(value) : null;
  },
};

const jsonObjectTransformer: ValueTransformer = {
  to: (value: any): string | null => {
    return value ? JSON.stringify(value) : null;
  },
  from: (value: string | null): any => {
    return value ? JSON.parse(value) : null;
  },
};

@Entity('agents')
@Unique(['agentId'])
@Index(['isActive', 'priority'])
export class Agent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  agentId: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ length: 50 })
  specialization: string;

  @Column({
    type: 'longtext',
    nullable: true,
    transformer: jsonArrayTransformer,
  })
  expertiseCategories: string[] | null;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  priority: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  model: string | null;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0.7 })
  temperature: number;

  @Column({ type: 'int', default: 1000 })
  maxTokens: number;

  @Column({
    type: 'longtext',
    nullable: true,
    transformer: jsonObjectTransformer,
  })
  metadata: any;

  @OneToMany(() => AgentPrompt, (prompt) => prompt.agent)
  prompts: AgentPrompt[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
