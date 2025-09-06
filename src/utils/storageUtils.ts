/**
 * Storage utility functions for localStorage, sessionStorage, and IndexedDB operations
 */

/**
 * Local storage utilities
 */
export const localStorage = {
  /**
   * Sets an item in localStorage
   */
  set: <T>(key: string, value: T): void => {
    try {
      const serialized = JSON.stringify(value);
      window.localStorage.setItem(key, serialized);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  /**
   * Gets an item from localStorage
   */
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue || null;
    }
  },

  /**
   * Removes an item from localStorage
   */
  remove: (key: string): void => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },

  /**
   * Clears all items from localStorage
   */
  clear: (): void => {
    try {
      window.localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },

  /**
   * Gets all keys from localStorage
   */
  keys: (): string[] => {
    try {
      return Object.keys(window.localStorage);
    } catch (error) {
      console.error('Error getting localStorage keys:', error);
      return [];
    }
  },

  /**
   * Checks if a key exists in localStorage
   */
  has: (key: string): boolean => {
    try {
      return window.localStorage.getItem(key) !== null;
    } catch (error) {
      console.error('Error checking localStorage key:', error);
      return false;
    }
  },
};

/**
 * Session storage utilities
 */
export const sessionStorage = {
  /**
   * Sets an item in sessionStorage
   */
  set: <T>(key: string, value: T): void => {
    try {
      const serialized = JSON.stringify(value);
      window.sessionStorage.setItem(key, serialized);
    } catch (error) {
      console.error('Error saving to sessionStorage:', error);
    }
  },

  /**
   * Gets an item from sessionStorage
   */
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      console.error('Error reading from sessionStorage:', error);
      return defaultValue || null;
    }
  },

  /**
   * Removes an item from sessionStorage
   */
  remove: (key: string): void => {
    try {
      window.sessionStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from sessionStorage:', error);
    }
  },

  /**
   * Clears all items from sessionStorage
   */
  clear: (): void => {
    try {
      window.sessionStorage.clear();
    } catch (error) {
      console.error('Error clearing sessionStorage:', error);
    }
  },

  /**
   * Gets all keys from sessionStorage
   */
  keys: (): string[] => {
    try {
      return Object.keys(window.sessionStorage);
    } catch (error) {
      console.error('Error getting sessionStorage keys:', error);
      return [];
    }
  },

  /**
   * Checks if a key exists in sessionStorage
   */
  has: (key: string): boolean => {
    try {
      return window.sessionStorage.getItem(key) !== null;
    } catch (error) {
      console.error('Error checking sessionStorage key:', error);
      return false;
    }
  },
};

/**
 * Cookie utilities
 */
export const cookies = {
  /**
   * Sets a cookie
   */
  set: (name: string, value: string, options: {
    expires?: Date | number;
    path?: string;
    domain?: string;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
  } = {}): void => {
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (options.expires) {
      if (typeof options.expires === 'number') {
        const date = new Date();
        date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1000);
        cookieString += `; expires=${date.toUTCString()}`;
      } else {
        cookieString += `; expires=${options.expires.toUTCString()}`;
      }
    }

    if (options.path) {
      cookieString += `; path=${options.path}`;
    }

    if (options.domain) {
      cookieString += `; domain=${options.domain}`;
    }

    if (options.secure) {
      cookieString += '; secure';
    }

    if (options.sameSite) {
      cookieString += `; samesite=${options.sameSite}`;
    }

    document.cookie = cookieString;
  },

  /**
   * Gets a cookie value
   */
  get: (name: string): string | null => {
    const nameEQ = encodeURIComponent(name) + '=';
    const ca = document.cookie.split(';');
    
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
      }
    }
    
    return null;
  },

  /**
   * Removes a cookie
   */
  remove: (name: string, path?: string, domain?: string): void => {
    cookies.set(name, '', {
      expires: new Date(0),
      path,
      domain,
    });
  },

  /**
   * Gets all cookies as an object
   */
  getAll: (): Record<string, string> => {
    const cookies: Record<string, string> = {};
    document.cookie.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        cookies[decodeURIComponent(name)] = decodeURIComponent(value);
      }
    });
    return cookies;
  },
};

/**
 * IndexedDB utilities
 */
export class IndexedDBStorage {
  private dbName: string;
  private version: number;
  private db: IDBDatabase | null = null;

  constructor(dbName: string, version: number = 1) {
    this.dbName = dbName;
    this.version = version;
  }

  /**
   * Opens the database
   */
  private async openDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('data')) {
          db.createObjectStore('data', { keyPath: 'key' });
        }
      };
    });
  }

  /**
   * Sets an item in IndexedDB
   */
  async set<T>(key: string, value: T): Promise<void> {
    const db = await this.openDB();
    const transaction = db.transaction(['data'], 'readwrite');
    const store = transaction.objectStore('data');
    
    return new Promise((resolve, reject) => {
      const request = store.put({ key, value });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Gets an item from IndexedDB
   */
  async get<T>(key: string): Promise<T | null> {
    const db = await this.openDB();
    const transaction = db.transaction(['data'], 'readonly');
    const store = transaction.objectStore('data');
    
    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.value : null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Removes an item from IndexedDB
   */
  async remove(key: string): Promise<void> {
    const db = await this.openDB();
    const transaction = db.transaction(['data'], 'readwrite');
    const store = transaction.objectStore('data');
    
    return new Promise((resolve, reject) => {
      const request = store.delete(key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Clears all items from IndexedDB
   */
  async clear(): Promise<void> {
    const db = await this.openDB();
    const transaction = db.transaction(['data'], 'readwrite');
    const store = transaction.objectStore('data');
    
    return new Promise((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Gets all keys from IndexedDB
   */
  async keys(): Promise<string[]> {
    const db = await this.openDB();
    const transaction = db.transaction(['data'], 'readonly');
    const store = transaction.objectStore('data');
    
    return new Promise((resolve, reject) => {
      const request = store.getAllKeys();
      request.onsuccess = () => resolve(request.result as string[]);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Closes the database connection
   */
  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

/**
 * Storage manager that can use different storage backends
 */
export class StorageManager {
  private storage: typeof localStorage | typeof sessionStorage | IndexedDBStorage;

  constructor(storage: 'localStorage' | 'sessionStorage' | IndexedDBStorage) {
    if (storage === 'localStorage') {
      this.storage = localStorage;
    } else if (storage === 'sessionStorage') {
      this.storage = sessionStorage;
    } else {
      this.storage = storage;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    if (this.storage instanceof IndexedDBStorage) {
      await this.storage.set(key, value);
    } else {
      this.storage.set(key, value);
    }
  }

  async get<T>(key: string, defaultValue?: T): Promise<T | null> {
    if (this.storage instanceof IndexedDBStorage) {
      return await this.storage.get<T>(key) || defaultValue || null;
    } else {
      return this.storage.get<T>(key, defaultValue);
    }
  }

  async remove(key: string): Promise<void> {
    if (this.storage instanceof IndexedDBStorage) {
      await this.storage.remove(key);
    } else {
      this.storage.remove(key);
    }
  }

  async clear(): Promise<void> {
    if (this.storage instanceof IndexedDBStorage) {
      await this.storage.clear();
    } else {
      this.storage.clear();
    }
  }

  async keys(): Promise<string[]> {
    if (this.storage instanceof IndexedDBStorage) {
      return await this.storage.keys();
    } else {
      return this.storage.keys();
    }
  }
}
