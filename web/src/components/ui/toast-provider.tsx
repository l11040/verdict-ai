/**
 * Toast Provider 컴포넌트
 */
import { Toaster } from './toaster';
import { useToastStore } from '@/lib/toast-store';

export const ToastProvider = () => {
  const { toasts, removeToast } = useToastStore();

  return <Toaster toasts={toasts} onRemove={removeToast} />;
};
