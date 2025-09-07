import { memo } from 'react';
import clsx from 'clsx';
import EmptyState from './EmptyState';
import LoadingSpinner from './LoadingSpinner';
import { TableHeader, TableRow } from './DataTable/index';
import { useTableSorting, useRowSelection, useTableKeyboard } from './DataTable/hooks';

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

import type { DataTableProps } from './DataTable/types';

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
  // Use custom hooks for table functionality
  const { sortColumn, sortDirection, sortedData, handleSort } = useTableSorting({
    data,
    onSort: sortable ? onSort : undefined
  });

  const { 
    selectedRow, 
    focusedRow, 
    processedData, 
    handleRowClick, 
    handleRowSelect, 
    setFocusedRow 
  } = useRowSelection({
    data: sortedData,
    onRowClick,
    onRowSelect
  });

  const { handleKeyDown } = useTableKeyboard({
    dataLength: sortedData.length,
    onRowClick: handleRowClick,
    onFocusChange: setFocusedRow
  });

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
                  key={String(item[keyField])}
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
                  keyField={keyField as string}
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
