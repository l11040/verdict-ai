/**
 * 통화 상태 관리 스토어 (Zustand)
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Currency = 'USD' | 'KRW';

interface CurrencyState {
  currency: Currency;
  exchangeRate: number; // USD to KRW 환율
  lastUpdated: number | null; // 마지막 업데이트 시간
  setCurrency: (currency: Currency) => void;
  setExchangeRate: (rate: number) => void;
  updateExchangeRate: (rate: number) => void;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      currency: 'USD',
      exchangeRate: 1300, // 기본 환율 (API에서 가져올 때까지 사용)
      lastUpdated: null,
      setCurrency: (currency) => set({ currency }),
      setExchangeRate: (rate) => set({ exchangeRate: rate }),
      updateExchangeRate: (rate) =>
        set({
          exchangeRate: rate,
          lastUpdated: Date.now(),
        }),
    }),
    {
      name: 'currency-storage',
      partialize: (state) => ({
        currency: state.currency,
        exchangeRate: state.exchangeRate,
        lastUpdated: state.lastUpdated,
      }),
    }
  )
);
