import React, { useState, useCallback, useMemo, memo } from 'react';
import clsx from 'clsx';
import EmptyState from './EmptyState';
import LoadingSpinner from './LoadingSpinner';

/**
 * Core Types for Normalized Table Component
 */
export type SortDirection = 'asc' | 'desc';
export type TextAlign = 'left' | 'center' | 'right';

export interface TableColumn<T extends Record<string, any> = Record<string, any>> {
  /** Unique identifier for the column */
  key: keyof T | string;
  
  /** Display label for the column header */
  label: string;
  
  /** Custom render function for cell content */
  render?: (item: T, value: any, index: number) => React.ReactNode;
  
  /** CSS class name for the column */
  className?: string;
  
  /** CSS class name for the header cell */
  headerClassName?: string;
  
  /** CSS class name for data cells */
  cellClassName?: string;
  
  /** Column width specification */
  width?: string | number;
  
  /** Text alignment */
  align?: TextAlign;
  
  /** Whether the column is sortable */
  sortable?: boolean;
  
  /** Whether the column is visible */
  visible?: boolean;
  
  /** Tooltip text for the column header */
  tooltip?: string;
}

export interface TableProps<T extends Record<string, any> = Record<string, any>> {
  /** Data array to display in the table */
  data: T[];
  
  /** Column configuration array */
  columns: TableColumn<T>[];
  
  /** Field to use as unique key for rows */
  keyField: keyof T;
  
  /** Additional CSS class name */
  className?: string;
  
  /** Message to display when no data is available */
  emptyMessage?: string;
  
  /** Whether the table is in loading state */
  loading?: boolean;
  
  /** Row click handler */
  onRowClick?: (item: T, index: number, event?: React.MouseEvent) => void;
  
  /** Row selection handler */
  onRowSelect?: (item: T, index: number) => void;
  
  /** Sort change handler */
  onSort?: (column: keyof T, direction: SortDirection) => void;
  
  /** Whether rows are selectable */
  selectable?: boolean;
  
  /** Whether columns are sortable */
  sortable?: boolean;
  
  /** Accessibility label for the table */
  ariaLabel?: string;
  
  /** Accessibility described by reference */
  ariaDescribedBy?: string;
  
  /** Whether to show striped rows */
  striped?: boolean;
  
  /** Whether to show hover effects */
  hoverable?: boolean;
  
  /** Custom row class name generator */
  rowClassName?: (item: T, index: number) => string;
  
  /** Custom row style generator */
  rowStyle?: (item: T, index: number) => React.CSSProperties;
}

/**
 * Table component styling constants
 * Centralized Tailwind CSS classes for better maintainability
 */
const TABLE_CLASSES = {
  // Container and wrapper classes
  container: 'overflow-visible',
  wrapper: 'overflow-x-auto',
  
  // Table structure classes
  table: 'min-w-full divide-y divide-gray-200',
  
  // Header classes
  header: 'bg-gray-50',
  headerCell: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
  headerCellSortable: 'cursor-pointer hover:bg-gray-100',
  
  // Body classes
  body: 'bg-white divide-y divide-gray-200',
  
  // Row classes
  row: 'transition-colors duration-150',
  rowHoverable: 'hover:bg-gray-50 cursor-pointer',
  rowStriped: 'even:bg-gray-50',
  rowSelected: 'bg-blue-50',
  rowFocused: 'bg-blue-100',
  
  // Cell classes
  cell: 'px-6 py-4 whitespace-nowrap text-sm text-gray-900',
  cellSelectable: 'px-6 py-4 whitespace-nowrap',
  
  // Selection classes
  checkbox: 'h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded',
  
  // Utility classes
  screenReaderOnly: 'sr-only',
} as const;

/**
 * Normalized Table Component
 * A comprehensive table component with sorting, selection, and keyboard navigation
 */
