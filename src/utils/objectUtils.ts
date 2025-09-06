/**
 * Object utility functions for common object operations
 */

/**
 * Deep clones an object
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as unknown as T;
  if (typeof obj === 'object') {
    const cloned = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }
  return obj;
};

/**
 * Deep merges two objects
 */
export const deepMergeObjects = <T extends Record<string, any>>(target: T, source: Partial<T>): T => {
  const result = { ...target };
  
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const sourceValue = source[key];
      const targetValue = result[key];
      
      if (isObjectValue(sourceValue) && isObjectValue(targetValue)) {
        result[key] = deepMergeObjects(targetValue, sourceValue as any);
      } else {
        result[key] = sourceValue as T[Extract<keyof T, string>];
      }
    }
  }
  
  return result;
};

/**
 * Checks if a value is an object
 */
export const isObjectValue = (value: any): value is Record<string, any> => {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
};

/**
 * Gets a nested property value using dot notation
 */
export const get = <T>(obj: any, path: string, defaultValue?: T): T | undefined => {
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result == null || typeof result !== 'object') {
      return defaultValue;
    }
    result = result[key];
  }
  
  return result !== undefined ? result : defaultValue;
};

/**
 * Sets a nested property value using dot notation
 */
export const set = (obj: any, path: string, value: any): any => {
  const keys = path.split('.');
  const result = { ...obj };
  let current = result;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current) || !isObjectValue(current[key])) {
      current[key] = {};
    }
    current = current[key];
  }
  
  current[keys[keys.length - 1]] = value;
  return result;
};

/**
 * Omits specified keys from an object
 */
export const omit = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> => {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
};

/**
 * Picks specified keys from an object
 */
export const pick = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
};

/**
 * Checks if an object has all specified keys
 */
export const hasAllKeys = (obj: any, keys: string[]): boolean => {
  return keys.every(key => key in obj);
};

/**
 * Checks if an object has any of the specified keys
 */
export const hasAnyKey = (obj: any, keys: string[]): boolean => {
  return keys.some(key => key in obj);
};

/**
 * Inverts an object (swaps keys and values)
 */
export const invert = <T extends Record<string, string>>(obj: T): Record<string, string> => {
  const result: Record<string, string> = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[obj[key]] = key;
    }
  }
  return result;
};

/**
 * Maps object values
 */
export const mapValues = <T, U>(
  obj: Record<string, T>,
  mapper: (value: T, key: string) => U
): Record<string, U> => {
  const result: Record<string, U> = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = mapper(obj[key], key);
    }
  }
  return result;
};

/**
 * Maps object keys
 */
export const mapKeys = <T>(
  obj: Record<string, T>,
  mapper: (key: string, value: T) => string
): Record<string, T> => {
  const result: Record<string, T> = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[mapper(key, obj[key])] = obj[key];
    }
  }
  return result;
};

/**
 * Filters object entries
 */
export const filterObject = <T>(
  obj: Record<string, T>,
  predicate: (value: T, key: string) => boolean
): Record<string, T> => {
  const result: Record<string, T> = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && predicate(obj[key], key)) {
      result[key] = obj[key];
    }
  }
  return result;
};

/**
 * Converts an object to an array of key-value pairs
 */
export const toPairs = <T>(obj: Record<string, T>): [string, T][] => {
  return Object.entries(obj);
};

/**
 * Converts an array of key-value pairs to an object
 */
export const fromPairs = <T>(pairs: [string, T][]): Record<string, T> => {
  const result: Record<string, T> = {};
  pairs.forEach(([key, value]) => {
    result[key] = value;
  });
  return result;
};

/**
 * Gets the size of an object (number of keys)
 */
export const objectSize = (obj: Record<string, any>): number => {
  return Object.keys(obj).length;
};

/**
 * Checks if an object is empty
 */
export const isEmpty = (obj: Record<string, any>): boolean => {
  return objectSize(obj) === 0;
};

/**
 * Creates an object from an array using a key selector
 */
export const keyBy = <T, K extends string | number>(
  array: T[],
  keySelector: (item: T) => K
): Record<K, T> => {
  const result = {} as Record<K, T>;
  array.forEach(item => {
    const key = keySelector(item);
    result[key] = item;
  });
  return result;
};

/**
 * Groups array items by a key and creates an object
 */
export const groupByToObject = <T, K extends string | number>(
  array: T[],
  keySelector: (item: T) => K
): Record<K, T[]> => {
  const result = {} as Record<K, T[]>;
  array.forEach(item => {
    const key = keySelector(item);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(item);
  });
  return result;
};
