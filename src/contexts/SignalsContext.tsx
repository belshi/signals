import React, { createContext, useContext, type ReactNode } from 'react';
import { useSignals } from '../hooks';
import type { UseSignalsReturn } from '../types/enhanced';

interface SignalsContextType extends UseSignalsReturn {}

const SignalsContext = createContext<SignalsContextType | undefined>(undefined);

interface SignalsProviderProps {
  children: ReactNode;
}

export const SignalsProvider: React.FC<SignalsProviderProps> = ({ children }) => {
  const signalsData = useSignals();

  return (
    <SignalsContext.Provider value={signalsData}>
      {children}
    </SignalsContext.Provider>
  );
};

export const useSignalsContext = (): SignalsContextType => {
  const context = useContext(SignalsContext);
  if (context === undefined) {
    throw new Error('useSignalsContext must be used within a SignalsProvider');
  }
  return context;
};
