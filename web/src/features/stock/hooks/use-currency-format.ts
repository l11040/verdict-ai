/**
 * 통화 포맷팅 Hook
 */
import { useCurrencyStore } from '@/stores/currency-store';
import { formatCurrencyAmount } from '@/lib/currency';

/**
 * USD 금액을 현재 선택된 통화로 변환하는 Hook
 */
export const useCurrencyFormat = () => {
  const { currency, exchangeRate } = useCurrencyStore();

  const formatCurrency = (amount: number | null | undefined): string => {
    return formatCurrencyAmount(amount, currency, exchangeRate);
  };

  return { formatCurrency, currency, exchangeRate };
};
