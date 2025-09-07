import type { TableColumn } from '../DataTable';

/**
 * DataTable component styling constants
 * Centralized Tailwind CSS classes for better maintainability
 */
const DATA_TABLE_CLASSES = {
  header: 'bg-gray-50',
  headerCell: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
  headerCellSortable: 'cursor-pointer hover:bg-gray-100',
  screenReaderOnly: 'sr-only',
} as const;

/**
 * Utility function to get header cell classes based on sortable state
 */
const getHeaderCellClasses = (isSortable: boolean): string => {
  return `${DATA_TABLE_CLASSES.headerCell} ${
    isSortable ? DATA_TABLE_CLASSES.headerCellSortable : ''
  }`.trim();
};

export interface TableHeaderProps<T extends Record<string, any>> {
  columns: TableColumn<T>[];
  sortable: boolean;
  sortColumn: keyof T | null;
  sortDirection: 'asc' | 'desc';
  onSort: (column: keyof T) => void;
  selectable: boolean;
}

/**
 * TableHeader component for DataTable
 * Handles column headers, sorting, and selection checkbox
 */
const TableHeader = <T extends Record<string, any>>({
  columns,
  sortable,
  sortColumn,
  sortDirection,
  onSort,
  selectable
}: TableHeaderProps<T>) => {
  return (
    <thead className={DATA_TABLE_CLASSES.header}>
      <tr role="row">
        {selectable && (
          <th
            scope="col"
            className={DATA_TABLE_CLASSES.headerCell}
            role="columnheader"
            aria-sort="none"
          >
            <span className={DATA_TABLE_CLASSES.screenReaderOnly}>Select</span>
          </th>
        )}
        {columns.map((column) => {
          const isSortable = sortable && column.sortable !== false;
          return (
            <th
              key={column.key as string}
              scope="col"
              className={getHeaderCellClasses(isSortable)}
              role="columnheader"
              aria-sort={
                sortColumn === column.key
                  ? sortDirection === 'asc' ? 'ascending' : 'descending'
                  : 'none'
              }
              tabIndex={isSortable ? 0 : undefined}
              onClick={isSortable ? () => onSort(column.key) : undefined}
              onKeyDown={
                isSortable
                  ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSort(column.key);
                      }
                    }
                  : undefined
              }
            >
              <div className="flex items-center space-x-1">
                <span>{column.label}</span>
                {isSortable && (
                  <span className={DATA_TABLE_CLASSES.screenReaderOnly}>
                    {sortColumn === column.key
                      ? `Sorted ${sortDirection === 'asc' ? 'ascending' : 'descending'}`
                      : 'Click to sort'}
                  </span>
                )}
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

export default TableHeader;
