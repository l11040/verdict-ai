/**
 * 현재 사용자 정보 조회 Query Hook
 * React Query를 사용한 /me API 호출
 */
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { authApi } from '@/api';
import { useAuthStore } from '../stores/auth-store';
import type { User } from '../types';

interface MeResponse {
  id: number;
  uid: string;
  email: string;
  nickname: string;
  createdAt: string;
  updatedAt: string;
}

export const useMeQuery = () => {
  const { accessToken, setUser } = useAuthStore();

  const { data, isSuccess } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const response = await authApi.authControllerGetMe();
      return response.data as MeResponse;
    },
    enabled: !!accessToken, // 토큰이 있을 때만 실행
    staleTime: 5 * 60 * 1000, // 5분
  });

  // 데이터가 성공적으로 로드되면 사용자 정보 업데이트
  useEffect(() => {
    if (isSuccess && data) {
      // API 응답의 user 객체를 클라이언트 User 타입으로 변환
      const user: User = {
        id: String(data.id),
        email: data.email,
        nickname: data.nickname,
      };
      setUser(user);
    }
  }, [isSuccess, data, setUser]);

  return { data, isSuccess };
};
