import { type ReactNode, type MouseEventHandler } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps {
  children?: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: MouseEventHandler<HTMLDivElement>;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  variant?: 'default' | 'angola' | 'borderless';
}

export function Card({ children, className, padding = 'md', onClick, title, subtitle, action, variant = 'default' }: CardProps) {
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4 sm:p-5',
    lg: 'p-5 sm:p-6',
  };

  const variants = {
    default: 'bg-white rounded border border-gray-200 shadow-formal',
    angola: 'bg-white rounded border border-gray-200 shadow-formal relative overflow-hidden',
    borderless: 'bg-white rounded shadow-formal',
  };

  return (
    <div 
      className={cn(paddings[padding], variants[variant], onClick && 'cursor-pointer hover:shadow-formal-md transition-shadow', className)}
      onClick={onClick}
    >
      {(title || subtitle || action) && (
        <div className="flex items-start justify-between mb-4 border-b border-gray-100 pb-3">
          <div>
            {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
      
      {/* Barra tricolor para cards Angola */}
      {variant === 'angola' && (
        <div className="absolute bottom-0 left-0 right-0 h-1 flex">
          <div className="flex-1 bg-primary-800" />
          <div className="flex-1 bg-primary-700" />
          <div className="flex-1 bg-primary-600" />
        </div>
      )}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export function CardHeader({ title, subtitle, action, className }: CardHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between mb-4 border-b border-gray-100 pb-3', className)}>
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
