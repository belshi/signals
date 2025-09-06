import React from 'react';
import { DataTable, StatusBadge } from './index';
import { useSignalsContext } from '../contexts/SignalsContext';
import type { EnhancedSignal } from '../types/enhanced';
import type { TableColumn } from './DataTable';

interface SignalsTableProps {
  onRowClick?: (signal: EnhancedSignal) => void;
  onRowSelect?: (signal: EnhancedSignal) => void;
  className?: string;
}

const SignalsTable: React.FC<SignalsTableProps> = ({ onRowClick, onRowSelect, className = '' }) => {
  const { signals } = useSignalsContext();

  const columns: TableColumn<EnhancedSignal>[] = [
    {
      key: 'name',
      label: 'Name',
      render: (signal) => (
        <div className="text-sm font-medium text-gray-900">
          {signal.name}
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      render: (signal) => (
        <div className="text-sm text-gray-500">{signal.type}</div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (signal) => <StatusBadge status={signal.status} />,
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (signal) => (
        <div className="text-sm text-gray-500">
          {new Date(signal.createdAt).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: 'updatedAt',
      label: 'Updated',
      render: (signal) => (
        <div className="text-sm text-gray-500">
          {new Date(signal.updatedAt).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (signal) => (
        <button
          className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
          type="button"
          aria-label={`Edit ${signal.name}`}
        >
          Edit
        </button>
      ),
    },
  ];

  const handleRowClick = (signal: EnhancedSignal, _index: number) => {
    onRowClick?.(signal);
  };

  const handleRowSelect = (signal: EnhancedSignal, _index: number) => {
    onRowSelect?.(signal);
  };

  return (
    <DataTable
      data={signals}
      columns={columns}
      keyField="id"
      emptyMessage="No signals found. Create your first signal to get started."
      onRowClick={handleRowClick}
      onRowSelect={handleRowSelect}
      selectable={!!onRowSelect}
      sortable={true}
      ariaLabel="Signals table"
      className={className}
    />
  );
};

export default SignalsTable;
