import React, { forwardRef, useMemo } from 'react';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps extends Omit<React.FieldsetHTMLAttributes<HTMLFieldSetElement>, 'onChange'> {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  options: RadioOption[];
  error?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  orientation?: 'vertical' | 'horizontal';
  className?: string;
  ariaDescribedBy?: string;
  ariaLabelledBy?: string;
}

const RadioGroup = forwardRef<HTMLFieldSetElement, RadioGroupProps>(
  (
    {
      name,
      value,
      onChange,
      options,
      error = false,
      disabled = false,
      size = 'md',
      orientation = 'vertical',
      className = '',
      ariaDescribedBy,
      ariaLabelledBy,
      ...props
    },
    ref
  ) => {
    const fieldsetRef = useKeyboardNavigation({
      onEnter: () => {},
      onSpace: () => {},
      disabled: disabled || false,
    });

    const fieldsetClasses = useMemo(() => {
      const baseClasses = 'border-0 p-0 m-0';
      const orientationClasses = orientation === 'horizontal' ? 'flex flex-wrap gap-4' : 'space-y-3';
      return `${baseClasses} ${orientationClasses} ${className}`.trim();
    }, [orientation, className]);

    const radioClasses = useMemo(() => {
      const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-4 w-4',
        lg: 'h-5 w-5',
      };
      
      const colorClasses = error
        ? 'text-red-600 focus:ring-red-500 border-red-300'
        : 'text-indigo-600 focus:ring-indigo-500 border-gray-300';

      return `${sizeClasses[size]} ${colorClasses} focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed`;
    }, [size, error]);

    const labelClasses = useMemo(() => {
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

      return `${sizeClasses[size]} font-medium ${colorClasses} cursor-pointer`;
    }, [size, error, disabled]);

    const descriptionClasses = useMemo(() => {
      const sizeClasses = {
        sm: 'text-xs',
        md: 'text-xs',
        lg: 'text-sm',
      };
      
      const colorClasses = error
        ? 'text-red-600'
        : disabled
        ? 'text-gray-400'
        : 'text-gray-500';

      return `${sizeClasses[size]} ${colorClasses}`;
    }, [size, error, disabled]);

    const handleChange = (optionValue: string) => {
      if (!disabled && onChange) {
        onChange(optionValue);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent, optionValue: string) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleChange(optionValue);
      }
    };

    return (
      <fieldset
        ref={ref || (fieldsetRef as React.Ref<HTMLFieldSetElement>)}
        className={fieldsetClasses}
        disabled={disabled}
        aria-invalid={error}
        aria-describedby={ariaDescribedBy}
        aria-labelledby={ariaLabelledBy}
        {...props}
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="radio"
                id={`${name}-${option.value}`}
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={() => handleChange(option.value)}
                onKeyDown={(e) => handleKeyDown(e, option.value)}
                disabled={disabled || option.disabled}
                className={radioClasses}
                aria-describedby={option.description ? `${name}-${option.value}-description` : undefined}
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor={`${name}-${option.value}`}
                className={labelClasses}
                onClick={() => !disabled && !option.disabled && handleChange(option.value)}
              >
                {option.label}
              </label>
              {option.description && (
                <p
                  id={`${name}-${option.value}-description`}
                  className={descriptionClasses}
                >
                  {option.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </fieldset>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';

export default RadioGroup;
