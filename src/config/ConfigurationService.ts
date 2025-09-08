/**
 * Centralized configuration service that provides a single source of truth
 * for all environment variables and application configuration.
 * 
 * This service handles the complexity of environment variable resolution
 * across different platforms (Vite, Next.js, Node.js) and provides
 * consistent validation and error handling.
 */
export class ConfigurationService {
  private static instance: ConfigurationService;
  private _config: AppConfig | null = null;

  private constructor() {
    this._config = this.loadConfiguration();
    this.validateConfiguration();
  }

  /**
   * Get the singleton instance of the configuration service
   */
  static getInstance(): ConfigurationService {
    if (!ConfigurationService.instance) {
      ConfigurationService.instance = new ConfigurationService();
    }
    return ConfigurationService.instance;
  }

  /**
   * Get the complete application configuration
   */
  get config(): AppConfig {
    if (!this._config) {
      throw new Error('Configuration not loaded');
    }
    return this._config;
  }

  /**
   * Get Supabase configuration
   */
  get supabase(): SupabaseConfig {
    return this.config.supabase;
  }

  /**
   * Get Talkwalker configuration
   */
  get talkwalker(): TalkwalkerConfig {
    return this.config.talkwalker;
  }

  /**
   * Get application configuration
   */
  get app(): AppEnvironmentConfig {
    return this.config.app;
  }

  /**
   * Check if Supabase is properly configured
   */
  get isSupabaseConfigured(): boolean {
    return this.config.supabase.isConfigured;
  }

  /**
   * Check if Talkwalker is properly configured
   */
  get isTalkwalkerConfigured(): boolean {
    return this.config.talkwalker.isConfigured;
  }

  /**
   * Load configuration from environment variables
   */
  private loadConfiguration(): AppConfig {
    return {
      supabase: this.loadSupabaseConfig(),
      talkwalker: this.loadTalkwalkerConfig(),
      app: this.loadAppConfig(),
    };
  }

  /**
   * Load Supabase configuration
   */
  private loadSupabaseConfig(): SupabaseConfig {
    const url = this.getEnvVar(['VITE_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL']);
    const anonKey = this.getEnvVar(['VITE_SUPABASE_ANON_KEY', 'NEXT_PUBLIC_SUPABASE_ANON_KEY']);

    return {
      url,
      anonKey,
      isConfigured: !!(url && anonKey),
    };
  }

  /**
   * Load Talkwalker configuration
   */
  private loadTalkwalkerConfig(): TalkwalkerConfig {
    const baseUrl = this.getEnvVar(['VITE_TALKWALKER_BASE_URL', 'NEXT_PUBLIC_TALKWALKER_BASE_URL']);
    const accessToken = this.getEnvVar(['VITE_TALKWALKER_ACCESS_TOKEN', 'NEXT_PUBLIC_TALKWALKER_ACCESS_TOKEN']);
    const origin = this.getEnvVar(['VITE_TALKWALKER_ORIGIN', 'NEXT_PUBLIC_TALKWALKER_ORIGIN']);
    const workspaceId = this.getEnvVar(['VITE_TALKWALKER_WORKSPACE_ID', 'NEXT_PUBLIC_TALKWALKER_WORKSPACE_ID']);
    const accountId = this.getEnvVar(['VITE_TALKWALKER_ACCOUNT_ID', 'NEXT_PUBLIC_TALKWALKER_ACCOUNT_ID']);
    const userEmail = this.getEnvVar(['VITE_TALKWALKER_USER_EMAIL', 'NEXT_PUBLIC_TALKWALKER_USER_EMAIL']);

    const hasRequiredFields = !!(baseUrl && accessToken);
    const hasOptionalFields = !!(origin && workspaceId && accountId && userEmail);

    return {
      baseUrl,
      accessToken,
      origin,
      workspaceId,
      accountId,
      userEmail,
      isConfigured: hasRequiredFields,
      hasOptionalFields,
    };
  }

  /**
   * Load application configuration
   */
  private loadAppConfig(): AppEnvironmentConfig {
    return {
      isDevelopment: this.getEnvVar(['NODE_ENV']) === 'development' || 
                     this.getEnvVar(['VITE_DEV']) === 'true' ||
                     import.meta.env?.DEV === true,
      isProduction: this.getEnvVar(['NODE_ENV']) === 'production' || 
                    this.getEnvVar(['VITE_PROD']) === 'true' ||
                    import.meta.env?.PROD === true,
      environment: this.getEnvVar(['NODE_ENV', 'VITE_ENV']) || 'development',
    };
  }

