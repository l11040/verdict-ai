/**
 * 환율 조회 Hook
 */
import { useQuery } from '@tanstack/react-query';
import { getExchangeRate } from '@/lib/exchange-rate-api';

export const useExchangeRate = () => {
  return useQuery({
    queryKey: ['exchangeRate'],
    queryFn: () => getExchangeRate(),
    staleTime: 60 * 60 * 1000, // 1시간
    gcTime: 60 * 60 * 1000, // 1시간 (이전 cacheTime)
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
