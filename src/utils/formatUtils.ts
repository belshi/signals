/**
 * Formatting utility functions for common formatting operations
 */

/**
 * Formats a number with commas
 */
export const formatNumber = (num: number, locale: string = 'en-US'): string => {
  return new Intl.NumberFormat(locale).format(num);
};

/**
 * Formats a number as currency
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Formats a number as a percentage
 */
export const formatPercentage = (
  value: number,
  decimals: number = 2,
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
};

/**
 * Formats a number with a specific number of decimal places
 */
export const formatDecimal = (
  num: number,
  decimals: number = 2,
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

/**
 * Formats a number with appropriate units (K, M, B, T)
 */
export const formatCompactNumber = (num: number, locale: string = 'en-US'): string => {
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(num);
};

/**
 * Formats a file size in bytes to human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Formats a duration in milliseconds to human-readable format
 */
export const formatDuration = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days}d ${hours % 24}h ${minutes % 60}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
};

/**
 * Formats a phone number
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  return phoneNumber;
};

/**
 * Formats a credit card number with spaces
 */
export const formatCreditCard = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\D/g, '');
  const groups = cleaned.match(/.{1,4}/g) || [];
  return groups.join(' ');
};

/**
 * Formats a social security number
 */
export const formatSSN = (ssn: string): string => {
  const cleaned = ssn.replace(/\D/g, '');
  if (cleaned.length === 9) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 5)}-${cleaned.slice(5)}`;
  }
  return ssn;
};

/**
 * Formats a name with proper capitalization
 */
export const formatName = (name: string): string => {
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Formats an address
 */
export const formatAddress = (address: {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}): string => {
  const parts = [
    address.street,
    address.city,
    address.state,
    address.zipCode,
    address.country,
  ].filter(Boolean);
  
  return parts.join(', ');
};

/**
 * Formats a list of items with proper punctuation
 */
export const formatList = (items: string[], conjunction: string = 'and'): string => {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;
  
  const lastItem = items[items.length - 1];
  const otherItems = items.slice(0, -1);
  
  return `${otherItems.join(', ')}, ${conjunction} ${lastItem}`;
};

/**
 * Formats a range of numbers
 */
export const formatRange = (start: number, end: number): string => {
  if (start === end) return start.toString();
  return `${start} - ${end}`;
};

/**
 * Formats a date range
 */
export const formatDateRange = (startDate: Date, endDate: Date): string => {
  const start = startDate.toLocaleDateString();
  const end = endDate.toLocaleDateString();
  
  if (start === end) return start;
  return `${start} - ${end}`;
};

/**
 * Formats a time range
 */
export const formatTimeRange = (startTime: Date, endTime: Date): string => {
  const start = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const end = endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  return `${start} - ${end}`;
};

/**
 * Formats a boolean value as text
 */
export const formatBoolean = (value: boolean, trueText: string = 'Yes', falseText: string = 'No'): string => {
  return value ? trueText : falseText;
};

/**
 * Formats a value with a unit
 */
export const formatWithUnit = (value: number, unit: string): string => {
  return `${value} ${unit}`;
};

/**
 * Formats a value with a prefix
 */
export const formatWithPrefix = (value: string, prefix: string): string => {
  return `${prefix}${value}`;
};

/**
 * Formats a value with a suffix
 */
export const formatWithSuffix = (value: string, suffix: string): string => {
  return `${value}${suffix}`;
};

/**
 * Formats a value with both prefix and suffix
 */
export const formatWithPrefixAndSuffix = (value: string, prefix: string, suffix: string): string => {
  return `${prefix}${value}${suffix}`;
};

/**
 * Formats a value with a mask (e.g., for sensitive data)
 */
export const formatWithMask = (value: string, mask: string = '*', visibleChars: number = 2): string => {
  if (value.length <= visibleChars * 2) return value;
  
  const start = value.slice(0, visibleChars);
  const end = value.slice(-visibleChars);
  const middle = mask.repeat(value.length - visibleChars * 2);
  
  return start + middle + end;
};

/**
 * Formats a value with a placeholder if empty
 */
export const formatWithPlaceholder = (value: string, placeholder: string = 'N/A'): string => {
  return value || placeholder;
};
