/**
 * 루트 앱 컴포넌트
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { routes } from './routers';
import { QueryProvider } from './lib/query-client';
import { ToastProvider } from './components/ui/toast-provider';
import { useMeQuery } from './features/auth/hooks/use-me-query';

function AppContent() {
  // 앱 초기화 시 사용자 정보 가져오기
  useMeQuery();

  return (
    <Routes>
      {routes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
}

function App() {
  return (
    <QueryProvider>
      <BrowserRouter>
        <AppContent />
        <ToastProvider />
      </BrowserRouter>
    </QueryProvider>
  );
}

export default App;
