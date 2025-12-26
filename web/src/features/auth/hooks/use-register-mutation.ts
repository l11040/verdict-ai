/**
 * 회원가입 Mutation Hook
 * React Query를 사용한 회원가입 API 호출
 */
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/api';
import type { RegisterDto } from '@/api/generated/api';
import { useAuthStore } from '../stores/auth-store';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types';

interface RegisterResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: number;
    uid: string;
    email: string;
    nickname: string;
    createdAt: string;
    updatedAt: string;
  };
}

interface RegisterMutationVariables {
  registerDto: RegisterDto;
}

export const useRegisterMutation = () => {
  const { setAuth, setError } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ registerDto }: RegisterMutationVariables) => {
      const response = await authApi.authControllerRegister({ registerDto });
      return response.data as RegisterResponse;
    },
    onSuccess: (data) => {
      const { access_token, refresh_token, user } = data;
      
      // API 응답의 user 객체를 클라이언트 User 타입으로 변환
      const clientUser: User = {
        id: String(user.id),
        email: user.email,
        nickname: user.nickname,
      };

      setAuth(clientUser, access_token, refresh_token);
      navigate('/dashboard', { replace: true });
    },
    onError: (error: unknown) => {
      let errorMessage = '회원가입에 실패했습니다. 다시 시도해주세요.';
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { 
          response?: { 
            status?: number;
            data?: { message?: string } 
          }; 
          message?: string 
        };
        
        // 409 에러 (이미 존재하는 이메일) 처리
        if (axiosError.response?.status === 409) {
          errorMessage = '이미 사용 중인 이메일입니다.';
        } else {
          errorMessage =
            axiosError.response?.data?.message ||
            axiosError.message ||
            errorMessage;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    },
  });
};

