/**
 * 로그인 Mutation Hook
 * React Query를 사용한 로그인 API 호출
 */
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/api';
import type { LoginDto } from '@/api/generated/api';
import { useAuthStore } from '../stores/auth-store';
import { useNavigate } from 'react-router-dom';

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user?: {
    id: number;
    uid: string;
    email: string;
    nickname: string;
    createdAt: string;
    updatedAt: string;
  };
}

interface LoginMutationVariables {
  loginDto: LoginDto;
}

export const useLoginMutation = () => {
  const { setTokens, setError } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ loginDto }: LoginMutationVariables) => {
      const response = await authApi.authControllerLogin({ loginDto });
      return response.data as LoginResponse;
    },
    onSuccess: (data) => {
      const { access_token, refresh_token } = data;

      // 토큰만 저장하고, 사용자 정보는 /me API로 가져옴
      setTokens(access_token, refresh_token);
      navigate('/', { replace: true });
    },
    onError: (error: unknown) => {
      let errorMessage =
        '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.';

      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        errorMessage =
          axiosError.response?.data?.message ||
          axiosError.message ||
          errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setError(errorMessage);
    },
  });
};
