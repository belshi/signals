import { useCallback } from 'react';
import type { 
  UseTableKeyboardProps, 
  UseTableKeyboardReturn 
} from '../types';

/**
 * Custom hook for table keyboard navigation
 * Handles arrow keys, enter, and space key interactions
 */
export const useTableKeyboard = <T extends Record<string, any>>({
  dataLength,
  onRowClick,
  onFocusChange
}: UseTableKeyboardProps<T>): UseTableKeyboardReturn<T> => {
  const handleKeyDown = useCallback((event: React.KeyboardEvent, item: T, index: number) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        onRowClick(item, index);
        break;
      case 'ArrowDown':
        event.preventDefault();
        onFocusChange(Math.min(index + 1, dataLength - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        onFocusChange(Math.max(index - 1, 0));
        break;
      case 'Home':
        event.preventDefault();
        onFocusChange(0);
        break;
      case 'End':
        event.preventDefault();
        onFocusChange(dataLength - 1);
        break;
    }
  }, [dataLength, onRowClick, onFocusChange]);

  return {
    handleKeyDown
  };
};
