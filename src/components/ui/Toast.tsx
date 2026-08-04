import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import { ToastItem } from '../../context/ToastContext';
import { cn } from '../../utils';

export interface ToastContainerProps {
  toasts: ToastItem[];
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  const iconMap = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <XCircle className="w-5 h-5 text-red-400 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-cyanGlow shrink-0" />,
  };

  const borderStyles = {
    success: 'border-emerald-500/40 bg-slate-950/90 text-slate-100',
    error: 'border-red-500/40 bg-slate-950/90 text-slate-100',
    warning: 'border-amber-500/40 bg-slate-950/90 text-slate-100',
    info: 'border-cyanGlow/40 bg-slate-950/90 text-slate-100',
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className={cn(
              'pointer-events-auto flex items-start justify-between p-4 rounded-2xl border backdrop-blur-xl shadow-2xl overflow-hidden glass-panel',
              borderStyles[toast.type]
            )}
          >
            <div className="flex items-start gap-3 min-w-0">
              {iconMap[toast.type]}
              <div className="min-w-0">
                <h5 className="text-xs font-bold text-white tracking-wide">{toast.title}</h5>
                {toast.message && (
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed line-clamp-2">
                    {toast.message}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => onClose(toast.id)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors ml-2 shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
