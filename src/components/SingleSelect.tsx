import React, { forwardRef, useMemo } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  description?: string;
}

export interface SingleSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size' | 'onChange'> {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
  fullWidth?: boolean;
  className?: string;
  searchable?: boolean; // Kept for API compatibility but not used
  clearable?: boolean; // Kept for API compatibility but not used
  ariaDescribedBy?: string;
}

const SingleSelect = forwardRef<HTMLSelectElement, SingleSelectProps>(
  (
    {
      options,
      value,
      onChange,
      placeholder = 'Select an option',
      size = 'md',
      error = false,
      fullWidth = true,
      className = '',
      searchable = false, // Not used in native select
      clearable = false, // Not used in native select
      ariaDescribedBy,
      disabled,
      ...props
    },
    ref
  ) => {
    const selectClasses = useMemo(() => {
      const baseClasses = 'block border rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50';
      
      const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-3 py-2 text-sm',
        lg: 'px-4 py-3 text-base',
      };

      const colorClasses = error
        ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
        : 'border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500';

      const widthClasses = fullWidth ? 'w-full' : '';

      return `${baseClasses} ${sizeClasses[size]} ${colorClasses} ${widthClasses} ${className}`.trim();
    }, [size, error, fullWidth, className]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange?.(e.target.value);
    };

    return (
      <select
        ref={ref}
        value={value || ''}
        onChange={handleChange}
        className={selectClasses}
        disabled={disabled}
        aria-invalid={error}
        aria-describedby={ariaDescribedBy}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
    );
  }
);

SingleSelect.displayName = 'SingleSelect';

export default SingleSelect;