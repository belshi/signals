import React, { type ReactNode } from 'react';
import { useLayout } from '../contexts/LayoutContext';
import { PageHeader, ErrorMessage, LoadingSpinner } from './index';

interface PageProps {
  children: ReactNode;
  className?: string;
}

interface PageHeaderProps {
  title: string;
  button?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
    icon?: ReactNode;
  };
  buttons?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
    icon?: ReactNode;
  }>;
}

interface PageContentProps {
  children: ReactNode;
  className?: string;
}

interface PageErrorProps {
  onRetry?: () => void;
  className?: string;
}

interface PageLoadingProps {
  message?: string;
  className?: string;
}

// Main Page component
const Page: React.FC<PageProps> & {
  Header: React.FC<PageHeaderProps>;
  Content: React.FC<PageContentProps>;
  Error: React.FC<PageErrorProps>;
  Loading: React.FC<PageLoadingProps>;
} = ({ children, className = '' }) => {
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {children}
    </div>
  );
};

// Page Header component
const PageHeaderComponent: React.FC<PageHeaderProps> = ({ title, button, buttons }) => {
  return (
    <PageHeader 
      title={title}
      button={button}
      buttons={buttons}
    />
  );
};

// Page Content component
const PageContent: React.FC<PageContentProps> = ({ children, className = '' }) => {
  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className}`}>
      {children}
    </div>
  );
};

// Page Error component
const PageError: React.FC<PageErrorProps> = ({ onRetry, className = '' }) => {
  const { error, clearError } = useLayout();

  if (!error) return null;

  return (
    <ErrorMessage 
      message={error} 
      onRetry={onRetry || clearError}
      className={`mb-4 ${className}`}
    />
  );
};

// Page Loading component
const PageLoading: React.FC<PageLoadingProps> = ({ message = 'Loading...', className = '' }) => {
  const { isLoading } = useLayout();

  if (!isLoading) return null;

  return (
    <LoadingSpinner 
      message={message} 
      className={`mb-4 ${className}`}
    />
  );
};

// Attach sub-components to main component
Page.Header = PageHeaderComponent;
Page.Content = PageContent;
Page.Error = PageError;
Page.Loading = PageLoading;

export default Page;
