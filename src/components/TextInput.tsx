import React, { forwardRef, useMemo } from 'react';

export interface TextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
  onClear?: () => void;
  showClearButton?: boolean;
  ariaDescribedBy?: string;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      size = 'md',
      error = false,
      leftIcon,
      rightIcon,
      fullWidth = true,
      className = '',
      onClear,
      showClearButton = false,
      ariaDescribedBy,
      disabled,
      value,
      ...props
    },
    ref
  ) => {

    const inputClasses = useMemo(() => {
      const baseClasses = 'block border rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50';
      
      const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-3 py-2 text-sm',
        lg: 'px-4 py-3 text-base',
      };

      const colorClasses = error
        ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
        : 'border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500';

      const widthClasses = fullWidth ? 'w-full' : '';

      const paddingClasses = leftIcon ? 'pl-10' : '';
      const rightPaddingClasses = (rightIcon || showClearButton) ? 'pr-10' : '';

      return `${baseClasses} ${sizeClasses[size]} ${colorClasses} ${widthClasses} ${paddingClasses} ${rightPaddingClasses} ${className}`.trim();
    }, [size, error, fullWidth, leftIcon, rightIcon, showClearButton, className]);

    const iconSizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };

    const iconPositionClasses = {
      sm: 'top-1.5',
      md: 'top-2',
      lg: 'top-3',
    };

    const hasValue = value !== undefined && value !== null && value !== '';

    return (
      <div className="relative">
        {leftIcon && (
          <div className={`absolute left-3 ${iconPositionClasses[size]} pointer-events-none`}>
            <div className={iconSizeClasses[size]} aria-hidden="true">
              {leftIcon}
            </div>
          </div>
        )}
        
        <input
          ref={ref}
          type="text"
          className={inputClasses}
          disabled={disabled}
          value={value}
          aria-invalid={error}
          aria-describedby={ariaDescribedBy}
          {...props}
        />
        
        {(rightIcon || (showClearButton && hasValue)) && (
          <div className={`absolute right-3 ${iconPositionClasses[size]} flex items-center`}>
            {showClearButton && hasValue && (
              <button
                type="button"
                onClick={onClear}
                className={`${iconSizeClasses[size]} text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600`}
                aria-label="Clear input"
                tabIndex={-1}
              >
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-full h-full"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
            {rightIcon && !(showClearButton && hasValue) && (
              <div className={iconSizeClasses[size]} aria-hidden="true">
                {rightIcon}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

TextInput.displayName = 'TextInput';

export default TextInput;
