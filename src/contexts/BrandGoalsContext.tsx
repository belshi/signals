import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { brandGoalsService } from '../services/database';
import type { BrandGoal, CreateBrandGoalForm, UpdateBrandGoalForm, BrandId } from '../types/enhanced';
import { useErrorHandler } from '../hooks';

interface BrandGoalsContextType {
  goals: BrandGoal[];
  isLoading: boolean;
  error: string | null;
  createGoal: (goalData: CreateBrandGoalForm) => Promise<BrandGoal>;
  updateGoal: (id: number, updates: UpdateBrandGoalForm) => Promise<BrandGoal>;
  deleteGoal: (id: number) => Promise<void>;
  refreshGoals: (brandId: BrandId) => Promise<void>;
  clearError: () => void;
}

const BrandGoalsContext = createContext<BrandGoalsContextType | undefined>(undefined);

interface BrandGoalsProviderProps {
  children: ReactNode;
}

export const BrandGoalsProvider: React.FC<BrandGoalsProviderProps> = ({ children }) => {
  const [goals, setGoals] = useState<BrandGoal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { handleError } = useErrorHandler();

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refreshGoals = useCallback(async (brandId: BrandId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const fetchedGoals = await brandGoalsService.getGoalsByBrandId(brandId);
      setGoals(fetchedGoals);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch brand goals';
      setError(errorMessage);
      handleError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const createGoal = useCallback(async (goalData: CreateBrandGoalForm): Promise<BrandGoal> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newGoal = await brandGoalsService.createGoal(goalData);
      setGoals(prevGoals => [newGoal, ...prevGoals]);
      return newGoal;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create brand goal';
      setError(errorMessage);
      handleError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const updateGoal = useCallback(async (id: number, updates: UpdateBrandGoalForm): Promise<BrandGoal> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedGoal = await brandGoalsService.updateGoal(id, updates);
      setGoals(prevGoals => 
        prevGoals.map(goal => goal.id === id ? updatedGoal : goal)
      );
      return updatedGoal;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update brand goal';
      setError(errorMessage);
      handleError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const deleteGoal = useCallback(async (id: number): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await brandGoalsService.deleteGoal(id);
      setGoals(prevGoals => prevGoals.filter(goal => goal.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete brand goal';
      setError(errorMessage);
      handleError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const contextValue: BrandGoalsContextType = {
    goals,
    isLoading,
    error,
    createGoal,
    updateGoal,
    deleteGoal,
    refreshGoals,
    clearError,
  };

  return (
    <BrandGoalsContext.Provider value={contextValue}>
      {children}
    </BrandGoalsContext.Provider>
  );
};

export const useBrandGoalsContext = (): BrandGoalsContextType => {
  const context = useContext(BrandGoalsContext);
  if (context === undefined) {
    throw new Error('useBrandGoalsContext must be used within a BrandGoalsProvider');
  }
  return context;
};
