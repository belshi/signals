import { useState, useCallback, useRef } from 'react';

export interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  onRetry?: (attempt: number, error: Error) => void;
  onMaxRetriesReached?: (error: Error) => void;
}

export interface RetryState {
  isRetrying: boolean;
  retryCount: number;
  lastError: Error | null;
  canRetry: boolean;
}

export const useRetry = (options: RetryOptions = {}) => {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffMultiplier = 2,
    onRetry,
    onMaxRetriesReached,
  } = options;

  const [state, setState] = useState<RetryState>({
    isRetrying: false,
    retryCount: 0,
    lastError: null,
    canRetry: true,
  });

  const timeoutRef = useRef<number | null>(null);

  const calculateDelay = useCallback(
    (attempt: number): number => {
      const delay = initialDelay * Math.pow(backoffMultiplier, attempt - 1);
      return Math.min(delay, maxDelay);
    },
    [initialDelay, backoffMultiplier, maxDelay]
  );

  const retry = useCallback(
    async <T>(
      asyncFn: () => Promise<T>,
      attempt: number = 1
    ): Promise<T> => {
      if (attempt > maxRetries) {
        const error = new Error(`Max retries (${maxRetries}) exceeded`);
        setState(prev => ({
          ...prev,
          isRetrying: false,
          canRetry: false,
          lastError: error,
        }));
        onMaxRetriesReached?.(error);
        throw error;
      }

      setState(prev => ({
        ...prev,
        isRetrying: true,
        retryCount: attempt - 1,
      }));

      try {
        const result = await asyncFn();
        
        setState(prev => ({
          ...prev,
          isRetrying: false,
          retryCount: 0,
          lastError: null,
          canRetry: true,
        }));

        return result;
      } catch (error) {
        const errorObj = error as Error;
        
        setState(prev => ({
          ...prev,
          lastError: errorObj,
        }));

        onRetry?.(attempt, errorObj);

        if (attempt < maxRetries) {
          const delay = calculateDelay(attempt);
          
          return new Promise((resolve, reject) => {
            timeoutRef.current = window.setTimeout(async () => {
              try {
                const result = await retry(asyncFn, attempt + 1);
                resolve(result);
              } catch (retryError) {
                reject(retryError);
              }
            }, delay);
          });
        } else {
          setState(prev => ({
            ...prev,
            isRetrying: false,
            canRetry: false,
          }));
          throw errorObj;
        }
      }
    },
    [maxRetries, calculateDelay, onRetry, onMaxRetriesReached]
  );

  const reset = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setState({
      isRetrying: false,
      retryCount: 0,
      lastError: null,
      canRetry: true,
    });
  }, []);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setState(prev => ({
      ...prev,
      isRetrying: false,
    }));
  }, []);

  return {
    ...state,
    retry,
    reset,
    cancel,
  };
};
