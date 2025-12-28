/**
 * Toast 상태 관리 스토어
 */
import { create } from 'zustand';
import type { ToastProps } from '@/components/ui/toast';

interface ToastState {
  toasts: ToastProps[];
  addToast: (message: string, variant?: ToastProps['variant'], duration?: number) => void;
  removeToast: (id: string) => void;
}

let toastIdCounter = 0;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (message, variant = 'info', duration = 3000) => {
    const id = `toast-${++toastIdCounter}`;
    const toast: ToastProps = {
      id,
      message,
      variant,
      duration,
      onClose: () => {}, // 실제 제거는 removeToast에서 처리
    };

    set((state) => ({
      toasts: [...state.toasts, toast],
    }));

    // 자동 제거는 Toast 컴포넌트에서 처리
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
}));
