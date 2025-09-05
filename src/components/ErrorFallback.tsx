import React from 'react';

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
  retryCount?: number;
  maxRetries?: number;
  className?: string;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
  retryCount = 0,
  maxRetries = 3,
  className = '',
}) => {
  const canRetry = retryCount < maxRetries;
  const isNetworkError = error.message.includes('network') || error.message.includes('fetch');
  const isTimeoutError = error.message.includes('timeout');
  const isServerError = error.message.includes('500') || error.message.includes('server');

  const getErrorMessage = () => {
    if (isNetworkError) {
      return 'Unable to connect to the server. Please check your internet connection.';
    }
    if (isTimeoutError) {
      return 'The request timed out. Please try again.';
    }
    if (isServerError) {
      return 'Server error occurred. Please try again later.';
    }
    return error.message || 'An unexpected error occurred.';
  };

  const getErrorTitle = () => {
    if (isNetworkError) return 'Connection Error';
    if (isTimeoutError) return 'Timeout Error';
    if (isServerError) return 'Server Error';
    return 'Error';
  };

  return (
    <div className={`flex items-center justify-center min-h-64 ${className}`}>
      <div className="max-w-md w-full text-center">
        <div className="mx-auto h-12 w-12 text-red-500 mb-4">
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {getErrorTitle()}
        </h3>
        
        <p className="text-gray-600 mb-6">
          {getErrorMessage()}
        </p>

        <div className="space-y-3">
          {canRetry && (
            <button
              onClick={resetError}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              type="button"
            >
              Try Again
            </button>
          )}
          
          <button
            onClick={() => window.location.reload()}
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            type="button"
          >
            Refresh Page
          </button>
        </div>

        {retryCount > 0 && (
          <div className="mt-4 text-sm text-gray-500">
            Retry attempt {retryCount} of {maxRetries}
          </div>
        )}

        {import.meta.env.DEV && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              Error Details (Development)
            </summary>
            <div className="mt-2 p-4 bg-gray-100 rounded-md text-xs font-mono text-gray-800 overflow-auto">
              <div className="mb-2">
                <strong>Error:</strong> {error.message}
              </div>
              {error.stack && (
                <div>
                  <strong>Stack:</strong>
                  <pre className="whitespace-pre-wrap">{error.stack}</pre>
                </div>
              )}
            </div>
          </details>
        )}
      </div>
    </div>
  );
};

export default ErrorFallback;
