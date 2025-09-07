import React from 'react';

/**
 * Enhanced TypeScript types for DataTable component
 * Provides comprehensive type safety and better developer experience
 */

// ============================================================================
// Core Types
// ============================================================================

/**
 * Sort direction for table columns
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Text alignment options
 */
export type TextAlign = 'left' | 'center' | 'right';

/**
 * Table size variants
 */
export type TableSize = 'sm' | 'md' | 'lg';

/**
 * Table density options
 */
export type TableDensity = 'compact' | 'normal' | 'comfortable';

/**
 * Selection mode for table rows
 */
export type SelectionMode = 'single' | 'multiple' | 'none';

// ============================================================================
// Column Types
// ============================================================================

/**
 * Column width specification
 */
export type ColumnWidth = string | number;

/**
 * Column alignment configuration
 */
export interface ColumnAlignment {
  header?: TextAlign;
  content?: TextAlign;
}

/**
 * Column sorting configuration
 */
export interface ColumnSorting {
  enabled?: boolean;
  defaultDirection?: SortDirection;
  customSort?: (a: any, b: any) => number;
}

/**
 * Column filtering configuration
 */
export interface ColumnFiltering {
  enabled?: boolean;
  type?: 'text' | 'select' | 'date' | 'number';
  options?: Array<{ label: string; value: any }>;
  placeholder?: string;
}

/**
 * Column resizing configuration
 */
export interface ColumnResizing {
  enabled?: boolean;
  minWidth?: number;
  maxWidth?: number;
  defaultWidth?: number;
}

/**
 * Enhanced TableColumn interface with comprehensive options
 */
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
  width?: ColumnWidth;
  
  /** Column alignment configuration */
  align?: ColumnAlignment | TextAlign;
  
  /** Sorting configuration */
  sorting?: ColumnSorting;
  
  /** Filtering configuration */
  filtering?: ColumnFiltering;
  
  /** Resizing configuration */
  resizing?: ColumnResizing;
  
  /** Whether the column is visible */
  visible?: boolean;
  
  /** Whether the column is fixed (sticky) */
  fixed?: 'left' | 'right';
  
  /** Column priority for responsive hiding */
  priority?: number;
  
  /** Tooltip text for the column header */
  tooltip?: string;
  
  /** Whether the column is sortable (legacy support) */
  sortable?: boolean;
}

// ============================================================================
// Table Configuration Types
// ============================================================================

/**
 * Table pagination configuration
 */
export interface TablePagination {
  enabled: boolean;
  pageSize: number;
  pageSizeOptions?: number[];
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showTotal?: (total: number, range: [number, number]) => string;
}

/**
 * Table selection configuration
 */
export interface TableSelection<T = any> {
  mode: SelectionMode;
  selectedRowKeys?: (string | number)[];
  onSelectionChange?: (selectedRowKeys: (string | number)[], selectedRows: T[]) => void;
  getCheckboxProps?: (record: T) => { disabled?: boolean; name?: string };
}

/**
 * Table loading configuration
 */
export interface TableLoading {
  spinning: boolean;
  tip?: string;
  delay?: number;
}

/**
 * Table empty state configuration
 */
export interface TableEmptyState {
  description?: string;
  image?: React.ReactNode;
  action?: React.ReactNode;
}

// ============================================================================
// Event Handler Types
// ============================================================================

/**
 * Row click event handler
 */
export type RowClickHandler<T> = (item: T, index: number, event?: React.MouseEvent) => void;

/**
 * Row double click event handler
 */
export type RowDoubleClickHandler<T> = (item: T, index: number, event: React.MouseEvent) => void;

/**
 * Row context menu event handler
 */
export type RowContextMenuHandler<T> = (item: T, index: number, event: React.MouseEvent) => void;

/**
 * Sort change event handler
 */
export type SortChangeHandler<T> = (column: keyof T, direction: SortDirection) => void;

/**
 * Filter change event handler
 */
export type FilterChangeHandler<T> = (filters: Record<keyof T, any>) => void;

/**
 * Page change event handler
 */
export type PageChangeHandler = (page: number, pageSize: number) => void;

// ============================================================================
// Component Props Types
// ============================================================================

/**
 * Base DataTable props interface
 */
export interface BaseDataTableProps<T extends Record<string, any> = Record<string, any>> {
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
  onRowClick?: RowClickHandler<T>;
  
  /** Row double click handler */
  onRowDoubleClick?: RowDoubleClickHandler<T>;
  
  /** Row context menu handler */
  onRowContextMenu?: RowContextMenuHandler<T>;
  
  /** Sort change handler */
  onSort?: SortChangeHandler<T>;
  
  /** Filter change handler */
  onFilter?: FilterChangeHandler<T>;
  
  /** Page change handler */
  onPageChange?: PageChangeHandler;
  
  /** Accessibility label for the table */
  ariaLabel?: string;
  
  /** Accessibility described by reference */
  ariaDescribedBy?: string;
}

/**
 * Enhanced DataTable props interface
 */