  /**
   * Get environment variable value with fallback support
   */
  private getEnvVar(keys: string[]): string | undefined {
    for (const key of keys) {
      // Try import.meta.env first (Vite)
      if (typeof import.meta !== 'undefined' && import.meta.env?.[key]) {
        return import.meta.env[key];
      }
      
      // Try process.env (Node.js/server-side)
      if (typeof process !== 'undefined' && process.env?.[key]) {
        return process.env[key];
      }
    }
    return undefined;
  }

  /**
   * Validate the loaded configuration
   */
  private validateConfiguration(): void {
    const warnings: string[] = [];
    const errors: string[] = [];

    // Validate Supabase configuration
    if (!this.config.supabase.isConfigured) {
      warnings.push(
        'Supabase configuration is missing. ' +
        'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or NEXT_PUBLIC_ equivalents). ' +
        'Application will use mock data instead.'
      );
    }

    // Validate Talkwalker configuration
    if (!this.config.talkwalker.isConfigured) {
      warnings.push(
        'Talkwalker configuration is missing. ' +
        'Set VITE_TALKWALKER_BASE_URL and VITE_TALKWALKER_ACCESS_TOKEN (or NEXT_PUBLIC_ equivalents). ' +
        'AI features will be disabled.'
      );
    } else if (!this.config.talkwalker.hasOptionalFields) {
      warnings.push(
        'Talkwalker configuration is incomplete. ' +
        'Set VITE_TALKWALKER_ORIGIN, VITE_TALKWALKER_WORKSPACE_ID, VITE_TALKWALKER_ACCOUNT_ID, and VITE_TALKWALKER_USER_EMAIL ' +
        'for full functionality.'
      );
    }

    // Log warnings
    if (warnings.length > 0) {
      console.warn('Configuration warnings:', warnings.join('\n'));
    }

    // Log errors
    if (errors.length > 0) {
      console.error('Configuration errors:', errors.join('\n'));
      throw new Error('Invalid configuration: ' + errors.join(', '));
    }
  }

  /**
   * Reload configuration (useful for testing or dynamic config changes)
   */
  reload(): void {
    this._config = this.loadConfiguration();
    this.validateConfiguration();
  }

  /**
   * Get configuration summary for debugging
   */
  getSummary(): ConfigurationSummary {
    return {
      supabase: {
        configured: this.config.supabase.isConfigured,
        hasUrl: !!this.config.supabase.url,
        hasAnonKey: !!this.config.supabase.anonKey,
      },
      talkwalker: {
        configured: this.config.talkwalker.isConfigured,
        hasBaseUrl: !!this.config.talkwalker.baseUrl,
        hasAccessToken: !!this.config.talkwalker.accessToken,
        hasOptionalFields: this.config.talkwalker.hasOptionalFields,
      },
      app: {
        environment: this.config.app.environment,
        isDevelopment: this.config.app.isDevelopment,
        isProduction: this.config.app.isProduction,
      },
    };
  }
}

/**
 * Configuration interfaces
 */
export interface AppConfig {
  supabase: SupabaseConfig;
  talkwalker: TalkwalkerConfig;
  app: AppEnvironmentConfig;
}

export interface SupabaseConfig {
  url?: string;
  anonKey?: string;
  isConfigured: boolean;
}

export interface TalkwalkerConfig {
  baseUrl?: string;
  accessToken?: string;
  origin?: string;
  workspaceId?: string;
  accountId?: string;
  userEmail?: string;
  isConfigured: boolean;
  hasOptionalFields: boolean;
}

export interface AppEnvironmentConfig {
  isDevelopment: boolean;
  isProduction: boolean;
  environment: string;
}

export interface ConfigurationSummary {
  supabase: {
    configured: boolean;
    hasUrl: boolean;
    hasAnonKey: boolean;
  };
  talkwalker: {
    configured: boolean;
    hasBaseUrl: boolean;
    hasAccessToken: boolean;
    hasOptionalFields: boolean;
  };
  app: {
    environment: string;
    isDevelopment: boolean;
    isProduction: boolean;
  };
}

/**
 * Export singleton instance for easy access
 */
export const configService = ConfigurationService.getInstance();

/**
 * Export individual config getters for backward compatibility
 */
export const config = {
  supabase: configService.supabase,
  talkwalker: configService.talkwalker,
  app: configService.app,
};
