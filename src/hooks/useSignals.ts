import { useState, useCallback } from 'react';
import { MOCK_SIGNALS } from '../constants';
import { useRetry } from './useRetry';
import { useErrorHandler } from './useErrorHandler';
import type { 
  EnhancedSignal, 
  SignalId, 
  CreateSignalForm, 
  UpdateSignalForm,
  UseSignalsReturn 
} from '../types/enhanced';
import { createSignalId, now } from '../utils/typeUtils';

export const useSignals = (): UseSignalsReturn => {
  const [signals, setSignals] = useState<EnhancedSignal[]>(MOCK_SIGNALS);
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

  const createSignal = useCallback(async (signalData: CreateSignalForm): Promise<EnhancedSignal> => {
    setIsLoading(true);
    setError(null);
    
    const createSignalOperation = async (): Promise<EnhancedSignal> => {
      // Simulate API call with potential failure
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate random failures for testing
          if (Math.random() < 0.3) {
            reject(new Error('Network error: Failed to create signal'));
          } else {
            resolve(undefined);
          }
        }, 1000);
      });
      
      const newSignal: EnhancedSignal = {
        ...signalData,
        id: createSignalId(Date.now().toString()),
        status: 'pending',
        createdAt: now(),
        updatedAt: now(),
        tags: signalData.tags || [],
        metadata: {},
      };
      
      setSignals(prev => [...prev, newSignal]);
      return newSignal;
    };

    try {
      const result = await retry(createSignalOperation);
      return result;
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
      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() < 0.2) {
            reject(new Error('Server error: Failed to update signal'));
          } else {
            resolve(undefined);
          }
        }, 500);
      });
      
      const updatedSignal = signals.find(s => s.id === id);
      if (!updatedSignal) {
        throw new Error('Signal not found');
      }
      
      const newSignal: EnhancedSignal = {
        ...updatedSignal,
        ...updates,
        updatedAt: now(),
      };
      
      setSignals(prev => prev.map(signal => 
        signal.id === id ? newSignal : signal
      ));
      
      return newSignal;
    };

    try {
      const result = await retry(updateSignalOperation);
      return result;
    } catch (err) {
      const error = err as Error;
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [signals, retry, handleError]);

  const deleteSignal = useCallback(async (id: SignalId): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    const deleteSignalOperation = async (): Promise<void> => {
      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() < 0.15) {
            reject(new Error('Permission denied: Cannot delete signal'));
          } else {
            resolve(undefined);
          }
        }, 500);
      });
      
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
    setIsLoading(true);
    setError(null);
    
    const refreshOperation = async (): Promise<void> => {
      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() < 0.1) {
            reject(new Error('Network timeout: Failed to refresh signals'));
          } else {
            resolve(undefined);
          }
        }, 1000);
      });
      setSignals(MOCK_SIGNALS);
    };

    try {
      await retry(refreshOperation);
    } catch (err) {
      const error = err as Error;
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }, [retry, handleError]);

  const getSignal = useCallback((id: SignalId): EnhancedSignal | undefined => {
    return signals.find(signal => signal.id === id);
  }, [signals]);

  return {
    signals,
    isLoading,
    error,
    createSignal,
    updateSignal,
    deleteSignal,
    refreshSignals,
    getSignal,
  };
};
