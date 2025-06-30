import { createClient } from '@supabase/supabase-js';

// Use environment variables with fallbacks to prevent "Invalid API key" errors
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tlcldjsllcytvlvdkria.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsY2xkanNsbGN5dHZsdmRrcmlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMzc4NjcsImV4cCI6MjA2NjcxMzg2N30.Gy1YQYQKcM7ueD-RQZGGpV_HjGWOxTJ6ZVYvz9sSVEY';

// Create Supabase client with error handling
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Log initialization for debugging
console.log('Supabase client initialized with URL:', supabaseUrl.substring(0, 30) + '...');

// Types for our database schema (these will be expanded as we build the database)
export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          description: string;
          brand: string;
          care_instructions: string;
          sku_prefix: string;
          default_lead_time_days: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          brand: string;
          care_instructions: string;
          sku_prefix: string;
          default_lead_time_days?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          brand?: string;
          care_instructions?: string;
          sku_prefix?: string;
          default_lead_time_days?: number;
          updated_at?: string;
        };
      };
      // More tables will be added as we build the schema
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
};