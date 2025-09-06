/**
 * Performance utility functions for common performance operations
 */

/**
 * Debounce function - delays execution until after wait time has passed
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate: boolean = false
): ((...args: Parameters<T>) => void) => {
  let timeout: number | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };

    const callNow = immediate && !timeout;

    if (timeout) clearTimeout(timeout);
    timeout = window.setTimeout(later, wait);

    if (callNow) func(...args);
  };
};

/**
 * Throttle function - limits execution to once per wait time
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean = false;

  return function executedFunction(this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), wait);
    }
  };
};

/**
 * Memoization function - caches function results
 */
export const memoize = <T extends (...args: any[]) => any>(
  func: T,
  keyGenerator?: (...args: Parameters<T>) => string
): T => {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>) => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = func(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

/**
 * Performance timer class
 */
export class PerformanceTimer {
  private startTime: number = 0;
  private endTime: number = 0;
  private isRunning: boolean = false;

  /**
   * Starts the timer
   */
  start(): void {
    this.startTime = performance.now();
    this.isRunning = true;
  }

  /**
   * Stops the timer
   */
  stop(): number {
    if (!this.isRunning) {
      throw new Error('Timer is not running');
    }
    
    this.endTime = performance.now();
    this.isRunning = false;
    return this.getDuration();
  }

  /**
   * Gets the current duration
   */
  getDuration(): number {
    if (this.isRunning) {
      return performance.now() - this.startTime;
    }
    return this.endTime - this.startTime;
  }

  /**
   * Resets the timer
   */
  reset(): void {
    this.startTime = 0;
    this.endTime = 0;
    this.isRunning = false;
  }

  /**
   * Gets the duration in a human-readable format
   */
  getFormattedDuration(): string {
    const duration = this.getDuration();
    return `${duration.toFixed(2)}ms`;
  }
}

/**
 * Performance observer for measuring performance
 */
export class PerformanceObserverWrapper {
  private observer: PerformanceObserver | null = null;
  private measurements: PerformanceEntry[] = [];

  constructor() {
    if ('PerformanceObserver' in window) {
      this.observer = new window.PerformanceObserver((list) => {
        this.measurements.push(...list.getEntries());
      });
    }
  }

  /**
   * Starts observing performance entries
   */
  observe(entryTypes: string[]): void {
    if (this.observer) {
      this.observer.observe({ entryTypes: entryTypes as any });
    }
  }

  /**
   * Stops observing
   */
  disconnect(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  /**
   * Gets all measurements
   */
  getMeasurements(): PerformanceEntry[] {
    return [...this.measurements];
  }

  /**
   * Gets measurements by name
   */
  getMeasurementsByName(name: string): PerformanceEntry[] {
    return this.measurements.filter(entry => entry.name === name);
  }

  /**
   * Gets measurements by type
   */
  getMeasurementsByType(type: string): PerformanceEntry[] {
    return this.measurements.filter(entry => entry.entryType === type);
  }

  /**
   * Clears all measurements
   */
  clear(): void {
    this.measurements = [];
  }
}

/**
 * Lazy loading utility
 */
export class LazyLoader {
  private observer: IntersectionObserver | null = null;
  private elements: Map<Element, () => void> = new Map();

  constructor(options: IntersectionObserverInit = {}) {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const callback = this.elements.get(entry.target);
            if (callback) {
              callback();
              this.unobserve(entry.target);
            }
          }
        });
      }, options);
    }
  }

  /**
   * Observes an element for lazy loading
   */
  observe(element: Element, callback: () => void): void {
    this.elements.set(element, callback);
    if (this.observer) {
      this.observer.observe(element);
    } else {
      // Fallback for browsers without IntersectionObserver
      callback();
    }
  }

  /**
   * Stops observing an element
   */
  unobserve(element: Element): void {
    this.elements.delete(element);
    if (this.observer) {
      this.observer.unobserve(element);
    }
  }

  /**
   * Disconnects the observer
   */
  disconnect(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.elements.clear();
  }
}

