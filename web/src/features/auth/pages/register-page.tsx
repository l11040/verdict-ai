/**
 * 회원가입 페이지
 * Feature-based Architecture: features/auth/pages/register-page.tsx
 */
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuthStore } from '../stores/auth-store';
import type { RegisterDto } from '@/api/generated/api';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { registerSchema, type RegisterFormData } from '../schemas/register-schema';
import { useRegisterMutation } from '../hooks/use-register-mutation';
import { cn } from '@/lib/utils';

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
    navigate('/dashboard', { replace: true });
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
    <div className="min-h-screen flex items-center justify-center bg-background p-6 dark:bg-neutral-950">
      <div className="w-full max-w-md">
        {/* 회원가입 폼 카드 */}
        <Card className="bg-card border-border rounded-2xl p-10 shadow-lg dark:bg-neutral-950 dark:border-neutral-900/50">
          <CardContent className="p-0">
            {/* 헤더 */}
            <div className="mb-10">
              <h1 className="text-3xl font-bold text-foreground tracking-tight dark:text-white">
                계정을 생성하세요
              </h1>
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
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                  <Input
                    {...register('email')}
                    type="email"
                    placeholder="example@email.com"
                    className={cn(
                      'pl-10 h-12 bg-background border-input text-foreground placeholder:text-muted-foreground dark:bg-neutral-800 dark:border-white/20 dark:text-white dark:placeholder:text-neutral-500',
                      errors.email && 'border-destructive focus-visible:ring-destructive'
                    )}
                    disabled={registerMutation.isPending}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              {/* 닉네임 입력 */}
              <div className="space-y-2">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                  <Input
                    {...register('nickname')}
                    type="text"
                    placeholder="닉네임을 입력하세요"
                    className={cn(
                      'pl-10 h-12 bg-background border-input text-foreground placeholder:text-muted-foreground dark:bg-neutral-800 dark:border-white/20 dark:text-white dark:placeholder:text-neutral-500',
                      errors.nickname && 'border-destructive focus-visible:ring-destructive'
                    )}
                    disabled={registerMutation.isPending}
                  />
                </div>
                {errors.nickname && (
                  <p className="text-sm text-destructive">{errors.nickname.message}</p>
                )}
              </div>

              {/* 비밀번호 입력 */}
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                  <Input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="비밀번호를 입력하세요"
                    className={cn(
                      'pl-10 pr-12 h-12 bg-background border-input text-foreground placeholder:text-muted-foreground dark:bg-neutral-800 dark:border-white/20 dark:text-white dark:placeholder:text-neutral-500',
                      errors.password && 'border-destructive focus-visible:ring-destructive'
                    )}
                    disabled={registerMutation.isPending}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-accent dark:text-white dark:hover:text-neutral-300 dark:hover:bg-neutral-800/50 active:scale-95 z-10 flex items-center justify-center"
                    aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              {/* 회원가입 버튼 */}
              <div className="pt-3">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-14 text-base font-semibold"
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
            <p className="mt-8 text-center text-sm text-muted-foreground dark:text-white">
              이미 계정이 있으신가요?{' '}
              <Link
                to="/login"
                className="text-primary hover:text-primary/80 font-medium transition-colors duration-200 hover:underline underline-offset-2 dark:text-white dark:hover:text-neutral-300"
              >
                로그인
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

