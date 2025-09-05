import React, { createContext, useContext, type ReactNode } from 'react';
import { useBrand } from '../hooks';

interface BrandContextType {
  brandDetails: any; // Using any for now, can be typed properly later
  isLoading: boolean;
  error: string | null;
  refreshBrandDetails: () => Promise<void>;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

interface BrandProviderProps {
  children: ReactNode;
}

export const BrandProvider: React.FC<BrandProviderProps> = ({ children }) => {
  const brandData = useBrand();

  return (
    <BrandContext.Provider value={brandData}>
      {children}
    </BrandContext.Provider>
  );
};

export const useBrandContext = (): BrandContextType => {
  const context = useContext(BrandContext);
  if (context === undefined) {
    throw new Error('useBrandContext must be used within a BrandProvider');
  }
  return context;
};
