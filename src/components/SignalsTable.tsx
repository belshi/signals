import React, { useState, useCallback, useMemo } from 'react';
import { DataTable, MoreMenu, EditSignalModal } from './index';
import { Icon } from './index';
import { useSignalsContext } from '../contexts/SignalsContext';
import { useBrandsContext } from '../contexts/BrandsContext';
import type { EnhancedSignal } from '../types/enhanced';
import type { TableColumn } from './DataTable/types';

interface SignalsTableProps {
  onRowClick?: (signal: EnhancedSignal) => void;
  onRowSelect?: (signal: EnhancedSignal) => void;
  className?: string;
}

const SignalsTable: React.FC<SignalsTableProps> = ({ onRowClick, onRowSelect, className = '' }) => {
  const { signals, deleteSignal } = useSignalsContext();
  const { getBrand } = useBrandsContext();
  const [editingSignal, setEditingSignal] = useState<EnhancedSignal | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditSignal = useCallback((signal: EnhancedSignal) => {
    setEditingSignal(signal);
    setIsEditModalOpen(true);
  }, []);

  const handleDeleteSignal = useCallback(async (signal: EnhancedSignal) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${signal.name}"? This action cannot be undone.`
    );
    
    if (confirmed) {
      try {
        await deleteSignal(signal.id);
        // No need to refresh signals as the hook already updates the state optimistically
      } catch (error) {
        console.error('Failed to delete signal:', error);
        // The error is already handled by the useSignals hook and will be displayed via the error context
        // Consider showing a toast notification for better UX
      }
    }
  }, [deleteSignal]);

  const columns: TableColumn<EnhancedSignal>[] = useMemo(() => [
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
      key: 'brand',
      label: 'Brand',
      render: (signal) => {
        const brand = signal.brandId ? getBrand(signal.brandId) : null;
        return (
          <div className="text-sm text-gray-500">
            {brand ? brand.name : 'No brand linked'}
          </div>
        );
      },
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
        <div className="flex items-center justify-end">
          <MoreMenu
            options={[
              {
                label: 'Edit',
                onClick: () => handleEditSignal(signal),
                icon: <Icon name="edit" size="sm" />,
              },
              {
                label: 'Delete',
                onClick: () => handleDeleteSignal(signal),
                icon: <Icon name="trash" size="sm" />,
                variant: 'danger',
              },
            ]}
          />
        </div>
      ),
    },
  ], [getBrand, handleEditSignal, handleDeleteSignal]);

  const handleRowClick = (signal: EnhancedSignal, _index: number) => {
    onRowClick?.(signal);
  };

  const handleRowSelect = (signal: EnhancedSignal, _index: number) => {
    onRowSelect?.(signal);
  };

  const handleEditModalClose = useCallback(() => {
    setIsEditModalOpen(false);
    setEditingSignal(null);
  }, []);

  const handleEditSuccess = useCallback(() => {
    // No need to refresh signals as the hook already updates the state optimistically
    // The signals list will automatically reflect the updated signal
  }, []);

  return (
    <>
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
      
      <EditSignalModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        onSuccess={handleEditSuccess}
        signal={editingSignal}
      />
    </>
  );
};

export default SignalsTable;
