import React, { useState, useCallback, useMemo } from 'react';
import { DataTable, EditSignalModal } from './index';
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
  const { signals } = useSignalsContext();
  const { getBrand } = useBrandsContext();
  const [editingSignal, setEditingSignal] = useState<EnhancedSignal | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
  ], [getBrand]);

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
