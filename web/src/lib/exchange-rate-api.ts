/**
 * 환율 API 클라이언트
 * ExchangeRate-API (무료) 사용
 */
const EXCHANGE_RATE_API_URL = 'https://api.exchangerate-api.com/v4/latest/USD';

interface ExchangeRateResponse {
  base: string;
  date: string;
  rates: {
    [key: string]: number;
  };
}

/**
 * USD to KRW 환율 가져오기
 */
export const fetchExchangeRate = async (): Promise<number> => {
  try {
    const response = await fetch(EXCHANGE_RATE_API_URL);

    if (!response.ok) {
      throw new Error('환율 정보를 가져올 수 없습니다.');
    }

    const data: ExchangeRateResponse = await response.json();
    const krwRate = data.rates.KRW;

    if (!krwRate) {
      throw new Error('KRW 환율 정보를 찾을 수 없습니다.');
    }

    return krwRate;
  } catch (error) {
    console.error('환율 API 호출 실패:', error);
    // 실패 시 기본값 반환
    return 1300;
  }
};

/**
 * 환율 캐시 (1시간 유효)
 */
let cachedRate: number | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1시간

/**
 * 캐시된 환율 가져오기 또는 새로 가져오기
 */
export const getExchangeRate = async (forceRefresh = false): Promise<number> => {
  const now = Date.now();

  // 캐시가 있고 유효하면 캐시 사용
  if (
    !forceRefresh &&
    cachedRate !== null &&
    cacheTimestamp !== null &&
    now - cacheTimestamp < CACHE_DURATION
  ) {
    return cachedRate;
  }

  // 새로 가져오기
  const rate = await fetchExchangeRate();
  cachedRate = rate;
  cacheTimestamp = now;

  return rate;
};
