import React, { useState, useCallback, useMemo, memo } from 'react';
import clsx from 'clsx';
import EmptyState from './EmptyState';
import LoadingSpinner from './LoadingSpinner';
import { TableHeader, TableRow } from './DataTable/index';

/**
 * DataTable component styling constants
 * Centralized Tailwind CSS classes for better maintainability
 */
const DATA_TABLE_CLASSES = {
  // Container and wrapper classes
  container: 'overflow-visible',
  wrapper: 'overflow-x-auto',
  
  // Table structure classes
  table: 'min-w-full divide-y divide-gray-200',
  body: 'bg-white divide-y divide-gray-200',
} as const;

// Define the base DataTable props interface locally
interface BaseDataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  keyField: keyof T;
  className?: string;
  emptyMessage?: string;
  loading?: boolean;
  onRowClick?: (item: T) => void;
}

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T, value: any, index?: number) => React.ReactNode;
  className?: string;
  sortable?: boolean;
}

interface DataTableProps<T> extends Omit<BaseDataTableProps<T>, 'onRowClick'> {
  onRowClick?: (item: T, index: number) => void;
  onRowSelect?: (item: T, index: number) => void;
  selectable?: boolean;
  sortable?: boolean;
  onSort?: (column: keyof T, direction: 'asc' | 'desc') => void;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

const DataTable = memo(<T extends Record<string, any>>({
  data,
  columns,
  keyField,
  className = '',
  emptyMessage = 'No data available',
  loading = false,
  onRowClick,
  onRowSelect,
  selectable = false,
  sortable = false,
  onSort,
  ariaLabel = 'Data table',
  ariaDescribedBy,
}: DataTableProps<T>) => {
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [focusedRow, setFocusedRow] = useState<number | null>(null);
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Memoize sorted data to prevent unnecessary re-sorting
  const sortedData = useMemo(() => {
    if (!sortColumn) return data;
    
    return [...data].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      
      // Handle null/undefined values
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return sortDirection === 'asc' ? -1 : 1;
      if (bVal == null) return sortDirection === 'asc' ? 1 : -1;
      
      // Handle different data types
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      // Fallback to string comparison
      const aStr = String(aVal);
      const bStr = String(bVal);
      return sortDirection === 'asc' 
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });
  }, [data, sortColumn, sortDirection]);

  // Memoize processed data with indices for better performance
  const processedData = useMemo(() => {
    return sortedData.map((item, index) => ({ item, index }));
  }, [sortedData]);

  const handleRowClick = useCallback((item: T, index: number) => {
    setSelectedRow(index);
    onRowClick?.(item, index);
  }, [onRowClick]);

  const handleRowSelect = useCallback((item: T, index: number) => {
    setSelectedRow(index);
    onRowSelect?.(item, index);
  }, [onRowSelect]);

  const handleSort = useCallback((column: keyof T) => {
    if (!sortable) return;
    
    const newDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortDirection(newDirection);
    onSort?.(column, newDirection);
  }, [sortable, sortColumn, sortDirection, onSort]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent, item: T, index: number) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        handleRowClick(item, index);
        break;
      case 'ArrowDown':
        event.preventDefault();
        setFocusedRow(Math.min(index + 1, sortedData.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusedRow(Math.max(index - 1, 0));
        break;
    }
  }, [sortedData.length, handleRowClick]);

  if (loading) {
    return <LoadingSpinner message="Loading data..." />;
  }

  if (sortedData.length === 0) {
    return <EmptyState title={emptyMessage} />;
  }

  return (
    <div className={clsx(DATA_TABLE_CLASSES.container, className)}>
      <div
        className={DATA_TABLE_CLASSES.wrapper}
        role="table"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-rowcount={sortedData.length}
        aria-colcount={columns.length}
      >
        <table className={DATA_TABLE_CLASSES.table}>
          <TableHeader
            columns={columns}
            sortable={sortable}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
            selectable={selectable}
          />
          <tbody className={DATA_TABLE_CLASSES.body}>
            {processedData.map(({ item, index }) => {
              const isSelected = selectedRow === index;
              const isFocused = focusedRow === index;
              
              return (
                <TableRow
                  key={item[keyField] as string}
                  item={item}
                  index={index}
                  columns={columns}
                  isSelected={isSelected}
                  isFocused={isFocused}
                  onRowClick={handleRowClick}
                  onRowSelect={handleRowSelect}
                  onKeyDown={handleKeyDown}
                  onFocus={setFocusedRow}
                  onBlur={() => setFocusedRow(null)}
                  selectable={selectable}
                  keyField={keyField}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}) as <T extends Record<string, any>>(props: DataTableProps<T>) => JSX.Element;

// Add display name for better debugging
(DataTable as any).displayName = 'DataTable';

export default DataTable;
