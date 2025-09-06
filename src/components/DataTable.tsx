import React, { useState, useCallback } from 'react';
import EmptyState from './EmptyState';
import LoadingSpinner from './LoadingSpinner';
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
  render?: (item: T, value: any) => React.ReactNode;
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

const DataTable = <T extends Record<string, any>>({
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
        setFocusedRow(Math.min(index + 1, data.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusedRow(Math.max(index - 1, 0));
        break;
    }
  }, [data.length, handleRowClick]);

  if (loading) {
    return <LoadingSpinner message="Loading data..." />;
  }

  if (data.length === 0) {
    return <EmptyState title={emptyMessage} />;
  }

  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        className="overflow-x-auto"
        role="table"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-rowcount={data.length}
        aria-colcount={columns.length}
      >
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr role="row">
              {selectable && (
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  role="columnheader"
                  aria-sort="none"
                >
                  <span className="sr-only">Select</span>
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key as string}
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    sortable && column.sortable !== false ? 'cursor-pointer hover:bg-gray-100' : ''
                  }`}
                  role="columnheader"
                  aria-sort={
                    sortColumn === column.key
                      ? sortDirection === 'asc' ? 'ascending' : 'descending'
                      : 'none'
                  }
                  tabIndex={sortable && column.sortable !== false ? 0 : undefined}
                  onClick={sortable && column.sortable !== false ? () => handleSort(column.key) : undefined}
                  onKeyDown={
                    sortable && column.sortable !== false
                      ? (e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleSort(column.key);
                          }
                        }
                      : undefined
                  }
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {sortable && column.sortable !== false && (
                      <span className="sr-only">
                        {sortColumn === column.key
                          ? `Sorted ${sortDirection === 'asc' ? 'ascending' : 'descending'}`
                          : 'Click to sort'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr
                key={item[keyField] as string}
                role="row"
                className={`${
                  selectedRow === index ? 'bg-indigo-50' : ''
                } ${
                  focusedRow === index ? 'ring-2 ring-indigo-500' : ''
                } hover:bg-gray-50 cursor-pointer transition-colors duration-150`}
                aria-rowindex={index + 1}
                aria-selected={selectedRow === index}
                tabIndex={0}
                onClick={() => handleRowClick(item, index)}
                onKeyDown={(e) => handleKeyDown(e, item, index)}
                onFocus={() => setFocusedRow(index)}
                onBlur={() => setFocusedRow(null)}
              >
                {selectable && (
                  <td className="px-6 py-4 whitespace-nowrap" role="gridcell">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      checked={selectedRow === index}
                      onChange={() => handleRowSelect(item, index)}
                      aria-label={`Select row ${index + 1}`}
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td
                    key={column.key as string}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    role="gridcell"
                  >
                    {column.render ? column.render(item, item[column.key]) : (item[column.key] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
