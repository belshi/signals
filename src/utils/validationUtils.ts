/**
 * Validation utility functions for common validation operations
 */

/**
 * Validation result type
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates that a value is not null or undefined
 */
export const isRequired = (value: any, fieldName: string = 'Field'): ValidationResult => {
  const isValid = value != null && value !== '';
  return {
    isValid,
    errors: isValid ? [] : [`${fieldName} is required`],
  };
};

/**
 * Validates that a string has a minimum length
 */
export const minLength = (value: string, min: number, fieldName: string = 'Field'): ValidationResult => {
  const isValid = value.length >= min;
  return {
    isValid,
    errors: isValid ? [] : [`${fieldName} must be at least ${min} characters long`],
  };
};

/**
 * Validates that a string has a maximum length
 */
export const maxLength = (value: string, max: number, fieldName: string = 'Field'): ValidationResult => {
  const isValid = value.length <= max;
  return {
    isValid,
    errors: isValid ? [] : [`${fieldName} must be no more than ${max} characters long`],
  };
};

/**
 * Validates that a number is within a range
 */
export const inRange = (value: number, min: number, max: number, fieldName: string = 'Field'): ValidationResult => {
  const isValid = value >= min && value <= max;
  return {
    isValid,
    errors: isValid ? [] : [`${fieldName} must be between ${min} and ${max}`],
  };
};

/**
 * Validates an email address
 */
export const isValidEmail = (email: string, fieldName: string = 'Email'): ValidationResult => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(email);
  return {
    isValid,
    errors: isValid ? [] : [`${fieldName} must be a valid email address`],
  };
};

/**
 * Validates a URL
 */
export const isValidUrl = (url: string, fieldName: string = 'URL'): ValidationResult => {
  try {
    new URL(url);
    return { isValid: true, errors: [] };
  } catch {
    return {
      isValid: false,
      errors: [`${fieldName} must be a valid URL`],
    };
  }
};

/**
 * Validates that a value matches a regular expression
 */
export const matchesPattern = (value: string, pattern: RegExp, message: string): ValidationResult => {
  const isValid = pattern.test(value);
  return {
    isValid,
    errors: isValid ? [] : [message],
  };
};

/**
 * Validates that a value is one of the allowed values
 */
export const isOneOf = <T>(value: T, allowedValues: T[], fieldName: string = 'Field'): ValidationResult => {
  const isValid = allowedValues.includes(value);
  return {
    isValid,
    errors: isValid ? [] : [`${fieldName} must be one of: ${allowedValues.join(', ')}`],
  };
};

/**
 * Validates that a value is not one of the forbidden values
 */
export const isNotOneOf = <T>(value: T, forbiddenValues: T[], fieldName: string = 'Field'): ValidationResult => {
  const isValid = !forbiddenValues.includes(value);
  return {
    isValid,
    errors: isValid ? [] : [`${fieldName} cannot be one of: ${forbiddenValues.join(', ')}`],
  };
};

/**
 * Validates that a string contains only alphanumeric characters
 */
export const isAlphanumeric = (value: string, fieldName: string = 'Field'): ValidationResult => {
  const isValid = /^[a-zA-Z0-9]+$/.test(value);
  return {
    isValid,
    errors: isValid ? [] : [`${fieldName} must contain only letters and numbers`],
  };
};

/**
 * Validates that a string contains only letters
 */
export const isAlpha = (value: string, fieldName: string = 'Field'): ValidationResult => {
  const isValid = /^[a-zA-Z]+$/.test(value);
  return {
    isValid,
    errors: isValid ? [] : [`${fieldName} must contain only letters`],
  };
};

/**
 * Validates that a string contains only numbers
 */
export const isNumeric = (value: string, fieldName: string = 'Field'): ValidationResult => {
  const isValid = /^\d+$/.test(value);
  return {
    isValid,
    errors: isValid ? [] : [`${fieldName} must contain only numbers`],
  };
};

/**
 * Validates that a value is a positive number
 */
export const isPositive = (value: number, fieldName: string = 'Field'): ValidationResult => {
  const isValid = value > 0;
  return {
    isValid,
    errors: isValid ? [] : [`${fieldName} must be a positive number`],
  };
};

/**
 * Validates that a value is a non-negative number
 */
export const isNonNegative = (value: number, fieldName: string = 'Field'): ValidationResult => {
  const isValid = value >= 0;
  return {
    isValid,
    errors: isValid ? [] : [`${fieldName} must be a non-negative number`],
  };
};

/**
 * Validates that a value is an integer
 */
export const isInteger = (value: number, fieldName: string = 'Field'): ValidationResult => {
  const isValid = Number.isInteger(value);
  return {
    isValid,
    errors: isValid ? [] : [`${fieldName} must be an integer`],
  };
};

/**
 * Validates that a date is in the future
 */
export const isFutureDate = (date: Date, fieldName: string = 'Date'): ValidationResult => {
  const isValid = date > new Date();
  return {
    isValid,
    errors: isValid ? [] : [`${fieldName} must be in the future`],
  };
};

/**
 * Validates that a date is in the past
 */
export const isPastDate = (date: Date, fieldName: string = 'Date'): ValidationResult => {
  const isValid = date < new Date();
  return {
    isValid,
    errors: isValid ? [] : [`${fieldName} must be in the past`],
  };
};

/**
 * Validates that a date is within a range
 */
export const isDateInRange = (
  date: Date,
  startDate: Date,
  endDate: Date,
  fieldName: string = 'Date'
): ValidationResult => {
  const isValid = date >= startDate && date <= endDate;
  return {
    isValid,
    errors: isValid ? [] : [`${fieldName} must be between ${startDate.toDateString()} and ${endDate.toDateString()}`],
  };
};

/**
 * Combines multiple validation results
 */
export const combineValidationResults = (...results: ValidationResult[]): ValidationResult => {
  const allErrors = results.flatMap(result => result.errors);
  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  };
};

/**
 * Validates an object against a schema
 */
export const validateObject = <T>(
  obj: T,
  schema: Record<keyof T, (value: any) => ValidationResult>
): ValidationResult => {
  const errors: string[] = [];
  
  for (const [field, validator] of Object.entries(schema)) {
    const result = (validator as (value: any) => ValidationResult)(obj[field as keyof T]);
    if (!result.isValid) {
      errors.push(...result.errors);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Creates a custom validator function
 */
export const createValidator = <T>(
  validatorFn: (value: T) => boolean,
  errorMessage: string
): (value: T) => ValidationResult => {
  return (value: T) => ({
    isValid: validatorFn(value),
    errors: validatorFn(value) ? [] : [errorMessage],
  });
};
