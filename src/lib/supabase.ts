import { createClient } from '@supabase/supabase-js';
import { config } from '../config/environment';

// Get environment variables from config
const supabaseUrl = config.supabase.url;
const supabaseAnonKey = config.supabase.anonKey;

// Check if Supabase is configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn('Supabase environment variables not configured. Application will use mock data.');
}

// Database types (will be generated from your schema)
export interface Database {
  public: {
    Tables: {
      brands: {
        Row: {
          id: number;
          name: string | null;
          description: string | null;
          website: string | null;
          industry: string | null;
          location: string | null;
          employees: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          name?: string | null;
          description?: string | null;
          website?: string | null;
          industry?: string | null;
          location?: string | null;
          employees?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          name?: string | null;
          description?: string | null;
          website?: string | null;
          industry?: string | null;
          location?: string | null;
          employees?: string | null;
          created_at?: string;
        };
      };
      signals: {
        Row: {
          id: string;
          name: string;
          prompt: string;
          type: string;
          status: 'active' | 'inactive' | 'pending';
          tags: string[];
          brand_id: string;
          triggered_at: string | null;
          ai_insights: {
            socialListening?: string;
            consumerInsights?: string;
          } | null;
          ai_recommendations: string[] | null;
          csv_data: string | null;
          metadata: Record<string, any> | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          prompt: string;
          type: string;
          status?: 'active' | 'inactive' | 'pending';
          tags?: string[];
          brand_id: string;
          triggered_at?: string | null;
          ai_insights?: {
            socialListening?: string;
            consumerInsights?: string;
          } | null;
          ai_recommendations?: string[] | null;
          csv_data?: string | null;
          metadata?: Record<string, any> | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          prompt?: string;
          type?: string;
          status?: 'active' | 'inactive' | 'pending';
          tags?: string[];
          brand_id?: string;
          triggered_at?: string | null;
          ai_insights?: {
            socialListening?: string;
            consumerInsights?: string;
          } | null;
          ai_recommendations?: string[] | null;
          csv_data?: string | null;
          metadata?: Record<string, any> | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

// Create a single Supabase client instance (singleton pattern)
let supabaseClient: any = null;

const createSupabaseClient = () => {
  if (!supabaseClient && isSupabaseConfigured) {
    supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey);
  }
  return supabaseClient;
};

// Export both the typed client and a regular client (same instance)
export const supabase = createSupabaseClient();
export const typedSupabase = supabase;
