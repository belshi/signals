import React, { useMemo } from 'react';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import ListItem from './ListItem';
import { type DropdownMenuItem } from './DropdownMenu';
import { type IconName } from './Icon';

export interface StackedListItem {
  id: string;
  text: string;
  actionItems?: DropdownMenuItem[];
  actionTriggerIcon?: IconName;
  actionTriggerVariant?: 'primary' | 'secondary';
  actionTriggerSize?: 'sm' | 'md' | 'lg';
  actionTriggerAriaLabel?: string;
  metadata?: Record<string, any>;
}

export interface StackedListProps {
  items: StackedListItem[];
  bordered?: boolean;
  className?: string;
  itemClassName?: string;
  onItemClick?: (item: StackedListItem) => void;
  emptyState?: React.ReactNode;
  renderItem?: (item: StackedListItem, index: number) => React.ReactNode;
  renderAction?: (item: StackedListItem, index: number) => React.ReactNode;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

const StackedList: React.FC<StackedListProps> = ({
  items,
  bordered = true,
  className = '',
  itemClassName = '',
  onItemClick,
  emptyState,
  renderItem,
  renderAction,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
}) => {
  const listRef = useKeyboardNavigation({
    onArrowDown: () => {
      const currentElement = document.activeElement as HTMLElement;
      const nextElement = currentElement.nextElementSibling as HTMLElement;
      if (nextElement) {
        nextElement.focus();
      }
    },
    onArrowUp: () => {
      const currentElement = document.activeElement as HTMLElement;
      const previousElement = currentElement.previousElementSibling as HTMLElement;
      if (previousElement) {
        previousElement.focus();
      }
    },
  });

  const containerClasses = useMemo(() => {
    const baseClasses = 'divide-y divide-gray-200';
    const borderClasses = bordered ? 'border border-gray-200 rounded-md' : '';
    return `${baseClasses} ${borderClasses} ${className}`.trim();
  }, [bordered, className]);

  const handleItemClick = (item: StackedListItem) => {
    if (onItemClick) {
      onItemClick(item);
    }
  };

  const defaultRenderItem = (item: StackedListItem, _index: number) => (
    <ListItem
      key={item.id}
      id={item.id}
      text={item.text}
      actionItems={item.actionItems}
      actionTriggerIcon={item.actionTriggerIcon}
      actionTriggerVariant={item.actionTriggerVariant}
      actionTriggerSize={item.actionTriggerSize}
      actionTriggerAriaLabel={item.actionTriggerAriaLabel}
      className={itemClassName}
      onClick={onItemClick ? () => handleItemClick(item) : undefined}
    />
  );

  // Actions are now handled directly in ListItem component

  if (items.length === 0 && emptyState) {
    return (
      <div className={className} role="region" aria-label={ariaLabel} aria-labelledby={ariaLabelledby}>
        {emptyState}
      </div>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <ul
      ref={listRef as React.Ref<HTMLUListElement>}
      className={containerClasses}
      role="list"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
    >
      {items.map((item, index) => {
        if (renderItem) {
          return renderItem(item, index);
        }
        
        const itemElement = defaultRenderItem(item, index);
        
        // If we have a custom renderAction, we need to handle it differently
        // since ListItem now only supports IconButton actions
        if (renderAction) {
          const customAction = renderAction(item, index);
          // For now, we'll render the custom action outside of ListItem
          // This maintains backward compatibility but limits the custom action to the right side
          return (
            <li
              key={item.id}
              className={`px-6 py-4 hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:bg-gray-50 ${itemClassName}`}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-900 flex-1 min-w-0">
                  {item.text}
                </p>
                {customAction && (
                  <div className="ml-4 flex-shrink-0">
                    {customAction}
                  </div>
                )}
              </div>
            </li>
          );
        }
        
        return itemElement;
      })}
    </ul>
  );
};

StackedList.displayName = 'StackedList';

export default StackedList;
