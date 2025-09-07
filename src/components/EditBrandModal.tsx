import React, { useState, useCallback, useEffect } from 'react';
import { Modal, Button } from './index';
import { useBrandsContext } from '../contexts';
import type { EnhancedBrandDetails, CreateBrandForm } from '../types/enhanced';

interface EditBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  brand: EnhancedBrandDetails | null;
}

const EditBrandModal: React.FC<EditBrandModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  brand,
}) => {
  const { updateBrand } = useBrandsContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<CreateBrandForm>({
    name: '',
    description: '',
    website: '',
    industry: '',
    foundedYear: undefined,
    employeeCount: undefined,
  });

  // Initialize form data when brand changes
  useEffect(() => {
    if (brand) {
      setFormData({
        name: brand.name,
        description: brand.description,
        website: brand.website || '',
        industry: brand.industry,
        foundedYear: brand.foundedYear,
        employeeCount: brand.employeeCount,
      });
    }
  }, [brand]);

  const handleInputChange = useCallback((field: keyof CreateBrandForm, value: string | number | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  }, [error]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!brand) {
      setError('No brand selected for editing.');
      return;
    }

    if (!formData.name.trim() || !formData.description.trim() || !formData.industry.trim()) {
      setError('Name, description, and industry are required fields.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      await updateBrand(brand.id, formData);
      
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update brand');
    } finally {
      setIsLoading(false);
    }
  }, [formData, brand, updateBrand, onSuccess, onClose]);

  const handleClose = useCallback(() => {
    if (!isLoading) {
      setError(null);
      onClose();
    }
  }, [isLoading, onClose]);

  if (!brand) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Brand"
      size="lg"
      closeOnOverlayClick={!isLoading}
      closeOnEscape={!isLoading}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Name */}
          <div className="sm:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Brand Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter brand name"
              required
              disabled={isLoading}
            />
          </div>

          {/* Description */}
          <div className="sm:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter brand description"
              required
              disabled={isLoading}
            />
          </div>

          {/* Website */}
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700">
              Website
            </label>
            <input
              type="url"
              id="website"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="https://example.com"
              disabled={isLoading}
            />
          </div>

          {/* Industry */}
          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
              Industry *
            </label>
            <input
              type="text"
              id="industry"
              value={formData.industry}
              onChange={(e) => handleInputChange('industry', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="e.g., Technology, Healthcare"
              required
              disabled={isLoading}
            />
          </div>

          {/* Founded Year */}
          <div>
            <label htmlFor="foundedYear" className="block text-sm font-medium text-gray-700">
              Founded Year
            </label>
            <input
              type="number"
              id="foundedYear"
              value={formData.foundedYear || ''}
              onChange={(e) => handleInputChange('foundedYear', e.target.value ? parseInt(e.target.value) : undefined)}
              min="1800"
              max={new Date().getFullYear()}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="2020"
              disabled={isLoading}
            />
          </div>

          {/* Employee Count */}
          <div>
            <label htmlFor="employeeCount" className="block text-sm font-medium text-gray-700">
              Employee Count
            </label>
            <input
              type="number"
              id="employeeCount"
              value={formData.employeeCount || ''}
              onChange={(e) => handleInputChange('employeeCount', e.target.value ? parseInt(e.target.value) : undefined)}
              min="1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="100"
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
            {isLoading ? 'Updating...' : 'Update Brand'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditBrandModal;
