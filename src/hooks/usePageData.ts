import { useEffect, useCallback } from 'react';
import { useLayout } from '../contexts/LayoutContext';

interface UsePageDataOptions {
  onLoad?: () => Promise<void>;
  onError?: (error: Error) => void;
  autoLoad?: boolean;
}

export const usePageData = (options: UsePageDataOptions = {}) => {
  const { onLoad, onError, autoLoad = true } = options;
  const { setLoading, setError, clearError } = useLayout();

  const loadData = useCallback(async () => {
    if (!onLoad) return;

    try {
      setLoading(true);
      clearError();
      await onLoad();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setError(errorMessage);
      onError?.(error as Error);
    } finally {
      setLoading(false);
    }
  }, [onLoad, onError, setLoading, setError, clearError]);

  const retry = useCallback(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (autoLoad) {
      loadData();
    }
  }, [autoLoad, loadData]);

  return {
    loadData,
    retry,
  };
};
