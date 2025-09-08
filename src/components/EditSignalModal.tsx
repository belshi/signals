import React, { useState, useCallback, useEffect } from 'react';
import { Modal, Button, InputLabel, TextInput } from './index';
import { useSignalsContext } from '../contexts';
import type { EnhancedSignal } from '../types/enhanced';

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
  
  const [formData, setFormData] = useState<{ name: string }>({
    name: '',
  });

  // Initialize form data when signal changes
  useEffect(() => {
    if (signal) {
      setFormData({
        name: signal.name,
      });
    }
  }, [signal]);

  const handleInputChange = useCallback((field: 'name', value: string) => {
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

    if (!formData.name.trim()) {
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
      
      await updateSignal(signal.id, { name: formData.name });
      
      onSuccess?.();
      onClose();
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : 'Failed to update signal' });
    } finally {
      setIsLoading(false);
    }
  }, [signal, formData, validateForm, updateSignal, onSuccess, onClose]);

  const resetForm = useCallback(() => {
    if (signal) {
      setFormData({
        name: signal.name,
      });
    }
    setErrors({});
  }, [signal]);

  const handleClose = useCallback(() => {
    if (!isLoading) {
      resetForm();
      onClose();
    }
  }, [isLoading, onClose, resetForm]);

  if (!signal) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Signal Name"
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
              value={formData.name}
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
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
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
