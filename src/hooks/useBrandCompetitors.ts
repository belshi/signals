import { useCallback, useEffect } from 'react';
import { useBrandCompetitorsContext } from '../contexts/BrandCompetitorsContext';
import type { BrandCompetitor, CreateBrandCompetitorForm, UpdateBrandCompetitorForm, BrandId } from '../types/enhanced';

interface UseBrandCompetitorsOptions {
  brandId?: BrandId;
  autoFetch?: boolean;
}

interface UseBrandCompetitorsReturn {
  competitors: BrandCompetitor[];
  isLoading: boolean;
  error: string | null;
  createCompetitor: (competitorData: CreateBrandCompetitorForm) => Promise<BrandCompetitor>;
  updateCompetitor: (id: number, updates: UpdateBrandCompetitorForm) => Promise<BrandCompetitor>;
  deleteCompetitor: (id: number) => Promise<void>;
  refreshCompetitors: () => Promise<void>;
  clearError: () => void;
}

export const useBrandCompetitors = ({ 
  brandId, 
  autoFetch = true 
}: UseBrandCompetitorsOptions = {}): UseBrandCompetitorsReturn => {
  const {
    competitors,
    isLoading,
    error,
    createCompetitor: contextCreateCompetitor,
    updateCompetitor: contextUpdateCompetitor,
    deleteCompetitor: contextDeleteCompetitor,
    refreshCompetitors: contextRefreshCompetitors,
    clearError,
  } = useBrandCompetitorsContext();

  const refreshCompetitors = useCallback(async () => {
    if (brandId) {
      await contextRefreshCompetitors(brandId);
    }
  }, [brandId, contextRefreshCompetitors]);

  // Auto-fetch competitors when brandId changes
  useEffect(() => {
    if (autoFetch && brandId) {
      refreshCompetitors();
    }
  }, [autoFetch, brandId, refreshCompetitors]);

  const createCompetitor = useCallback(async (competitorData: CreateBrandCompetitorForm) => {
    if (!brandId) {
      throw new Error('Brand ID is required to create a competitor');
    }
    
    const competitorDataWithBrandId = {
      ...competitorData,
      brand_id: brandId,
    };
    
    return await contextCreateCompetitor(competitorDataWithBrandId);
  }, [brandId, contextCreateCompetitor]);

  const updateCompetitor = useCallback(async (id: number, updates: UpdateBrandCompetitorForm) => {
    return await contextUpdateCompetitor(id, updates);
  }, [contextUpdateCompetitor]);

  const deleteCompetitor = useCallback(async (id: number) => {
    return await contextDeleteCompetitor(id);
  }, [contextDeleteCompetitor]);

  return {
    competitors,
    isLoading,
    error,
    createCompetitor,
    updateCompetitor,
    deleteCompetitor,
    refreshCompetitors,
    clearError,
  };
};
