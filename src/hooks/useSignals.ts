import { useState, useCallback, useEffect, useMemo } from 'react';
import { signalService } from '../services/database';
import { useRetry } from './useRetry';
import { useErrorHandler } from './useErrorHandler';
import type { 
  EnhancedSignal, 
  SignalId, 
  CreateSignalForm,
  UpdateSignalForm,
  UseSignalsReturn 
} from '../types/enhanced';

export const useSignals = (): UseSignalsReturn => {
  const [signals, setSignals] = useState<EnhancedSignal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { retry } = useRetry({
    maxRetries: 3,
    initialDelay: 1000,
    onRetry: (attempt, error) => {
      console.log(`Retrying signal operation (attempt ${attempt}):`, error.message);
    },
    onMaxRetriesReached: (error) => {
      console.error('Max retries reached for signal operation:', error);
    },
  });

  const { handleError } = useErrorHandler({
    onError: (error) => {
      setError(error.message);
    },
  });

  // Load signals on mount
  useEffect(() => {
    loadSignals();
  }, []);

  const loadSignals = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const signalsData = await signalService.getAllSignals();
      setSignals(signalsData);
    } catch (err) {
      const error = err as Error;
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const createSignal = useCallback(async (data: CreateSignalForm): Promise<EnhancedSignal> => {
    setIsLoading(true);
    setError(null);
    
    const createSignalOperation = async (): Promise<EnhancedSignal> => {
      const newSignal = await signalService.createSignal(data);
      setSignals(prev => [...prev, newSignal]);
      return newSignal;
    };

    try {
      return await retry(createSignalOperation);
    } catch (err) {
      const error = err as Error;
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [retry, handleError]);

  const createSignalWithAI = useCallback(async (
    data: CreateSignalForm,
    brandDetails: { name: string; industry: string; description: string },
    onProgress?: (message: string) => void
  ): Promise<EnhancedSignal> => {
    setIsLoading(true);
    setError(null);
    
    const createSignalWithAIOperation = async (): Promise<EnhancedSignal> => {
      const newSignal = await signalService.createSignalWithAI(data, brandDetails, onProgress);
      setSignals(prev => [...prev, newSignal]);
      return newSignal;
    };

    try {
      return await retry(createSignalWithAIOperation);
    } catch (err) {
      const error = err as Error;
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [retry, handleError]);

  const updateSignal = useCallback(async (id: SignalId, updates: UpdateSignalForm): Promise<EnhancedSignal> => {
    setIsLoading(true);
    setError(null);
    
    const updateSignalOperation = async (): Promise<EnhancedSignal> => {
      const updatedSignal = await signalService.updateSignal(id, updates);
      setSignals(prev => prev.map(signal => 
        signal.id === id ? updatedSignal : signal
      ));
      return updatedSignal;
    };

    try {
      return await retry(updateSignalOperation);
    } catch (err) {
      const error = err as Error;
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [retry, handleError]);

  const deleteSignal = useCallback(async (id: SignalId): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    const deleteSignalOperation = async (): Promise<void> => {
      await signalService.deleteSignal(id);
      setSignals(prev => prev.filter(signal => signal.id !== id));
    };

    try {
      await retry(deleteSignalOperation);
    } catch (err) {
      const error = err as Error;
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [retry, handleError]);

  const refreshSignals = useCallback(async (): Promise<void> => {
    await loadSignals();
  }, [loadSignals]);

  const refreshSignalInsights = useCallback(async (
    signalId: SignalId,
    brandDetails: { name: string; industry: string; description: string },
    onProgress?: (message: string) => void
  ): Promise<EnhancedSignal> => {
    setIsLoading(true);
    setError(null);
    
    const refreshInsightsOperation = async (): Promise<EnhancedSignal> => {
      const updatedSignal = await signalService.refreshSignalInsights(signalId, brandDetails, onProgress);
      setSignals(prev => prev.map(signal => 
        signal.id === signalId ? updatedSignal : signal
      ));
      return updatedSignal;
    };

    try {
      return await retry(refreshInsightsOperation);
    } catch (err) {
      const error = err as Error;
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [retry, handleError]);

  const refreshRecommendations = useCallback(async (
    signalId: SignalId,
    brandDetails: { name: string; industry: string; description: string },
    onProgress?: (message: string) => void
  ): Promise<EnhancedSignal> => {
    setIsLoading(true);
    setError(null);
    
    const refreshRecommendationsOperation = async (): Promise<EnhancedSignal> => {
      const updatedSignal = await signalService.refreshRecommendations(signalId, brandDetails, onProgress);
      setSignals(prev => prev.map(signal => 
        signal.id === signalId ? updatedSignal : signal
      ));
      return updatedSignal;
    };

    try {
      return await retry(refreshRecommendationsOperation);
    } catch (err) {
      const error = err as Error;
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [retry, handleError]);

  const getSignal = useCallback((id: SignalId): EnhancedSignal | undefined => {
    return signals.find(signal => signal.id === id);
  }, [signals]);

  // Memoize the return object to prevent unnecessary re-renders
  const returnValue = useMemo(() => ({
    signals,
    isLoading,
    error,
    createSignal,
    createSignalWithAI,
    updateSignal,
    deleteSignal,
    refreshSignals,
    refreshSignalInsights,
    refreshRecommendations,
    getSignal,
  }), [signals, isLoading, error, createSignal, createSignalWithAI, updateSignal, deleteSignal, refreshSignals, refreshSignalInsights, refreshRecommendations, getSignal]);

  return returnValue;
};