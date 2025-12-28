import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('stock_infos')
export class StockInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20, unique: true })
  @Index()
  symbol: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  longName: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  shortName: string | null;

  @Column({ type: 'bigint', nullable: true })
  marketCap: number | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  sector: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  industry: string | null;

  @Column({ type: 'varchar', length: 10, nullable: true })
  currency: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  exchange: string | null;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  currentPrice: number | null;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  previousClose: number | null;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  dayLow: number | null;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  dayHigh: number | null;

  @Column({ type: 'bigint', nullable: true })
  volume: number | null;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  fiftyTwoWeekLow: number | null;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  fiftyTwoWeekHigh: number | null;

  @Column({ type: 'text', nullable: true })
  longBusinessSummary: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
