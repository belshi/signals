import { createClient } from '@supabase/supabase-js';
import { configService } from '../config/ConfigurationService';

// Get environment variables from config service
const supabaseUrl = configService.supabase.url;
const supabaseAnonKey = configService.supabase.anonKey;

// Check if Supabase is configured
export const isSupabaseConfigured = configService.isSupabaseConfigured;

if (!isSupabaseConfigured) {
  console.warn('Supabase environment variables not configured. Application will use mock data.');
}

// Database types matching the actual schema
export interface Database {
  public: {
    Tables: {
      brands: {
        Row: {
          id: number; // BIGINT identity
          created_at: string; // timestamptz
          name: string | null;
          description: string | null;
          website: string | null;
          industry: string | null;
          location: string | null;
          employees: string | null;
        };
        Insert: {
          id?: number;
          created_at?: string;
          name?: string | null;
          description?: string | null;
          website?: string | null;
          industry?: string | null;
          location?: string | null;
          employees?: string | null;
        };
        Update: {
          id?: number;
          created_at?: string;
          name?: string | null;
          description?: string | null;
          website?: string | null;
          industry?: string | null;
          location?: string | null;
          employees?: string | null;
        };
      };
      brand_goals: {
        Row: {
          id: number; // BIGINT identity
          created_at: string; // timestamptz
          name: string | null;
          brand_id: number | null; // BIGINT
        };
        Insert: {
          id?: number;
          created_at?: string;
          name?: string | null;
          brand_id?: number | null;
        };
        Update: {
          id?: number;
          created_at?: string;
          name?: string | null;
          brand_id?: number | null;
        };
      };
      brand_competitors: {
        Row: {
          id: number; // BIGINT identity
          created_at: string; // timestamptz
          name: string | null;
          brand_id: number | null; // BIGINT
        };
        Insert: {
          id?: number;
          created_at?: string;
          name?: string | null;
          brand_id?: number | null;
        };
        Update: {
          id?: number;
          created_at?: string;
          name?: string | null;
          brand_id?: number | null;
        };
      };
      signals: {
        Row: {
          id: number; // BIGINT
          created_at: string; // timestamptz
          updated_at: string | null; // timestamp without tz
          copilot_id: string | null; // TEXT
          brand_id: number | null; // BIGINT
          name: string | null; // TEXT
          prompt: string | null; // TEXT
          insights: string | null; // TEXT
          recommendations: string | null; // TEXT
        };
        Insert: {
          id?: number; // BIGINT
          created_at?: string;
          updated_at?: string | null;
          copilot_id?: string | null;
          brand_id?: number | null;
          name?: string | null;
          prompt?: string | null;
          insights?: string | null;
          recommendations?: string | null;
        };
        Update: {
          id?: number; // BIGINT
          created_at?: string;
          updated_at?: string | null;
          copilot_id?: string | null;
          brand_id?: number | null;
          name?: string | null;
          prompt?: string | null;
          insights?: string | null;
          recommendations?: string | null;
        };
      };
    };
  };
}

// Create a single Supabase client instance (singleton pattern)
let supabaseClient: any = null;

const createSupabaseClient = () => {
  if (!supabaseClient && isSupabaseConfigured && supabaseUrl && supabaseAnonKey) {
    supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey);
  }
  return supabaseClient;
};

// Export both the typed client and a regular client (same instance)
export const supabase = createSupabaseClient();
export const typedSupabase = supabase;
