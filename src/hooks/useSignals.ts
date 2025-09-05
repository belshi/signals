import { useState, useCallback } from 'react';
import { MOCK_SIGNALS } from '../constants';
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

  const createSignal = useCallback(async (signalData: CreateSignalForm): Promise<EnhancedSignal> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create signal');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateSignal = useCallback(async (id: SignalId, updates: UpdateSignalForm): Promise<EnhancedSignal> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update signal');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [signals]);

  const deleteSignal = useCallback(async (id: SignalId): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSignals(prev => prev.filter(signal => signal.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete signal');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshSignals = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSignals(MOCK_SIGNALS);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh signals');
    } finally {
      setIsLoading(false);
    }
  }, []);

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
