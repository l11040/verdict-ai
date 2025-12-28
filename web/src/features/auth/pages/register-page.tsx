/**
 * 회원가입 페이지
 * Feature-based Architecture: features/auth/pages/register-page.tsx
 */
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuthStore } from '../stores/auth-store';
import type { RegisterDto } from '@/api/generated/api';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import {
  registerSchema,
  type RegisterFormData,
} from '../schemas/register-schema';
import { useRegisterMutation } from '../hooks/use-register-mutation';
import { cn } from '@/lib/utils';
import { ParticleBackground } from '../components/particle-background';

export const RegisterPage = () => {
  const { error, isAuthenticated, clearError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const registerMutation = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      nickname: '',
    },
  });

  // 이미 로그인된 경우 대시보드로 리다이렉트
  if (isAuthenticated) {
    navigate('/', { replace: true });
    return null;
  }

  const onSubmit = (data: RegisterFormData) => {
    clearError();

    const registerDto: RegisterDto = {
      email: data.email,
      password: data.password,
      nickname: data.nickname,
    };

    registerMutation.mutate({ registerDto });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* 왼쪽: 브랜딩 영역 */}
      <div className="hidden md:flex md:w-1/2">
        <ParticleBackground />
      </div>

      {/* 오른쪽: 회원가입 폼 영역 */}
      <div className="flex-1 flex items-center justify-center bg-background dark:bg-neutral-950 p-6 md:p-12">
        <div className="w-full max-w-md animate-in fade-in duration-300">
          {/* 헤더 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground tracking-tight dark:text-white mb-2">
              계정을 생성하세요
            </h1>
            <p className="text-sm text-muted-foreground dark:text-neutral-400">
              AI 투자 심의 위원회에 합류하세요.
            </p>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm font-medium">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* 회원가입 폼 */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* 이메일 입력 */}
            <div className="space-y-2">
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none transition-colors group-focus-within:text-primary dark:text-neutral-400 dark:group-focus-within:text-primary-400" />
                <Input
                  {...register('email')}
                  type="email"
                  placeholder="example@email.com"
                  className={cn(
                    'pl-10 h-12 bg-background border-input text-foreground placeholder:text-muted-foreground',
                    'transition-all duration-200 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2',
                    'hover:border-primary/50',
                    errors.email &&
                      'border-destructive focus-visible:ring-destructive',
                  )}
                  disabled={registerMutation.isPending}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* 닉네임 입력 */}
            <div className="space-y-2">
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none transition-colors group-focus-within:text-primary dark:text-neutral-400 dark:group-focus-within:text-primary-400" />
                <Input
                  {...register('nickname')}
                  type="text"
                  placeholder="닉네임을 입력하세요"
                  className={cn(
                    'pl-10 h-12 bg-background border-input text-foreground placeholder:text-muted-foreground',
                    'transition-all duration-200 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2',
                    'hover:border-primary/50',
                    errors.nickname &&
                      'border-destructive focus-visible:ring-destructive',
                  )}
                  disabled={registerMutation.isPending}
                />
              </div>
              {errors.nickname && (
                <p className="text-sm text-destructive">
                  {errors.nickname.message}
                </p>
              )}
            </div>

            {/* 비밀번호 입력 */}
            <div className="space-y-2">
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none transition-colors group-focus-within:text-primary dark:text-neutral-400 dark:group-focus-within:text-primary-400" />
                <Input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="비밀번호를 입력하세요"
                  className={cn(
                    'pl-10 pr-12 h-12 bg-background border-input text-foreground placeholder:text-muted-foreground',
                    'transition-all duration-200 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2',
                    'hover:border-primary/50',
                    errors.password &&
                      'border-destructive focus-visible:ring-destructive',
                  )}
                  disabled={registerMutation.isPending}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-all duration-200 p-2 rounded-lg hover:bg-primary/10 dark:text-neutral-400 dark:hover:text-primary-400 dark:hover:bg-primary/20 active:scale-95 z-10 flex items-center justify-center"
                  aria-label={
                    showPassword ? '비밀번호 숨기기' : '비밀번호 보기'
                  }
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* 회원가입 버튼 */}
            <div className="pt-2">
              <Button
                type="submit"
                size="lg"
                className={cn(
                  'w-full h-12 text-base font-semibold',
                  'bg-primary text-primary-foreground hover:bg-primary/90',
                  'transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]',
                  'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
                )}
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    회원가입 중...
                  </span>
                ) : (
                  '회원가입'
                )}
              </Button>
            </div>
          </form>

          {/* 추가 링크 (로그인 등) */}
          <p className="mt-6 text-center text-sm text-muted-foreground dark:text-neutral-400">
            이미 계정이 있으신가요?{' '}
            <Link
              to="/login"
              className="text-primary hover:text-primary/80 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors duration-200 hover:underline underline-offset-2"
            >
              로그인
            </Link>
          </p>
        </div>
      </div>

      {/* 모바일: 브랜딩 영역 (하단) */}
      <div className="md:hidden h-48 flex-shrink-0">
        <ParticleBackground />
      </div>
    </div>
  );
};
