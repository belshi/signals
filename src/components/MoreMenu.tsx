import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '../components';

export interface MoreMenuOption {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  variant?: 'default' | 'danger';
}

export interface MoreMenuProps {
  options: MoreMenuOption[];
  className?: string;
}

const MoreMenu: React.FC<MoreMenuProps> = ({ options, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

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

  const getOptionStyles = (variant: MoreMenuOption['variant'] = 'default') => {
    const baseStyles = 'flex items-center w-full px-3 py-2 text-sm transition-colors duration-200 focus:outline-none focus:bg-gray-100';
    
    switch (variant) {
      case 'danger':
        return `${baseStyles} text-red-700 hover:bg-red-50 focus:bg-red-50`;
      case 'default':
      default:
        return `${baseStyles} text-gray-700 hover:bg-gray-50`;
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 rounded-md transition-colors duration-200"
        aria-label="More options"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Icon name="more-vertical" size="sm" />
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50"
          onKeyDown={handleKeyDown}
          role="menu"
          aria-orientation="vertical"
        >
          <div className="py-1">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  option.onClick();
                  setIsOpen(false);
                }}
                className={getOptionStyles(option.variant)}
                role="menuitem"
                tabIndex={0}
              >
                {option.icon && (
                  <span className="mr-3 flex-shrink-0">
                    {option.icon}
                  </span>
                )}
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoreMenu;
