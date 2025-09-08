import { useState, useCallback, useEffect, useMemo } from 'react';
import { brandService } from '../services/database';
import type { EnhancedBrandDetails, BrandId, CreateBrandForm, UseBrandsReturn } from '../types/enhanced';
import { useErrorHandler } from './useErrorHandler';

export const useBrands = (): UseBrandsReturn => {
  const [brands, setBrands] = useState<EnhancedBrandDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { handleError } = useErrorHandler({
    onError: (error) => {
      setError(error.message);
    },
  });

  // Load brands on mount
  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const brandsData = await brandService.getAllBrands();
      setBrands(brandsData);
    } catch (err) {
      const error = err as Error;
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const getBrand = useCallback((id: BrandId): EnhancedBrandDetails | undefined => {
    return brands.find(brand => brand.id === id);
  }, [brands]);

  const createBrand = useCallback(async (data: CreateBrandForm): Promise<EnhancedBrandDetails> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newBrand = await brandService.createBrand(data);
      setBrands(prev => [...prev, newBrand]);
      return newBrand;
    } catch (err) {
      const error = err as Error;
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const updateBrand = useCallback(async (id: BrandId, data: Partial<CreateBrandForm>): Promise<EnhancedBrandDetails> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedBrand = await brandService.updateBrand(id, data);
      setBrands(prev => prev.map(brand => 
        brand.id === id ? updatedBrand : brand
      ));
      return updatedBrand;
    } catch (err) {
      const error = err as Error;
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const deleteBrand = useCallback(async (id: BrandId): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await brandService.deleteBrand(id);
      setBrands(prev => prev.filter(brand => brand.id !== id));
    } catch (err) {
      const error = err as Error;
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const refreshBrands = useCallback(async (): Promise<void> => {
    await loadBrands();
  }, [loadBrands]);

  // Memoize the return object to prevent unnecessary re-renders
  const returnValue = useMemo(() => ({
    brands,
    isLoading,
    error,
    getBrand,
    createBrand,
    updateBrand,
    deleteBrand,
    refreshBrands,
  }), [brands, isLoading, error, getBrand, createBrand, updateBrand, deleteBrand, refreshBrands]);

  return returnValue;
};