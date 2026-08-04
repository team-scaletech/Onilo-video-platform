import React from 'react';
import { cn } from '../../utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'glow' | 'outline' | 'ghost' | 'danger' | 'glass' | 'gradient';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const sizeStyles = {
    xs: 'px-2.5 py-1 text-[11px] gap-1 rounded-lg',
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5 rounded-2xl',
    xl: 'px-8 py-4 text-lg gap-3 rounded-2xl font-bold',
  };

  const variantStyles = {
    primary:
      'bg-brand-600 hover:bg-brand-500 text-white shadow-md hover:shadow-brand-500/30 focus:ring-brand-500',
    glow:
      'bg-gradient-to-r from-brand-600 via-purple-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white shadow-glow hover:shadow-cyanGlow focus:ring-cyanGlow font-semibold',
    gradient:
      'bg-gradient-to-r from-cyanGlow via-brand-500 to-purple-600 hover:brightness-110 text-white font-bold shadow-lg',
    secondary:
      'bg-slate-800/80 hover:bg-slate-700 text-slate-100 border border-slate-700/60 focus:ring-slate-500',
    glass:
      'bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md focus:ring-white/30',
    outline:
      'border border-slate-700 hover:border-brand-500 hover:text-brand-400 text-slate-300 bg-transparent focus:ring-brand-500',
    ghost:
      'text-slate-300 hover:text-white hover:bg-white/5 focus:ring-slate-500',
    danger:
      'bg-red-600 hover:bg-red-500 text-white shadow-md hover:shadow-red-500/30 focus:ring-red-500',
  };

  return (
    <button
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
};
