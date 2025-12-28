/**
 * 주식 상세 페이지
 * Feature-based Architecture: features/stock/pages/stock-detail-page.tsx
 */
import { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RefreshCw, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AppHeader } from '@/shared/components';
import { useFetchStock, useStockInfo } from '../hooks';
import { useCurrencyStore } from '@/stores/currency-store';
import { formatCurrencyValue, getCurrencySymbol } from '@/lib/currency';
import { useCurrencyFormat } from '../hooks/use-currency-format';
import { useToastStore } from '@/lib/toast-store';

export const StockDetailPage = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const { currency, exchangeRate } = useCurrencyStore();
  const { formatCurrency } = useCurrencyFormat();
  const { addToast } = useToastStore();

  const {
    data: stockInfo,
    isLoading: infoLoading,
    error: infoError,
  } = useStockInfo(symbol || null);
  const fetchStockMutation = useFetchStock();

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

  // 전일 종가 대비 변화율 계산
  const priceChange = useMemo(() => {
    if (!stockInfo?.currentPrice || !stockInfo?.previousClose) return null;
    const current = Number(stockInfo.currentPrice);
    const previous = Number(stockInfo.previousClose);
    const change = current - previous;
    const changePercent = (change / previous) * 100;
    return { change, changePercent, isPositive: change >= 0 };
  }, [stockInfo]);

  if (!symbol) {
    return (
      <div className="min-h-screen bg-background dark:bg-neutral-950 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">주식 심볼이 없습니다.</p>
            <Button onClick={() => navigate('/')} className="mt-4">
              검색 페이지로 돌아가기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isLoading = infoLoading || fetchStockMutation.isPending;
  const stockData = stockInfo || fetchStockMutation.data?.stockInfo;

  return (
    <div className="min-h-screen bg-background dark:bg-neutral-950">
      <AppHeader showBackButton backButtonLabel="검색으로" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 로딩 상태 */}
        {isLoading && (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">데이터를 불러오는 중...</p>
            </CardContent>
          </Card>
        )}

        {/* 에러 상태 */}
        {!isLoading && infoError && !stockData && (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-destructive mb-4">
                주식 정보를 불러올 수 없습니다.
              </p>
              <Button
                onClick={handleFetchData}
                disabled={fetchStockMutation.isPending}
              >
                데이터 가져오기
              </Button>
            </CardContent>
          </Card>
        )}

        {/* 데이터 표시 */}
        {!isLoading && stockData && (
          <div className="space-y-6">
            {/* 헤더 영역: 심볼, 회사명, 현재가, 변화율 */}
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 border-primary/20">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  {/* 왼쪽: 심볼 및 회사 정보 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shrink-0">
                        <span className="text-white font-bold text-lg">
                          {symbol.toUpperCase().slice(0, 2)}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3">
                          <h1 className="text-3xl font-bold text-foreground dark:text-white">
                            {symbol.toUpperCase()}
                          </h1>
                          {/* 새로고침 버튼 */}
                          <Button
                            onClick={handleFetchData}
                            disabled={fetchStockMutation.isPending}
                            size="sm"
                            variant="outline"
                            className="gap-2 h-9"
                          >
                            <RefreshCw
                              className={`w-4 h-4 ${
                                fetchStockMutation.isPending
                                  ? 'animate-spin'
                                  : ''
                              }`}
                            />
                            <span className="hidden sm:inline">
                              {fetchStockMutation.isPending
                                ? '새로고침 중...'
                                : '새로고침'}
                            </span>
                          </Button>
                        </div>
                        {stockData.longName && (
                          <p className="text-base text-muted-foreground dark:text-neutral-400 truncate">
                            {stockData.longName}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 오른쪽: 현재가 및 변화율 */}
                  {stockData.currentPrice && (
                    <div className="text-right">
                      <p className="text-4xl font-bold text-foreground dark:text-white mb-1">
                        {formatCurrency(stockData.currentPrice)}
                      </p>
                      {priceChange && (
                        <div
                          className={`flex items-center gap-1.5 justify-end ${
                            priceChange.isPositive
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}
                        >
                          {priceChange.isPositive ? (
                            <ArrowUpRight className="w-4 h-4" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4" />
                          )}
                          <span className="font-semibold">
                            {priceChange.isPositive ? '+' : ''}
                            {getCurrencySymbol(currency)}
                            {formatCurrencyValue(
                              Math.abs(priceChange.change),
                              currency,
                              exchangeRate,
                            )}
                          </span>
                          <span className="font-semibold">
                            ({priceChange.isPositive ? '+' : ''}
                            {priceChange.changePercent.toFixed(2)}%)
                          </span>
                        </div>
                      )}
                      {stockData.previousClose && (
                        <p className="text-sm text-muted-foreground dark:text-neutral-500 mt-1">
                          전일 종가: {formatCurrency(stockData.previousClose)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 주요 지표 카드 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stockData.dayLow && stockData.dayHigh && (
                <Card className="bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm border-border/50">
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground dark:text-neutral-400 mb-1">
                      일일 변동폭
                    </p>
                    <p className="text-sm font-semibold dark:text-white">
                      {getCurrencySymbol(currency)}
                      {formatCurrencyValue(
                        Number(stockData.dayLow),
                        currency,
                        exchangeRate,
                      )}{' '}
                      - {getCurrencySymbol(currency)}
                      {formatCurrencyValue(
                        Number(stockData.dayHigh),
                        currency,
                        exchangeRate,
                      )}
                    </p>
                  </CardContent>
                </Card>
              )}

              {stockData.volume && (
                <Card className="bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm border-border/50">
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground dark:text-neutral-400 mb-1">
                      거래량
                    </p>
                    <p className="text-sm font-semibold dark:text-white">
                      {Number(stockData.volume).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              )}

              {stockData.marketCap && (
                <Card className="bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm border-border/50">
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground dark:text-neutral-400 mb-1">
                      시가총액
                    </p>
                    {currency === 'USD' ? (
                      <p className="text-sm font-semibold dark:text-white">
                        $
                        {(
                          Number(stockData.marketCap) / 1_000_000_000_000
                        ).toFixed(2)}
                        T
                      </p>
                    ) : (
                      <p className="text-sm font-semibold dark:text-white">
                        ₩
                        {(
                          (Number(stockData.marketCap) * exchangeRate) /
                          1_000_000_000_000
                        ).toFixed(2)}
                        T
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              {stockData.fiftyTwoWeekLow && stockData.fiftyTwoWeekHigh && (
                <Card className="bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm border-border/50">
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground dark:text-neutral-400 mb-1">
                      52주 변동폭
                    </p>
                    <p className="text-sm font-semibold dark:text-white">
                      {getCurrencySymbol(currency)}
                      {formatCurrencyValue(
                        Number(stockData.fiftyTwoWeekLow),
                        currency,
                        exchangeRate,
                      )}{' '}
                      - {getCurrencySymbol(currency)}
                      {formatCurrencyValue(
                        Number(stockData.fiftyTwoWeekHigh),
                        currency,
                        exchangeRate,
                      )}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* 회사 소개 */}
            {stockData.longBusinessSummary && (
              <Card className="bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm border-border/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg dark:text-white">
                    회사 소개
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground dark:text-neutral-300 leading-relaxed">
                    {stockData.longBusinessSummary}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
