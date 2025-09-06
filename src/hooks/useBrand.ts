import { useState, useCallback } from 'react';
import { MOCK_BRAND_DETAILS } from '../constants';
import type { EnhancedBrandDetails } from '../types/enhanced';

export const useBrand = () => {
  const [brandDetails, setBrandDetails] = useState<EnhancedBrandDetails>(MOCK_BRAND_DETAILS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateBrandDetails = useCallback(async (updates: Partial<EnhancedBrandDetails>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setBrandDetails(prev => ({ ...prev, ...updates }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update brand details');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshBrandDetails = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setBrandDetails(MOCK_BRAND_DETAILS);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh brand details');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    brandDetails,
    isLoading,
    error,
    updateBrandDetails,
    refreshBrandDetails,
  };
};
