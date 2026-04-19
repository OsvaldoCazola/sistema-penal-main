'use client';

import { useState, useCallback, useMemo } from 'react';
import type { Page } from '@/types';

interface UsePaginationOptions {
  initialPage?: number;
  initialSize?: number;
}

export function usePagination<T>(options: UsePaginationOptions = {}) {
  const { initialPage = 0, initialSize = 20 } = options;
  
  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(initialSize);
  const [data, setData] = useState<Page<T> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const goToPage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const nextPage = useCallback(() => {
    if (data && !data.last) {
      setPage((p) => p + 1);
    }
  }, [data]);

  const prevPage = useCallback(() => {
    if (data && !data.first) {
      setPage((p) => p - 1);
    }
  }, [data]);

  const changeSize = useCallback((newSize: number) => {
    setSize(newSize);
    setPage(0);
  }, []);

  const reset = useCallback(() => {
    setPage(initialPage);
    setSize(initialSize);
    setData(null);
    setError(null);
  }, [initialPage, initialSize]);

  const pagination = useMemo(() => ({
    page,
    size,
    totalPages: data?.totalPages || 0,
    totalElements: data?.totalElements || 0,
    isFirst: data?.first ?? true,
    isLast: data?.last ?? true,
    hasData: !!data,
  }), [page, size, data]);

  return {
    data,
    setData,
    isLoading,
    setIsLoading,
    error,
    setError,
    pagination,
    goToPage,
    nextPage,
    prevPage,
    changeSize,
    reset,
  };
}
