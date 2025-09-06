import type { 
  SignalId, 
  BrandId, 
  ISODateString
} from '../types/enhanced';

// Branded type constructors - ONLY USED FUNCTIONS
export const createSignalId = (id: string): SignalId => id as SignalId;
export const createBrandId = (id: string): BrandId => id as BrandId;

// Date utilities with type safety - ONLY USED FUNCTIONS
export const createISODateString = (date: Date | string): ISODateString => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toISOString() as ISODateString;
};

export const now = (): ISODateString => createISODateString(new Date());