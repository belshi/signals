import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '',
  message = 'Loading...'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex items-center space-x-2">
        <div
          className={`animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600 ${sizeClasses[size]}`}
          role="status"
          aria-label="Loading"
        />
        {message && (
          <span className="text-sm text-gray-600">{message}</span>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;
