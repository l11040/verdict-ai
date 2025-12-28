import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DebateLog } from '../../../entities/debate-log.entity';

@Injectable()
export class DebateLogRepository {
  constructor(
    @InjectRepository(DebateLog)
    private readonly repository: Repository<DebateLog>,
  ) {}

  async save(debateLog: DebateLog): Promise<DebateLog> {
    return this.repository.save(debateLog);
  }

  async saveMany(debateLogs: DebateLog[]): Promise<DebateLog[]> {
    return this.repository.save(debateLogs);
  }

  async findByVerdictId(verdictId: number): Promise<DebateLog[]> {
    return this.repository.find({
      where: { verdictId },
      order: { turn: 'ASC', createdAt: 'ASC' },
    });
  }

  async findByVerdictIdAndTurn(
    verdictId: number,
    turn: number,
  ): Promise<DebateLog[]> {
    return this.repository.find({
      where: { verdictId, turn },
      order: { createdAt: 'ASC' },
    });
  }
}
