/**
 * 주식 기본 정보 조회 Hook
 */
import { useQuery } from '@tanstack/react-query';
import { stocksApi } from '@/api';

export const useStockInfo = (symbol: string | null) => {
  return useQuery({
    queryKey: ['stockInfo', symbol],
    queryFn: async () => {
      if (!symbol) return null;
      const response = await stocksApi.stockControllerGetStockInfo({
        symbol: symbol.toUpperCase(),
      });
      return response.data;
    },
    enabled: !!symbol,
  });
};
