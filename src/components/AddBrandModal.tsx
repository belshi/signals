import React, { useState, useCallback } from 'react';
import { Modal, Button, InputLabel, TextInput, TextArea, SingleSelect } from './index';
import { useBrandsContext } from '../contexts';
import type { CreateBrandForm } from '../types/enhanced';

interface AddBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// Industry options based on mock data
const INDUSTRY_OPTIONS = [
  { value: 'Technology', label: 'Technology', description: 'Software, hardware, and digital services' },
  { value: 'Healthcare', label: 'Healthcare', description: 'Medical devices, pharmaceuticals, and health services' },
  { value: 'Energy', label: 'Energy', description: 'Renewable energy, oil & gas, and utilities' },
  { value: 'Finance', label: 'Finance', description: 'Banking, insurance, and financial services' },
  { value: 'Retail', label: 'Retail', description: 'E-commerce, consumer goods, and retail services' },
  { value: 'Manufacturing', label: 'Manufacturing', description: 'Industrial production and manufacturing' },
  { value: 'Education', label: 'Education', description: 'Educational services and edtech' },
  { value: 'Transportation', label: 'Transportation', description: 'Logistics, shipping, and mobility' },
  { value: 'Media', label: 'Media & Entertainment', description: 'Content creation, broadcasting, and entertainment' },
  { value: 'Real Estate', label: 'Real Estate', description: 'Property development and real estate services' },
];

const AddBrandModal: React.FC<AddBrandModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { createBrand } = useBrandsContext();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<CreateBrandForm>({
    name: '',
    description: '',
    website: '',
    industry: '',
    foundedYear: undefined,
    employeeCount: undefined,
  });

  const handleInputChange = useCallback((field: keyof CreateBrandForm, value: string | number | undefined) => {
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
      newErrors.name = 'Brand name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.industry) {
      newErrors.industry = 'Please select an industry';
    }

    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = 'Please enter a valid URL (starting with http:// or https://)';
    }

    if (formData.foundedYear && (formData.foundedYear < 1800 || formData.foundedYear > new Date().getFullYear())) {
      newErrors.foundedYear = `Founded year must be between 1800 and ${new Date().getFullYear()}`;
    }

    if (formData.employeeCount && formData.employeeCount < 1) {
      newErrors.employeeCount = 'Employee count must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      setErrors({});
      
      await createBrand(formData);
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        website: '',
        industry: '',
        foundedYear: undefined,
        employeeCount: undefined,
      });
      
      onSuccess?.();
      onClose();
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : 'Failed to create brand' });
    } finally {
      setIsLoading(false);
    }
  }, [formData, validateForm, createBrand, onSuccess, onClose]);

  const handleClose = useCallback(() => {
    if (!isLoading) {
      setFormData({
        name: '',
        description: '',
        website: '',
        industry: '',
        foundedYear: undefined,
        employeeCount: undefined,
      });
      setErrors({});
      onClose();
    }
  }, [isLoading, onClose]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New Brand"
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

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Brand Name */}
          <div className="sm:col-span-2">
            <InputLabel
              htmlFor="name"
              required
              error={!!errors.name}
              description="Enter the official name of the brand"
            >
              Brand Name
            </InputLabel>
            <TextInput
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter brand name"
              error={!!errors.name}
              disabled={isLoading}
              ariaDescribedBy={errors.name ? 'name-error' : 'name-description'}
            />
            {errors.name && (
              <p id="name-error" className="mt-1 text-sm text-red-600">
                {errors.name}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="sm:col-span-2">
            <InputLabel
              htmlFor="description"
              required
              error={!!errors.description}
              description="Provide a brief description of the brand and its business"
            >
              Description
            </InputLabel>
            <TextArea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter brand description"
              autoResize
              minRows={3}
              maxRows={6}
              error={!!errors.description}
              disabled={isLoading}
              ariaDescribedBy={errors.description ? 'description-error' : 'description-description'}
            />
            {errors.description && (
              <p id="description-error" className="mt-1 text-sm text-red-600">
                {errors.description}
              </p>
            )}
          </div>

          {/* Website */}
          <div>
            <InputLabel
              htmlFor="website"
              error={!!errors.website}
              description="Enter the brand's official website URL"
            >
              Website
            </InputLabel>
            <TextInput
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              placeholder="https://example.com"
              error={!!errors.website}
              disabled={isLoading}
              ariaDescribedBy={errors.website ? 'website-error' : 'website-description'}
            />
            {errors.website && (
              <p id="website-error" className="mt-1 text-sm text-red-600">
                {errors.website}
              </p>
            )}
          </div>

          {/* Industry */}
          <div>
            <InputLabel
              htmlFor="industry"
              required
              error={!!errors.industry}
              description="Select the primary industry category"
            >
              Industry
            </InputLabel>
            <SingleSelect
              id="industry"
              options={INDUSTRY_OPTIONS}
              value={formData.industry}
              onChange={(value) => handleInputChange('industry', value)}
              placeholder="Select an industry"
              error={!!errors.industry}
              searchable
              clearable
              disabled={isLoading}
              ariaDescribedBy={errors.industry ? 'industry-error' : 'industry-description'}
            />
            {errors.industry && (
              <p id="industry-error" className="mt-1 text-sm text-red-600">
                {errors.industry}
              </p>
            )}
          </div>

          {/* Founded Year */}
          <div>
            <InputLabel
              htmlFor="foundedYear"
              error={!!errors.foundedYear}
              description="Year the company was established"
            >
              Founded Year
            </InputLabel>
            <TextInput
              id="foundedYear"
              type="number"
              value={formData.foundedYear?.toString() || ''}
              onChange={(e) => handleInputChange('foundedYear', e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="2020"
              min="1800"
              max={new Date().getFullYear()}
              error={!!errors.foundedYear}
              disabled={isLoading}
              ariaDescribedBy={errors.foundedYear ? 'foundedYear-error' : 'foundedYear-description'}
            />
            {errors.foundedYear && (
              <p id="foundedYear-error" className="mt-1 text-sm text-red-600">
                {errors.foundedYear}
              </p>
            )}
          </div>

          {/* Employee Count */}
          <div>
            <InputLabel
              htmlFor="employeeCount"
              error={!!errors.employeeCount}
              description="Approximate number of employees"
            >
              Employee Count
            </InputLabel>
            <TextInput
              id="employeeCount"
              type="number"
              value={formData.employeeCount?.toString() || ''}
              onChange={(e) => handleInputChange('employeeCount', e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="100"
              min="1"
              error={!!errors.employeeCount}
              disabled={isLoading}
              ariaDescribedBy={errors.employeeCount ? 'employeeCount-error' : 'employeeCount-description'}
            />
            {errors.employeeCount && (
              <p id="employeeCount-error" className="mt-1 text-sm text-red-600">
                {errors.employeeCount}
              </p>
            )}
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
            {isLoading ? 'Creating...' : 'Create Brand'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddBrandModal;
