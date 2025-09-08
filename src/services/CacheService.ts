/**
 * Cache service for storing API responses and computed data
 * Provides TTL-based caching with automatic cleanup
 */

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  key: string;
}

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of entries
  cleanupInterval?: number; // Cleanup interval in milliseconds
}

export class CacheService {
  private cache = new Map<string, CacheEntry<any>>();
  private cleanupTimer: NodeJS.Timeout | null = null;
  private readonly defaultTTL: number;
  private readonly maxSize: number;
  private readonly cleanupInterval: number;

  constructor(options: CacheOptions = {}) {
    this.defaultTTL = options.ttl || 300000; // 5 minutes default
    this.maxSize = options.maxSize || 100; // 100 entries default
    this.cleanupInterval = options.cleanupInterval || 60000; // 1 minute cleanup

    this.startCleanupTimer();
  }

  /**
   * Get data from cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Set data in cache
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
      key,
    };

    // If cache is at max size, remove oldest entry
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.getOldestKey();
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, entry);
  }

  /**
   * Check if key exists in cache and is not expired
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Delete specific key from cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    size: number;
    maxSize: number;
    hitRate: number;
    entries: Array<{ key: string; age: number; ttl: number }>;
  } {
    const now = Date.now();
    const entries = Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      age: now - entry.timestamp,
      ttl: entry.ttl,
    }));

    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: 0, // This would need to be tracked separately
      entries,
    };
  }

  /**
   * Get or set data with automatic caching
   */
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    // Try to get from cache first
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Fetch fresh data
    const data = await fetcher();
    
    // Cache the result
    this.set(key, data, ttl);
    
    return data;
  }

  /**
   * Invalidate cache entries matching a pattern
   */
  invalidatePattern(pattern: string | RegExp): number {
    let count = 0;
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
        count++;
      }
    }

    return count;
  }

  /**
   * Get the oldest cache key
   */
  private getOldestKey(): string | null {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    }

    return oldestKey;
  }

  /**
   * Start the cleanup timer
   */
  private startCleanupTimer(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }

    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.cleanupInterval);
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        expiredKeys.push(key);
      }
    }

    expiredKeys.forEach(key => this.cache.delete(key));

    if (expiredKeys.length > 0) {
      console.log(`Cache cleanup: removed ${expiredKeys.length} expired entries`);
    }
  }

  /**
   * Destroy the cache service and cleanup resources
   */
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    this.clear();
  }
}

/**
 * Singleton cache service instance
 */
export const cacheService = new CacheService({
  ttl: 300000, // 5 minutes
  maxSize: 100,
  cleanupInterval: 60000, // 1 minute
});

/**
 * Cache key generators for different types of data
 */
export const cacheKeys = {
  talkwalker: {
    copilots: () => 'talkwalker:copilots',
    chat: (copilotId: string, messageHash: string) => `talkwalker:chat:${copilotId}:${messageHash}`,
  },
  brands: {
    all: () => 'brands:all',
    byId: (id: string) => `brands:${id}`,
    byIndustry: (industry: string) => `brands:industry:${industry}`,
  },
  signals: {
    all: () => 'signals:all',
    byId: (id: string) => `signals:${id}`,
    byBrand: (brandId: string) => `signals:brand:${brandId}`,
  },
  statistics: {
    brands: () => 'stats:brands',
    signals: () => 'stats:signals',
    goals: () => 'stats:goals',
    competitors: () => 'stats:competitors',
  },
};

/**
 * Utility function to create a hash for cache keys
 */
export function createHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}
