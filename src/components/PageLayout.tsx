import React from 'react';
import PageHeader from './PageHeader';
import ErrorMessage from './ErrorMessage';
import LoadingSpinner from './LoadingSpinner';
import type { PageHeaderProps } from '../types';

interface PageLayoutProps extends PageHeaderProps {
  children: React.ReactNode;
  error?: string | null;
  isLoading?: boolean;
  onRetry?: () => void;
  className?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  button,
  buttons,
  children,
  error,
  isLoading,
  onRetry,
  className = '',
}) => {
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <PageHeader 
        title={title}
        button={button}
        buttons={buttons}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <ErrorMessage 
            message={error} 
            onRetry={onRetry}
            className="mb-4"
          />
        )}
        
        {isLoading && (
          <LoadingSpinner 
            message="Loading..." 
            className="mb-4"
          />
        )}
        
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
