// Environment configuration
export const config = {
  supabase: {
    // Support both Vite (VITE_) and Vercel/Next.js (NEXT_PUBLIC_) naming conventions
    // Also check process.env as fallback for server-side or build-time access
    url: import.meta.env.VITE_SUPABASE_URL || 
         import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 
         (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_SUPABASE_URL : undefined),
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 
             import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
             (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY : undefined),
  },
  talkwalker: {
    baseUrl: import.meta.env.VITE_TALKWALKER_BASE_URL ||
             import.meta.env.NEXT_PUBLIC_TALKWALKER_BASE_URL ||
             (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_TALKWALKER_BASE_URL : undefined),
    accessToken: import.meta.env.VITE_TALKWALKER_ACCESS_TOKEN ||
                 import.meta.env.NEXT_PUBLIC_TALKWALKER_ACCESS_TOKEN ||
                 (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_TALKWALKER_ACCESS_TOKEN : undefined),
    origin: import.meta.env.VITE_TALKWALKER_ORIGIN ||
            import.meta.env.NEXT_PUBLIC_TALKWALKER_ORIGIN ||
            (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_TALKWALKER_ORIGIN : undefined),
    workspaceId: import.meta.env.VITE_TALKWALKER_WORKSPACE_ID ||
                 import.meta.env.NEXT_PUBLIC_TALKWALKER_WORKSPACE_ID ||
                 (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_TALKWALKER_WORKSPACE_ID : undefined),
    accountId: import.meta.env.VITE_TALKWALKER_ACCOUNT_ID ||
               import.meta.env.NEXT_PUBLIC_TALKWALKER_ACCOUNT_ID ||
               (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_TALKWALKER_ACCOUNT_ID : undefined),
    userEmail: import.meta.env.VITE_TALKWALKER_USER_EMAIL ||
               import.meta.env.NEXT_PUBLIC_TALKWALKER_USER_EMAIL ||
               (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_TALKWALKER_USER_EMAIL : undefined),
  },
  app: {
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
  },
} as const;

// Validate required environment variables
export const validateEnvironment = () => {
  const missingVars: string[] = [];

  if (!config.supabase.url) {
    missingVars.push('VITE_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL');
  }

  if (!config.supabase.anonKey) {
    missingVars.push('VITE_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  if (missingVars.length > 0) {
    // Don't throw error, just log warning
    console.warn(
      `Missing Supabase environment variables: ${missingVars.join(', ')}\n` +
      'Application will use mock data instead.\n' +
      'To use real database, set one of these environment variable pairs:\n' +
      'For Vite: VITE_SUPABASE_URL=your_supabase_project_url, VITE_SUPABASE_ANON_KEY=your_supabase_anon_key\n' +
      'For Vercel/Next.js: NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url, NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key'
    );
  }

  // Optional: Talkwalker is not required, but warn if partially configured
  const hasTWBase = Boolean(config.talkwalker.baseUrl);
  const hasTWToken = Boolean(config.talkwalker.accessToken);
  if ((hasTWBase && !hasTWToken) || (!hasTWBase && hasTWToken)) {
    console.warn('Talkwalker config is partially set. Set both VITE_TALKWALKER_BASE_URL and VITE_TALKWALKER_ACCESS_TOKEN (or NEXT_PUBLIC_ equivalents).');
  }

  // Warn if required Talkwalker body fields are missing when base/token provided
  if (hasTWBase && hasTWToken) {
    const missing: string[] = [];
    if (!config.talkwalker.origin) missing.push('VITE_TALKWALKER_ORIGIN');
    if (!config.talkwalker.workspaceId) missing.push('VITE_TALKWALKER_WORKSPACE_ID');
    if (!config.talkwalker.accountId) missing.push('VITE_TALKWALKER_ACCOUNT_ID');
    if (!config.talkwalker.userEmail) missing.push('VITE_TALKWALKER_USER_EMAIL');
    if (missing.length) {
      console.warn(`Talkwalker body fields missing: ${missing.join(', ')}`);
    }
  }
};

// Call validation on import
if (typeof window !== 'undefined') {
  validateEnvironment();
}
