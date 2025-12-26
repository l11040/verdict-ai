/**
 * React Query QueryClient 설정 (상수)
 */
import { QueryClient } from '@tanstack/react-query';

// QueryClient 인스턴스 생성
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5분
    },
    mutations: {
      retry: 0,
    },
  },
});


