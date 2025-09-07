import React, { createContext, useContext, type ReactNode } from 'react';
import { useBrands } from '../hooks';
import type { UseBrandsReturn } from '../types/enhanced';

const BrandsContext = createContext<UseBrandsReturn | undefined>(undefined);

interface BrandsProviderProps {
  children: ReactNode;
}

export const BrandsProvider: React.FC<BrandsProviderProps> = ({ children }) => {
  const brandsData = useBrands();

  return (
    <BrandsContext.Provider value={brandsData}>
      {children}
    </BrandsContext.Provider>
  );
};

export const useBrandsContext = (): UseBrandsReturn => {
  const context = useContext(BrandsContext);
  if (context === undefined) {
    throw new Error('useBrandsContext must be used within a BrandsProvider');
  }
  return context;
};
