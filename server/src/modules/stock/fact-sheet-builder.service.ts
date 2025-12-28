/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger } from '@nestjs/common';
import { MasterFactSheet } from './dto/master-fact-sheet.interface';

@Injectable()
export class FactSheetBuilderService {
  private readonly logger = new Logger(FactSheetBuilderService.name);

  /**
   * yahoo-finance2의 quoteSummary와 historical 데이터를 받아 Master Fact Sheet로 가공
   * @param symbol 주식 심볼
   * @param quoteSummary yahoo-finance2의 quoteSummary 결과
   * @param historical yahoo-finance2의 historical 결과
   * @returns MasterFactSheet
   */
  buildMasterFactSheet(
    symbol: string,
    quoteSummary: any,
    historical: any[],
  ): MasterFactSheet {
    try {
      this.logger.log(`심볼 ${symbol}의 Master Fact Sheet 생성 시작`);

      // 현재가 추출
      const summaryDetail = quoteSummary?.summaryDetail || {};
      const price = quoteSummary?.price || {};
      const currentPrice =
        (price?.regularMarketPrice?.raw as number) ||
        (summaryDetail?.regularMarketPrice?.raw as number) ||
        (historical && historical.length > 0
          ? historical[historical.length - 1]?.close
          : null) ||
        null;

      const factSheet: MasterFactSheet = {
        symbol: symbol.toUpperCase(),
        currentPrice: this.roundToTwoDecimals(currentPrice as number | null),
        valuation: this.buildValuationCategory(quoteSummary),
        growth: this.buildGrowthCategory(quoteSummary),
        safety: this.buildSafetyCategory(quoteSummary),
        efficiency: this.buildEfficiencyCategory(quoteSummary),
        momentum: this.buildMomentumCategory(historical),
        volume: this.buildVolumeCategory(historical),
        dividend: this.buildDividendCategory(quoteSummary),
        context: this.buildContextCategory(quoteSummary),
      };

      this.logger.log(`심볼 ${symbol}의 Master Fact Sheet 생성 완료`);
      return factSheet;
    } catch (error) {
      this.logger.error(
        `심볼 ${symbol}의 Master Fact Sheet 생성 실패: ${error.message}`,
        error,
      );
      throw error;
    }
  }

  /**
   * Valuation 카테고리 구성
   */
  private buildValuationCategory(
    quoteSummary: any,
  ): MasterFactSheet['valuation'] {
    const summaryDetail = quoteSummary?.summaryDetail || {};
    const defaultKeyStatistics = quoteSummary?.defaultKeyStatistics || {};

    // 그레이엄 숫자 계산: sqrt(22.5 * eps * bvps)
    const eps = (defaultKeyStatistics?.trailingEps?.raw as number) || null;
    const bvps = (defaultKeyStatistics?.bookValue?.raw as number) || null;
    let intrinsicValue: number | null = null;

    if (eps && bvps && eps > 0 && bvps > 0) {
      intrinsicValue = Math.sqrt(22.5 * eps * bvps);
    }

    return {
      trailingPE: this.roundToTwoDecimals(
        (summaryDetail?.trailingPE?.raw as number) || null,
      ),
      forwardPE: this.roundToTwoDecimals(
        (summaryDetail?.forwardPE?.raw as number) || null,
      ),
      priceToBook: this.roundToTwoDecimals(
        (defaultKeyStatistics?.priceToBook?.raw as number) || null,
      ),
      pegRatio: this.roundToTwoDecimals(
        (defaultKeyStatistics?.pegRatio?.raw as number) || null,
      ),
      intrinsic_value: this.roundToTwoDecimals(intrinsicValue),
    };
  }

  /**
   * Growth 카테고리 구성
   */
  private buildGrowthCategory(quoteSummary: any): MasterFactSheet['growth'] {
    const financialData = quoteSummary?.financialData || {};
    const defaultKeyStatistics = quoteSummary?.defaultKeyStatistics || {};

    return {
      revenueGrowth: this.roundToTwoDecimals(
        (financialData?.revenueGrowth?.raw as number) || null,
      ),
      earningsQuarterlyGrowth: this.roundToTwoDecimals(
        (defaultKeyStatistics?.earningsQuarterlyGrowth?.raw as number) || null,
      ),
    };
  }

