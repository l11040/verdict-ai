/**
 * 주식 차트 데이터 조회 Hook
 */
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/api/client/axios';

export interface ChartDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjustedClose: number;
}

export interface ChartDataResponse {
  symbol: string;
  startDate: string;
  endDate: string;
  data: ChartDataPoint[];
  count: number;
}

interface UseChartDataParams {
  symbol: string | null;
  startDate?: string;
  endDate?: string;
  enabled?: boolean;
}

export const useChartData = ({
  symbol,
  startDate,
  endDate,
  enabled = true,
}: UseChartDataParams) => {
  return useQuery({
    queryKey: ['chartData', symbol, startDate, endDate],
    queryFn: async (): Promise<ChartDataResponse> => {
      if (!symbol) {
        throw new Error('Symbol is required');
      }

      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const url = `/stocks/${symbol.toUpperCase()}/chart${
        params.toString() ? `?${params.toString()}` : ''
      }`;

      const response = await axiosInstance.get<ChartDataResponse>(url);
      return response.data;
    },
    enabled: enabled && !!symbol,
    staleTime: 5 * 60 * 1000, // 5분
  });
};
