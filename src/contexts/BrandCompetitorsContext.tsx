import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { brandCompetitorsService } from '../services/database';
import type { BrandCompetitor, CreateBrandCompetitorForm, UpdateBrandCompetitorForm, BrandId } from '../types/enhanced';
import { useErrorHandler } from '../hooks';

interface BrandCompetitorsContextType {
  competitors: BrandCompetitor[];
  isLoading: boolean;
  error: string | null;
  createCompetitor: (competitorData: CreateBrandCompetitorForm) => Promise<BrandCompetitor>;
  updateCompetitor: (id: number, updates: UpdateBrandCompetitorForm) => Promise<BrandCompetitor>;
  deleteCompetitor: (id: number) => Promise<void>;
  refreshCompetitors: (brandId: BrandId) => Promise<void>;
  clearError: () => void;
}

const BrandCompetitorsContext = createContext<BrandCompetitorsContextType | undefined>(undefined);

interface BrandCompetitorsProviderProps {
  children: ReactNode;
}

export const BrandCompetitorsProvider: React.FC<BrandCompetitorsProviderProps> = ({ children }) => {
  const [competitors, setCompetitors] = useState<BrandCompetitor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { handleError } = useErrorHandler();

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refreshCompetitors = useCallback(async (brandId: BrandId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const fetchedCompetitors = await brandCompetitorsService.getCompetitorsByBrandId(brandId);
      setCompetitors(fetchedCompetitors);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch brand competitors';
      setError(errorMessage);
      handleError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const createCompetitor = useCallback(async (competitorData: CreateBrandCompetitorForm): Promise<BrandCompetitor> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newCompetitor = await brandCompetitorsService.createCompetitor(competitorData);
      setCompetitors(prevCompetitors => [newCompetitor, ...prevCompetitors]);
      return newCompetitor;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create brand competitor';
      setError(errorMessage);
      handleError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const updateCompetitor = useCallback(async (id: number, updates: UpdateBrandCompetitorForm): Promise<BrandCompetitor> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedCompetitor = await brandCompetitorsService.updateCompetitor(id, updates);
      setCompetitors(prevCompetitors => 
        prevCompetitors.map(competitor => competitor.id === id ? updatedCompetitor : competitor)
      );
      return updatedCompetitor;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update brand competitor';
      setError(errorMessage);
      handleError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const deleteCompetitor = useCallback(async (id: number): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await brandCompetitorsService.deleteCompetitor(id);
      setCompetitors(prevCompetitors => prevCompetitors.filter(competitor => competitor.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete brand competitor';
      setError(errorMessage);
      handleError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const contextValue: BrandCompetitorsContextType = {
    competitors,
    isLoading,
    error,
    createCompetitor,
    updateCompetitor,
    deleteCompetitor,
    refreshCompetitors,
    clearError,
  };

  return (
    <BrandCompetitorsContext.Provider value={contextValue}>
      {children}
    </BrandCompetitorsContext.Provider>
  );
};

export const useBrandCompetitorsContext = (): BrandCompetitorsContextType => {
  const context = useContext(BrandCompetitorsContext);
  if (context === undefined) {
    throw new Error('useBrandCompetitorsContext must be used within a BrandCompetitorsProvider');
  }
  return context;
};
