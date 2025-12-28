/**
 * 주식 상세 페이지
 * Feature-based Architecture: features/stock/pages/stock-detail-page.tsx
 */
import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  BarChart3,
  DollarSign,
  Activity,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppHeader } from '@/shared/components';
import { useFetchStock, useStockInfo } from '../hooks';
import { StockChart } from '../components';
import { useCurrencyStore } from '@/stores/currency-store';
import { formatCurrencyValue, getCurrencySymbol } from '@/lib/currency';
import { useCurrencyFormat } from '../hooks/use-currency-format';
import { useToastStore } from '@/lib/toast-store';
import { DebatePanel } from '@/features/debate';
import type { DebateStatus } from '@/features/debate/types';

export const StockDetailPage = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const { currency, exchangeRate } = useCurrencyStore();
  const { formatCurrency } = useCurrencyFormat();
  const { addToast } = useToastStore();
  const [debateStatus, setDebateStatus] = useState<DebateStatus>('idle');

  const {
    data: stockInfo,
    isLoading: infoLoading,
    error: infoError,
  } = useStockInfo(symbol || null);
  const fetchStockMutation = useFetchStock();

  // 토론 진행 중인지 확인 (idle일 때만 차트/About 표시)
  const showChartAndAbout = debateStatus === 'idle';

  useEffect(() => {
    if (symbol && !infoLoading && !stockInfo && !infoError) {
      // 데이터가 없으면 자동으로 가져오기
      fetchStockMutation.mutate({ symbol });
    }
  }, [symbol, infoLoading, stockInfo, infoError, fetchStockMutation]);

  // 토스트 메시지 표시
  useEffect(() => {
    if (fetchStockMutation.isSuccess && fetchStockMutation.data) {
      addToast(fetchStockMutation.data.message, 'success');
    }
  }, [fetchStockMutation.isSuccess, fetchStockMutation.data, addToast]);

  useEffect(() => {
    if (fetchStockMutation.isError) {
      addToast('데이터를 가져오는 중 오류가 발생했습니다.', 'error');
    }
  }, [fetchStockMutation.isError, addToast]);

  const handleFetchData = () => {
    if (symbol) {
      fetchStockMutation.mutate({ symbol });
    }
  };

  // stockData 먼저 정의
  const stockData = stockInfo || fetchStockMutation.data?.stockInfo;

  // 전일 종가 대비 변화율 계산
  const priceChange = useMemo(() => {
    if (!stockData?.currentPrice || !stockData?.previousClose) return null;
    const current = Number(stockData.currentPrice);
    const previous = Number(stockData.previousClose);
    const change = current - previous;
    const changePercent = (change / previous) * 100;
    return { change, changePercent, isPositive: change >= 0 };
  }, [stockData]);

  if (!symbol) {
    return (
      <div className="min-h-screen bg-background dark:bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">주식 심볼이 없습니다.</p>
          <Button onClick={() => navigate('/')} variant="outline">
            검색 페이지로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  const isLoading = infoLoading || fetchStockMutation.isPending;

  return (
    <div className="min-h-screen bg-background dark:bg-neutral-950">
      <AppHeader showBackButton backButtonLabel="검색으로" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 로딩 상태 */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-6 h-6 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">
              데이터를 불러오는 중...
            </span>
          </div>
        )}

        {/* 에러 상태 */}
        {!isLoading && infoError && !stockData && (
          <div className="text-center py-20">
            <p className="text-destructive mb-4">
              주식 정보를 불러올 수 없습니다.
            </p>
            <Button
              onClick={handleFetchData}
              disabled={fetchStockMutation.isPending}
            >
              데이터 가져오기
            </Button>
          </div>
        )}

        {/* 데이터 표시 */}
        {!isLoading && stockData && (
          <div className="space-y-8">
            {/* 헤더 영역 - 카드 없이 깔끔하게 */}
            <header className="border-b border-border/30 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                {/* 왼쪽: 심볼 및 회사 정보 */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-4xl font-bold tracking-tight text-foreground dark:text-white">
                      {symbol.toUpperCase()}
                    </h1>
                    <button
                      onClick={handleFetchData}
                      disabled={fetchStockMutation.isPending}
                      className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      title="새로고침"
                    >
                      <RefreshCw
                        className={`w-4 h-4 text-neutral-500 ${
                          fetchStockMutation.isPending ? 'animate-spin' : ''
                        }`}
                      />
                    </button>
                  </div>
                  {stockData.longName && (
                    <p className="text-lg text-muted-foreground dark:text-neutral-400">
                      {stockData.longName}
                    </p>
                  )}
                </div>

                {/* 오른쪽: 현재가 및 변화율 */}
                {stockData.currentPrice && (
                  <div className="text-left sm:text-right">
                    <p className="text-4xl font-bold tracking-tight text-foreground dark:text-white">
                      {formatCurrency(stockData.currentPrice)}
                    </p>
                    {priceChange && (
                      <div
                        className={`flex items-center gap-1 sm:justify-end mt-1 ${
                          priceChange.isPositive
                            ? 'text-emerald-500'
                            : 'text-rose-500'
                        }`}
                      >
                        {priceChange.isPositive ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4" />
                        )}
                        <span className="font-medium">
                          {priceChange.isPositive ? '+' : ''}
                          {getCurrencySymbol(currency)}
                          {formatCurrencyValue(
                            Math.abs(priceChange.change),
                            currency,
                            exchangeRate,
                          )}
                          <span className="ml-1 text-sm">
                            ({priceChange.isPositive ? '+' : ''}
                            {priceChange.changePercent.toFixed(2)}%)
                          </span>
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </header>

            {/* 주요 지표 - 인라인 스타일로 간결하게 */}
            <section className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {stockData.dayLow && stockData.dayHigh && (
                <div className="group">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-primary" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      오늘
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-foreground dark:text-white">
                    {getCurrencySymbol(currency)}
                    {formatCurrencyValue(
                      Number(stockData.dayLow),
                      currency,
                      exchangeRate,
                    )}
                    <span className="text-muted-foreground mx-1">—</span>
                    {getCurrencySymbol(currency)}
                    {formatCurrencyValue(
                      Number(stockData.dayHigh),
                      currency,
                      exchangeRate,
                    )}
                  </p>
                </div>
              )}

              {stockData.volume && (
                <div className="group">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-primary" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      거래량
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-foreground dark:text-white">
                    {Number(stockData.volume).toLocaleString()}
                  </p>
                </div>
              )}

              {stockData.marketCap && (
                <div className="group">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-primary" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      시가총액
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-foreground dark:text-white">
                    {(() => {
                      const marketCapUSD =
                        currency === 'USD'
                          ? Number(stockData.marketCap)
                          : Number(stockData.marketCap) * exchangeRate;

                      const formatKoreanNumber = (num: number) => {
                        const trillion = 1_000_000_000_000;
                        const hundredMillion = 100_000_000;

                        if (num >= trillion) {
                          return `${(num / trillion).toFixed(1)}조`;
                        } else {
                          return `${Math.round(num / hundredMillion)}억`;
                        }
                      };

                      return `${formatKoreanNumber(marketCapUSD)}${
                        currency === 'USD' ? '달러' : '원'
                      }`;
                    })()}
                  </p>
                </div>
              )}

              {stockData.fiftyTwoWeekLow && stockData.fiftyTwoWeekHigh && (
                <div className="group">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      52주
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-foreground dark:text-white">
                    {getCurrencySymbol(currency)}
                    {formatCurrencyValue(
                      Number(stockData.fiftyTwoWeekLow),
                      currency,
                      exchangeRate,
                    )}
                    <span className="text-muted-foreground mx-1">—</span>
                    {getCurrencySymbol(currency)}
                    {formatCurrencyValue(
                      Number(stockData.fiftyTwoWeekHigh),
                      currency,
                      exchangeRate,
                    )}
                  </p>
                </div>
              )}
            </section>

            {/* 차트 - idle 상태일 때만 표시 */}
            {showChartAndAbout && (
              <section className="pt-6 border-t border-border/30">
                <StockChart symbol={symbol} />
              </section>
            )}

            {/* AI 투자 토론 패널 */}
            <DebatePanel symbol={symbol} onStatusChange={setDebateStatus} />

            {/* 회사 소개 - idle 상태일 때만 표시 */}
            {showChartAndAbout && stockData.longBusinessSummary && (
              <section className="pt-4 border-t border-border/30">
                <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                  About
                </h2>
                <p className="text-sm text-foreground/80 dark:text-neutral-300 leading-relaxed max-w-3xl">
                  {stockData.longBusinessSummary}
                </p>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
