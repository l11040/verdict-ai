/**
 * Toaster 컴포넌트 - Toast 컨테이너
 */
import { createPortal } from 'react-dom';
import { Toast, type ToastProps } from './toast';

interface ToasterProps {
  toasts: ToastProps[];
  onRemove: (id: string) => void;
}

export const Toaster = ({ toasts, onRemove }: ToasterProps) => {
  if (typeof window === 'undefined') return null;

  return createPortal(
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast {...toast} onClose={onRemove} />
        </div>
      ))}
    </div>,
    document.body,
  );
};
