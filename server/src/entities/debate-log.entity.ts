import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  Index,
  ValueTransformer,
  JoinColumn,
} from 'typeorm';
import { Verdict } from './verdict.entity';

const jsonObjectTransformer: ValueTransformer = {
  to: (value: any): string | null => {
    return value ? JSON.stringify(value) : null;
  },
  from: (value: string | null): any => {
    return value ? JSON.parse(value) : null;
  },
};

@Entity('debate_logs')
@Index(['verdictId', 'turn'])
@Index(['verdictId', 'createdAt'])
export class DebateLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  verdictId: number;

  @ManyToOne(() => Verdict, (verdict) => verdict.debateLogs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'verdictId' })
  verdict: Verdict;

  @Column({ length: 100 })
  agentId: string;

  @Column({ length: 100 })
  agentRole: string;

  @Column({ type: 'int' })
  turn: number;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  summary: string | null;

  @Column({ type: 'varchar', length: 10, nullable: true })
  decision: 'BUY' | 'SELL' | 'HOLD' | null;

  @Column({ type: 'int', nullable: true })
  confidence: number | null;

  @Column({
    type: 'longtext',
    nullable: true,
    transformer: jsonObjectTransformer,
  })
  metadata: any;

  @Column({ type: 'bigint', default: 0 })
  tokensUsed: number;

  @Column({ type: 'bigint', default: 0 })
  promptTokens: number;

  @Column({ type: 'bigint', default: 0 })
  completionTokens: number;

  @CreateDateColumn()
  createdAt: Date;
}
