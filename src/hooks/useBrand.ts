import { useState, useCallback, useEffect } from 'react';
import { brandService } from '../services/database';
import type { EnhancedBrandDetails, BrandId } from '../types/enhanced';
import { useErrorHandler } from './useErrorHandler';

interface UseBrandOptions {
  brandId?: BrandId;
}

export const useBrand = (options: UseBrandOptions = {}) => {
  const { brandId } = options;
  const [brandDetails, setBrandDetails] = useState<EnhancedBrandDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { handleError } = useErrorHandler({
    onError: (error) => {
      setError(error.message);
    },
  });

  // Load brand details when brandId changes
  useEffect(() => {
    if (brandId) {
      loadBrandDetails(brandId);
    }
  }, [brandId]);

  const loadBrandDetails = useCallback(async (id: BrandId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const brand = await brandService.getBrandById(id);
      setBrandDetails(brand);
    } catch (err) {
      const error = err as Error;
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const updateBrandDetails = useCallback(async (updates: Partial<EnhancedBrandDetails>) => {
    if (!brandDetails) {
      throw new Error('No brand details available to update');
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const updatedBrand = await brandService.updateBrand(brandDetails.id, {
        name: updates.name,
        description: updates.description,
        website: updates.website,
        industry: updates.industry,
        foundedYear: updates.foundedYear,
        employeeCount: updates.employeeCount,
      });
      setBrandDetails(updatedBrand);
    } catch (err) {
      const error = err as Error;
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [brandDetails, handleError]);

  const refreshBrandDetails = useCallback(async () => {
    if (brandDetails) {
      await loadBrandDetails(brandDetails.id);
    }
  }, [brandDetails, loadBrandDetails]);

  return {
    brandDetails,
    isLoading,
    error,
    updateBrandDetails,
    refreshBrandDetails,
  };
};