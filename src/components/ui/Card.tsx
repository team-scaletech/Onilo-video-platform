import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '../../utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  hoverGlow?: boolean;
  variant?: 'default' | 'glass' | 'gradient' | 'elevated';
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  glass = true,
  hoverGlow = true,
  variant = 'default',
  ...props
}) => {
  const variantClasses = {
    default: glass
      ? 'bg-slate-900/60 backdrop-blur-xl border-white/10 dark:bg-slate-900/70 dark:border-white/10'
      : 'bg-slate-900 border-slate-800',
    glass: 'bg-white/5 backdrop-blur-2xl border-white/15 shadow-glass',
    gradient: 'gradient-border bg-slate-950/80 backdrop-blur-xl',
    elevated: 'bg-slate-900 border-white/10 shadow-elevated',
  };

  return (
    <div
      className={cn(
        'rounded-2xl p-5 border transition-all duration-300',
        variantClasses[variant],
        hoverGlow && 'hover:border-brand-500/40 hover:shadow-lg hover:shadow-brand-500/10',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon?: React.ReactNode;
  description?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon,
  description,
  className,
}) => {
  return (
    <Card className={cn('p-5 flex flex-col justify-between', className)}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        {icon && (
          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-white/10 text-brand-400">
            {icon}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {value}
          </span>
          {change && (
            <span
              className={cn(
                'inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-full border',
                isPositive
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-red-500/10 text-red-400 border-red-500/30'
              )}
            >
              {isPositive ? (
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
              ) : (
                <ArrowDownRight className="w-3 h-3 mr-0.5" />
              )}
              {change}
            </span>
          )}
        </div>
        {description && <p className="text-[11px] text-slate-400">{description}</p>}
      </div>
    </Card>
  );
};
