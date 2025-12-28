import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockInfo } from '../../../entities/stock-info.entity';

@Injectable()
export class StockInfoRepository {
  constructor(
    @InjectRepository(StockInfo)
    private readonly repository: Repository<StockInfo>,
  ) {}

  /**
   * 심볼로 주식 정보 조회
   */
  async findBySymbol(symbol: string): Promise<StockInfo | null> {
    return this.repository.findOne({
      where: { symbol: symbol.toUpperCase() },
    });
  }

  /**
   * 주식 정보 저장
   */
  async save(stockInfo: StockInfo): Promise<StockInfo> {
    return this.repository.save(stockInfo);
  }

  /**
   * 주식 정보 업데이트
   */
  async update(symbol: string, data: Partial<StockInfo>): Promise<void> {
    await this.repository.update({ symbol }, data);
  }

  /**
   * 주식 정보 저장 또는 업데이트
   * @returns 업데이트 여부 (true: 업데이트, false: 새로 저장)
   */
  async upsert(
    stockInfo: StockInfo,
  ): Promise<{ data: StockInfo; isUpdate: boolean }> {
    const existing = await this.findBySymbol(stockInfo.symbol);

    if (existing) {
      await this.update(stockInfo.symbol, stockInfo);
      const updated = await this.findBySymbol(stockInfo.symbol);
      if (!updated) {
        throw new Error('주식 정보 업데이트 후 조회에 실패했습니다.');
      }
      return { data: updated, isUpdate: true };
    } else {
      const saved = await this.save(stockInfo);
      return { data: saved, isUpdate: false };
    }
  }
}
