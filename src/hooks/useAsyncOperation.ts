import { useState, useCallback } from 'react';

interface AsyncOperationState {
  isLoading: boolean;
  error: string | null;
}

export const useAsyncOperation = () => {
  const [state, setState] = useState<AsyncOperationState>({
    isLoading: false,
    error: null,
  });

  const execute = useCallback(async <T>(
    operation: () => Promise<T>,
    onSuccess?: (result: T) => void,
    onError?: (error: Error) => void
  ): Promise<T | null> => {
    setState({ isLoading: true, error: null });
    
    try {
      const result = await operation();
      setState({ isLoading: false, error: null });
      onSuccess?.(result);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState({ isLoading: false, error: errorMessage });
      onError?.(error instanceof Error ? error : new Error(errorMessage));
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ isLoading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
};
