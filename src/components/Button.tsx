import React from 'react';

export interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
  ariaDescribedBy?: string;
  ariaExpanded?: boolean;
  ariaControls?: string;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant = 'primary',
  icon,
  className = '',
  disabled = false,
  loading = false,
  type = 'button',
  ariaLabel,
  ariaDescribedBy,
  ariaExpanded,
  ariaControls,
}) => {
  const getVariantStyles = () => {
    const baseStyles = 'inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    switch (variant) {
      case 'secondary':
        return `${baseStyles} text-white bg-gray-600 hover:bg-gray-700 focus:ring-gray-500`;
      case 'danger':
        return `${baseStyles} text-white bg-red-600 hover:bg-red-700 focus:ring-red-500`;
      case 'primary':
      default:
        return `${baseStyles} text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500`;
    }
  };

  return (
    <button
      onClick={onClick}
      className={`${getVariantStyles()} ${className}`}
      type={type}
      disabled={disabled || loading}
      aria-label={ariaLabel || label}
      aria-describedby={ariaDescribedBy}
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
      aria-disabled={disabled || loading}
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
      
      {!loading && icon && (
        <span className="mr-2" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className={loading ? 'opacity-0' : ''}>{label}</span>
    </button>
  );
};

export default Button;
