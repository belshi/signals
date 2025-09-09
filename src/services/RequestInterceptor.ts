/**
 * Request interceptor for monitoring, logging, and performance optimization
 */

export interface RequestMetrics {
  url: string;
  method: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  status?: number;
  success: boolean;
  error?: string;
  cacheHit?: boolean;
  retryCount?: number;
  errorType?: 'network' | 'timeout' | 'abort' | 'http' | 'unknown';
}

export interface InterceptorOptions {
  enableLogging?: boolean;
  enableMetrics?: boolean;
  enableRetry?: boolean;
  maxRetries?: number;
  retryDelay?: number;
  timeout?: number;
  operationTimeout?: number; // Specific timeout for different operations
}

export class RequestInterceptor {
  private metrics: RequestMetrics[] = [];
  private options: InterceptorOptions;

  constructor(options: InterceptorOptions = {}) {
    this.options = {
      enableLogging: true,
      enableMetrics: true,
      enableRetry: true,
      maxRetries: 3,
      retryDelay: 1000,
      timeout: 120000, // 2 minutes default timeout
      ...options,
    };
  }

  /**
   * Intercept and enhance fetch requests
   */
  async intercept<T>(
    url: string,
    options: RequestInit = {},
    operation: string = 'request'
  ): Promise<T> {
    const startTime = Date.now();
    const method = options.method || 'GET';
    
    const metrics: RequestMetrics = {
      url,
      method,
      startTime,
      success: false,
    };

    if (this.options.enableLogging) {
      console.log(`[${operation}] ${method} ${url}`, { ...options, signal: options.signal ? 'AbortSignal present' : 'undefined' });
    }

    try {
      const response = await this.executeWithRetry(
        () => this.executeSingleRequest(url, options, operation),
        operation
      );

      metrics.endTime = Date.now();
      metrics.duration = metrics.endTime - metrics.startTime;
      metrics.status = response.status;
      metrics.success = response.ok;

      if (this.options.enableLogging) {
        console.log(`[${operation}] ${method} ${url} - ${response.status} (${metrics.duration}ms)`);
      }

      if (!response.ok) {
        // Try to get error details from response body
        let errorDetails = '';
        try {
          const errorBody = await response.clone().text();
          errorDetails = errorBody ? ` - ${errorBody}` : '';
        } catch (e) {
          // Ignore error reading response body
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}${errorDetails}`);
      }

      const data = await response.json() as T;
      
      if (this.options.enableMetrics) {
        this.metrics.push(metrics);
      }

      return data;

    } catch (error) {
      metrics.endTime = Date.now();
      metrics.duration = metrics.endTime - metrics.startTime;
      
      const errorObj = error instanceof Error ? error : new Error('Unknown error');
      const errorType = this.classifyError(errorObj);
      const userFriendlyMessage = this.getUserFriendlyErrorMessage(errorObj, errorType);
      
      metrics.error = userFriendlyMessage;
      metrics.errorType = errorType;

      if (this.options.enableLogging) {
        console.error(`[${operation}] ${method} ${url} - Error (${errorType}): ${userFriendlyMessage}`);
      }

      if (this.options.enableMetrics) {
        this.metrics.push(metrics);
      }

      // Create a new error with the user-friendly message
      const enhancedError = new Error(userFriendlyMessage);
      enhancedError.name = errorObj.name;
      enhancedError.cause = errorObj;
      (enhancedError as any).errorType = errorType;
      
      throw enhancedError;
    }
  }

  /**
   * Execute a single request with timeout and abort signal handling
   */
  private async executeSingleRequest(url: string, options: RequestInit, operation?: string): Promise<Response> {
    // Determine timeout based on operation type
    const timeout = this.getTimeoutForOperation(operation);
    
    // Add timeout if specified
    const controller = new AbortController();
    const timeoutId = timeout 
      ? setTimeout(() => controller.abort(), timeout)
      : null;

    try {
      // Merge abort signals
      const signal = this.mergeAbortSignals(options.signal || undefined, controller.signal);

      const response = await fetch(url, { ...options, signal });

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      return response;
    } catch (error) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      throw error;
    }
  }

  /**
   * Execute request with retry logic
   */
  private async executeWithRetry(
    requestFn: () => Promise<Response>,
    operation: string,
    attempt: number = 1
  ): Promise<Response> {
    try {
      return await requestFn();
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error('Unknown error');
      const errorType = this.classifyError(errorObj);
      
      // Don't retry if the request was aborted (user cancellation)
      if (errorType === 'abort') {
        throw error;
      }

      // Don't retry for certain HTTP status codes that are unlikely to succeed on retry
      if (errorType === 'http') {
        const statusMatch = errorObj.message.match(/HTTP (\d+):/);
        if (statusMatch) {
          const statusCode = parseInt(statusMatch[1], 10);
          // Don't retry client errors (4xx) except for 408 (timeout), 429 (rate limit)
          if (statusCode >= 400 && statusCode < 500 && ![408, 429].includes(statusCode)) {
            throw error;
          }
        }
      }

      if (this.options.enableRetry && attempt < this.options.maxRetries!) {
        const delay = this.options.retryDelay! * Math.pow(2, attempt - 1); // Exponential backoff
        
      if (this.options.enableLogging) {
        console.log(`[${operation}] Retry attempt ${attempt}/${this.options.maxRetries} after ${delay}ms. Error (${errorType}): ${errorObj.message}`);
      }

        await this.delay(delay);
        return this.executeWithRetry(requestFn, operation, attempt + 1);
      }
      throw error;
    }
  }

  /**
   * Merge multiple abort signals
   */
  private mergeAbortSignals(...signals: (AbortSignal | undefined)[]): AbortSignal {
    const controller = new AbortController();
    
    signals.forEach(signal => {
      if (signal) {
        if (signal.aborted) {
          controller.abort();
        } else {
          signal.addEventListener('abort', () => controller.abort());
        }
      }
    });

    return controller.signal;
  }

  /**
   * Delay execution
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Classify error type for better handling
   */
  private classifyError(error: Error): 'network' | 'timeout' | 'abort' | 'http' | 'unknown' {
    if (error.name === 'AbortError' || error.message.includes('aborted')) {
      return 'abort';
    }
    
    if (error.message.includes('timeout') || error.message.includes('TIMEOUT')) {
      return 'timeout';
    }
    
    if (error.message.includes('HTTP')) {
      return 'http';
    }
    
    if (error.message.includes('fetch') || error.message.includes('network') || error.message.includes('Failed to fetch')) {
      return 'network';
    }
    
    return 'unknown';
  }

  /**
   * Get timeout for specific operation
   */
  private getTimeoutForOperation(operation?: string): number | undefined {
    // Use operation-specific timeout if available
    if (this.options.operationTimeout) {
      return this.options.operationTimeout;
    }
    
    // Default timeouts for different operations
    if (operation?.includes('OpenAI')) {
      return 300000; // 5 minutes for OpenAI requests
    }
    
    if (operation?.includes('Talkwalker')) {
      return 120000; // 2 minutes for Talkwalker requests
    }
    
    // Default timeout
    return this.options.timeout;
  }

  /**
   * Get user-friendly error message
   */
  private getUserFriendlyErrorMessage(error: Error, errorType: string): string {
    switch (errorType) {
      case 'abort':
        return 'Request was cancelled';
      case 'timeout':
        return 'Request timed out. Please try again.';
      case 'network':
        return 'Network error. Please check your connection and try again.';
      case 'http':
        if (error.message.includes('401')) {
          return 'Authentication failed. Please check your API key.';
        }
        if (error.message.includes('403')) {
          return 'Access denied. Please check your permissions.';
        }
        if (error.message.includes('429')) {
          return 'Rate limit exceeded. Please wait a moment and try again.';
        }
        if (error.message.includes('500')) {
          return 'Server error. Please try again later.';
        }
        return `Request failed: ${error.message}`;
      default:
        return error.message || 'An unexpected error occurred';
    }
  }

  /**
   * Get performance metrics
   */
  getMetrics(): {
    total: number;
    successful: number;
    failed: number;
    averageDuration: number;
    slowestRequest?: RequestMetrics;
    fastestRequest?: RequestMetrics;
    recentRequests: RequestMetrics[];
  } {
    const recent = this.metrics.slice(-10);
    const successful = this.metrics.filter(m => m.success);
    const failed = this.metrics.filter(m => !m.success);
    
    const durations = this.metrics
      .filter(m => m.duration !== undefined)
      .map(m => m.duration!);

    const averageDuration = durations.length > 0 
      ? durations.reduce((sum, duration) => sum + duration, 0) / durations.length
      : 0;

    const slowestRequest = durations.length > 0
      ? this.metrics.find(m => m.duration === Math.max(...durations))
      : undefined;

    const fastestRequest = durations.length > 0
      ? this.metrics.find(m => m.duration === Math.min(...durations))
      : undefined;

    return {
      total: this.metrics.length,
      successful: successful.length,
      failed: failed.length,
      averageDuration: Math.round(averageDuration),
      slowestRequest,
      fastestRequest,
      recentRequests: recent,
    };
  }

  /**
   * Clear metrics
   */
  clearMetrics(): void {
    this.metrics = [];
  }

  /**
   * Get health status
   */
  getHealthStatus(): {
    status: 'healthy' | 'degraded' | 'unhealthy';
    successRate: number;
    averageResponseTime: number;
    issues: string[];
  } {
    const metrics = this.getMetrics();
    const successRate = metrics.total > 0 ? (metrics.successful / metrics.total) * 100 : 100;
    const issues: string[] = [];

    if (successRate < 95) {
      issues.push(`Low success rate: ${successRate.toFixed(1)}%`);
    }

    if (metrics.averageDuration > 5000) {
      issues.push(`Slow response time: ${metrics.averageDuration}ms average`);
    }

    let status: 'healthy' | 'degraded' | 'unhealthy';
    if (issues.length === 0) {
      status = 'healthy';
    } else if (issues.length <= 2) {
      status = 'degraded';
    } else {
      status = 'unhealthy';
    }

    return {
      status,
      successRate: Math.round(successRate * 100) / 100,
      averageResponseTime: metrics.averageDuration,
      issues,
    };
  }
}

/**
 * Singleton request interceptor instance
 */
export const requestInterceptor = new RequestInterceptor({
  enableLogging: true,
  enableMetrics: true,
  enableRetry: true,
  maxRetries: 3,
  retryDelay: 1000,
  timeout: 120000, // 2 minutes default timeout
});

/**
 * Enhanced fetch function with interceptors
 */
export async function enhancedFetch<T>(
  url: string,
  options: RequestInit = {},
  operation: string = 'request'
): Promise<T> {
  return requestInterceptor.intercept<T>(url, options, operation);
}

/**
 * Performance monitoring utilities
 */
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private measurements: Map<string, number[]> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  /**
   * Start a performance measurement
   */
  startMeasurement(name: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (!this.measurements.has(name)) {
        this.measurements.set(name, []);
      }
      
      this.measurements.get(name)!.push(duration);
    };
  }

  /**
   * Get performance statistics for a measurement
   */
  getStats(name: string): {
    count: number;
    average: number;
    min: number;
    max: number;
    total: number;
  } | null {
    const measurements = this.measurements.get(name);
    
    if (!measurements || measurements.length === 0) {
      return null;
    }

    const total = measurements.reduce((sum, duration) => sum + duration, 0);
    const average = total / measurements.length;
    const min = Math.min(...measurements);
    const max = Math.max(...measurements);

    return {
      count: measurements.length,
      average: Math.round(average * 100) / 100,
      min: Math.round(min * 100) / 100,
      max: Math.round(max * 100) / 100,
      total: Math.round(total * 100) / 100,
    };
  }

  /**
   * Get all performance statistics
   */
  getAllStats(): Record<string, any> {
    const stats: Record<string, any> = {};
    
    for (const [name] of this.measurements) {
      stats[name] = this.getStats(name);
    }
    
    return stats;
  }

  /**
   * Clear all measurements
   */
  clear(): void {
    this.measurements.clear();
  }
}

/**
 * Singleton performance monitor instance
 */
export const performanceMonitor = PerformanceMonitor.getInstance();
