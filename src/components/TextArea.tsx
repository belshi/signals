import React, { forwardRef, useMemo, useCallback, useEffect, useState } from 'react';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';

export interface TextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
  fullWidth?: boolean;
  className?: string;
  autoResize?: boolean;
  minRows?: number;
  maxRows?: number;
  ariaDescribedBy?: string;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      size = 'md',
      error = false,
      fullWidth = true,
      className = '',
      autoResize = false,
      minRows = 3,
      maxRows = 10,
      ariaDescribedBy,
      disabled,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const [textareaRef, setTextareaRef] = useState<HTMLTextAreaElement | null>(null);
    const [height, setHeight] = useState<number | undefined>(undefined);

    const inputRef = useKeyboardNavigation({
      onEnter: () => {},
      onSpace: () => {},
      disabled: disabled || false,
    });

    const textareaClasses = useMemo(() => {
      const baseClasses = 'block border rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 resize-none';
      
      const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-3 py-2 text-sm',
        lg: 'px-4 py-3 text-base',
      };

      const colorClasses = error
        ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
        : 'border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500';

      const widthClasses = fullWidth ? 'w-full' : '';

      return `${baseClasses} ${sizeClasses[size]} ${colorClasses} ${widthClasses} ${className}`.trim();
    }, [size, error, fullWidth, className]);

    const calculateHeight = useCallback(() => {
      if (!textareaRef || !autoResize) return;

      // Reset height to auto to get the correct scrollHeight
      textareaRef.style.height = 'auto';
      
      const scrollHeight = textareaRef.scrollHeight;
      const lineHeight = parseInt(getComputedStyle(textareaRef).lineHeight, 10) || 20;
      
      const minHeight = minRows * lineHeight;
      const maxHeight = maxRows * lineHeight;
      
      const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
      
      setHeight(newHeight);
      textareaRef.style.height = `${newHeight}px`;
    }, [textareaRef, autoResize, minRows, maxRows]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (autoResize) {
        calculateHeight();
      }
      onChange?.(e);
    }, [autoResize, calculateHeight, onChange]);

    useEffect(() => {
      if (autoResize && textareaRef) {
        calculateHeight();
      }
    }, [autoResize, textareaRef, calculateHeight, value]);

    const combinedRef = useCallback((node: HTMLTextAreaElement) => {
      setTextareaRef(node);
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
      if (typeof inputRef === 'function') {
        inputRef(node);
      } else if (inputRef) {
        inputRef.current = node;
      }
    }, [ref, inputRef]);

    const style = autoResize && height ? { height: `${height}px` } : undefined;

    return (
      <textarea
        ref={combinedRef}
        className={textareaClasses}
        style={style}
        disabled={disabled}
        value={value}
        onChange={handleChange}
        aria-invalid={error}
        aria-describedby={ariaDescribedBy}
        {...props}
      />
    );
  }
);

TextArea.displayName = 'TextArea';

export default TextArea;
