/**
 * API utility functions for common API operations
 */

/**
 * HTTP methods
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * API response type
 */
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

/**
 * API error type
 */
export interface ApiError {
  message: string;
  status: number;
  statusText: string;
  data?: any;
}

/**
 * Request configuration
 */
export interface RequestConfig {
  method: HttpMethod;
  url: string;
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

/**
 * Default request configuration
 */
const DEFAULT_CONFIG: Partial<RequestConfig> = {
  timeout: 10000,
  retries: 3,
  retryDelay: 1000,
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * Makes an HTTP request
 */
export const makeRequest = async <T = any>(config: RequestConfig): Promise<ApiResponse<T>> => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const { method, url, headers, body, timeout, retries, retryDelay } = finalConfig;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= (retries || 0); attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const requestInit: RequestInit = {
        method,
        headers,
        signal: controller.signal,
      };

      if (body && method !== 'GET') {
        requestInit.body = typeof body === 'string' ? body : JSON.stringify(body);
      }

      const response = await fetch(url, requestInit);
      clearTimeout(timeoutId);

      const responseData = await response.json().catch(() => null);

      if (!response.ok) {
        throw new ApiError(
          responseData?.message || response.statusText,
          response.status,
          response.statusText,
          responseData
        );
      }

      return {
        data: responseData,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      };
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < (retries || 0)) {
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
  }

  throw lastError;
};

/**
 * GET request
 */
export const get = <T = any>(url: string, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> => {
  return makeRequest<T>({ method: 'GET', url, ...config });
};

/**
 * POST request
 */
export const post = <T = any>(url: string, body?: any, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> => {
  return makeRequest<T>({ method: 'POST', url, body, ...config });
};

/**
 * PUT request
 */
export const put = <T = any>(url: string, body?: any, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> => {
  return makeRequest<T>({ method: 'PUT', url, body, ...config });
};

/**
 * PATCH request
 */
export const patch = <T = any>(url: string, body?: any, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> => {
  return makeRequest<T>({ method: 'PATCH', url, body, ...config });
};

/**
 * DELETE request
 */
export const del = <T = any>(url: string, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> => {
  return makeRequest<T>({ method: 'DELETE', url, ...config });
};

/**
 * API client class
 */
export class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private defaultConfig: Partial<RequestConfig>;

  constructor(baseURL: string, defaultHeaders: Record<string, string> = {}) {
    this.baseURL = baseURL;
    this.defaultHeaders = defaultHeaders;
    this.defaultConfig = {
      timeout: 10000,
      retries: 3,
      retryDelay: 1000,
    };
  }

  /**
   * Sets default headers
   */
  setDefaultHeaders(headers: Record<string, string>): void {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers };
  }

  /**
   * Sets default configuration
   */
  setDefaultConfig(config: Partial<RequestConfig>): void {
    this.defaultConfig = { ...this.defaultConfig, ...config };
  }

  /**
   * Makes a request with the client's default configuration
   */
  private async request<T = any>(config: RequestConfig): Promise<ApiResponse<T>> {
    const finalConfig: RequestConfig = {
      ...this.defaultConfig,
      ...config,
      url: this.baseURL + config.url,
      headers: { ...this.defaultHeaders, ...config.headers },
    };

    return makeRequest<T>(finalConfig);
  }

  /**
   * GET request
   */
  get<T = any>(url: string, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'GET', url, ...config });
  }

  /**
   * POST request
   */
  post<T = any>(url: string, body?: any, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'POST', url, body, ...config });
  }

  /**
   * PUT request
   */
  put<T = any>(url: string, body?: any, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'PUT', url, body, ...config });
  }

  /**
   * PATCH request
   */
  patch<T = any>(url: string, body?: any, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'PATCH', url, body, ...config });
  }

  /**
   * DELETE request
   */
  delete<T = any>(url: string, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'DELETE', url, ...config });
  }
}

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  public status: number;
  public statusText: string;
  public data?: any;

  constructor(message: string, status: number, statusText: string, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }
}

/**
 * Request interceptor type
 */
export type RequestInterceptor = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;

/**
 * Response interceptor type
 */
export type ResponseInterceptor = <T>(response: ApiResponse<T>) => ApiResponse<T> | Promise<ApiResponse<T>>;

/**
 * Error interceptor type
 */
export type ErrorInterceptor = (error: ApiError) => ApiError | Promise<ApiError>;

/**
 * Interceptor manager
 */
