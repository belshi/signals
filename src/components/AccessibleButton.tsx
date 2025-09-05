import React, { forwardRef } from 'react';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  onActivate?: () => void;
}

const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      ariaLabel,
      ariaDescribedBy,
      onActivate,
      onClick,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
      const buttonRef = useKeyboardNavigation({
    onEnter: onActivate || (() => onClick?.({} as React.MouseEvent<HTMLButtonElement>)),
    onSpace: onActivate || (() => onClick?.({} as React.MouseEvent<HTMLButtonElement>)),
    disabled: disabled || loading,
  });

    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variantClasses = {
      primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
      secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
      outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500',
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    const widthClasses = fullWidth ? 'w-full' : '';

    const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClasses} ${className}`;

    const renderIcon = () => {
      if (!icon) return null;
      
      const iconClasses = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';
      const iconSpacing = children ? (iconPosition === 'left' ? 'mr-2' : 'ml-2') : '';
      
      return (
        <span className={`${iconClasses} ${iconSpacing}`} aria-hidden="true">
          {icon}
        </span>
      );
    };

    return (
      <button
        ref={ref || (buttonRef as React.Ref<HTMLButtonElement>)}
        type="button"
        className={buttonClasses}
        disabled={disabled || loading}
        onClick={onClick}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        
        {!loading && iconPosition === 'left' && renderIcon()}
        
        {children && (
          <span className={loading ? 'opacity-0' : ''}>
            {children}
          </span>
        )}
        
        {!loading && iconPosition === 'right' && renderIcon()}
      </button>
    );
  }
);

AccessibleButton.displayName = 'AccessibleButton';

export default AccessibleButton;
