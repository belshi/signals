import React, { useState } from 'react';
import { StackedList, Button, Modal, TextInput, LoadingSpinner, ErrorMessage, type StackedListItem, type DropdownMenuItem } from '../components';
import { useBrandCompetitors } from '../hooks';
import type { BrandId, BrandCompetitor } from '../types/enhanced';

export interface CompetitorsRef {
  openAddModal: () => void;
}

interface CompetitorsProps {
  brandId?: BrandId;
}

interface AddCompetitorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
  isLoading: boolean;
}

interface EditCompetitorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
  isLoading: boolean;
  currentCompetitor: string;
}

const AddCompetitorModal: React.FC<AddCompetitorModalProps> = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      await onSubmit(name.trim());
      setName('');
      onClose();
    }
  };

  const handleClose = () => {
    setName('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New Competitor"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="competitor-name" className="block text-sm font-medium text-gray-700 mb-2">
            Competitor Name
          </label>
          <TextInput
            id="competitor-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter competitor name..."
            required
            disabled={isLoading}
          />
        </div>
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="brandGray"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="secondary"
            loading={isLoading}
            disabled={!name.trim()}
          >
            Add Competitor
          </Button>
        </div>
      </form>
    </Modal>
  );
};

const EditCompetitorModal: React.FC<EditCompetitorModalProps> = ({ isOpen, onClose, onSubmit, isLoading, currentCompetitor }) => {
  const [name, setName] = useState(currentCompetitor);

  React.useEffect(() => {
    setName(currentCompetitor);
  }, [currentCompetitor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && name.trim() !== currentCompetitor) {
      await onSubmit(name.trim());
      onClose();
    }
  };

  const handleClose = () => {
    setName(currentCompetitor);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Competitor"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="edit-competitor-name" className="block text-sm font-medium text-gray-700 mb-2">
            Competitor Name
          </label>
          <TextInput
            id="edit-competitor-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter competitor name..."
            required
            disabled={isLoading}
          />
        </div>
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="brandGray"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="secondary"
            loading={isLoading}
            disabled={!name.trim() || name.trim() === currentCompetitor}
          >
            Update Competitor
          </Button>
        </div>
      </form>
    </Modal>
  );
};

const Competitors = React.forwardRef<CompetitorsRef, CompetitorsProps>(({ brandId }, ref) => {
  const { competitors, isLoading, error, createCompetitor, updateCompetitor, deleteCompetitor, clearError } = useBrandCompetitors({ brandId });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCompetitor, setEditingCompetitor] = useState<BrandCompetitor | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Expose methods to parent component via ref
  React.useImperativeHandle(ref, () => ({
    openAddModal: () => setIsAddModalOpen(true),
  }));

  const handleAddCompetitor = async (competitorName: string) => {
    if (!brandId) return;
    
    setActionLoading(true);
    try {
      await createCompetitor({ name: competitorName, brand_id: brandId });
    } catch (err) {
      // Error is handled by the context
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditCompetitor = (competitor: BrandCompetitor) => {
    setEditingCompetitor(competitor);
    setIsEditModalOpen(true);
  };

  const handleUpdateCompetitor = async (competitorName: string) => {
    if (!editingCompetitor) return;
    
    setActionLoading(true);
    try {
      await updateCompetitor(editingCompetitor.id, { name: competitorName });
    } catch (err) {
      // Error is handled by the context
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCompetitor = async (competitorId: number) => {
    if (!confirm('Are you sure you want to delete this competitor?')) {
      return;
    }
    
    setActionLoading(true);
    try {
      await deleteCompetitor(competitorId);
    } catch (err) {
      // Error is handled by the context
    } finally {
      setActionLoading(false);
    }
  };

  const getActionItems = (competitor: BrandCompetitor): DropdownMenuItem[] => [
    {
      id: 'edit',
      label: 'Edit',
      icon: 'edit',
      variant: 'default',
      onClick: () => handleEditCompetitor(competitor)
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: 'trash',
      variant: 'danger',
      onClick: () => handleDeleteCompetitor(competitor.id)
    }
  ];

  const stackedListItems: StackedListItem[] = competitors.map((competitor) => ({
    id: competitor.id.toString(),
    text: competitor.name,
    actionItems: getActionItems(competitor),
    actionTriggerIcon: 'more-vertical',
    actionTriggerVariant: 'secondary',
    actionTriggerSize: 'sm',
    actionTriggerAriaLabel: `More options for ${competitor.name}`
  }));

  if (isLoading && competitors.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <ErrorMessage 
          message={error} 
          onDismiss={clearError}
          variant="error"
        />
      )}

      {competitors.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No competitors set for this brand yet.</p>
          <p className="text-sm text-gray-400 mt-1">Add your first competitor to get started.</p>
        </div>
      ) : (
        <StackedList 
          items={stackedListItems}
          bordered={false}
          aria-label="Competitors list"
        />
      )}

      <AddCompetitorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddCompetitor}
        isLoading={actionLoading}
      />

      <EditCompetitorModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingCompetitor(null);
        }}
        onSubmit={handleUpdateCompetitor}
        isLoading={actionLoading}
        currentCompetitor={editingCompetitor?.name || ''}
      />
    </div>
  );
});

export default Competitors;
