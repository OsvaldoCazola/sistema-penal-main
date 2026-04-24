'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'institucional';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, style, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center font-medium rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';

    /* Variantes que não dependem de tema — fundos fixos */
    const staticVariants: Record<string, string> = {
      primary:       'bg-gradient-to-r from-primary-700 to-primary-600 text-white hover:from-primary-800 hover:to-primary-700 focus:ring-primary-700 shadow-md',
      danger:        'bg-red-700 text-white hover:bg-red-800 focus:ring-red-500 shadow-sm',
      institucional: 'bg-gradient-to-r from-primary-900 via-primary-800 to-primary-900 text-white hover:from-primary-800 hover:via-primary-700 hover:to-primary-600 focus:ring-primary-700 shadow-lg',
    };

    /* Variantes que usam variáveis CSS (respondem ao tema) */
    const themedStyles: Record<string, React.CSSProperties> = {
      secondary: {
        backgroundColor: 'var(--bg-surface-2)',
        borderColor:     'var(--border)',
        color:           'var(--text-secondary)',
        border:          '1px solid var(--border)',
      },
      ghost: {
        backgroundColor: 'transparent',
        color:           'var(--text-secondary)',
      },
      outline: {
        backgroundColor: 'transparent',
        borderColor:     'var(--text-primary)',
        color:           'var(--text-primary)',
        border:          '2px solid var(--border-strong)',
      },
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-4 py-2 text-sm gap-2',
      lg: 'px-6 py-3 text-base gap-2',
    };

    const isThemed = variant in themedStyles;

    return (
      <button
        ref={ref}
        className={cn(
          base,
          sizes[size],
          isThemed ? 'hover:opacity-80' : staticVariants[variant],
          className
        )}
        style={isThemed ? { ...themedStyles[variant], ...style } : style}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export { Button };
