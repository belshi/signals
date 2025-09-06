/**
 * String utility functions for common string operations
 */

/**
 * Capitalizes the first letter of a string
 */
export const capitalize = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Converts a string to title case (capitalizes each word)
 */
export const toTitleCase = (str: string): string => {
  if (!str) return str;
  return str
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
};

/**
 * Converts a string to kebab-case
 */
export const toKebabCase = (str: string): string => {
  if (!str) return str;
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
};

/**
 * Converts a string to camelCase
 */
export const toCamelCase = (str: string): string => {
  if (!str) return str;
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
};

/**
 * Converts a string to snake_case
 */
export const toSnakeCase = (str: string): string => {
  if (!str) return str;
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase();
};

/**
 * Truncates a string to a specified length and adds ellipsis
 */
export const truncate = (str: string, length: number, suffix: string = '...'): string => {
  if (!str || str.length <= length) return str;
  return str.slice(0, length) + suffix;
};

/**
 * Removes extra whitespace and normalizes spaces
 */
export const normalizeWhitespace = (str: string): string => {
  if (!str) return str;
  return str.replace(/\s+/g, ' ').trim();
};

/**
 * Generates a random string of specified length
 */
export const generateRandomString = (length: number = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Checks if a string is a valid email (simple version)
 */
export const isValidEmailString = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Checks if a string is a valid URL (simple version)
 */
export const isValidUrlString = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Extracts initials from a name
 */
export const getInitials = (name: string, maxInitials: number = 2): string => {
  if (!name) return '';
  return name
    .split(' ')
    .slice(0, maxInitials)
    .map(word => word.charAt(0).toUpperCase())
    .join('');
};

/**
 * Masks sensitive information (e.g., email, phone)
 */
export const maskSensitive = (str: string, visibleChars: number = 2): string => {
  if (!str || str.length <= visibleChars * 2) return str;
  const start = str.slice(0, visibleChars);
  const end = str.slice(-visibleChars);
  const middle = '*'.repeat(str.length - visibleChars * 2);
  return start + middle + end;
};

/**
 * Formats a string as a slug (URL-friendly)
 */
export const slugify = (str: string): string => {
  if (!str) return str;
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Pluralizes a word based on count
 */
export const pluralize = (word: string, count: number, plural?: string): string => {
  if (count === 1) return word;
  return plural || word + 's';
};

/**
 * Formats a number with commas (simple version)
 */
export const formatNumberSimple = (num: number): string => {
  return num.toLocaleString();
};

/**
 * Formats a string as currency (simple version)
 */
export const formatCurrencySimple = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};
