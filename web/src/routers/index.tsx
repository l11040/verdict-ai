/**
 * 라우터 설정
 * Feature-based Architecture
 * Lazy loading을 사용하여 코드 스플리팅 적용
 */
import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '@/shared/components/protected-route';

// Lazy loading으로 페이지 컴포넌트 로드
// Feature-based: features/{feature}/pages/{page}
const LoginPage = lazy(() =>
  import('@/features/auth').then((module) => ({ default: module.LoginPage })),
);
const RegisterPage = lazy(() =>
  import('@/features/auth').then((module) => ({
    default: module.RegisterPage,
  })),
);
const StockSearchPage = lazy(() =>
  import('@/features/stock').then((module) => ({
    default: module.StockSearchPage,
  })),
);
const StockDetailPage = lazy(() =>
  import('@/features/stock').then((module) => ({
    default: module.StockDetailPage,
  })),
);

export const routes: RouteObject[] = [
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <StockSearchPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/stocks/:symbol',
    element: (
      <ProtectedRoute>
        <StockDetailPage />
      </ProtectedRoute>
    ),
  },
];
