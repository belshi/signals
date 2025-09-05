import { useState, useCallback } from 'react';
import { MOCK_SIGNALS } from '../constants';
import type { Signal } from '../types';

export const useSignals = () => {
  const [signals, setSignals] = useState<Signal[]>(MOCK_SIGNALS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSignal = useCallback(async (signalData: Omit<Signal, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newSignal: Signal = {
        ...signalData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
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

  const updateSignal = useCallback(async (id: string, updates: Partial<Signal>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSignals(prev => prev.map(signal => 
        signal.id === id 
          ? { ...signal, ...updates, updatedAt: new Date().toISOString().split('T')[0] }
          : signal
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update signal');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteSignal = useCallback(async (id: string) => {
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

  const refreshSignals = useCallback(async () => {
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

  return {
    signals,
    isLoading,
    error,
    createSignal,
    updateSignal,
    deleteSignal,
    refreshSignals,
  };
};
