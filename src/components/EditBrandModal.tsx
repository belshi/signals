import React, { useState, useCallback, useEffect } from 'react';
import { Modal, Button, InputLabel, TextInput } from './index';
import { useBrandsContext } from '../contexts';
import { getSimpleIndustryOptions } from '../constants';
import type { EnhancedBrandDetails, CreateBrandForm } from '../types/enhanced';

interface EditBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  brand: EnhancedBrandDetails | null;
  updateBrand?: (id: any, updates: any) => Promise<void>;
}

// Get comprehensive industry options
const INDUSTRY_OPTIONS = getSimpleIndustryOptions();

const EditBrandModal: React.FC<EditBrandModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  brand,
  updateBrand: propUpdateBrand,
}) => {
  const { updateBrand: contextUpdateBrand } = useBrandsContext();
  const updateBrand = propUpdateBrand || contextUpdateBrand;
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<CreateBrandForm>({
    name: '',
    website: '',
    industry: '',
    location: '',
    employeeCount: undefined,
  });

  // Initialize form data when brand changes
  useEffect(() => {
    if (brand) {
      setFormData({
        name: brand.name,
        website: brand.website || '',
        industry: brand.industry,
        location: brand.location || '',
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
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Brand name is required';
    }

    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = 'Please enter a valid URL (starting with http:// or https://)';
    }

    if (formData.employeeCount && formData.employeeCount < 1) {
      newErrors.employeeCount = 'Employee count must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!brand) {
      setErrors({ submit: 'No brand selected for editing.' });
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      setErrors({});
      
      await updateBrand(brand.id, formData);
      
      onSuccess?.();
      onClose();
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : 'Failed to update brand' });
    } finally {
      setIsLoading(false);
    }
  }, [formData, brand, validateForm, updateBrand, onSuccess, onClose]);

  const handleClose = useCallback(() => {
    if (!isLoading) {
      setErrors({});
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
              ariaDescribedBy={errors.name ? 'name-error' : undefined}
            />
            {errors.name && (
              <p id="name-error" className="mt-1 text-sm text-red-600">
                {errors.name}
              </p>
            )}
          </div>


          {/* Website */}
          <div>
            <InputLabel
              htmlFor="website"
              error={!!errors.website}
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
              ariaDescribedBy={errors.website ? 'website-error' : undefined}
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
              error={!!errors.industry}
            >
              Industry
            </InputLabel>
            <select
              id="industry"
              value={formData.industry}
              onChange={(e) => handleInputChange('industry', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 ${
                errors.industry
                  ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 text-gray-900 focus:ring-brand-500 focus:border-brand-500'
              }`}
              disabled={isLoading}
              aria-invalid={!!errors.industry}
              aria-describedby={errors.industry ? 'industry-error' : undefined}
            >
              <option value="">Select an industry</option>
              {INDUSTRY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.industry && (
              <p id="industry-error" className="mt-1 text-sm text-red-600">
                {errors.industry}
              </p>
            )}
          </div>

          {/* Location */}
          <div>
            <InputLabel
              htmlFor="location"
              error={!!errors.location}
            >
              Location
            </InputLabel>
            <TextInput
              id="location"
              value={formData.location || ''}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="e.g., San Francisco, CA"
              error={!!errors.location}
              disabled={isLoading}
              ariaDescribedBy={errors.location ? 'location-error' : undefined}
            />
            {errors.location && (
              <p id="location-error" className="mt-1 text-sm text-red-600">
                {errors.location}
              </p>
            )}
          </div>


          {/* Employee Count */}
          <div>
            <InputLabel
              htmlFor="employeeCount"
              error={!!errors.employeeCount}
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
              ariaDescribedBy={errors.employeeCount ? 'employeeCount-error' : undefined}
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
            {isLoading ? 'Updating...' : 'Update Brand'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditBrandModal;
