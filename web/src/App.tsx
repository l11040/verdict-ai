/**
 * 루트 앱 컴포넌트
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { routes } from './routers';
import { QueryProvider } from './lib/query-client';

function AppContent() {
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
      </BrowserRouter>
    </QueryProvider>
  );
}

export default App;
