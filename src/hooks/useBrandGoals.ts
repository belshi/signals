import { useEffect, useCallback } from 'react';
import { useBrandGoalsContext } from '../contexts';
import type { BrandId, CreateBrandGoalForm, UpdateBrandGoalForm } from '../types/enhanced';

interface UseBrandGoalsOptions {
  brandId?: BrandId;
  autoFetch?: boolean;
}

interface UseBrandGoalsReturn {
  goals: any[];
  isLoading: boolean;
  error: string | null;
  createGoal: (goalData: CreateBrandGoalForm) => Promise<any>;
  updateGoal: (id: number, updates: UpdateBrandGoalForm) => Promise<any>;
  deleteGoal: (id: number) => Promise<void>;
  refreshGoals: () => Promise<void>;
  clearError: () => void;
}

export const useBrandGoals = ({ 
  brandId, 
  autoFetch = true 
}: UseBrandGoalsOptions = {}): UseBrandGoalsReturn => {
  const {
    goals,
    isLoading,
    error,
    createGoal: contextCreateGoal,
    updateGoal: contextUpdateGoal,
    deleteGoal: contextDeleteGoal,
    refreshGoals: contextRefreshGoals,
    clearError,
  } = useBrandGoalsContext();

  const refreshGoals = useCallback(async () => {
    if (brandId) {
      await contextRefreshGoals(brandId);
    }
  }, [brandId, contextRefreshGoals]);

  // Auto-fetch goals when brandId changes
  useEffect(() => {
    if (autoFetch && brandId) {
      refreshGoals();
    }
  }, [autoFetch, brandId, refreshGoals]);

  const createGoal = useCallback(async (goalData: CreateBrandGoalForm) => {
    if (!brandId) {
      throw new Error('Brand ID is required to create a goal');
    }
    
    const goalDataWithBrandId = {
      ...goalData,
      brand_id: brandId,
    };
    
    return await contextCreateGoal(goalDataWithBrandId);
  }, [brandId, contextCreateGoal]);

  const updateGoal = useCallback(async (id: number, updates: UpdateBrandGoalForm) => {
    return await contextUpdateGoal(id, updates);
  }, [contextUpdateGoal]);

  const deleteGoal = useCallback(async (id: number) => {
    return await contextDeleteGoal(id);
  }, [contextDeleteGoal]);

  return {
    goals,
    isLoading,
    error,
    createGoal,
    updateGoal,
    deleteGoal,
    refreshGoals,
    clearError,
  };
};