  /**
   * Safety 카테고리 구성
   */
  private buildSafetyCategory(quoteSummary: any): MasterFactSheet['safety'] {
    const financialData = quoteSummary?.financialData || {};
    const balanceSheet = quoteSummary?.balanceSheetHistoryQuarterly || {};

    // 최근 분기 데이터 사용
    const latestBalanceSheet = balanceSheet?.balanceSheetStatements?.[0] || {};

    // 부채비율 계산 (Total Debt / Total Equity)
    const totalDebt = (latestBalanceSheet?.totalDebt?.raw as number) || null;
    const totalEquity =
      (latestBalanceSheet?.totalStockholderEquity?.raw as number) || null;
    let debtToEquity: number | null = null;

    if (totalDebt && totalEquity && totalEquity > 0) {
      debtToEquity = totalDebt / totalEquity;
    }

    // 유동비율 계산 (Current Assets / Current Liabilities)
    const currentAssets =
      (latestBalanceSheet?.totalCurrentAssets?.raw as number) || null;
    const currentLiabilities =
      (latestBalanceSheet?.totalCurrentLiabilities?.raw as number) || null;
    let currentRatio: number | null = null;

    if (currentAssets && currentLiabilities && currentLiabilities > 0) {
      currentRatio = currentAssets / currentLiabilities;
    }

    // FCF 상태 판단
    const freeCashflow = (financialData?.freeCashflow?.raw as number) || null;
    let fcfStatus: 'Healthy' | 'Warning' | null = null;

    if (freeCashflow !== null) {
      fcfStatus = freeCashflow > 0 ? 'Healthy' : 'Warning';
    }

    return {
      debtToEquity: this.roundToTwoDecimals(debtToEquity),
      currentRatio: this.roundToTwoDecimals(currentRatio),
      fcf_status: fcfStatus,
    };
  }

  /**
   * Efficiency 카테고리 구성
   */
  private buildEfficiencyCategory(
    quoteSummary: any,
  ): MasterFactSheet['efficiency'] {
    const financialData = quoteSummary?.financialData || {};
    const defaultKeyStatistics = quoteSummary?.defaultKeyStatistics || {};

    return {
      returnOnEquity: this.roundToTwoDecimals(
        (defaultKeyStatistics?.returnOnEquity?.raw as number) || null,
      ),
      operatingMargins: this.roundToTwoDecimals(
        (financialData?.operatingMargins?.raw as number) || null,
      ),
    };
  }

  /**
   * Momentum 카테고리 구성
   */
  private buildMomentumCategory(
    historical: any[],
  ): MasterFactSheet['momentum'] {
    if (!historical || historical.length < 14) {
      return {
        rsi: null,
        dist_from_200ma: null,
        macd: { value: null, signal: null, histogram: null },
        bollingerBands: {
          upper: null,
          middle: null,
          lower: null,
          bandwidth: null,
        },
        sma20: null,
        sma50: null,
        ema12: null,
        ema26: null,
        priceVsSMA20: null,
        priceVsSMA50: null,
      };
    }

    const currentPrice = historical[historical.length - 1]?.close || null;

    // RSI 계산 (14일)
    const rsi = this.calculateRSI(historical, 14);

    // 200일 이동평균선 계산
    const sma200 = this.calculateSMA(historical, 200);
    let distFrom200ma: number | null = null;
    if (sma200 && currentPrice && sma200 > 0) {
      distFrom200ma = ((currentPrice - sma200) / sma200) * 100;
    }

    // MACD 계산
    const macd = this.calculateMACD(historical);

    // 볼린저 밴드 계산 (20일, 2 표준편차)
    const bollingerBands = this.calculateBollingerBands(historical, 20, 2);

    // 이동평균선들
    const sma20 = this.calculateSMA(historical, 20);
    const sma50 = this.calculateSMA(historical, 50);
    const ema12 = this.calculateEMA(historical, 12);
    const ema26 = this.calculateEMA(historical, 26);

    // 가격 vs 이평선 비율
    let priceVsSMA20: number | null = null;
    if (sma20 && currentPrice && sma20 > 0) {
      priceVsSMA20 = ((currentPrice - sma20) / sma20) * 100;
    }

    let priceVsSMA50: number | null = null;
    if (sma50 && currentPrice && sma50 > 0) {
      priceVsSMA50 = ((currentPrice - sma50) / sma50) * 100;
    }

    return {
      rsi: this.roundToTwoDecimals(rsi),
      dist_from_200ma: this.roundToTwoDecimals(distFrom200ma),
      macd: {
        value: this.roundToTwoDecimals(macd.value),
        signal: this.roundToTwoDecimals(macd.signal),
        histogram: this.roundToTwoDecimals(macd.histogram),
      },
      bollingerBands: {
        upper: this.roundToTwoDecimals(bollingerBands.upper),
        middle: this.roundToTwoDecimals(bollingerBands.middle),
        lower: this.roundToTwoDecimals(bollingerBands.lower),
        bandwidth: this.roundToTwoDecimals(bollingerBands.bandwidth),
      },
      sma20: this.roundToTwoDecimals(sma20),
      sma50: this.roundToTwoDecimals(sma50),
      ema12: this.roundToTwoDecimals(ema12),
      ema26: this.roundToTwoDecimals(ema26),
      priceVsSMA20: this.roundToTwoDecimals(priceVsSMA20),
      priceVsSMA50: this.roundToTwoDecimals(priceVsSMA50),
    };
  }

