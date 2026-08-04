import React from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import { cn } from '../../utils';

export interface AlertProps {
  variant?: 'success' | 'error' | 'warning' | 'info';
  title: string;
  children?: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  onClose,
  className,
}) => {
  const variantStyles = {
    success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200',
    error: 'bg-red-500/10 border-red-500/30 text-red-200',
    warning: 'bg-amber-500/10 border-amber-500/30 text-amber-200',
    info: 'bg-cyanGlow/10 border-cyanGlow/30 text-cyan-200',
  };

  const iconMap = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <XCircle className="w-5 h-5 text-red-400 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-cyanGlow shrink-0" />,
  };

  return (
    <div
      className={cn(
        'flex items-start justify-between p-4 rounded-2xl border backdrop-blur-md transition-all duration-200',
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start gap-3 min-w-0">
        {iconMap[variant]}
        <div className="min-w-0">
          <h5 className="text-sm font-bold text-white tracking-wide">{title}</h5>
          {children && (
            <div className="text-xs opacity-90 mt-1 leading-relaxed">{children}</div>
          )}
        </div>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors ml-3 shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
