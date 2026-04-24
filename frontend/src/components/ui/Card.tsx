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

export function Card({
  children, className, padding = 'md', onClick,
  title, subtitle, action, variant = 'default',
}: CardProps) {
  const paddings = { none: '', sm: 'p-3', md: 'p-4 sm:p-5', lg: 'p-5 sm:p-6' };

  /* Usa variáveis CSS em vez de classes Tailwind hardcoded —
     assim responde automaticamente ao tema claro/escuro */
  const baseStyle: React.CSSProperties = {
    backgroundColor: 'var(--bg-surface)',
    borderColor:     'var(--border)',
    color:           'var(--text-primary)',
  };

  return (
    <div
      className={cn(
        paddings[padding],
        'rounded-xl border shadow-formal transition-colors duration-200',
        variant === 'angola' && 'relative overflow-hidden',
        variant === 'borderless' && 'border-0',
        onClick && 'cursor-pointer hover:shadow-formal-md',
        className
      )}
      style={baseStyle}
      onClick={onClick}
    >
      {(title || subtitle || action) && (
        <div
          className="flex items-start justify-between mb-4 pb-3 border-b"
          style={{ borderColor: 'var(--border)' }}
        >
          <div>
            {title    && <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</h3>}
            {subtitle && <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}

      {/* Barra tricolor Angola */}
      {variant === 'angola' && (
        <div className="absolute bottom-0 left-0 right-0 h-1 flex">
          <div className="flex-1 bg-[#CC092F]" />
          <div className="flex-1 bg-[#111]" />
          <div className="flex-1 bg-[#FFCC00]" />
        </div>
      )}
    </div>
  );
}

/* ── CardHeader ─────────────────────────────────────────────────────────── */
interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export function CardHeader({ title, subtitle, action, className }: CardHeaderProps) {
  return (
    <div
      className={cn('flex items-start justify-between mb-4 pb-3 border-b', className)}
      style={{ borderColor: 'var(--border)' }}
    >
      <div>
        <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</h3>
        {subtitle && <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
