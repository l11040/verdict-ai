import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Verdict } from '../../../entities/verdict.entity';

@Injectable()
export class VerdictRepository {
  constructor(
    @InjectRepository(Verdict)
    private readonly repository: Repository<Verdict>,
  ) {}

  async save(verdict: Verdict): Promise<Verdict> {
    return this.repository.save(verdict);
  }

  async update(id: number, data: Partial<Verdict>): Promise<void> {
    await this.repository.update(id, data);
  }

  async findById(id: number): Promise<Verdict | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['debateLogs', 'user'],
    });
  }

  async findByUserId(userId: number): Promise<Verdict[]> {
    return this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findBySymbolAndUserId(
    symbol: string,
    userId: number,
  ): Promise<Verdict[]> {
    return this.repository.find({
      where: { symbol, userId },
      order: { createdAt: 'DESC' },
    });
  }
}
