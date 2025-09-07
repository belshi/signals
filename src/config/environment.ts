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
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}\n\n` +
      'Please create a .env.local file with the following variables:\n' +
      'VITE_SUPABASE_URL=your_supabase_project_url\n' +
      'VITE_SUPABASE_ANON_KEY=your_supabase_anon_key'
    );
  }
};

// Call validation on import
if (typeof window !== 'undefined') {
  try {
    validateEnvironment();
  } catch (error) {
    console.error('Environment validation failed:', error);
    // In development, show a helpful error message
    if (config.app.isDevelopment) {
      console.warn(
        'To fix this issue:\n' +
        '1. Create a .env.local file in your project root\n' +
        '2. Add your Supabase credentials:\n' +
        '   VITE_SUPABASE_URL=https://your-project-id.supabase.co\n' +
        '   VITE_SUPABASE_ANON_KEY=your-anon-key-here\n' +
        '3. Restart your development server'
      );
    }
  }
}
