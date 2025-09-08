// Service decorator for standardized error handling

/**
 * Enhanced error class that provides additional context for service operations
 */
export class ServiceError extends Error {
  public readonly serviceName: string;
  public readonly operation: string;
  public readonly originalError: Error;
  public readonly timestamp: Date;
  public readonly context?: Record<string, unknown>;

  constructor(
    serviceName: string,
    operation: string,
    originalError: Error,
    context?: Record<string, unknown>
  ) {
    const message = `${serviceName}.${operation} failed: ${originalError.message}`;
    super(message);
    
    this.name = 'ServiceError';
    this.serviceName = serviceName;
    this.operation = operation;
    this.originalError = originalError;
    this.timestamp = new Date();
    this.context = context;

    // Preserve the original stack trace
    if (originalError.stack) {
      this.stack = originalError.stack;
    }
  }
}

/**
 * Options for service method decoration
 */
export interface ServiceDecoratorOptions {
  /** Whether to log errors to console */
  logErrors?: boolean;
  /** Whether to include request context in error */
  includeContext?: boolean;
  /** Custom error message formatter */
  formatErrorMessage?: (serviceName: string, operation: string, error: Error) => string;
}

/**
 * Decorator that adds standardized error handling to service methods
 */
export function withErrorHandling<T extends (...args: any[]) => any>(
  serviceMethod: T,
  serviceName: string,
  operation: string,
  options: ServiceDecoratorOptions = {}
): T {
  const {
    logErrors = true,
    includeContext = true
  } = options;

  return (async (...args: Parameters<T>) => {
    try {
      const result = await serviceMethod(...args);
      return result;
    } catch (error) {
      const originalError = error as Error;
      
      // Create context object if requested
      const context = includeContext ? {
        args: args.length > 0 ? args : undefined,
        timestamp: new Date().toISOString(),
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      } : undefined;

      // Create enhanced error
      const enhancedError = new ServiceError(
        serviceName,
        operation,
        originalError,
        context
      );

      // Log error if requested
      if (logErrors) {
        console.error(`[${serviceName}.${operation}] Error:`, {
          message: enhancedError.message,
          originalError: originalError.message,
          context,
          stack: originalError.stack
        });
      }

      throw enhancedError;
    }
  }) as T;
}

/**
 * Decorator factory for creating service method decorators
 */
export function createServiceDecorator(
  serviceName: string,
  options: ServiceDecoratorOptions = {}
) {
  return function <T extends (...args: any[]) => any>(
    _target: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<T>
  ) {
    if (descriptor.value) {
      descriptor.value = withErrorHandling(
        descriptor.value,
        serviceName,
        propertyKey,
        options
      ) as T;
    }
    return descriptor;
  };
}

/**
 * Higher-order function that wraps a service class with error handling
 */
export function withServiceErrorHandling<T extends new (...args: any[]) => any>(
  ServiceClass: T,
  serviceName: string,
  options: ServiceDecoratorOptions = {}
): T {
  return class extends ServiceClass {
    constructor(...args: any[]) {
      super(...args);
      
      // Wrap all methods with error handling
      const prototype = Object.getPrototypeOf(this);
      const propertyNames = Object.getOwnPropertyNames(prototype);
      
      propertyNames.forEach(propertyName => {
        const descriptor = Object.getOwnPropertyDescriptor(prototype, propertyName);
        
        if (descriptor && typeof descriptor.value === 'function' && propertyName !== 'constructor') {
          const originalMethod = descriptor.value;
          descriptor.value = withErrorHandling(
            originalMethod,
            serviceName,
            propertyName,
            options
          );
          Object.defineProperty(prototype, propertyName, descriptor);
        }
      });
    }
  };
}

/**
 * Utility function to check if an error is a service error
 */
export function isServiceError(error: unknown): error is ServiceError {
  return error instanceof ServiceError;
}

/**
 * Utility function to extract original error from service error
 */
export function getOriginalError(error: unknown): Error {
  if (isServiceError(error)) {
    return error.originalError;
  }
  return error as Error;
}

/**
 * Utility function to format service error for user display
 */
export function formatServiceErrorForUser(error: unknown): string {
  if (isServiceError(error)) {
    // Return a user-friendly message based on the original error type
    const originalError = error.originalError;
    
    if (originalError.message.includes('Failed to fetch')) {
      return 'Unable to retrieve data. Please check your connection and try again.';
    }
    
    if (originalError.message.includes('Failed to create')) {
      return 'Unable to create the item. Please check your input and try again.';
    }
    
    if (originalError.message.includes('Failed to update')) {
      return 'Unable to update the item. Please check your input and try again.';
    }
    
    if (originalError.message.includes('Failed to delete')) {
      return 'Unable to delete the item. Please try again.';
    }
    
    // Fallback to original error message
    return originalError.message;
  }
  
  return (error as Error).message || 'An unexpected error occurred';
}

/**
 * Retry configuration for service operations
 */
export interface RetryConfig {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  retryCondition?: (error: Error) => boolean;
}

/**
 * Default retry configuration
 */
export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
  retryCondition: (error: Error) => {
    // Retry on network errors and temporary database errors
    return error.message.includes('network') || 
           error.message.includes('timeout') ||
           error.message.includes('connection') ||
           (error as any).code === 'PGRST301'; // Temporary connection error
  }
};

/**
 * Decorator that adds retry logic to service methods
 */
export function withRetry<T extends (...args: any[]) => any>(
  serviceMethod: T,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): T {
  return (async (...args: Parameters<T>) => {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
      try {
        return await serviceMethod(...args);
      } catch (error) {
        lastError = error as Error;
        
        // Check if we should retry
        if (attempt === config.maxRetries || !config.retryCondition?.(lastError)) {
          throw lastError;
        }
        
        // Calculate delay with exponential backoff
        const delay = Math.min(
          config.initialDelay * Math.pow(config.backoffMultiplier, attempt - 1),
          config.maxDelay
        );
        
        console.log(`Retrying ${serviceMethod.name} (attempt ${attempt}/${config.maxRetries}) after ${delay}ms`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError!;
  }) as T;
}
