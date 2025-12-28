/**
 * 통화 변환 유틸리티 함수
 */
import type { Currency } from '@/stores/currency-store';

/**
 * USD 금액을 특정 통화로 포맷팅
 */
export const formatCurrencyAmount = (
  amount: number | null | undefined,
  currency: Currency,
  exchangeRate: number
): string => {
  if (amount === null || amount === undefined) return '-';

  if (currency === 'KRW') {
    const krwAmount = amount * exchangeRate;
    return `₩${krwAmount.toLocaleString('ko-KR', { maximumFractionDigits: 0 })}`;
  }

  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

/**
 * USD 금액을 특정 통화로 변환
 */
export const convertCurrency = (
  amount: number,
  targetCurrency: Currency,
  exchangeRate: number
): number => {
  if (targetCurrency === 'KRW') {
    return amount * exchangeRate;
  }
  return amount;
};

/**
 * 통화 심볼 반환
 */
export const getCurrencySymbol = (currency: Currency): string => {
  return currency === 'KRW' ? '₩' : '$';
};

/**
 * 통화 포맷팅 (숫자만)
 */
export const formatCurrencyValue = (
  amount: number | null | undefined,
  currency: Currency,
  exchangeRate: number
): string => {
  if (amount === null || amount === undefined) return '-';

  const converted = convertCurrency(amount, currency, exchangeRate);

  if (currency === 'KRW') {
    return converted.toLocaleString('ko-KR', { maximumFractionDigits: 0 });
  }

  return converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};
