import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Unique,
} from 'typeorm';

@Entity('stocks')
@Unique(['symbol', 'date'])
@Index(['symbol', 'date'])
export class Stock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  @Index()
  symbol: string;

  @Column({ type: 'date' })
  @Index()
  date: Date;

  @Column({ type: 'decimal', precision: 15, scale: 4 })
  open: number;

  @Column({ type: 'decimal', precision: 15, scale: 4 })
  high: number;

  @Column({ type: 'decimal', precision: 15, scale: 4 })
  low: number;

  @Column({ type: 'decimal', precision: 15, scale: 4 })
  close: number;

  @Column({ type: 'bigint' })
  volume: number;

  @Column({ type: 'decimal', precision: 15, scale: 4 })
  adjustedClose: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  dividendAmount: number | null;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true, default: 1.0 })
  splitCoefficient: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

