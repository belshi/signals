import React, { forwardRef, useMemo } from 'react';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import Icon, { type IconName } from './Icon';

export type IconButtonVariant = 'primary' | 'secondary';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: IconName;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  loading?: boolean;
  ariaLabel: string; // Required for accessibility since there's no visible text
  ariaDescribedBy?: string;
  onActivate?: () => void;
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      variant = 'primary',
      size = 'md',
      loading = false,
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
      const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
      
      const variantClasses: Record<IconButtonVariant, string> = {
        primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
        secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500',
      };

      const sizeClasses: Record<IconButtonSize, string> = {
        sm: 'p-1.5',
        md: 'p-2',
        lg: 'p-3',
      };

      return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim();
    }, [variant, size, className]);

    const iconSize = useMemo(() => {
      const sizeMap: Record<IconButtonSize, 'sm' | 'md' | 'lg'> = {
        sm: 'sm',
        md: 'md',
        lg: 'lg',
      };
      return sizeMap[size];
    }, [size]);

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
        {loading ? (
          <svg
            className="animate-spin h-4 w-4"
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
        ) : (
          <Icon name={icon} size={iconSize} aria-hidden="true" />
        )}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';

export default IconButton;
