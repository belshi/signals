/**
 * DataTable component exports
 * Barrel export for all DataTable related components and hooks
 */

export { default as TableHeader } from './TableHeader';
export { default as TableRow } from './TableRow';
export { default as TableCell, SelectableCell } from './TableCell';

export type { TableHeaderProps } from './TableHeader';
export type { TableRowProps } from './TableRow';
export type { TableCellProps, SelectableCellProps } from './TableCell';

// Export hooks
export { 
  useTableSorting, 
  useRowSelection, 
  useTableKeyboard 
} from './hooks';

// Export enhanced types
export type { 
  // Core types
  SortDirection,
  TextAlign,
  TableSize,
  TableDensity,
  SelectionMode,
  ColumnWidth,
  
  // Column types
  ColumnAlignment,
  ColumnSorting,
  ColumnFiltering,
  ColumnResizing,
  TableColumn,
  
  // Configuration types
  TablePagination,
  TableSelection,
  TableLoading,
  TableEmptyState,
  
  // Event handler types
  RowClickHandler,
  RowDoubleClickHandler,
  RowContextMenuHandler,
  SortChangeHandler,
  FilterChangeHandler,
  PageChangeHandler,
  
  // Component props types
  BaseDataTableProps,
  DataTableProps,
  
  // Hook return types
  UseTableSortingReturn,
  UseRowSelectionReturn,
  UseTableKeyboardReturn,
  
  // Utility types
  ExtractDataType,
  ColumnKey,
  TableData,
  TableState,
  EventHandler,
  Callback,
  AsyncCallback
} from './types';

// Export type guards
export {
  isSortDirection,
  isTextAlign,
  isTableSize,
  isSelectionMode,
  hasSorting,
  hasFiltering,
  hasResizing
} from './types';
