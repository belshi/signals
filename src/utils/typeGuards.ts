import type { 
  SignalStatus, 
  SignalType, 
  BrandGoalStatus, 
  CompetitorStrength,
  ButtonVariant,
  LoadingSize,
  ErrorVariant,
  ISODateString,
  DateString
} from '../types/enhanced';

// Type guards for union types
export const isSignalStatus = (value: unknown): value is SignalStatus => {
  return typeof value === 'string' && ['active', 'inactive', 'pending'].includes(value);
};

export const isSignalType = (value: unknown): value is SignalType => {
  return typeof value === 'string' && ['Analytics', 'Social', 'Competitive', 'Market', 'Financial'].includes(value);
};

export const isBrandGoalStatus = (value: unknown): value is BrandGoalStatus => {
  return typeof value === 'string' && ['not-started', 'in-progress', 'completed'].includes(value);
};

export const isCompetitorStrength = (value: unknown): value is CompetitorStrength => {
  return typeof value === 'string' && ['low', 'medium', 'high'].includes(value);
};

export const isButtonVariant = (value: unknown): value is ButtonVariant => {
  return typeof value === 'string' && ['primary', 'secondary', 'danger'].includes(value);
};

export const isLoadingSize = (value: unknown): value is LoadingSize => {
  return typeof value === 'string' && ['sm', 'md', 'lg'].includes(value);
};

export const isErrorVariant = (value: unknown): value is ErrorVariant => {
  return typeof value === 'string' && ['error', 'warning', 'info'].includes(value);
};

// Type guards for branded types
export const isISODateString = (value: unknown): value is ISODateString => {
  if (typeof value !== 'string') return false;
  const date = new Date(value);
  return !isNaN(date.getTime()) && value === date.toISOString();
};

export const isDateString = (value: unknown): value is DateString => {
  if (typeof value !== 'string') return false;
  const date = new Date(value);
  return !isNaN(date.getTime());
};

// Type guards for objects
export const hasProperty = <T extends object, K extends PropertyKey>(
  obj: T,
  prop: K
): obj is T & Record<K, unknown> => {
  return prop in obj;
};

export const isNonNullable = <T>(value: T): value is NonNullable<T> => {
  return value !== null && value !== undefined;
};

export const isString = (value: unknown): value is string => {
  return typeof value === 'string';
};

export const isNumber = (value: unknown): value is number => {
  return typeof value === 'number' && !isNaN(value);
};

export const isBoolean = (value: unknown): value is boolean => {
  return typeof value === 'boolean';
};

export const isArray = <T>(value: unknown): value is T[] => {
  return Array.isArray(value);
};

export const isObject = (value: unknown): value is Record<string, unknown> => {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
};

// Type guards for API responses
export const isApiError = (value: unknown): value is { code: string; message: string } => {
  return isObject(value) && 
         isString(value.code) && 
         isString(value.message);
};

// Type guards for form validation
export const isValidEmail = (value: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

export const isValidUrl = (value: string): boolean => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

export const isValidPhoneNumber = (value: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(value.replace(/\s/g, ''));
};

// Type guards for date validation
export const isFutureDate = (date: Date): boolean => {
  return date > new Date();
};

export const isPastDate = (date: Date): boolean => {
  return date < new Date();
};

export const isValidDateRange = (startDate: Date, endDate: Date): boolean => {
  return startDate <= endDate;
};

// Type guards for number validation
export const isPositiveNumber = (value: number): boolean => {
  return value > 0;
};

export const isNonNegativeNumber = (value: number): boolean => {
  return value >= 0;
};

export const isInteger = (value: number): boolean => {
  return Number.isInteger(value);
};

export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

// Type guards for string validation
export const isNonEmptyString = (value: string): boolean => {
  return value.trim().length > 0;
};

export const hasMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength;
};

export const hasMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength;
};

export const matchesPattern = (value: string, pattern: RegExp): boolean => {
  return pattern.test(value);
};
