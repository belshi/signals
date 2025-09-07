import { useState, useCallback } from 'react';
import { MOCK_BRANDS } from '../constants';
import type { EnhancedBrandDetails, BrandId, CreateBrandForm, UseBrandsReturn } from '../types/enhanced';
import { createBrandId, createISODateString } from '../utils/typeUtils';

export const useBrands = (): UseBrandsReturn => {
  const [brands, setBrands] = useState<EnhancedBrandDetails[]>(MOCK_BRANDS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getBrand = useCallback((id: BrandId): EnhancedBrandDetails | undefined => {
    return brands.find(brand => brand.id === id);
  }, [brands]);

  const createBrand = useCallback(async (data: CreateBrandForm): Promise<EnhancedBrandDetails> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newBrand: EnhancedBrandDetails = {
        id: createBrandId(`brand-${Date.now()}`),
        name: data.name,
        description: data.description,
        website: data.website,
        industry: data.industry,
        foundedYear: data.foundedYear,
        employeeCount: data.employeeCount,
        createdAt: createISODateString(new Date().toISOString()),
        updatedAt: createISODateString(new Date().toISOString()),
      };
      
      setBrands(prev => [...prev, newBrand]);
      return newBrand;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create brand';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateBrand = useCallback(async (id: BrandId, data: Partial<CreateBrandForm>): Promise<EnhancedBrandDetails> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedBrand = brands.find(brand => brand.id === id);
      if (!updatedBrand) {
        throw new Error('Brand not found');
      }
      
      const updated = {
        ...updatedBrand,
        ...data,
        updatedAt: createISODateString(new Date().toISOString()),
      };
      
      setBrands(prev => prev.map(brand => brand.id === id ? updated : brand));
      return updated;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update brand';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [brands]);

  const deleteBrand = useCallback(async (id: BrandId): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setBrands(prev => prev.filter(brand => brand.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete brand';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshBrands = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setBrands(MOCK_BRANDS);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh brands');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    brands,
    isLoading,
    error,
    getBrand,
    createBrand,
    updateBrand,
    deleteBrand,
    refreshBrands,
  };
};
