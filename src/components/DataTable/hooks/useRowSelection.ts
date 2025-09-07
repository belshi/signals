import { useState, useCallback, useMemo } from 'react';
import type { 
  UseRowSelectionProps, 
  UseRowSelectionReturn
} from '../types';

/**
 * Custom hook for row selection and focus management
 * Handles row selection state, focus management, and data processing
 */
export const useRowSelection = <T extends Record<string, any>>({
  data,
  onRowClick,
  onRowSelect
}: UseRowSelectionProps<T>): UseRowSelectionReturn<T> => {
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [focusedRow, setFocusedRow] = useState<number | null>(null);

  // Memoize processed data with indices for better performance
  const processedData = useMemo(() => {
    return data.map((item: T, index: number) => ({ item, index }));
  }, [data]);

  const handleRowClick = useCallback((item: T, index: number) => {
    setSelectedRow(index);
    onRowClick?.(item, index);
  }, [onRowClick]);

  const handleRowSelect = useCallback((item: T, index: number) => {
    setSelectedRow(index);
    onRowSelect?.(item, index);
  }, [onRowSelect]);

  return {
    selectedRow,
    focusedRow,
    processedData,
    handleRowClick,
    handleRowSelect,
    setFocusedRow
  };
};
