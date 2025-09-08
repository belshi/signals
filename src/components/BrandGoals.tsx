import React, { useState } from 'react';
import { StackedList, Button, Modal, TextArea, LoadingSpinner, ErrorMessage, type StackedListItem, type DropdownMenuItem } from '../components';
import { useBrandGoals } from '../hooks';
import type { BrandId, BrandGoal } from '../types/enhanced';

interface BrandGoalsProps {
  brandId?: BrandId;
}

export interface BrandGoalsRef {
  openAddModal: () => void;
}

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (goal: string) => Promise<void>;
  isLoading: boolean;
}

interface EditGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (goal: string) => Promise<void>;
  isLoading: boolean;
  currentGoal: string;
}

const AddGoalModal: React.FC<AddGoalModalProps> = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [goal, setGoal] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (goal.trim()) {
      await onSubmit(goal.trim());
      setGoal('');
      onClose();
    }
  };

  const handleClose = () => {
    setGoal('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New Goal"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-2">
            Goal Description
          </label>
          <TextArea
            id="goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Enter your brand goal..."
            rows={4}
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
            disabled={!goal.trim()}
          >
            Add Goal
          </Button>
        </div>
      </form>
    </Modal>
  );
};

const EditGoalModal: React.FC<EditGoalModalProps> = ({ isOpen, onClose, onSubmit, isLoading, currentGoal }) => {
  const [goal, setGoal] = useState(currentGoal);

  React.useEffect(() => {
    setGoal(currentGoal);
  }, [currentGoal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (goal.trim() && goal.trim() !== currentGoal) {
      await onSubmit(goal.trim());
      onClose();
    }
  };

  const handleClose = () => {
    setGoal(currentGoal);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Goal"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="edit-goal" className="block text-sm font-medium text-gray-700 mb-2">
            Goal Description
          </label>
          <TextArea
            id="edit-goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Enter your brand goal..."
            rows={4}
            required
            disabled={isLoading}
          />
        </div>
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={isLoading}
            disabled={!goal.trim() || goal.trim() === currentGoal}
          >
            Update Goal
          </Button>
        </div>
      </form>
    </Modal>
  );
};

const BrandGoals = React.forwardRef<BrandGoalsRef, BrandGoalsProps>(({ brandId }, ref) => {
  const { goals, isLoading, error, createGoal, updateGoal, deleteGoal, clearError } = useBrandGoals({ brandId });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<BrandGoal | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Expose methods to parent component via ref
  React.useImperativeHandle(ref, () => ({
    openAddModal: () => setIsAddModalOpen(true),
  }));

  const handleAddGoal = async (goalText: string) => {
    if (!brandId) return;
    
    setActionLoading(true);
    try {
      await createGoal({ name: goalText, brand_id: brandId });
    } catch (err) {
      // Error is handled by the context
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditGoal = (goal: BrandGoal) => {
    setEditingGoal(goal);
    setIsEditModalOpen(true);
  };

  const handleUpdateGoal = async (goalText: string) => {
    if (!editingGoal) return;
    
    setActionLoading(true);
    try {
      await updateGoal(editingGoal.id, { name: goalText });
    } catch (err) {
      // Error is handled by the context
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteGoal = async (goalId: number) => {
    if (!confirm('Are you sure you want to delete this goal?')) {
      return;
    }
    
    setActionLoading(true);
    try {
      await deleteGoal(goalId);
    } catch (err) {
      // Error is handled by the context
    } finally {
      setActionLoading(false);
    }
  };

  const getActionItems = (goal: BrandGoal): DropdownMenuItem[] => [
    {
      id: 'edit',
      label: 'Edit',
      icon: 'edit',
      variant: 'default',
      onClick: () => handleEditGoal(goal)
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: 'trash',
      variant: 'danger',
      onClick: () => handleDeleteGoal(goal.id)
    }
  ];

  const stackedListItems: StackedListItem[] = goals.map((goal) => ({
    id: goal.id.toString(),
    text: goal.name,
    actionItems: getActionItems(goal),
    actionTriggerIcon: 'more-vertical',
    actionTriggerVariant: 'secondary',
    actionTriggerSize: 'sm',
    actionTriggerAriaLabel: `More options for ${goal.name}`
  }));

  if (isLoading && goals.length === 0) {
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

      {goals.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No goals set for this brand yet.</p>
          <p className="text-sm text-gray-400 mt-1">Add your first goal to get started.</p>
        </div>
      ) : (
        <StackedList 
          items={stackedListItems}
          bordered={false}
          aria-label="Brand goals list"
        />
      )}

      <AddGoalModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddGoal}
        isLoading={actionLoading}
      />

      <EditGoalModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingGoal(null);
        }}
        onSubmit={handleUpdateGoal}
        isLoading={actionLoading}
        currentGoal={editingGoal?.name || ''}
      />
    </div>
  );
});

BrandGoals.displayName = 'BrandGoals';

export default BrandGoals;
