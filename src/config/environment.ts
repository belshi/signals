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
};

// Call validation on import
if (typeof window !== 'undefined') {
  validateEnvironment();
}
