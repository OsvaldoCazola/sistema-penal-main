import { type ReactNode } from 'react';
import Link from 'next/link';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: ReactNode;
  icon?: React.ElementType;
  badge?: { label: string; color?: 'blue' | 'green' | 'amber' | 'red' | 'gray' };
}

export function PageHeader({ title, subtitle, breadcrumbs, actions, icon: Icon, badge }: PageHeaderProps) {
  const badgeColors = {
    blue:  'bg-blue-50 text-blue-700 border border-blue-100',
    green: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
    amber: 'bg-amber-50 text-amber-700 border border-amber-100',
    red:   'bg-red-50 text-red-700 border border-red-100',
    gray:  'bg-gray-100 text-gray-600 border border-gray-200',
  };

  return (
    <div className="mb-6">
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1 text-xs mb-3">
          <Link href="/dashboard" className="text-gray-400 hover:text-gray-600 transition-colors">
            <HomeIcon className="h-3.5 w-3.5" />
          </Link>
          {breadcrumbs.map((crumb, index) => (
            <span key={index} className="flex items-center gap-1">
              <ChevronRightIcon className="h-3 w-3 text-gray-300" />
              {crumb.href ? (
                <Link href={crumb.href} className="text-gray-400 hover:text-gray-700 transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-gray-600 font-medium">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}

      {/* Título e acções */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          {Icon && (
            <div className="w-10 h-10 bg-[#1a2744] rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon className="h-5 w-5 text-white" />
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-gray-900 leading-tight truncate">{title}</h1>
              {badge && (
                <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${badgeColors[badge.color ?? 'gray']}`}>
                  {badge.label}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-0.5 truncate">{subtitle}</p>
            )}
          </div>
        </div>

        {actions && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
