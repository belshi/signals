import { configService } from '../config/ConfigurationService';
import { cacheService, createHash } from './CacheService';
import { withErrorHandling } from './ServiceDecorator';
import { enhancedFetch, performanceMonitor } from './RequestInterceptor';

/**
 * Base Talkwalker service that provides common patterns for all Talkwalker API operations
 */
export abstract class BaseTalkwalkerService {
  protected abstract getEndpoint(): string;
  protected abstract getCacheKey(...args: any[]): string;

  /**
   * Get the base URLs for Talkwalker API
   */
  protected getBaseUrls(): string[] {
    const baseUrl = configService.talkwalker.baseUrl?.replace(/\/$/, '');
    return [
      baseUrl,
      baseUrl?.includes('api.talkwalker.com') ? 'https://app.talkwalker.com' : undefined
    ].filter(Boolean) as string[];
  }

  /**
   * Check if we should use proxy for requests
   * Never use proxy - always make direct requests
   */
  protected shouldUseProxy(): boolean {
    return false;
  }

  /**
   * Get the default request payload for list API
   */
  protected getDefaultPayload(): Record<string, any> {
    return {
      origin: String(configService.talkwalker.origin || ''),
      context: [String(configService.talkwalker.workspaceId || '')],
      accountId: String(configService.talkwalker.accountId || ''),
      userEmail: String(configService.talkwalker.userEmail || ''),
    };
  }

  /**
   * Get the chat request payload (different field names)
   */
  protected getChatPayload(): Record<string, any> {
    return {
      origin: String(configService.talkwalker.origin || ''),
      context: [String(configService.talkwalker.workspaceId || '')],
      account_id: String(configService.talkwalker.accountId || ''),
      email: String(configService.talkwalker.userEmail || ''),
    };
  }

  /**
   * Make a direct request to Talkwalker API
   */
  protected async makeRequest<T>(
    payload: any,
    signal?: AbortSignal,
    useCache: boolean = true
  ): Promise<T> {
    const cacheKey = useCache ? this.getCacheKey(payload) : null;
    
    // Try cache first if enabled
    if (useCache && cacheKey) {
      const cached = cacheService.get<T>(cacheKey);
      if (cached !== null) {
        console.log(`Cache hit for ${this.getEndpoint()}`);
        return cached;
      }
    }

    return this.makeDirectRequest<T>(payload, signal, cacheKey);
  }


  /**
   * Make a direct request to Talkwalker API
   */
  private async makeDirectRequest<T>(
    payload: any,
    signal?: AbortSignal,
    cacheKey?: string | null
  ): Promise<T> {
    if (!configService.isTalkwalkerConfigured) {
      throw new Error('Talkwalker not configured. Cannot make direct API request.');
    }

    const bases = this.getBaseUrls();
    let lastError: Error | null = null;
    const endMeasurement = performanceMonitor.startMeasurement(`talkwalker:direct:${this.getEndpoint()}`);

    try {
      for (const base of bases) {
        const url = `${base}${this.getEndpoint()}?access_token=${encodeURIComponent(configService.talkwalker.accessToken!)}`;

        try {
          const data = await enhancedFetch<T>(
            url,
            {
              method: 'POST',
              signal,
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
              body: JSON.stringify(payload),
            },
            `Talkwalker Direct ${this.getEndpoint()}`
          );
          
          // Cache the result if cache key is provided
          if (cacheKey) {
            cacheService.set(cacheKey, data, this.getCacheTTL());
          }
          
          endMeasurement();
          return data;
        } catch (err) {
          lastError = err as Error;
        }
      }

      throw lastError ?? new Error(`${this.getEndpoint()} failed: Unknown error`);
    } finally {
      endMeasurement();
    }
  }


  /**
   * Get the cache TTL for this service
   */
  protected getCacheTTL(): number {
    return 300000; // 5 minutes default
  }

  /**
   * Validate Talkwalker response
   */
  protected validateResponse<T extends { status_code: string; status_message?: string }>(
    data: T,
    operation: string
  ): T {
    if (data.status_code !== '0') {
      throw new Error(`Talkwalker ${operation} error: ${data.status_message || 'Unknown error'}`);
    }
    return data;
  }

  /**
   * Create a contextual message for chat requests
   */
  protected createContextualMessage(
    message: string,
    brandDetails: { name: string; industry: string; description: string }
  ): string {
    return `Brand: ${brandDetails.name}
Industry: ${brandDetails.industry}
Description: ${brandDetails.description}

User Request: ${message}

Please provide detailed insights and analysis based on the brand context and user request.`;
  }

