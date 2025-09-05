import { useCallback, useRef } from 'react';
import type { ErrorInfo } from 'react';

export interface ErrorHandlerOptions {
  onError?: (error: Error, errorInfo?: ErrorInfo) => void;
  logToConsole?: boolean;
  logToService?: boolean;
}

export const useErrorHandler = (options: ErrorHandlerOptions = {}) => {
  const {
    onError,
    logToConsole = true,
    logToService = false,
  } = options;

  const errorCountRef = useRef(0);
  const lastErrorRef = useRef<Error | null>(null);

  const handleError = useCallback(
    (error: Error | string, errorInfo?: ErrorInfo) => {
      const errorObj = typeof error === 'string' ? new Error(error) : error;
      
      // Prevent error spam
      if (lastErrorRef.current?.message === errorObj.message) {
        errorCountRef.current++;
        if (errorCountRef.current > 3) {
          return; // Stop logging after 3 identical errors
        }
      } else {
        errorCountRef.current = 1;
        lastErrorRef.current = errorObj;
      }

      // Log to console
      if (logToConsole) {
        console.error('Error handled by useErrorHandler:', errorObj, errorInfo);
      }

      // Log to external service
      if (logToService) {
        // Here you would typically send to Sentry, LogRocket, etc.
        console.error('Production error logging:', errorObj, errorInfo);
      }

      // Call custom error handler
      onError?.(errorObj, errorInfo);
    },
    [onError, logToConsole, logToService]
  );

  const handleAsyncError = useCallback(
    async <T>(
      asyncFn: () => Promise<T>,
      fallback?: T
    ): Promise<T | undefined> => {
      try {
        return await asyncFn();
      } catch (error) {
        handleError(error as Error);
        return fallback;
      }
    },
    [handleError]
  );

  const withErrorHandling = useCallback(
    <T extends (...args: any[]) => any>(fn: T): T => {
      return ((...args: Parameters<T>) => {
        try {
          const result = fn(...args);
          
          // Handle promise results
          if (result instanceof Promise) {
            return result.catch((error) => {
              handleError(error);
              throw error;
            });
          }
          
          return result;
        } catch (error) {
          handleError(error as Error);
          throw error;
        }
      }) as T;
    },
    [handleError]
  );

  const resetErrorCount = useCallback(() => {
    errorCountRef.current = 0;
    lastErrorRef.current = null;
  }, []);

  return {
    handleError,
    handleAsyncError,
    withErrorHandling,
    resetErrorCount,
  };
};
