import React from 'react';
import { DataTable, StatusBadge } from './index';
import { useSignalsContext } from '../contexts/SignalsContext';
import type { Signal } from '../types';
import type { TableColumn } from './DataTable';

interface SignalsTableProps {
  onRowClick?: (signal: Signal) => void;
  className?: string;
}

const SignalsTable: React.FC<SignalsTableProps> = ({ onRowClick, className = '' }) => {
  const { signals } = useSignalsContext();

  const columns: TableColumn<Signal>[] = [
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

  return (
    <DataTable
      data={signals}
      columns={columns}
      keyField="id"
      emptyMessage="No signals found. Create your first signal to get started."
      onRowClick={onRowClick}
      className={className}
    />
  );
};

export default SignalsTable;
