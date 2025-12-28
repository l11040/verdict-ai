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
   * 주식 데이터 일괄 저장 (upsert) - TypeORM upsert 사용
   */
  async upsertMany(stocks: Stock[]): Promise<number> {
    if (stocks.length === 0) {
      return 0;
    }

    // 날짜 정규화 (시간 제거)
    const normalizedStocks = stocks.map(stock => {
      const normalizedDate = new Date(stock.date);
      normalizedDate.setHours(0, 0, 0, 0);
      return {
        ...stock,
        date: normalizedDate,
      };
    });

    // TypeORM의 upsert 기능 사용
    // conflictPaths: 충돌 감지 컬럼 (symbol + date의 복합 unique)
    // skipUpdateIfNoValuesChanged: 값이 변경되지 않으면 업데이트 스킵
    await this.repository.upsert(normalizedStocks, {
      conflictPaths: ['symbol', 'date'],
      skipUpdateIfNoValuesChanged: true,
    });

    // upsert는 삽입/업데이트 개수를 정확히 반환하지 않으므로
    // 처리된 전체 개수를 반환 (로깅 용도)
    return normalizedStocks.length;
  }
}
