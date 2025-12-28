export interface MasterFactSheet {
  symbol: string;
  currentPrice: number | null; // 현재가 추가
  valuation: {
    trailingPE: number | null;
    forwardPE: number | null;
    priceToBook: number | null;
    pegRatio: number | null;
    intrinsic_value: number | null;
  };
  growth: {
    revenueGrowth: number | null;
    earningsQuarterlyGrowth: number | null;
  };
  safety: {
    debtToEquity: number | null;
    currentRatio: number | null;
    fcf_status: 'Healthy' | 'Warning' | null;
  };
  efficiency: {
    returnOnEquity: number | null;
    operatingMargins: number | null;
  };
  momentum: {
    rsi: number | null;
    dist_from_200ma: number | null;
    macd: {
      value: number | null;
      signal: number | null;
      histogram: number | null;
    };
    bollingerBands: {
      upper: number | null;
      middle: number | null;
      lower: number | null;
      bandwidth: number | null; // 밴드 너비 (변동성 지표)
    };
    sma20: number | null;
    sma50: number | null;
    ema12: number | null;
    ema26: number | null;
    priceVsSMA20: number | null; // 20일 이평선 대비 % (양수면 위, 음수면 아래)
    priceVsSMA50: number | null; // 50일 이평선 대비 %
  };
  volume: {
    avgVolume10d: number | null;
    avgVolume30d: number | null;
    currentVsAvg10d: number | null; // 현재 거래량 / 10일 평균 (1.5면 50% 증가)
    volumeTrend: 'Increasing' | 'Decreasing' | 'Stable' | null;
  };
  dividend: {
    dividendYield: number | null;
    payoutRatio: number | null;
  };
  context: {
    marketCapRank: number | null;
    beta: number | null;
  };
}
