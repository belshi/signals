import { type ReactNode } from 'react';

interface DataProviderProps<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
  children: (props: {
    data: T | null;
    loading: boolean;
    error: string | null;
    onRetry?: () => void;
  }) => ReactNode;
}

const DataProvider = <T,>({
  data,
  loading,
  error,
  onRetry,
  children,
}: DataProviderProps<T>) => {
  return <>{children({ data, loading, error, onRetry })}</>;
};

export default DataProvider;
