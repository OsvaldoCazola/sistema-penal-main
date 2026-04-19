'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  isFirst: boolean;
  isLast: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  totalElements,
  onPageChange,
  isFirst,
  isLast,
}: PaginationProps) {
  const getVisiblePages = () => {
    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta + 1)) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
      <div className="text-sm text-gray-500">
        {totalElements} registro{totalElements !== 1 ? 's' : ''} encontrado{totalElements !== 1 ? 's' : ''}
      </div>
      
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={isFirst}
          className={cn(
            'p-2 rounded-lg transition-colors',
            isFirst
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-600 hover:bg-gray-100'
          )}
          aria-label="Página anterior"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>

        {getVisiblePages().map((page, idx) => (
          <button
            key={idx}
            onClick={() => typeof page === 'number' && onPageChange(page - 1)}
            disabled={typeof page !== 'number'}
            className={cn(
              'min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-colors',
              typeof page !== 'number'
                ? 'cursor-default text-gray-400'
                : page === currentPage + 1
                ? 'bg-primary-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={isLast}
          className={cn(
            'p-2 rounded-lg transition-colors',
            isLast
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-600 hover:bg-gray-100'
          )}
          aria-label="Próxima página"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
