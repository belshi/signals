import React from 'react';
import { DataTable, Badge } from './index';
import { useSignalsContext } from '../contexts/SignalsContext';
import type { EnhancedSignal, SignalStatus } from '../types/enhanced';
import type { TableColumn } from './DataTable/types';
import type { BadgeVariant } from './Badge';

interface SignalsTableProps {
  onRowClick?: (signal: EnhancedSignal) => void;
  onRowSelect?: (signal: EnhancedSignal) => void;
  className?: string;
}

const SignalsTable: React.FC<SignalsTableProps> = ({ onRowClick, onRowSelect, className = '' }) => {
  const { signals } = useSignalsContext();

  // Helper function to map signal status to badge variant
  const getStatusVariant = (status: SignalStatus): BadgeVariant => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'secondary';
      case 'pending':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  // Helper function to get status label
  const getStatusLabel = (status: SignalStatus): string => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'inactive':
        return 'Inactive';
      case 'pending':
        return 'Pending';
      default:
        return status;
    }
  };

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
      render: (signal) => (
        <Badge variant={getStatusVariant(signal.status)} size="md">
          {getStatusLabel(signal.status)}
        </Badge>
      ),
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
