import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Stock } from '../../../entities/stock.entity';

@Injectable()
export class StockRepository {
  constructor(
    @InjectRepository(Stock)
    private readonly repository: Repository<Stock>,
  ) {}

  /**
   * 기간 내 주식 데이터 조회
   */
  async findBySymbolAndDateRange(
    symbol: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Stock[]> {
    return this.repository.find({
      where: {
        symbol,
        date: Between(startDate, endDate),
      },
      order: {
        date: 'ASC',
      },
    });
  }

  /**
   * 심볼과 날짜로 주식 데이터 조회
   */
  async findBySymbolAndDate(symbol: string, date: Date): Promise<Stock | null> {
    return this.repository.findOne({
      where: {
        symbol,
        date,
      },
    });
  }

  /**
   * 주식 데이터 저장
   */
  async save(stock: Stock): Promise<Stock> {
    return this.repository.save(stock);
  }

  /**
   * 주식 데이터 업데이트
   */
  async update(
    symbol: string,
    date: Date,
    data: Partial<Stock>,
  ): Promise<void> {
    await this.repository.update({ symbol, date }, data);
  }

  /**
   * 주식 데이터 일괄 저장 (upsert)
   */
  async upsertMany(stocks: Stock[]): Promise<number> {
    let savedCount = 0;

    for (const stock of stocks) {
      const existing = await this.findBySymbolAndDate(stock.symbol, stock.date);

      if (existing) {
        await this.update(stock.symbol, stock.date, {
          open: stock.open,
          high: stock.high,
          low: stock.low,
          close: stock.close,
          volume: stock.volume,
          adjustedClose: stock.adjustedClose,
          dividendAmount: stock.dividendAmount,
          splitCoefficient: stock.splitCoefficient,
        });
      } else {
        await this.save(stock);
        savedCount++;
      }
    }

    return savedCount;
  }
}
