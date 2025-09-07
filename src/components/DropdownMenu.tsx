import React, { useState, useRef, useEffect } from 'react';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import Icon, { type IconName } from './Icon';

export interface DropdownMenuItem {
  id: string;
  label: string;
  icon?: IconName;
  variant?: 'default' | 'danger';
  onClick: () => void;
  disabled?: boolean;
}

export interface DropdownMenuProps {
  items: DropdownMenuItem[];
  triggerIcon?: IconName;
  triggerVariant?: 'primary' | 'secondary';
  triggerSize?: 'sm' | 'md' | 'lg';
  triggerAriaLabel?: string;
  className?: string;
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  items,
  triggerIcon = 'more-vertical',
  triggerVariant = 'secondary',
  triggerSize = 'sm',
  triggerAriaLabel = 'More options',
  className = '',
  placement = 'bottom-end',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const buttonKeyboardRef = useKeyboardNavigation({
    onEnter: () => setIsOpen(!isOpen),
    onSpace: () => setIsOpen(!isOpen),
    onEscape: () => setIsOpen(false),
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
      buttonRef.current?.focus();
    }
  };

  const getTriggerClasses = () => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variantClasses: Record<'primary' | 'secondary', string> = {
      primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
      secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500',
    };

    const sizeClasses: Record<'sm' | 'md' | 'lg', string> = {
      sm: 'p-1.5',
      md: 'p-2',
      lg: 'p-3',
    };

    return `${baseClasses} ${variantClasses[triggerVariant]} ${sizeClasses[triggerSize]} ${className}`.trim();
  };

  const getIconSize = () => {
    const sizeMap: Record<'sm' | 'md' | 'lg', 'sm' | 'md' | 'lg'> = {
      sm: 'sm',
      md: 'md',
      lg: 'lg',
    };
    return sizeMap[triggerSize];
  };

  const getMenuClasses = () => {
    const baseClasses = 'absolute w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50';
    
    const placementClasses: Record<string, string> = {
      'bottom-start': 'top-full left-0 mt-1',
      'bottom-end': 'top-full right-0 mt-1',
      'top-start': 'bottom-full left-0 mb-1',
      'top-end': 'bottom-full right-0 mb-1',
    };

    return `${baseClasses} ${placementClasses[placement]}`.trim();
  };

  const getItemClasses = (variant: DropdownMenuItem['variant'] = 'default', disabled = false) => {
    const baseClasses = 'flex items-center w-full px-3 py-2 text-sm transition-colors duration-200 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed';
    
    if (disabled) {
      return `${baseClasses} text-gray-400 cursor-not-allowed`;
    }
    
    switch (variant) {
      case 'danger':
        return `${baseClasses} text-red-700 hover:bg-red-50 focus:bg-red-50`;
      case 'default':
      default:
        return `${baseClasses} text-gray-700 hover:bg-gray-50`;
    }
  };

  const handleItemClick = (item: DropdownMenuItem) => {
    if (!item.disabled) {
      item.onClick();
      setIsOpen(false);
    }
  };

  const handleItemKeyDown = (event: React.KeyboardEvent, item: DropdownMenuItem) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleItemClick(item);
    }
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef || (buttonKeyboardRef as React.Ref<HTMLButtonElement>)}
        onClick={() => setIsOpen(!isOpen)}
        className={getTriggerClasses()}
        aria-label={triggerAriaLabel}
        aria-expanded={isOpen}
        aria-haspopup="true"
        type="button"
      >
        <Icon name={triggerIcon} size={getIconSize()} aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className={getMenuClasses()}
          onKeyDown={handleKeyDown}
          role="menu"
          aria-orientation="vertical"
        >
          <div className="py-1">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                onKeyDown={(e) => handleItemKeyDown(e, item)}
                className={getItemClasses(item.variant, item.disabled)}
                role="menuitem"
                tabIndex={0}
                disabled={item.disabled}
                aria-disabled={item.disabled}
              >
                {item.icon && (
                  <span className="mr-3 flex-shrink-0">
                    <Icon name={item.icon} size="sm" aria-hidden="true" />
                  </span>
                )}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

DropdownMenu.displayName = 'DropdownMenu';

export default DropdownMenu;
