import { useState, useEffect, useCallback } from 'react';

interface UseLoadingState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useLoadingState = <T,>(
  fetchFn: () => Promise<T>,
  dependencies: any[] = []
): UseLoadingState<T> => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setIsLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
};

// Skeleton loader component props
export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
  animation = 'pulse'
}) => {
  const baseClasses = 'bg-slate-200';
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
    rounded: 'rounded-lg'
  };
  const animationClasses = animation === 'pulse' ? 'animate-pulse' : '';
  
  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height && variant !== 'text') style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses} ${className}`}
      style={style}
    />
  );
};

// Pre-built skeleton components
export const TextSkeleton: React.FC<{ lines?: number; className?: string }> = ({ 
  lines = 1, 
  className = '' 
}) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton 
        key={i} 
        variant="text" 
        className={i === lines - 1 ? 'w-3/4' : 'w-full'} 
      />
    ))}
  </div>
);

export const CardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl p-6 border border-slate-200 space-y-4">
    <div className="flex justify-between items-start">
      <Skeleton variant="text" width="120px" />
      <Skeleton variant="circular" width="40px" height="40px" />
    </div>
    <Skeleton variant="text" width="80px" height="32px" />
    <Skeleton variant="text" width="150px" />
  </div>
);

export const AvatarSkeleton: React.FC = () => (
  <div className="flex items-center gap-3">
    <Skeleton variant="circular" width="40px" height="40px" />
    <div className="flex-1 space-y-2">
      <Skeleton variant="text" width="120px" />
      <Skeleton variant="text" width="80px" />
    </div>
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({ 
  rows = 5, 
  columns = 4 
}) => (
  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
    <div className="p-4 border-b border-slate-100">
      <div className="flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} variant="text" width="80px" />
        ))}
      </div>
    </div>
    <div className="divide-y divide-slate-100">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 flex gap-4">
          {Array.from({ length: columns }).map((_, j) => (
            <Skeleton key={j} variant="text" width="100px" />
          ))}
        </div>
      ))}
    </div>
  </div>
);

export const GridSkeleton: React.FC<{ items?: number }> = ({ items = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} className="bg-white rounded-xl p-6 border border-slate-200 space-y-4">
        <Skeleton variant="circular" width="80px" height="80px" className="mx-auto" />
        <Skeleton variant="text" width="150px" className="mx-auto" />
        <Skeleton variant="text" width="100px" className="mx-auto" />
        <Skeleton variant="rounded" width="100%" height="8px" />
      </div>
    ))}
  </div>
);

// Empty state component
export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction
}) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    {icon && (
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
        {icon}
      </div>
    )}
    <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
    <p className="text-sm text-slate-500 max-w-md mb-6">{description}</p>
    {actionLabel && onAction && (
      <button
        onClick={onAction}
        className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
      >
        {actionLabel}
      </button>
    )}
  </div>
);

// Error state component
export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Произошла ошибка',
  message = 'Не удалось загрузить данные. Пожалуйста, попробуйте снова.',
  onRetry
}) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
      <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
    <p className="text-sm text-slate-500 max-w-md mb-6">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Повторить
      </button>
    )}
  </div>
);