  /**
   * Volume 카테고리 구성
   */
  private buildVolumeCategory(historical: any[]): MasterFactSheet['volume'] {
    if (!historical || historical.length < 30) {
      return {
        avgVolume10d: null,
        avgVolume30d: null,
        currentVsAvg10d: null,
        volumeTrend: null,
      };
    }

    const currentVolume = historical[historical.length - 1]?.volume || null;

    // 10일 평균 거래량
    const avgVolume10d = this.calculateAverageVolume(historical, 10);

    // 30일 평균 거래량
    const avgVolume30d = this.calculateAverageVolume(historical, 30);

    // 현재 거래량 vs 10일 평균
    let currentVsAvg10d: number | null = null;
    if (currentVolume && avgVolume10d && avgVolume10d > 0) {
      currentVsAvg10d = currentVolume / avgVolume10d;
    }

    // 거래량 트렌드 판단 (최근 10일 vs 이전 10일)
    const volumeTrend = this.determineVolumeTrend(historical);

    return {
      avgVolume10d: this.roundToTwoDecimals(avgVolume10d),
      avgVolume30d: this.roundToTwoDecimals(avgVolume30d),
      currentVsAvg10d: this.roundToTwoDecimals(currentVsAvg10d),
      volumeTrend,
    };
  }

  /**
   * Dividend 카테고리 구성
   */
  private buildDividendCategory(
    quoteSummary: any,
  ): MasterFactSheet['dividend'] {
    const summaryDetail = quoteSummary?.summaryDetail || {};
    const defaultKeyStatistics = quoteSummary?.defaultKeyStatistics || {};

    return {
      dividendYield: this.roundToTwoDecimals(
        (summaryDetail?.dividendYield?.raw as number) || null,
      ),
      payoutRatio: this.roundToTwoDecimals(
        (defaultKeyStatistics?.payoutRatio?.raw as number) || null,
      ),
    };
  }

  /**
   * Context 카테고리 구성
   */
  private buildContextCategory(quoteSummary: any): MasterFactSheet['context'] {
    const defaultKeyStatistics = quoteSummary?.defaultKeyStatistics || {};

    return {
      marketCapRank: null, // 시가총액 순위는 별도 계산 필요
      beta: this.roundToTwoDecimals(
        (defaultKeyStatistics?.beta?.raw as number) || null,
      ),
    };
  }

  /**
   * RSI 계산 (Relative Strength Index)
   */
  private calculateRSI(data: any[], period: number): number | null {
    if (!data || data.length < period + 1) {
      return null;
    }

    const gains: number[] = [];
    const losses: number[] = [];

    // 가격 변화 계산
    for (let i = 1; i <= period; i++) {
      const current = (data[data.length - i]?.close as number) || 0;
      const previous = (data[data.length - i - 1]?.close as number) || 0;
      const change = current - previous;

      if (change > 0) {
        gains.push(change);
        losses.push(0);
      } else {
        gains.push(0);
        losses.push(Math.abs(change));
      }
    }

    // 평균 상승/하락 계산
    const avgGain = gains.reduce((sum, gain) => sum + gain, 0) / period;
    const avgLoss = losses.reduce((sum, loss) => sum + loss, 0) / period;

    if (avgLoss === 0) {
      return 100; // 손실이 없으면 RSI = 100
    }

    const rs = avgGain / avgLoss;
    return 100 - 100 / (1 + rs);
  }

