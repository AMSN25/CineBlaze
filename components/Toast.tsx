import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X, Heart, Bookmark, Star } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'watchlist' | 'collection' | 'rating';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
}

interface ToastProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  watchlist: Heart,
  collection: Bookmark,
  rating: Star
};

const colors = {
  success: 'from-green-600 to-green-500',
  error: 'from-red-600 to-red-500',
  info: 'from-blue-600 to-blue-500',
  watchlist: 'from-pink-600 to-pink-500',
  collection: 'from-purple-600 to-purple-500',
  rating: 'from-yellow-600 to-yellow-500'
};

export const ToastItem: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const Icon = icons[toast.type];
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onDismiss(toast.id), 300);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => onDismiss(toast.id), 300);
  };

  return (
    <div className={`
      relative overflow-hidden rounded-2xl p-4 flex items-start gap-4
      bg-gradient-to-r ${colors[toast.type]} shadow-xl
      transform transition-all duration-300
      ${isExiting ? 'opacity-0 translate-x-full scale-95' : 'opacity-100 translate-x-0 scale-100'}
    `}>
      <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="text-xs font-black uppercase tracking-wider text-white/90 mb-1">{toast.title}</p>
        )}
        <p className="text-sm font-medium text-white truncate">{toast.message}</p>
      </div>
      <button 
        onClick={handleDismiss}
        className="p-1 hover:bg-white/20 rounded-lg transition-colors"
      >
        <X className="w-4 h-4 text-white" />
      </button>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div className="h-full bg-white/50 animate-shrink" />
      </div>
    </div>
  );
};

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (type: ToastType, message: string, title?: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, type, message, title }]);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return { toasts, addToast, dismissToast };
};

const ToastContainer: React.FC<{ toasts: Toast[]; onDismiss: (id: string) => void }> = ({ toasts, onDismiss }) => (
  <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 max-w-sm">
    {toasts.map(toast => (
      <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
    ))}
  </div>
);

export default ToastContainer;