import React, { useState, useCallback, useEffect } from 'react';
import { Modal, Button, InputLabel, TextInput, RadioGroup, SingleSelect } from './index';
import { useSignalsContext } from '../contexts';
import type { EnhancedSignal, UpdateSignalForm } from '../types/enhanced';

interface EditSignalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  signal: EnhancedSignal | null;
}

const EditSignalModal: React.FC<EditSignalModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  signal,
}) => {
  const { updateSignal } = useSignalsContext();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<UpdateSignalForm>({
    name: '',
    type: 'Analytics',
    status: 'active',
  });

  // Initialize form data when signal changes
  useEffect(() => {
    if (signal) {
      setFormData({
        name: signal.name,
        type: signal.type,
        status: signal.status,
      });
    }
  }, [signal]);

  const handleInputChange = useCallback((field: keyof UpdateSignalForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Signal name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signal || !validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      setErrors({});
      
      await updateSignal(signal.id, formData);
      
      onSuccess?.();
      onClose();
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : 'Failed to update signal' });
    } finally {
      setIsLoading(false);
    }
  }, [signal, formData, validateForm, updateSignal, onSuccess, onClose]);

  const handleClose = useCallback(() => {
    if (!isLoading) {
      setErrors({});
      onClose();
    }
  }, [isLoading, onClose]);

  if (!signal) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Signal"
      size="lg"
      closeOnOverlayClick={!isLoading}
      closeOnEscape={!isLoading}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.submit && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{errors.submit}</div>
          </div>
        )}

        <div className="space-y-6">
          {/* Signal Name */}
          <div>
            <InputLabel
              htmlFor="name"
              required
              error={!!errors.name}
            >
              Signal Name
            </InputLabel>
            <TextInput
              id="name"
              value={formData.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter signal name"
              error={!!errors.name}
              disabled={isLoading}
              ariaDescribedBy={errors.name ? 'name-error' : undefined}
            />
            {errors.name && (
              <p id="name-error" className="mt-1 text-sm text-red-600">
                {errors.name}
              </p>
            )}
          </div>

          {/* Signal Type */}
          <div>
            <InputLabel
              htmlFor="type"
              required
            >
              Signal Type
            </InputLabel>
            <SingleSelect
              id="type"
              options={[
                { value: 'Analytics', label: 'Analytics' },
                { value: 'Social', label: 'Social' },
                { value: 'Competitive', label: 'Competitive' },
                { value: 'Market', label: 'Market' },
                { value: 'Financial', label: 'Financial' },
              ]}
              value={formData.type || 'Analytics'}
              onChange={(value) => handleInputChange('type', value)}
              placeholder="Select signal type"
              disabled={isLoading}
            />
          </div>

          {/* Signal Status */}
          <div>
            <InputLabel
              htmlFor="status"
              required
            >
              Status
            </InputLabel>
            <RadioGroup
              name="status"
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'pending', label: 'Pending' },
              ]}
              value={formData.status || 'active'}
              onChange={(value) => handleInputChange('status', value)}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
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
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update Signal'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditSignalModal;