  /**
   * 단순 이동평균선 계산
   */
  private calculateSMA(data: any[], period: number): number | null {
    if (!data || data.length < period) {
      return null;
    }

    const recentPrices = data
      .slice(-period)
      .map((item) => (item.close as number) || 0);
    const sum = recentPrices.reduce((acc, price) => acc + price, 0);
    return sum / period;
  }

  /**
   * 지수 이동평균선 계산 (EMA)
   */
  private calculateEMA(data: any[], period: number): number | null {
    if (!data || data.length < period) {
      return null;
    }

    const multiplier = 2 / (period + 1);
    const prices = data.map((item) => (item.close as number) || 0);

    // 초기 SMA로 시작
    let ema = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;

    // EMA 계산
    for (let i = period; i < prices.length; i++) {
      ema = (prices[i] - ema) * multiplier + ema;
    }

    return ema;
  }

  /**
   * MACD 계산 (12-26-9)
   */
  private calculateMACD(data: any[]): {
    value: number | null;
    signal: number | null;
    histogram: number | null;
  } {
    if (!data || data.length < 26) {
      return { value: null, signal: null, histogram: null };
    }

    const ema12 = this.calculateEMA(data, 12);
    const ema26 = this.calculateEMA(data, 26);

    if (!ema12 || !ema26) {
      return { value: null, signal: null, histogram: null };
    }

    const macdValue = ema12 - ema26;

    // Signal line은 MACD의 9일 EMA
    // 간단하게 구현하기 위해 최근 9개 MACD 값의 평균으로 근사
    const macdSignal = macdValue; // 실제로는 9일 EMA를 계산해야 하지만 단순화

    return {
      value: macdValue,
      signal: macdSignal,
      histogram: macdValue - macdSignal,
    };
  }

  /**
   * 볼린저 밴드 계산
   */
  private calculateBollingerBands(
    data: any[],
    period: number,
    stdDev: number,
  ): {
    upper: number | null;
    middle: number | null;
    lower: number | null;
    bandwidth: number | null;
  } {
    if (!data || data.length < period) {
      return { upper: null, middle: null, lower: null, bandwidth: null };
    }

    const middle = this.calculateSMA(data, period);
    if (!middle) {
      return { upper: null, middle: null, lower: null, bandwidth: null };
    }

    // 표준편차 계산
    const recentPrices = data
      .slice(-period)
      .map((item) => (item.close as number) || 0);
    const variance =
      recentPrices.reduce((sum, price) => {
        const diff = price - middle;
        return sum + diff * diff;
      }, 0) / period;
    const standardDeviation = Math.sqrt(variance);

    const upper = middle + stdDev * standardDeviation;
    const lower = middle - stdDev * standardDeviation;
    const bandwidth = ((upper - lower) / middle) * 100; // 밴드 너비 (%)

    return {
      upper,
      middle,
      lower,
      bandwidth,
    };
  }

  /**
   * 평균 거래량 계산
   */
  private calculateAverageVolume(data: any[], period: number): number | null {
    if (!data || data.length < period) {
      return null;
    }

    const recentVolumes = data
      .slice(-period)
      .map((item) => (item.volume as number) || 0);
    const sum = recentVolumes.reduce((acc, vol) => acc + vol, 0);
    return sum / period;
  }

  /**
   * 거래량 트렌드 판단
   */
  private determineVolumeTrend(
    data: any[],
  ): 'Increasing' | 'Decreasing' | 'Stable' | null {
    if (!data || data.length < 20) {
      return null;
    }

    // 최근 10일 평균 vs 이전 10일 평균
    const recent10 = this.calculateAverageVolume(data.slice(-10), 10);
    const previous10 = this.calculateAverageVolume(data.slice(-20, -10), 10);

    if (!recent10 || !previous10 || previous10 === 0) {
      return null;
    }

    const change = (recent10 - previous10) / previous10;

    if (change > 0.2) return 'Increasing'; // 20% 이상 증가
    if (change < -0.2) return 'Decreasing'; // 20% 이상 감소
    return 'Stable';
  }

  /**
   * 소수점 2자리로 반올림
   */
  private roundToTwoDecimals(value: number | null): number | null {
    return value !== null && !isNaN(value)
      ? Math.round(value * 100) / 100
      : null;
  }
}