export interface DataTableProps<T extends Record<string, any> = Record<string, any>> 
  extends BaseDataTableProps<T> {
  /** Row selection handler */
  onRowSelect?: (item: T, index: number) => void;
  
  /** Whether rows are selectable */
  selectable?: boolean;
  
  /** Whether columns are sortable */
  sortable?: boolean;
  
  /** Table size variant */
  size?: TableSize;
  
  /** Table density */
  density?: TableDensity;
  
  /** Pagination configuration */
  pagination?: TablePagination;
  
  /** Selection configuration */
  selection?: TableSelection;
  
  /** Loading configuration */
  loadingConfig?: TableLoading;
  
  /** Empty state configuration */
  emptyState?: TableEmptyState;
  
  /** Whether to show row numbers */
  showRowNumbers?: boolean;
  
  /** Whether to show column borders */
  bordered?: boolean;
  
  /** Whether to show striped rows */
  striped?: boolean;
  
  /** Whether to show hover effects */
  hoverable?: boolean;
  
  /** Whether the table is responsive */
  responsive?: boolean;
  
  /** Custom row key generator */
  rowKey?: (item: T, index: number) => string | number;
  
  /** Custom row class name generator */
  rowClassName?: (item: T, index: number) => string;
  
  /** Custom row style generator */
  rowStyle?: (item: T, index: number) => React.CSSProperties;
}

// ============================================================================
// Hook Interface Types
// ============================================================================

/**
 * Table sorting hook props interface
 */
export interface UseTableSortingProps<T extends Record<string, any> = Record<string, any>> {
  data: T[];
  onSort?: (column: keyof T, direction: SortDirection) => void;
}

/**
 * Row selection hook props interface
 */
export interface UseRowSelectionProps<T extends Record<string, any> = Record<string, any>> {
  data: T[];
  onRowClick?: RowClickHandler<T>;
  onRowSelect?: (item: T, index: number) => void;
}

/**
 * Table keyboard hook props interface
 */
export interface UseTableKeyboardProps<T extends Record<string, any> = Record<string, any>> {
  dataLength: number;
  onRowClick: (item: T, index: number) => void;
  onFocusChange: (index: number | null) => void;
}

// ============================================================================
// Hook Return Types
// ============================================================================

/**
 * Table sorting hook return type
 */
export interface UseTableSortingReturn<T> {
  sortColumn: keyof T | null;
  sortDirection: SortDirection;
  sortedData: T[];
  handleSort: (column: keyof T) => void;
}

/**
 * Row selection hook return type
 */
export interface UseRowSelectionReturn<T> {
  selectedRow: number | null;
  focusedRow: number | null;
  processedData: Array<{ item: T; index: number }>;
  handleRowClick: (item: T, index: number) => void;
  handleRowSelect: (item: T, index: number) => void;
  setFocusedRow: (index: number | null) => void;
}

/**
 * Table keyboard hook return type
 */
export interface UseTableKeyboardReturn<T> {
  handleKeyDown: (event: React.KeyboardEvent, item: T, index: number) => void;
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard to check if a value is a valid sort direction
 */
export const isSortDirection = (value: any): value is SortDirection => {
  return value === 'asc' || value === 'desc';
};

/**
 * Type guard to check if a value is a valid text alignment
 */
export const isTextAlign = (value: any): value is TextAlign => {
  return value === 'left' || value === 'center' || value === 'right';
};

/**
 * Type guard to check if a value is a valid table size
 */
export const isTableSize = (value: any): value is TableSize => {
  return value === 'sm' || value === 'md' || value === 'lg';
};

/**
 * Type guard to check if a value is a valid selection mode
 */
export const isSelectionMode = (value: any): value is SelectionMode => {
  return value === 'single' || value === 'multiple' || value === 'none';
};

/**
 * Type guard to check if a column has sorting enabled
 */
export const hasSorting = <T extends Record<string, any>>(column: TableColumn<T>): boolean => {
  return column.sorting?.enabled === true || column.sortable === true;
};

/**
 * Type guard to check if a column has filtering enabled
 */
export const hasFiltering = <T extends Record<string, any>>(column: TableColumn<T>): boolean => {
  return column.filtering?.enabled === true;
};

/**
 * Type guard to check if a column has resizing enabled
 */
export const hasResizing = <T extends Record<string, any>>(column: TableColumn<T>): boolean => {
  return column.resizing?.enabled === true;
};

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Extract the data type from a TableColumn
 */
export type ExtractDataType<T> = T extends TableColumn<infer U> ? U : never;

/**
 * Create a type-safe column key
 */
export type ColumnKey<T> = keyof T | string;

/**
 * Create a type-safe table data type
 */
export type TableData = Record<string, any>;

/**
 * Create a discriminated union for table states
 */
export type TableState = 
  | { type: 'loading'; data: never }
  | { type: 'empty'; data: never }
  | { type: 'error'; data: never; error: Error }
  | { type: 'success'; data: TableData[] };

/**
 * Create a type-safe event handler
 */
export type EventHandler<T extends any[], R = void> = (...args: T) => R;

/**
 * Create a type-safe callback
 */
export type Callback<T = void> = () => T;

/**
 * Create a type-safe async callback
 */
export type AsyncCallback<T = void> = () => Promise<T>;