const Table = memo(<T extends Record<string, any>>({
  data,
  columns,
  keyField,
  className = '',
  emptyMessage = 'No data available',
  loading = false,
  onRowClick,
  onRowSelect,
  onSort,
  selectable = false,
  sortable = false,
  ariaLabel = 'Data table',
  ariaDescribedBy,
  striped = false,
  hoverable = true,
  rowClassName,
  rowStyle,
}: TableProps<T>) => {
  // Sorting state
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  
  // Selection and focus state
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [focusedRow, setFocusedRow] = useState<number | null>(null);

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
    return sortedData.map((item: T, index: number) => ({ item, index }));
  }, [sortedData]);

  // Sorting handler
  const handleSort = useCallback((column: keyof T) => {
    const newDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortDirection(newDirection);
    onSort?.(column, newDirection);
  }, [sortColumn, sortDirection, onSort]);

  // Row interaction handlers
  const handleRowClick = useCallback((item: T, index: number, event?: React.MouseEvent) => {
    setSelectedRow(index);
    onRowClick?.(item, index, event);
  }, [onRowClick]);

  const handleRowSelect = useCallback((item: T, index: number) => {
    setSelectedRow(index);
    onRowSelect?.(item, index);
  }, [onRowSelect]);

  const setFocusedRowIndex = useCallback((index: number | null) => {
    setFocusedRow(index);
  }, []);

  // Keyboard navigation handler
  const handleKeyDown = useCallback((event: React.KeyboardEvent, item: T, index: number) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        handleRowClick(item, index);
        break;
      case 'ArrowDown':
        event.preventDefault();
        setFocusedRowIndex(Math.min(index + 1, sortedData.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusedRowIndex(Math.max(index - 1, 0));
        break;
      case 'Home':
        event.preventDefault();
        setFocusedRowIndex(0);
        break;
      case 'End':
        event.preventDefault();
        setFocusedRowIndex(sortedData.length - 1);
        break;
    }
  }, [sortedData.length, handleRowClick, setFocusedRowIndex]);

  // Utility functions for classes
  const getHeaderCellClasses = useCallback((isSortable: boolean, column: TableColumn<T>): string => {
    return clsx(
      TABLE_CLASSES.headerCell,
      isSortable && TABLE_CLASSES.headerCellSortable,
      column.headerClassName
    );
  }, []);

  const getRowClasses = useCallback((item: T, index: number, isSelected: boolean, isFocused: boolean): string => {
    return clsx(
      TABLE_CLASSES.row,
      hoverable && TABLE_CLASSES.rowHoverable,
      striped && TABLE_CLASSES.rowStriped,
      isSelected && TABLE_CLASSES.rowSelected,
      isFocused && TABLE_CLASSES.rowFocused,
      rowClassName?.(item, index)
    );
  }, [hoverable, striped, rowClassName]);

  const getCellClasses = useCallback((column: TableColumn<T>): string => {
    return clsx(
      TABLE_CLASSES.cell,
      column.cellClassName,
      column.align === 'center' && 'text-center',
      column.align === 'right' && 'text-right'
    );
  }, []);

  // Render loading state
  if (loading) {
    return <LoadingSpinner message="Loading data..." />;
  }

  // Render empty state
  if (sortedData.length === 0) {
    return <EmptyState title={emptyMessage} />;
  }

  return (
    <div className={clsx(TABLE_CLASSES.container, className)}>
      <div
        className={TABLE_CLASSES.wrapper}
        role="table"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-rowcount={sortedData.length}
        aria-colcount={columns.filter(col => col.visible !== false).length + (selectable ? 1 : 0)}
      >
        <table className={TABLE_CLASSES.table}>
          {/* Table Header */}
          <thead className={TABLE_CLASSES.header}>
            <tr role="row">
              {selectable && (
                <th
                  scope="col"
                  className={TABLE_CLASSES.headerCell}
                  role="columnheader"
                  aria-sort="none"
                >
                  <span className={TABLE_CLASSES.screenReaderOnly}>Select</span>
                </th>
              )}
              {columns.filter(col => col.visible !== false).map((column) => {
                const isSortable = sortable && column.sortable !== false;
                return (
                  <th
                    key={column.key as string}
                    scope="col"
                    className={getHeaderCellClasses(isSortable, column)}
                    role="columnheader"
                    aria-sort={
                      sortColumn === column.key
                        ? sortDirection === 'asc' ? 'ascending' : 'descending'
                        : 'none'
                    }
                    tabIndex={isSortable ? 0 : undefined}
                    onClick={isSortable ? () => handleSort(column.key) : undefined}
                    onKeyDown={
                      isSortable
                        ? (e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleSort(column.key);
                            }
                          }
                        : undefined
                    }
                    title={column.tooltip}
                    style={column.width ? { width: column.width } : undefined}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.label}</span>
                      {isSortable && (
                        <>
                          <span className={TABLE_CLASSES.screenReaderOnly}>
                            {sortColumn === column.key
                              ? `Sorted ${sortDirection === 'asc' ? 'ascending' : 'descending'}`
                              : 'Click to sort'}
                          </span>
                          {sortColumn === column.key && (
                            <span aria-hidden="true">
                              {sortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className={TABLE_CLASSES.body}>
            {processedData.map(({ item, index }) => {
              const isSelected = selectedRow === index;
              const isFocused = focusedRow === index;
              
              return (
                <tr
                  key={String(item[keyField])}
                  role="row"
                  className={getRowClasses(item, index, isSelected, isFocused)}
                  aria-rowindex={index + 1}
                  aria-selected={isSelected}
                  tabIndex={0}
                  onClick={(e) => handleRowClick(item, index, e)}
                  onKeyDown={(e) => handleKeyDown(e, item, index)}
                  onFocus={() => setFocusedRowIndex(index)}
                  onBlur={() => setFocusedRowIndex(null)}
                  style={rowStyle?.(item, index)}
                >
                  {/* Selection Cell */}
                  {selectable && (
                    <td className={TABLE_CLASSES.cellSelectable} role="gridcell">
                      <input
                        type="checkbox"
                        className={TABLE_CLASSES.checkbox}
                        checked={isSelected}
                        onChange={() => handleRowSelect(item, index)}
                        aria-label={`Select row ${index + 1}`}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                  )}

                  {/* Data Cells */}
                  {columns.filter(col => col.visible !== false).map((column) => (
                    <td
                      key={column.key as string}
                      className={getCellClasses(column)}
                      role="gridcell"
                      style={column.width ? { width: column.width } : undefined}
                    >
                      {column.render 
                        ? column.render(item, item[column.key], index) 
                        : (item[column.key] as React.ReactNode)
                      }
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}) as <T extends Record<string, any>>(props: TableProps<T>) => JSX.Element;

// Add display name for better debugging
(Table as any).displayName = 'Table';

export default Table;