export class InterceptorManager {
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];

  /**
   * Adds a request interceptor
   */
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * Adds a response interceptor
   */
  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  /**
   * Adds an error interceptor
   */
  addErrorInterceptor(interceptor: ErrorInterceptor): void {
    this.errorInterceptors.push(interceptor);
  }

  /**
   * Removes a request interceptor
   */
  removeRequestInterceptor(interceptor: RequestInterceptor): void {
    const index = this.requestInterceptors.indexOf(interceptor);
    if (index > -1) {
      this.requestInterceptors.splice(index, 1);
    }
  }

  /**
   * Removes a response interceptor
   */
  removeResponseInterceptor(interceptor: ResponseInterceptor): void {
    const index = this.responseInterceptors.indexOf(interceptor);
    if (index > -1) {
      this.responseInterceptors.splice(index, 1);
    }
  }

  /**
   * Removes an error interceptor
   */
  removeErrorInterceptor(interceptor: ErrorInterceptor): void {
    const index = this.errorInterceptors.indexOf(interceptor);
    if (index > -1) {
      this.errorInterceptors.splice(index, 1);
    }
  }

  /**
   * Applies request interceptors
   */
  async applyRequestInterceptors(config: RequestConfig): Promise<RequestConfig> {
    let finalConfig = config;
    for (const interceptor of this.requestInterceptors) {
      finalConfig = await interceptor(finalConfig);
    }
    return finalConfig;
  }

  /**
   * Applies response interceptors
   */
  async applyResponseInterceptors<T>(response: ApiResponse<T>): Promise<ApiResponse<T>> {
    let finalResponse = response;
    for (const interceptor of this.responseInterceptors) {
      finalResponse = await interceptor(finalResponse);
    }
    return finalResponse;
  }

  /**
   * Applies error interceptors
   */
  async applyErrorInterceptors(error: ApiError): Promise<ApiError> {
    let finalError = error;
    for (const interceptor of this.errorInterceptors) {
      finalError = await interceptor(finalError);
    }
    return finalError;
  }
}

/**
 * Enhanced API client with interceptors
 */
export class EnhancedApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private defaultConfig: Partial<RequestConfig>;
  private interceptors: InterceptorManager;

  constructor(baseURL: string, defaultHeaders: Record<string, string> = {}) {
    this.baseURL = baseURL;
    this.defaultHeaders = defaultHeaders;
    this.defaultConfig = {
      timeout: 10000,
      retries: 3,
      retryDelay: 1000,
    };
    this.interceptors = new InterceptorManager();
  }

  /**
   * Sets default headers
   */
  setDefaultHeaders(headers: Record<string, string>): void {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers };
  }

  /**
   * Sets default configuration
   */
  setDefaultConfig(config: Partial<RequestConfig>): void {
    this.defaultConfig = { ...this.defaultConfig, ...config };
  }

  /**
   * Gets the interceptor manager
   */
  getInterceptors(): InterceptorManager {
    return this.interceptors;
  }

  /**
   * Makes a request with interceptors
   */
  private async requestWithInterceptors<T = any>(config: RequestConfig): Promise<ApiResponse<T>> {
    try {
      const interceptedConfig = await this.interceptors.applyRequestInterceptors(config);
      const response = await makeRequest<T>(interceptedConfig);
      return await this.interceptors.applyResponseInterceptors(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw await this.interceptors.applyErrorInterceptors(error);
      }
      throw error;
    }
  }

  /**
   * Makes a request with the client's default configuration
   */
  private async request<T = any>(config: RequestConfig): Promise<ApiResponse<T>> {
    const finalConfig: RequestConfig = {
      ...this.defaultConfig,
      ...config,
      url: this.baseURL + config.url,
      headers: { ...this.defaultHeaders, ...config.headers },
    };

    return this.requestWithInterceptors<T>(finalConfig);
  }

  /**
   * GET request
   */
  get<T = any>(url: string, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'GET', url, ...config });
  }

  /**
   * POST request
   */
  post<T = any>(url: string, body?: any, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'POST', url, body, ...config });
  }

  /**
   * PUT request
   */
  put<T = any>(url: string, body?: any, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'PUT', url, body, ...config });
  }

  /**
   * PATCH request
   */
  patch<T = any>(url: string, body?: any, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'PATCH', url, body, ...config });
  }

  /**
   * DELETE request
   */
  delete<T = any>(url: string, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'DELETE', url, ...config });
  }
}
