import React from 'react';
import type { TableColumn } from '../DataTable';

/**
 * DataTable component styling constants
 */
const DATA_TABLE_CLASSES = {
  cell: 'px-6 py-4 whitespace-nowrap text-sm text-gray-900',
  cellSelectable: 'px-6 py-4 whitespace-nowrap',
  checkbox: 'h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded',
} as const;

export interface TableCellProps<T extends Record<string, any>> {
  column: TableColumn<T>;
  item: T;
  index: number;
}

/**
 * TableCell component for DataTable
 * Renders individual table cells with custom rendering support
 */
const TableCell = <T extends Record<string, any>>({
  column,
  item,
  index
}: TableCellProps<T>) => {
  return (
    <td
      key={column.key as string}
      className={DATA_TABLE_CLASSES.cell}
      role="gridcell"
    >
      {column.render ? column.render(item, item[column.key], index) : (item[column.key] as React.ReactNode)}
    </td>
  );
};

export interface SelectableCellProps {
  isSelected: boolean;
  index: number;
  onRowSelect: () => void;
}

/**
 * SelectableCell component for DataTable
 * Renders checkbox for row selection
 */
const SelectableCell = ({
  isSelected,
  index,
  onRowSelect
}: SelectableCellProps) => {
  return (
    <td className={DATA_TABLE_CLASSES.cellSelectable} role="gridcell">
      <input
        type="checkbox"
        className={DATA_TABLE_CLASSES.checkbox}
        checked={isSelected}
        onChange={onRowSelect}
        aria-label={`Select row ${index + 1}`}
      />
    </td>
  );
};

export { SelectableCell };
export default TableCell;
