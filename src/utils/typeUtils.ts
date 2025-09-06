import type { 
  SignalId, 
  BrandId, 
  UserId, 
  ISODateString, 
  DateString,
  DeepPartial
} from '../types/enhanced';

// Branded type constructors
export const createSignalId = (id: string): SignalId => id as SignalId;
export const createBrandId = (id: string): BrandId => id as BrandId;
export const createUserId = (id: string): UserId => id as UserId;

// Date utilities with type safety
export const createISODateString = (date: Date | string): ISODateString => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toISOString() as ISODateString;
};

export const createDateString = (date: Date | string): DateString => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toISOString().split('T')[0] as DateString;
};

export const now = (): ISODateString => createISODateString(new Date());

export const today = (): DateString => createDateString(new Date());

// Type-safe object manipulation
export const pick = <T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
};

export const omit = <T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
  const result = { ...obj };
  keys.forEach(key => {
    delete result[key];
  });
  return result;
};

export const deepMerge = <T extends Record<string, any>>(target: T, source: DeepPartial<T>): T => {
  const result = { ...target };
  
  for (const key in source) {
    if (source[key] !== undefined) {
      if (isObject(result[key]) && isObject(source[key])) {
        result[key] = deepMerge(result[key], source[key] as DeepPartial<T[Extract<keyof T, string>]>);
      } else {
        result[key] = source[key] as T[Extract<keyof T, string>];
      }
    }
  }
  
  return result;
};

// Note: Array operations (groupBy, sortBy, uniqueBy, chunk) are available from arrayUtils.ts

// Type-safe validation
export const validateRequired = <T>(value: T | null | undefined, fieldName: string): T => {
  if (value === null || value === undefined) {
    throw new Error(`${fieldName} is required`);
  }
  return value;
};

export const validateType = <T>(value: unknown, typeGuard: (val: unknown) => val is T, fieldName: string): T => {
  if (!typeGuard(value)) {
    throw new Error(`${fieldName} has invalid type`);
  }
  return value;
};

// Type-safe error handling
export const safeParse = <T>(parser: () => T, fallback: T): T => {
  try {
    return parser();
  } catch {
    return fallback;
  }
};

export const safeAsync = async <T>(asyncFn: () => Promise<T>, fallback: T): Promise<T> => {
  try {
    return await asyncFn();
  } catch {
    return fallback;
  }
};

// Type-safe conditional operations
export const when = <T>(condition: boolean, value: T): T | undefined => {
  return condition ? value : undefined;
};

export const unless = <T>(condition: boolean, value: T): T | undefined => {
  return condition ? undefined : value;
};

export const defaultTo = <T>(value: T | null | undefined, defaultValue: T): T => {
  return value ?? defaultValue;
};

// Type-safe function composition
export const pipe = <T>(value: T, ...fns: Array<(val: T) => T>): T => {
  return fns.reduce((acc, fn) => fn(acc), value);
};

export const compose = <T>(...fns: Array<(val: T) => T>) => (value: T): T => {
  return fns.reduceRight((acc, fn) => fn(acc), value);
};

// Type-safe memoization
export const memoize = <T extends (...args: any[]) => any>(fn: T): T => {
  const cache = new Map();
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

// Type-safe debouncing
export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: number;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => fn(...args), delay);
  };
};

// Type-safe throttling
export const throttle = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    }
  };
};

// Helper function for object checking
const isObject = (value: unknown): value is Record<string, unknown> => {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
};

// Type-safe environment variables (browser-safe)
export const getEnvVar = (key: string, defaultValue?: string): string => {
  // In browser environment, we can't access process.env directly
  // This would typically be handled by build tools like Vite
  if (defaultValue !== undefined) {
    return defaultValue;
  }
  throw new Error(`Environment variable ${key} is not defined`);
};

export const getRequiredEnvVar = (key: string): string => {
  return getEnvVar(key);
};

// Type-safe URL construction
export const buildUrl = (baseUrl: string, path: string, params?: Record<string, string | number>): string => {
  const url = new URL(path, baseUrl);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, String(value));
    });
  }
  return url.toString();
};

// Type-safe localStorage operations
export const safeGetItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const safeSetItem = <T>(key: string, value: T): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

export const safeRemoveItem = (key: string): boolean => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
};
