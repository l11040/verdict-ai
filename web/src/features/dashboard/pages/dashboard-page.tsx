/**
 * 대시보드 페이지
 * Feature-based Architecture: features/dashboard/pages/dashboard-page.tsx
 */
import { useAuthStore } from '@/features/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardPage = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <Card className="mb-6 dark:bg-neutral-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground dark:text-neutral-100">
                    Verdict AI
                  </h1>
                  <p className="text-sm text-muted-foreground dark:text-neutral-400">
                    {user?.email}
                  </p>
                </div>
              </div>
              <Button
                variant="secondary"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                로그아웃
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 대시보드 컨텐츠 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="dark:bg-neutral-800">
            <CardHeader>
              <CardTitle className="text-lg dark:text-neutral-100">
                환영합니다!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground dark:text-neutral-400">
                로그인에 성공했습니다.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

