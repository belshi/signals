import React, { forwardRef, useMemo } from 'react';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';

export type ButtonVariant = 'primary' | 'secondary' | 'brandGray';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type IconPosition = 'left' | 'right';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: IconPosition;
  fullWidth?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  onActivate?: () => void;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
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
    const isDisabled = disabled || loading;

    const buttonRef = useKeyboardNavigation({
      onEnter: onActivate || (() => onClick?.({} as React.MouseEvent<HTMLButtonElement>)),
      onSpace: onActivate || (() => onClick?.({} as React.MouseEvent<HTMLButtonElement>)),
      disabled: isDisabled,
    });

    const buttonClasses = useMemo(() => {
      const baseClasses = 'cursor-pointer inline-flex items-center justify-center font-bold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
      
      const variantClasses: Record<ButtonVariant, string> = {
        primary: 'bg-brand-600 text-white border border-brand-600 hover:bg-brand-700 hover:border-brand-700 focus:ring-brand-500',
        secondary: 'bg-nocturn text-white border border-nocturn hover:bg-nocturn/90 focus:ring-nocturn',
        brandGray: 'bg-brand-gray text-gray-700 border border-brand-gray hover:bg-brand-gray-hover hover:border-brand-gray-hover focus:ring-brand-gray',
      };

      const sizeClasses: Record<ButtonSize, string> = {
        sm: 'px-3 py-1.5 text-base',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-base',
      };

      const widthClasses = fullWidth ? 'w-full' : '';

      return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClasses} ${className}`.trim();
    }, [variant, size, fullWidth, className]);

    const iconClasses = useMemo(() => {
      const sizeMap: Record<ButtonSize, string> = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
      };
      return sizeMap[size];
    }, [size]);

    const iconSpacing = useMemo(() => {
      if (!children) return '';
      return iconPosition === 'left' ? 'mr-2' : 'ml-2';
    }, [children, iconPosition]);

    return (
      <button
        ref={ref || (buttonRef as React.Ref<HTMLButtonElement>)}
        type="button"
        className={buttonClasses}
        disabled={isDisabled}
        onClick={onClick}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-disabled={isDisabled}
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
        
        {!loading && icon && iconPosition === 'left' && (
          <span className={`${iconClasses} ${iconSpacing}`} aria-hidden="true">
            {icon}
          </span>
        )}
        
        {children && (
          <span className={loading ? 'opacity-0' : ''}>
            {children}
          </span>
        )}
        
        {!loading && icon && iconPosition === 'right' && (
          <span className={`${iconClasses} ${iconSpacing}`} aria-hidden="true">
            {icon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
