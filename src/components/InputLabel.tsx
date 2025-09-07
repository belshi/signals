import React, { forwardRef } from 'react';

export interface InputLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  required?: boolean;
  error?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  htmlFor?: string;
  description?: string;
  className?: string;
}

const InputLabel = forwardRef<HTMLLabelElement, InputLabelProps>(
  (
    {
      children,
      required = false,
      error = false,
      disabled = false,
      size = 'md',
      htmlFor,
      description,
      className = '',
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'text-sm',
      md: 'text-sm',
      lg: 'text-base',
    };

    const colorClasses = error
      ? 'text-red-700'
      : disabled
      ? 'text-gray-400'
      : 'text-gray-700';

    const labelClasses = `block font-medium ${sizeClasses[size]} ${colorClasses} ${className}`.trim();

    return (
      <div className="space-y-1">
        <label
          ref={ref}
          htmlFor={htmlFor}
          className={labelClasses}
          aria-required={required}
          aria-disabled={disabled}
          {...props}
        >
          {children}
          {required && (
            <span className="text-red-500 ml-1" aria-label="required">
              *
            </span>
          )}
        </label>
        {description && (
          <p
            className={`text-xs ${error ? 'text-red-600' : disabled ? 'text-gray-400' : 'text-gray-500'}`}
            id={htmlFor ? `${htmlFor}-description` : undefined}
          >
            {description}
          </p>
        )}
      </div>
    );
  }
);

InputLabel.displayName = 'InputLabel';

export default InputLabel;
