import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';
import { nanoid } from 'nanoid';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 12 })
  uid: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  nickname: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  refreshToken: string | null;

  @Column({ type: 'bigint', default: 0 })
  totalTokensUsed: number;

  @Column({ type: 'datetime', nullable: true })
  lastTokenResetAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  generateUid() {
    if (!this.uid) {
      this.uid = nanoid(12);
    }
  }
}
