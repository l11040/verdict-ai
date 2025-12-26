/**
 * 보호된 라우트 컴포넌트
 * 인증이 필요한 페이지를 보호합니다.
 */
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

