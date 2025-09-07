import React, { forwardRef, useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import { Icon } from './index';

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
  searchable?: boolean;
  clearable?: boolean;
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
      searchable = false,
      clearable = false,
      ariaDescribedBy,
      disabled,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
    const containerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const optionRefs = useRef<(HTMLDivElement | null)[]>([]);

    const selectRef = useKeyboardNavigation({
      onEnter: () => {
        if (!isOpen) {
          setIsOpen(true);
          if (searchable) {
            setTimeout(() => searchInputRef.current?.focus(), 0);
          }
        } else if (focusedIndex >= 0) {
          const filteredOptions = getFilteredOptions();
          const selectedOption = filteredOptions[focusedIndex];
          if (selectedOption && !selectedOption.disabled) {
            handleSelect(selectedOption.value);
          }
        }
      },
      onSpace: () => {
        if (!isOpen) {
          setIsOpen(true);
          if (searchable) {
            setTimeout(() => searchInputRef.current?.focus(), 0);
          }
        }
      },
      onEscape: () => {
        setIsOpen(false);
        setSearchTerm('');
        setFocusedIndex(-1);
      },
      onArrowDown: () => {
        if (isOpen) {
          const filteredOptions = getFilteredOptions();
          setFocusedIndex(prev => Math.min(prev + 1, filteredOptions.length - 1));
        }
      },
      onArrowUp: () => {
        if (isOpen) {
          setFocusedIndex(prev => Math.max(prev - 1, -1));
        }
      },
      disabled: disabled || false,
    });

    const getFilteredOptions = useCallback(() => {
      if (!searchable || !searchTerm) return options;
      return options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }, [options, searchTerm, searchable]);

    const selectedOption = useMemo(() => {
      return options.find(option => option.value === value);
    }, [options, value]);

    const selectClasses = useMemo(() => {
      const baseClasses = 'block border rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 cursor-pointer';
      
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

    const dropdownClasses = useMemo(() => {
      const positionClasses = dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1';
      const baseClasses = `absolute z-[9999] ${positionClasses} bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto`;
      const widthClasses = fullWidth ? 'w-full' : 'min-w-full';
      return `${baseClasses} ${widthClasses}`;
    }, [fullWidth, dropdownPosition]);

    // Check if dropdown should open upward to avoid clipping
    useEffect(() => {
      if (isOpen && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;
        
        // If there's not enough space below but more space above, open upward
        if (spaceBelow < 200 && spaceAbove > spaceBelow) {
          setDropdownPosition('top');
        } else {
          setDropdownPosition('bottom');
        }
      }
    }, [isOpen]);

    const handleSelect = useCallback((optionValue: string) => {
      onChange?.(optionValue);
      setIsOpen(false);
      setSearchTerm('');
      setFocusedIndex(-1);
    }, [onChange]);

    const handleClear = useCallback((e: React.MouseEvent) => {
      e.stopPropagation();
      onChange?.('');
    }, [onChange]);

    const handleToggle = useCallback(() => {
      if (!disabled) {
        setIsOpen(!isOpen);
        if (!isOpen && searchable) {
          setTimeout(() => searchInputRef.current?.focus(), 0);
        }
      }
    }, [disabled, isOpen, searchable]);

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          setSearchTerm('');
          setFocusedIndex(-1);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [isOpen]);

    // Scroll focused option into view
    useEffect(() => {
      if (focusedIndex >= 0 && optionRefs.current[focusedIndex]) {
        optionRefs.current[focusedIndex]?.scrollIntoView({
          block: 'nearest',
        });
      }
    }, [focusedIndex]);

    const filteredOptions = getFilteredOptions();

    return (
      <div ref={containerRef} className="relative">
        <div
          ref={selectRef as React.Ref<HTMLDivElement>}
          className={selectClasses}
          onClick={handleToggle}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-invalid={error}
          aria-describedby={ariaDescribedBy}
          tabIndex={disabled ? -1 : 0}
        >
          <div className="flex items-center justify-between">
            <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <div className="flex items-center space-x-2">
              {clearable && selectedOption && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  aria-label="Clear selection"
                >
                  <Icon name="x" size="sm" />
                </button>
              )}
              <Icon
                name="more-vertical"
                size="sm"
                className={`transform transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
              />
            </div>
          </div>
        </div>

        {isOpen && (
          <div className={dropdownClasses}>
            {searchable && (
              <div className="p-2 border-b border-gray-200">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search options..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            )}
            
            <div role="listbox" className="py-1">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-sm text-gray-500">
                  No options found
                </div>
              ) : (
                filteredOptions.map((option, index) => (
                  <div
                    key={option.value}
                    ref={(el) => (optionRefs.current[index] = el)}
                    className={`px-3 py-2 text-sm cursor-pointer transition-colors duration-150 ${
                      index === focusedIndex
                        ? 'bg-indigo-50 text-indigo-900'
                        : option.disabled
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-900 hover:bg-gray-50'
                    }`}
                    onClick={() => !option.disabled && handleSelect(option.value)}
                    role="option"
                    aria-selected={value === option.value}
                    aria-disabled={option.disabled}
                  >
                    <div className="font-medium">{option.label}</div>
                    {option.description && (
                      <div className="text-xs text-gray-500 mt-1">{option.description}</div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);

SingleSelect.displayName = 'SingleSelect';

export default SingleSelect;
