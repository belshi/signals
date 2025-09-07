import React from 'react';
import type { TableColumn } from '../DataTable';
import TableCell, { SelectableCell } from './TableCell';

/**
 * DataTable component styling constants
 */
const DATA_TABLE_CLASSES = {
  row: 'hover:bg-gray-50 cursor-pointer transition-colors duration-150',
  rowSelected: 'bg-indigo-50',
  rowFocused: 'ring-2 ring-indigo-500',
} as const;

/**
 * Utility function to get row classes based on state
 */
const getRowClasses = (isSelected: boolean, isFocused: boolean): string => {
  const baseClasses = DATA_TABLE_CLASSES.row;
  const selectedClasses = isSelected ? DATA_TABLE_CLASSES.rowSelected : '';
  const focusedClasses = isFocused ? DATA_TABLE_CLASSES.rowFocused : '';
  
  return `${baseClasses} ${selectedClasses} ${focusedClasses}`.trim();
};

export interface TableRowProps<T extends Record<string, any>> {
  item: T;
  index: number;
  columns: TableColumn<T>[];
  isSelected: boolean;
  isFocused: boolean;
  onRowClick: (item: T, index: number) => void;
  onRowSelect: (item: T, index: number) => void;
  onKeyDown: (event: React.KeyboardEvent, item: T, index: number) => void;
  onFocus: (index: number) => void;
  onBlur: () => void;
  selectable: boolean;
  keyField: keyof T;
}

/**
 * TableRow component for DataTable
 * Renders individual table rows with selection and interaction support
 */
const TableRow = <T extends Record<string, any>>({
  item,
  index,
  columns,
  isSelected,
  isFocused,
  onRowClick,
  onRowSelect,
  onKeyDown,
  onFocus,
  onBlur,
  selectable,
  keyField
}: TableRowProps<T>) => {
  return (
    <tr
      key={item[keyField] as string}
      role="row"
      className={getRowClasses(isSelected, isFocused)}
      aria-rowindex={index + 1}
      aria-selected={isSelected}
      tabIndex={0}
      onClick={() => onRowClick(item, index)}
      onKeyDown={(e) => onKeyDown(e, item, index)}
      onFocus={() => onFocus(index)}
      onBlur={onBlur}
    >
      {selectable && (
        <SelectableCell
          isSelected={isSelected}
          index={index}
          onRowSelect={() => onRowSelect(item, index)}
        />
      )}
      {columns.map((column) => (
        <TableCell
          key={column.key as string}
          column={column}
          item={item}
          index={index}
        />
      ))}
    </tr>
  );
};

export default TableRow;