/**
 * Virtual scrolling utility
 */
export class VirtualScroller {
  private container: HTMLElement;
  private itemHeight: number;
  private visibleItems: number;
  private totalItems: number;
  private scrollTop: number = 0;
  private startIndex: number = 0;
  private endIndex: number = 0;

  constructor(
    container: HTMLElement,
    itemHeight: number,
    visibleItems: number,
    totalItems: number
  ) {
    this.container = container;
    this.itemHeight = itemHeight;
    this.visibleItems = visibleItems;
    this.totalItems = totalItems;
    
    this.updateVisibleRange();
    this.setupScrollListener();
  }

  /**
   * Updates the visible range based on scroll position
   */
  private updateVisibleRange(): void {
    this.startIndex = Math.floor(this.scrollTop / this.itemHeight);
    this.endIndex = Math.min(
      this.startIndex + this.visibleItems + 1,
      this.totalItems
    );
  }

  /**
   * Sets up scroll listener
   */
  private setupScrollListener(): void {
    this.container.addEventListener('scroll', () => {
      this.scrollTop = this.container.scrollTop;
      this.updateVisibleRange();
    });
  }

  /**
   * Gets the visible range
   */
  getVisibleRange(): { start: number; end: number } {
    return { start: this.startIndex, end: this.endIndex };
  }

  /**
   * Gets the total height of all items
   */
  getTotalHeight(): number {
    return this.totalItems * this.itemHeight;
  }

  /**
   * Gets the offset for the visible items
   */
  getOffset(): number {
    return this.startIndex * this.itemHeight;
  }
}

/**
 * Batch processing utility
 */
export class BatchProcessor<T> {
  private batchSize: number;
  private delay: number;
  private items: T[] = [];
  private processor: (items: T[]) => void | Promise<void>;
  private timeout: number | null = null;

  constructor(
    processor: (items: T[]) => void | Promise<void>,
    batchSize: number = 10,
    delay: number = 100
  ) {
    this.processor = processor;
    this.batchSize = batchSize;
    this.delay = delay;
  }

  /**
   * Adds an item to the batch
   */
  add(item: T): void {
    this.items.push(item);
    
    if (this.items.length >= this.batchSize) {
      this.process();
    } else if (!this.timeout) {
      this.timeout = window.setTimeout(() => {
        this.process();
      }, this.delay);
    }
  }

  /**
   * Processes the current batch
   */
  private async process(): Promise<void> {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }

    if (this.items.length > 0) {
      const batch = this.items.splice(0, this.batchSize);
      await this.processor(batch);
    }
  }

  /**
   * Forces processing of remaining items
   */
  async flush(): Promise<void> {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }

    while (this.items.length > 0) {
      await this.process();
    }
  }
}

/**
 * Memory usage utility
 */
export const getMemoryUsage = (): {
  used: number;
  total: number;
  percentage: number;
} | null => {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    return {
      used: memory.usedJSHeapSize,
      total: memory.totalJSHeapSize,
      percentage: (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100,
    };
  }
  return null;
};

/**
 * Frame rate utility
 */
export class FrameRateCounter {
  private frames: number = 0;
  private lastTime: number = 0;
  private fps: number = 0;
  private isRunning: boolean = false;
  private animationId: number | null = null;

  /**
   * Starts counting frames
   */
  start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.frames = 0;
    this.lastTime = performance.now();
    this.animate();
  }

  /**
   * Stops counting frames
   */
  stop(): void {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * Animation loop
   */
  private animate(): void {
    if (!this.isRunning) return;

    this.frames++;
    const currentTime = performance.now();
    
    if (currentTime - this.lastTime >= 1000) {
      this.fps = Math.round((this.frames * 1000) / (currentTime - this.lastTime));
      this.frames = 0;
      this.lastTime = currentTime;
    }

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  /**
   * Gets the current FPS
   */
  getFPS(): number {
    return this.fps;
  }
}
