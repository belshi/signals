// Environment configuration
export const config = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
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
    missingVars.push('VITE_SUPABASE_URL');
  }

  if (!config.supabase.anonKey) {
    missingVars.push('VITE_SUPABASE_ANON_KEY');
  }

  if (missingVars.length > 0) {
    // Don't throw error, just log warning
    console.warn(
      `Missing Supabase environment variables: ${missingVars.join(', ')}\n` +
      'Application will use mock data instead.\n' +
      'To use real database, create a .env.local file with:\n' +
      'VITE_SUPABASE_URL=your_supabase_project_url\n' +
      'VITE_SUPABASE_ANON_KEY=your_supabase_anon_key'
    );
  }
};

// Call validation on import
if (typeof window !== 'undefined') {
  validateEnvironment();
}
