/**
 * 주식 데이터 가져오기 Hook
 */
import { useMutation } from '@tanstack/react-query';
import { stocksApi } from '@/api';

interface FetchStockParams {
  symbol: string;
  startDate?: string;
  endDate?: string;
}

export const useFetchStock = () => {
  return useMutation({
    mutationFn: async ({ symbol, startDate, endDate }: FetchStockParams) => {
      const response = await stocksApi.stockControllerFetchStockData({
        symbol: symbol.toUpperCase(),
        startDate,
        endDate,
      });
      return response.data;
    },
  });
};
