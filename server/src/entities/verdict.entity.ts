import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  Index,
  ValueTransformer,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { DebateLog } from './debate-log.entity';

const jsonObjectTransformer: ValueTransformer = {
  to: (value: any): string | null => {
    return value ? JSON.stringify(value) : null;
  },
  from: (value: string | null): any => {
    return value ? JSON.parse(value) : null;
  },
};

export enum VerdictDecision {
  BUY = 'BUY',
  SELL = 'SELL',
  HOLD = 'HOLD',
}

@Entity('verdicts')
@Index(['symbol', 'userId'])
@Index(['userId', 'createdAt'])
export class Verdict {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  @Index()
  symbol: string;

  @Column()
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({
    type: 'enum',
    enum: VerdictDecision,
  })
  decision: VerdictDecision;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  targetPrice: number | null;

  @Column({ type: 'int', default: 0 })
  confidence: number;

  @Column({ type: 'text', nullable: true })
  reasoning: string | null;

  @Column({
    type: 'longtext',
    nullable: true,
    transformer: jsonObjectTransformer,
  })
  factSheet: any;

  @Column({ type: 'bigint', default: 0 })
  totalTokens: number;

  @Column({ type: 'bigint', default: 0 })
  promptTokens: number;

  @Column({ type: 'bigint', default: 0 })
  completionTokens: number;

  @OneToMany(() => DebateLog, (debateLog) => debateLog.verdict)
  debateLogs: DebateLog[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
