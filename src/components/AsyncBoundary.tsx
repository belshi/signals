import React, { type ReactNode } from 'react';
import { ErrorMessage, LoadingSpinner } from './index';

interface AsyncBoundaryProps {
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
  loadingMessage?: string;
  children: ReactNode;
}

const AsyncBoundary: React.FC<AsyncBoundaryProps> = ({
  loading,
  error,
  onRetry,
  loadingMessage = 'Loading...',
  children,
}) => {
  if (error) {
    return (
      <ErrorMessage 
        message={error} 
        onRetry={onRetry}
        className="mb-4"
      />
    );
  }

  if (loading) {
    return (
      <LoadingSpinner 
        message={loadingMessage} 
        className="mb-4"
      />
    );
  }

  return <>{children}</>;
};

export default AsyncBoundary;
