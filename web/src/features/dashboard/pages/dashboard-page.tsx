/**
 * 대시보드 페이지
 * Feature-based Architecture: features/dashboard/pages/dashboard-page.tsx
 */
import { useAuthStore } from '@/features/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, User, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const DashboardPage = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <Card className="mb-8 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm border-border/50 shadow-lg animate-in fade-in duration-300">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground dark:text-white tracking-tight">
                    Verdict AI
                  </h1>
                  <p className="text-sm text-muted-foreground dark:text-neutral-400 mt-0.5">
                    {user?.email}
                  </p>
                </div>
              </div>
              <Button
                variant="secondary"
                onClick={handleLogout}
                className="gap-2 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <LogOut className="w-4 h-4" />
                로그아웃
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 컨셉 소개 */}
        <Card className="mb-8 bg-gradient-to-br from-primary-500/10 to-primary-600/5 dark:from-primary-900/20 dark:to-primary-800/10 backdrop-blur-sm border-primary/20 shadow-lg animate-in fade-in duration-300">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/25 flex-shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-foreground dark:text-white mb-2">
                  개인화 투자 심의 위원회
                </h2>
                <p className="text-sm text-muted-foreground dark:text-neutral-300 leading-relaxed">
                  사용자의 투자 성향을 학습한 <span className="font-semibold text-primary dark:text-primary-400">20인의 AI 에이전트</span>가 
                  치열한 토론을 거쳐 최적의 <span className="font-semibold text-primary dark:text-primary-400">매수·매도 평결</span>을 내립니다.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 대시보드 컨텐츠 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] animate-in fade-in duration-300">
            <CardHeader>
              <CardTitle className="text-lg dark:text-white flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                AI 에이전트 토론
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground dark:text-neutral-400">
                20인의 AI 에이전트가 투자 의견을 제시하고 토론합니다.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] animate-in fade-in duration-300">
            <CardHeader>
              <CardTitle className="text-lg dark:text-white flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                투자 평결
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground dark:text-neutral-400">
                치열한 토론을 거쳐 최적의 매수·매도 평결을 확인하세요.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] animate-in fade-in duration-300">
            <CardHeader>
              <CardTitle className="text-lg dark:text-white flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                개인화 학습
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground dark:text-neutral-400">
                당신의 투자 성향을 학습하여 맞춤형 의견을 제공합니다.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

