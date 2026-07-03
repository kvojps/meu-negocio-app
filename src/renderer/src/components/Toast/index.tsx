import type { ToastItem } from '@contexts/ToastContext';
import './styles.css';

interface ToastViewportProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export function ToastViewport({ toasts, onDismiss }: ToastViewportProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-viewport" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast--${toast.variant}`}
          onClick={() => onDismiss(toast.id)}
          role="presentation"
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
