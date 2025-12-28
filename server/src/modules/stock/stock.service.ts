/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { Stock } from '../../entities/stock.entity';
import { StockInfo } from '../../entities/stock-info.entity';
import YahooFinance from 'yahoo-finance2';
import { StockRepository } from './repositories/stock.repository';
import { StockInfoRepository } from './repositories/stock-info.repository';
import { ChartDataResponseDto } from './dto/chart-data.dto';

@Injectable()
export class StockService {
  private readonly logger = new Logger(StockService.name);
  private readonly yahooFinance = new YahooFinance();

  constructor(
    private readonly stockRepository: StockRepository,
    private readonly stockInfoRepository: StockInfoRepository,
  ) {}

  /**
   * 주식 데이터를 가져와서 DB에 저장
   * @param symbol 주식 심볼
   * @param startDate 시작 날짜 (선택)
   * @param endDate 종료 날짜 (선택)
   * @returns 저장된 데이터 개수
   */
  async fetchAndSaveStockData(
    symbol: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<number> {
    // 날짜가 지정되지 않으면 오늘 기준 5년치
    const today = new Date();
    const fiveYearsAgo = new Date();
    fiveYearsAgo.setFullYear(today.getFullYear() - 5);

    const requestStartDate = startDate || fiveYearsAgo;
    const requestEndDate = endDate || today;

    // 날짜 유효성 검사
    if (requestStartDate > requestEndDate) {
      throw new BadRequestException(
        '시작 날짜가 종료 날짜보다 늦을 수 없습니다.',
      );
    }

    // 기존 데이터 확인 및 기간 조정
    const adjustedPeriods = await this.adjustPeriodForExistingData(
      symbol,
      requestStartDate,
      requestEndDate,
    );

    // 모든 기간의 데이터가 이미 있으면 스킵
    if (adjustedPeriods.length === 0) {
      this.logger.log(
        `심볼 ${symbol}: 요청한 기간(${requestStartDate.toISOString().split('T')[0]} ~ ${requestEndDate.toISOString().split('T')[0]})의 데이터가 이미 모두 존재합니다.`,
      );
      return 0;
    }

    let totalSaved = 0;

    // 각 기간별로 데이터 조회 및 저장
    for (const period of adjustedPeriods) {
      try {
        const data = await this.fetchDataFromYahoo(
          symbol,
          period.start,
          period.end,
        );

        // 데이터가 없는 경우 (주말, 공휴일 등)는 정상적인 상황이므로 스킵
        if (!data || data.length === 0) {
          this.logger.warn(
            `심볼 ${symbol}: ${period.start.toISOString().split('T')[0]} ~ ${period.end.toISOString().split('T')[0]} 기간에 거래 데이터가 없습니다. (주말/공휴일일 수 있음)`,
          );
          continue;
        }

        const savedCount = await this.saveStockData(symbol, data);
        totalSaved += savedCount;
        this.logger.log(
          `심볼 ${symbol}: ${period.start.toISOString().split('T')[0]} ~ ${period.end.toISOString().split('T')[0]} 기간에 ${savedCount}개의 데이터를 저장했습니다.`,
        );
      } catch (error) {
        this.logger.error(
          `심볼 ${symbol}: ${period.start.toISOString().split('T')[0]} ~ ${period.end.toISOString().split('T')[0]} 기간 데이터 조회 실패`,
          error,
        );
        throw error;
      }
    }

    return totalSaved;
  }

  /**
   * 주식 시세 데이터와 기본 정보를 함께 가져와서 DB에 저장
   * @param symbol 주식 심볼
   * @param startDate 시작 날짜 (선택)
   * @param endDate 종료 날짜 (선택)
   * @returns 저장된 시세 데이터 개수와 주식 정보
   */
  async fetchAndSaveStockDataWithInfo(
    symbol: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<{ savedCount: number; stockInfo: StockInfo | null }> {
    // 시세 데이터와 기본 정보를 병렬로 가져오기
    const [savedCount, stockInfo] = await Promise.allSettled([
      this.fetchAndSaveStockData(symbol, startDate, endDate),
      this.fetchAndSaveStockInfo(symbol).catch((error) => {
        // 기본 정보 가져오기 실패는 경고만 남기고 계속 진행
        this.logger.warn(
          `심볼 ${symbol}의 기본 정보 가져오기 실패: ${error.message}`,
        );
        return null;
      }),
    ]);

    return {
      savedCount: savedCount.status === 'fulfilled' ? savedCount.value : 0,
      stockInfo: stockInfo.status === 'fulfilled' ? stockInfo.value : null,
    };
  }

  /**
   * 기존 데이터를 확인하고 필요한 기간만 계산
   */
  private async adjustPeriodForExistingData(
    symbol: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Array<{ start: Date; end: Date }>> {
    // 날짜 정규화 (시간 제거)
    const normalizedStartDate = new Date(startDate);
    normalizedStartDate.setHours(0, 0, 0, 0);
    const normalizedEndDate = new Date(endDate);
    normalizedEndDate.setHours(23, 59, 59, 999);

    // 요청한 기간 내의 기존 데이터 확인
    const existingData = await this.stockRepository.findBySymbolAndDateRange(
      symbol,
      normalizedStartDate,
      normalizedEndDate,
    );

    // 기존 데이터가 없으면 전체 기간 반환
    if (existingData.length === 0) {
      return [{ start: normalizedStartDate, end: normalizedEndDate }];
    }

    // 기존 데이터의 날짜를 Set으로 변환하여 빠른 조회
    const existingDates = new Set(
      existingData.map((item) => {
        const date = new Date(item.date);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
      }),
    );

    // 요청한 기간의 각 날짜를 확인하여 누락된 날짜 찾기
    const missingPeriods: Array<{ start: Date; end: Date }> = [];
    let currentPeriodStart: Date | null = null;

    const currentDate = new Date(normalizedStartDate);
    while (currentDate <= normalizedEndDate) {
      const dateKey = currentDate.getTime();
      const exists = existingDates.has(dateKey);

      if (!exists) {
        // 누락된 날짜 시작
        if (!currentPeriodStart) {
          currentPeriodStart = new Date(currentDate);
        }
      } else {
        // 누락된 날짜 종료
        if (currentPeriodStart) {
          const periodEnd = new Date(currentDate);
          periodEnd.setDate(periodEnd.getDate() - 1);
          periodEnd.setHours(23, 59, 59, 999);
          missingPeriods.push({
            start: currentPeriodStart,
            end: periodEnd,
          });
          currentPeriodStart = null;
        }
      }

      // 다음 날로 이동
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // 마지막 기간이 끝나지 않은 경우
    if (currentPeriodStart) {
      missingPeriods.push({
        start: currentPeriodStart,
        end: normalizedEndDate,
      });
    }

    return missingPeriods;
  }

  /**
   * yahoo-finance2에서 데이터 조회
   */
  private async fetchDataFromYahoo(
    symbol: string,
    startDate: Date,
    endDate: Date,
  ): Promise<any[]> {
    try {
      const queryOptions = {
        period1: Math.floor(startDate.getTime() / 1000),
        period2: Math.floor(endDate.getTime() / 1000),
        interval: '1d' as const,
      };

      const result = (await this.yahooFinance.historical(
        symbol,
        queryOptions,
      )) as any[];

      // 빈 배열인 경우는 정상 반환 (주말/공휴일 등으로 데이터가 없을 수 있음)
      // 상위에서 처리하도록 빈 배열 반환
      return result || [];
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(
        `yahoo-finance2 API 호출 실패: ${error.message}`,
        error,
      );
      throw new BadRequestException(`주식 데이터 조회 실패: ${error.message}`);
    }
  }

  /**
   * 주식 데이터를 DB에 저장
   */
  private async saveStockData(symbol: string, data: any[]): Promise<number> {
    if (!data || data.length === 0) {
      return 0;
    }

    const stocks = data.map((item: any) => {
      const stock = new Stock();
      stock.symbol = symbol;

      // 날짜 정규화 (시간 제거)
      const date = new Date(item.date as string | number | Date);
      date.setHours(0, 0, 0, 0);
      stock.date = date;

      stock.open = item.open ?? 0;
      stock.high = item.high ?? 0;
      stock.low = item.low ?? 0;
      stock.close = item.close ?? 0;
      stock.volume = item.volume ?? 0;
      // yahoo-finance2는 adjClose 또는 adjustedClose 필드를 사용할 수 있음
      stock.adjustedClose =
        item.adjClose ?? item.adjustedClose ?? item.close ?? 0;
      stock.dividendAmount = item.dividends ?? item.dividendAmount ?? null;
      stock.splitCoefficient = item.splits ?? item.splitCoefficient ?? 1.0;

      return stock;
    });

    // 중복 제거를 위해 upsert 사용
    return this.stockRepository.upsertMany(stocks);
  }

  /**
   * 주식 기본 정보를 가져와서 DB에 저장
   * @param symbol 주식 심볼
   * @returns 저장된 주식 정보
   */
  async fetchAndSaveStockInfo(symbol: string): Promise<StockInfo> {
    try {
      // yahoo-finance2에서 quote와 quoteSummary 가져오기
      let quote: any = null;
      let quoteSummary: any = null;
      let quoteError: Error | null = null;
      let summaryError: Error | null = null;

      try {
        // yahoo-finance2 v3의 quote 메서드 시도
        quote = await (this.yahooFinance as any).quote(symbol);
      } catch (error) {
        quoteError = error as Error;
        this.logger.warn(
          `심볼 ${symbol}의 quote 조회 실패: ${quoteError.message}`,
        );
      }

      try {
        // yahoo-finance2 v3의 quoteSummary 메서드 시도
        quoteSummary = await (this.yahooFinance as any).quoteSummary(symbol);
      } catch (error) {
        summaryError = error as Error;
        this.logger.warn(
          `심볼 ${symbol}의 quoteSummary 조회 실패: ${summaryError.message}`,
        );
      }

      if (!quote && !quoteSummary) {
        const errorMessage =
          quoteError && summaryError
            ? `quote: ${quoteError.message}, quoteSummary: ${summaryError.message}`
            : quoteError?.message || summaryError?.message || '알 수 없는 오류';
        throw new BadRequestException(
          `심볼 ${symbol}에 대한 정보를 찾을 수 없습니다. (${errorMessage})`,
        );
      }

      const quoteData = quote;
      const summaryData = quoteSummary;

      // StockInfo 엔티티 생성
      const stockInfo = new StockInfo();
      stockInfo.symbol = symbol.toUpperCase();
      stockInfo.longName =
        quoteData?.longName || summaryData?.quoteType?.longName || null;
      stockInfo.shortName =
        quoteData?.shortName || summaryData?.quoteType?.shortName || null;
      stockInfo.marketCap =
        quoteData?.marketCap ||
        summaryData?.summaryDetail?.marketCap?.raw ||
        null;
      stockInfo.sector = summaryData?.assetProfile?.sector || null;
      stockInfo.industry = summaryData?.assetProfile?.industry || null;
      stockInfo.currency =
        quoteData?.currency || summaryData?.price?.currency || null;
      stockInfo.exchange =
        quoteData?.exchange || summaryData?.quoteType?.exchange || null;
      stockInfo.currentPrice =
        quoteData?.regularMarketPrice ||
        summaryData?.price?.regularMarketPrice?.raw ||
        null;
      stockInfo.previousClose =
        quoteData?.regularMarketPreviousClose ||
        summaryData?.price?.regularMarketPreviousClose?.raw ||
        null;
      stockInfo.dayLow =
        quoteData?.regularMarketDayLow ||
        summaryData?.price?.regularMarketDayLow?.raw ||
        null;
      stockInfo.dayHigh =
        quoteData?.regularMarketDayHigh ||
        summaryData?.price?.regularMarketDayHigh?.raw ||
        null;
      stockInfo.volume =
        quoteData?.regularMarketVolume ||
        summaryData?.price?.regularMarketVolume?.raw ||
        null;
      stockInfo.fiftyTwoWeekLow =
        quoteData?.fiftyTwoWeekLow ||
        summaryData?.summaryDetail?.fiftyTwoWeekLow?.raw ||
        null;
      stockInfo.fiftyTwoWeekHigh =
        quoteData?.fiftyTwoWeekHigh ||
        summaryData?.summaryDetail?.fiftyTwoWeekHigh?.raw ||
        null;
      stockInfo.longBusinessSummary =
        summaryData?.assetProfile?.longBusinessSummary || null;

      // 기존 정보가 있으면 업데이트, 없으면 생성
      const { data, isUpdate } =
        await this.stockInfoRepository.upsert(stockInfo);
      this.logger.log(
        `심볼 ${symbol}의 기본 정보를 ${isUpdate ? '업데이트' : '저장'}했습니다.`,
      );
      return data;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`주식 기본 정보 조회 실패: ${error.message}`, error);
      throw new BadRequestException(
        `주식 기본 정보 조회 실패: ${error.message}`,
      );
    }
  }

  /**
   * 저장된 주식 기본 정보 조회
   * @param symbol 주식 심볼
   * @returns 주식 정보
   */
  async getStockInfo(symbol: string): Promise<StockInfo | null> {
    return this.stockInfoRepository.findBySymbol(symbol);
  }

  /**
   * 차트 데이터 조회
   * @param symbol 주식 심볼
   * @param startDate 시작 날짜 (선택)
   * @param endDate 종료 날짜 (선택)
   * @returns 차트 데이터
   */
  async getChartData(
    symbol: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<ChartDataResponseDto> {
    // 날짜가 지정되지 않으면 오늘 기준 5년치
    const today = new Date();
    const fiveYearsAgo = new Date();
    fiveYearsAgo.setFullYear(today.getFullYear() - 5);

    const requestStartDate = startDate || fiveYearsAgo;
    const requestEndDate = endDate || today;

    // 날짜 정규화
    const normalizedStartDate = new Date(requestStartDate);
    normalizedStartDate.setHours(0, 0, 0, 0);
    const normalizedEndDate = new Date(requestEndDate);
    normalizedEndDate.setHours(23, 59, 59, 999);

    // 데이터 조회
    const stocks = await this.stockRepository.findBySymbolAndDateRange(
      symbol.toUpperCase(),
      normalizedStartDate,
      normalizedEndDate,
    );

    // DTO 형식으로 변환
    const data = stocks.map((stock) => {
      // 날짜가 Date 객체가 아니면 변환
      const date =
        stock.date instanceof Date
          ? stock.date
          : new Date(stock.date as string | number | Date);

      return {
        date: date.toISOString().split('T')[0],
        open: Number(stock.open),
        high: Number(stock.high),
        low: Number(stock.low),
        close: Number(stock.close),
        volume: Number(stock.volume),
        adjustedClose: Number(stock.adjustedClose),
      };
    });

    return {
      symbol: symbol.toUpperCase(),
      startDate: normalizedStartDate.toISOString().split('T')[0],
      endDate: normalizedEndDate.toISOString().split('T')[0],
      data,
      count: data.length,
    };
  }
}
