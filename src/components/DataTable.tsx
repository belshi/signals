import React from 'react';

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T, value: any) => React.ReactNode;
  className?: string;
  sortable?: boolean;
}

export interface DataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  keyField: keyof T;
  className?: string;
  emptyMessage?: string;
  loading?: boolean;
  onRowClick?: (item: T) => void;
}

const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  keyField,
  className = '',
  emptyMessage = 'No data available',
  loading = false,
  onRowClick,
}: DataTableProps<T>) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  column.className || ''
                }`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => (
            <tr
              key={item[keyField] as string}
              className={`hover:bg-gray-50 ${onRowClick ? 'cursor-pointer' : ''}`}
              onClick={() => onRowClick?.(item)}
              role={onRowClick ? 'button' : undefined}
              tabIndex={onRowClick ? 0 : undefined}
              onKeyDown={(e) => {
                if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  onRowClick(item);
                }
              }}
            >
              {columns.map((column, colIndex) => {
                const value = typeof column.key === 'string' 
                  ? item[column.key] 
                  : item[column.key as keyof T];
                
                return (
                  <td
                    key={colIndex}
                    className={`px-6 py-4 whitespace-nowrap ${column.className || ''}`}
                  >
                    {column.render ? column.render(item, value) : value}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
