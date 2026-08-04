import React from 'react';
import { cn } from '../../utils';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className,
  label = 'Loading interactive stream...',
}) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 gap-3">
      <div
        className={cn(
          'relative rounded-full border-2 border-brand-500/20 border-t-brand-500 animate-spin',
          sizeClasses[size],
          className
        )}
      />
      {label && <p className="text-xs text-slate-400 font-medium tracking-wide animate-pulse">{label}</p>}
    </div>
  );
};
