/**
 * 앱 헤더 컴포넌트
 * 공통 헤더 UI를 제공합니다.
 */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, LogOut, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/features/auth';
import { useMeQuery } from '@/features/auth/hooks/use-me-query';
import { useCurrencyStore } from '@/stores/currency-store';
import { useExchangeRate } from '@/features/stock/hooks/use-exchange-rate';

interface AppHeaderProps {
  showBackButton?: boolean;
  backButtonLabel?: string;
  onBackClick?: () => void;
}

export const AppHeader = ({
  showBackButton = false,
  backButtonLabel = '뒤로가기',
  onBackClick,
}: AppHeaderProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, logout } = useAuthStore();
  const {
    currency,
    setCurrency,
    updateExchangeRate,
    exchangeRate: storeRate,
  } = useCurrencyStore();
  const { data: exchangeRate, isLoading: isLoadingRate } = useExchangeRate();

  // 사용자 정보 가져오기 (토큰이 있으면 자동으로 실행)
  useMeQuery();

  // 환율이 업데이트되면 스토어에 반영
  useEffect(() => {
    if (exchangeRate) {
      updateExchangeRate(exchangeRate);
    }
  }, [exchangeRate, updateExchangeRate]);

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate('/');
    }
  };

  const handleLogout = () => {
    // React Query 캐시 초기화 (이전 사용자 정보 제거)
    queryClient.clear();
    logout();
    navigate('/login');
  };

  const handleCurrencyToggle = () => {
    setCurrency(currency === 'USD' ? 'KRW' : 'USD');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* 왼쪽: 뒤로가기 + 로고 */}
          <div className="flex items-center gap-3 min-w-0">
            {showBackButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="shrink-0"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                <span className="hidden sm:inline">{backButtonLabel}</span>
              </Button>
            )}
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-md shadow-primary/25 shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-lg font-bold text-foreground dark:text-white tracking-tight shrink-0">
                Verdict AI
              </h1>
            </button>
          </div>

          {/* 오른쪽: 통화 + 사용자 정보 */}
          <div className="flex items-center gap-3 shrink-0">
            {/* 통화 전환 */}
            <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-muted/50 border border-border/50">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCurrencyToggle}
                className="h-7 px-2 font-medium"
                disabled={isLoadingRate}
              >
                {currency === 'USD' ? '$' : '₩'}
                <span className="ml-1 hidden sm:inline">{currency}</span>
              </Button>
              {!isLoadingRate && storeRate && (
                <span className="text-xs text-muted-foreground dark:text-neutral-500 hidden lg:inline border-l border-border/50 pl-2">
                  1$ = ₩{Math.round(storeRate).toLocaleString()}
                </span>
              )}
            </div>

            {/* 사용자 정보 */}
            {user && (
              <div className="hidden md:flex items-center px-3 py-1.5 rounded-lg bg-primary/10 dark:bg-primary/20 border border-primary/20">
                <span className="text-sm text-primary dark:text-primary-300 font-medium truncate max-w-[120px]">
                  {user.nickname || user.email || user.id}
                </span>
              </div>
            )}

            {/* 로그아웃 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="shrink-0"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline ml-1.5">로그아웃</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