  /**
   * Create a chat request payload
   */
  protected createChatRequest(
    copilotId: string,
    message: string,
    brandDetails: { name: string; industry: string; description: string }
  ): any {
    const contextualMessage = this.createContextualMessage(message, brandDetails);
    
    return {
      ...this.getChatPayload(),
      yeti_id: copilotId,
      message: {
        user_id: 'U074V17S75L', // This could be made configurable
        username: 'Signal User',
        timestamp: Math.floor(Date.now() / 1000),
        text: contextualMessage,
        role: 'USER',
      },
    };
  }

  /**
   * Invalidate cache for this service
   */
  protected invalidateCache(pattern?: string): void {
    if (pattern) {
      cacheService.invalidatePattern(pattern);
    } else {
      // Invalidate all cache entries for this service
      const servicePattern = this.getEndpoint().replace(/[^a-zA-Z0-9]/g, '');
      cacheService.invalidatePattern(new RegExp(servicePattern, 'i'));
    }
  }
}

/**
 * Talkwalker List Service for fetching copilots
 */
export class TalkwalkerListService extends BaseTalkwalkerService {
  protected getEndpoint(): string {
    return '/api/v3/yeti/list';
  }

  protected getCacheKey(payload: any): string {
    const payloadHash = createHash(JSON.stringify(payload));
    return `talkwalker:list:${payloadHash}`;
  }

  protected getCacheTTL(): number {
    return 600000; // 10 minutes for copilot list
  }

  /**
   * List all available copilots
   */
  async listCopilots(signal?: AbortSignal): Promise<any[]> {
    const payload = this.getDefaultPayload();
    
    const response = await this.makeRequest<any>(
      payload,
      signal,
      true // Use cache
    );

    const validatedResponse = this.validateResponse(response, 'list');
    return validatedResponse.yeti_answer?.custom_yetis ?? [];
  }
}

/**
 * Talkwalker Chat Service for chat operations
 */
export class TalkwalkerChatService extends BaseTalkwalkerService {
  protected getEndpoint(): string {
    return '/api/v3/yeti/chat';
  }

  protected getCacheKey(payload: any): string {
    const messageHash = createHash(payload.message?.text || '');
    return `talkwalker:chat:${payload.yeti_id}:${messageHash}`;
  }

  protected getCacheTTL(): number {
    return 300000; // 5 minutes for chat responses
  }

  /**
   * Chat with a copilot
   */
  async chatWithCopilot(
    copilotId: string,
    message: string,
    brandDetails: { name: string; industry: string; description: string },
    signal?: AbortSignal,
    useCache: boolean = false // Chat responses typically shouldn't be cached
  ): Promise<any> {
    const payload = this.createChatRequest(copilotId, message, brandDetails);
    
    const response = await this.makeRequest<any>(
      payload,
      signal,
      useCache
    );

    return this.validateResponse(response, 'chat');
  }
}

/**
 * Enhanced Talkwalker Service with caching and performance optimizations
 */
export class EnhancedTalkwalkerService {
  private listService: TalkwalkerListService;
  private chatService: TalkwalkerChatService;

  constructor() {
    this.listService = new TalkwalkerListService();
    this.chatService = new TalkwalkerChatService();
  }

  /**
   * List copilots with caching
   */
  async listCopilots(signal?: AbortSignal): Promise<any[]> {
    return withErrorHandling(
      () => this.listService.listCopilots(signal),
      'EnhancedTalkwalkerService',
      'listCopilots'
    )();
  }

  /**
   * Chat with copilot
   */
  async chatWithCopilot(
    copilotId: string,
    message: string,
    brandDetails: { name: string; industry: string; description: string },
    signal?: AbortSignal
  ): Promise<any> {
    return withErrorHandling(
      () => this.chatService.chatWithCopilot(copilotId, message, brandDetails, signal),
      'EnhancedTalkwalkerService',
      'chatWithCopilot'
    )();
  }

  /**
   * Get service statistics
   */
  getStats(): {
    cache: any;
    configuration: {
      configured: boolean;
      hasBaseUrl: boolean;
      hasAccessToken: boolean;
      hasOptionalFields: boolean;
    };
    performance: any;
  } {
    return {
      cache: cacheService.getStats(),
      configuration: {
        configured: configService.isTalkwalkerConfigured,
        hasBaseUrl: !!configService.talkwalker.baseUrl,
        hasAccessToken: !!configService.talkwalker.accessToken,
        hasOptionalFields: configService.talkwalker.hasOptionalFields,
      },
      performance: performanceMonitor.getAllStats(),
    };
  }

  /**
   * Clear all Talkwalker-related cache
   */
  clearCache(): void {
    cacheService.invalidatePattern(/^talkwalker:/);
  }

  /**
   * Test Talkwalker connectivity
   */
  async testConnectivity(): Promise<{
    success: boolean;
    error?: string;
    responseTime?: number;
  }> {
    const startTime = Date.now();
    
    try {
      await this.listCopilots();
      const responseTime = Date.now() - startTime;
      
      return {
        success: true,
        responseTime,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime: Date.now() - startTime,
      };
    }
  }
}
