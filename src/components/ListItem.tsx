import React, { useMemo } from 'react';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import IconButton, { type IconButtonProps } from './IconButton';

export interface ListItemProps {
  id: string;
  text: string;
  actionIcon?: IconButtonProps['icon'];
  actionVariant?: IconButtonProps['variant'];
  actionSize?: IconButtonProps['size'];
  actionAriaLabel?: string;
  onActionClick?: () => void;
  className?: string;
  onClick?: () => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  'aria-label'?: string;
  'aria-describedby'?: string;
  role?: string;
  tabIndex?: number;
}

const ListItem: React.FC<ListItemProps> = ({
  id,
  text,
  actionIcon,
  actionVariant = 'secondary',
  actionSize = 'sm',
  actionAriaLabel,
  onActionClick,
  className = '',
  onClick,
  onKeyDown,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  role = 'listitem',
  tabIndex = -1,
}) => {
  const itemRef = useKeyboardNavigation({
    onEnter: () => {
      if (onClick) {
        onClick();
      }
    },
    onSpace: (e) => {
      e.preventDefault();
      if (onClick) {
        onClick();
      }
    },
    disabled: !onClick,
  });

  const itemClasses = useMemo(() => {
    const baseClasses = 'px-6 py-4 hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:bg-gray-50';
    const clickableClasses = onClick ? 'cursor-pointer' : '';
    return `${baseClasses} ${clickableClasses} ${className}`.trim();
  }, [onClick, className]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (onKeyDown) {
      onKeyDown(event);
    }
    
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (onClick) {
        onClick();
      }
    }
  };

  const effectiveTabIndex = onClick ? 0 : tabIndex;
  const effectiveRole = onClick ? 'button' : role;
  const effectiveAriaLabel = onClick && !ariaLabel ? `Click to interact with ${text}` : ariaLabel;

  return (
    <li
      ref={itemRef as React.Ref<HTMLLIElement>}
      className={itemClasses}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={effectiveTabIndex}
      role={effectiveRole}
      aria-label={effectiveAriaLabel}
      aria-describedby={ariaDescribedBy}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-900 flex-1 min-w-0">
          {text}
        </p>
        {actionIcon && (
          <div className="ml-4 flex-shrink-0">
            <IconButton
              icon={actionIcon}
              variant={actionVariant}
              size={actionSize}
              ariaLabel={actionAriaLabel || `Action for ${text}`}
              onClick={onActionClick}
            />
          </div>
        )}
      </div>
    </li>
  );
};

ListItem.displayName = 'ListItem';

export default ListItem;
