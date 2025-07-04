import { createClient } from '@supabase/supabase-js';

// Use environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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

type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Types for our database schema
export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          short_description: string | null;
          category_id: string | null;
          base_price: number;
          compare_at_price: number | null;
          cost_price: number | null;
          sku: string | null;
          weight: number | null;
          dimensions: Json | null;
          materials: string[] | null;
          care_instructions: string | null;
          is_active: boolean | null;
          is_featured: boolean | null;
          requires_shipping: boolean | null;
          is_customizable: boolean | null;
          customization_options: Json | null;
          seo_title: string | null;
          seo_description: string | null;
          images: string[] | null;
          sort_order: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          short_description?: string | null;
          category_id?: string | null;
          base_price?: number;
          compare_at_price?: number | null;
          cost_price?: number | null;
          sku?: string | null;
          weight?: number | null;
          dimensions?: Json | null;
          materials?: string[] | null;
          care_instructions?: string | null;
          is_active?: boolean | null;
          is_featured?: boolean | null;
          requires_shipping?: boolean | null;
          is_customizable?: boolean | null;
          customization_options?: Json | null;
          seo_title?: string | null;
          seo_description?: string | null;
          images?: string[] | null;
          sort_order?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          short_description?: string | null;
          category_id?: string | null;
          base_price?: number;
          compare_at_price?: number | null;
          cost_price?: number | null;
          sku?: string | null;
          weight?: number | null;
          dimensions?: Json | null;
          materials?: string[] | null;
          care_instructions?: string | null;
          is_active?: boolean | null;
          is_featured?: boolean | null;
          requires_shipping?: boolean | null;
          is_customizable?: boolean | null;
          customization_options?: Json | null;
          seo_title?: string | null;
          seo_description?: string | null;
          images?: string[] | null;
          sort_order?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      pages: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string | null;
          meta_title: string | null;
          meta_description: string | null;
          is_published: boolean | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          content?: string | null;
          meta_title?: string | null;
          meta_description?: string | null;
          is_published?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          content?: string | null;
          meta_title?: string | null;
          meta_description?: string | null;
          is_published?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      blog_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          is_active: boolean | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          is_active?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          is_active?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: string | null;
          featured_image: string | null;
          category: string | null;
          tags: string[] | null;
          author_id: string | null;
          meta_title: string | null;
          meta_description: string | null;
          is_published: boolean | null;
          published_at: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt?: string | null;
          content?: string | null;
          featured_image?: string | null;
          category?: string | null;
          tags?: string[] | null;
          author_id?: string | null;
          meta_title?: string | null;
          meta_description?: string | null;
          is_published?: boolean | null;
          published_at?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          excerpt?: string | null;
          content?: string | null;
          featured_image?: string | null;
          category?: string | null;
          tags?: string[] | null;
          author_id?: string | null;
          meta_title?: string | null;
          meta_description?: string | null;
          is_published?: boolean | null;
          published_at?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      blog_comments: {
        Row: {
          id: string;
          post_id: string | null;
          user_id: string | null;
          parent_id: string | null;
          author_name: string | null;
          author_email: string | null;
          content: string;
          is_approved: boolean | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          post_id?: string | null;
          user_id?: string | null;
          parent_id?: string | null;
          author_name?: string | null;
          author_email?: string | null;
          content: string;
          is_approved?: boolean | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          post_id?: string | null;
          user_id?: string | null;
          parent_id?: string | null;
          author_name?: string | null;
          author_email?: string | null;
          content?: string;
          is_approved?: boolean | null;
          created_at?: string | null;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          email: string;
          first_name: string | null;
          last_name: string | null;
          phone: string | null;
          role: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          email: string;
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          role?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          role?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          parent_id: string | null;
          sort_order: number | null;
          is_active: boolean | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          parent_id?: string | null;
          sort_order?: number | null;
          is_active?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          parent_id?: string | null;
          sort_order?: number | null;
          is_active?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      tags: {
        Row: {
          id: string;
          name: string;
          slug: string;
          color: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          color?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          color?: string | null;
          created_at?: string | null;
        };
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          name: string;
          sku: string;
          price: number;
          compare_at_price: number | null;
          cost_price: number | null;
          stock_quantity: number | null;
          low_stock_threshold: number | null;
          weight: number | null;
          dimensions: Json | null;
          options: Json | null;
          is_active: boolean | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          product_id: string;
          name: string;
          sku: string;
          price: number;
          compare_at_price?: number | null;
          cost_price?: number | null;
          stock_quantity?: number | null;
          low_stock_threshold?: number | null;
          weight?: number | null;
          dimensions?: Json | null;
          options?: Json | null;
          is_active?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          product_id?: string;
          name?: string;
          sku?: string;
          price?: number;
          compare_at_price?: number | null;
          cost_price?: number | null;
          stock_quantity?: number | null;
          low_stock_threshold?: number | null;
          weight?: number | null;
          dimensions?: Json | null;
          options?: Json | null;
          is_active?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      product_tags: {
        Row: {
          product_id: string;
          tag_id: string;
        };
        Insert: {
          product_id: string;
          tag_id: string;
        };
        Update: {
          product_id?: string;
          tag_id?: string;
        };
      };
      shipping_addresses: {
        Row: {
          id: string;
          user_id: string | null;
          first_name: string;
          last_name: string;
          company: string | null;
          address_line_1: string;
          address_line_2: string | null;
          city: string;
          state: string;
          postal_code: string;
          country: string;
          phone: string | null;
          is_default: boolean | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          first_name: string;
          last_name: string;
          company?: string | null;
          address_line_1: string;
          address_line_2?: string | null;
          city: string;
          state: string;
          postal_code: string;
          country?: string;
          phone?: string | null;
          is_default?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          first_name?: string;
          last_name?: string;
          company?: string | null;
          address_line_1?: string;
          address_line_2?: string | null;
          city?: string;
          state?: string;
          postal_code?: string;
          country?: string;
          phone?: string | null;
          is_default?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          user_id: string | null;
          customer_email: string;
          status: string | null;
          subtotal: number;
          tax_amount: number | null;
          shipping_amount: number | null;
          discount_amount: number | null;
          total_amount: number;
          currency: string | null;
          payment_status: string | null;
          payment_method: string | null;
          shipping_address_id: string | null;
          billing_address_id: string | null;
          shipping_method: string | null;
          tracking_number: string | null;
          notes: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          order_number?: string;
          user_id?: string | null;
          customer_email: string;
          status?: string | null;
          subtotal?: number;
          tax_amount?: number | null;
          shipping_amount?: number | null;
          discount_amount?: number | null;
          total_amount?: number;
          currency?: string | null;
          payment_status?: string | null;
          payment_method?: string | null;
          shipping_address_id?: string | null;
          billing_address_id?: string | null;
          shipping_method?: string | null;
          tracking_number?: string | null;
          notes?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          order_number?: string;
          user_id?: string | null;
          customer_email?: string;
          status?: string | null;
          subtotal?: number;
          tax_amount?: number | null;
          shipping_amount?: number | null;
          discount_amount?: number | null;
          total_amount?: number;
          currency?: string | null;
          payment_status?: string | null;
          payment_method?: string | null;
          shipping_address_id?: string | null;
          billing_address_id?: string | null;
          shipping_method?: string | null;
          tracking_number?: string | null;
          notes?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          variant_id: string | null;
          product_name: string;
          variant_name: string | null;
          sku: string | null;
          quantity: number;
          unit_price: number;
          total_price: number;
          customization_data: Json | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          variant_id?: string | null;
          product_name: string;
          variant_name?: string | null;
          sku?: string | null;
          quantity?: number;
          unit_price: number;
          total_price: number;
          customization_data?: Json | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string | null;
          variant_id?: string | null;
          product_name?: string;
          variant_name?: string | null;
          sku?: string | null;
          quantity?: number;
          unit_price?: number;
          total_price?: number;
          customization_data?: Json | null;
          created_at?: string | null;
        };
      };
      inventory_alerts: {
        Row: {
          id: string;
          variant_id: string;
          alert_type: string;
          message: string;
          current_stock: number;
          threshold: number | null;
          is_read: boolean | null;
          created_at: string | null;
          read_at: string | null;
        };
        Insert: {
          id?: string;
          variant_id: string;
          alert_type: string;
          message: string;
          current_stock: number;
          threshold?: number | null;
          is_read?: boolean | null;
          created_at?: string | null;
          read_at?: string | null;
        };
        Update: {
          id?: string;
          variant_id?: string;
          alert_type?: string;
          message?: string;
          current_stock?: number;
          threshold?: number | null;
          is_read?: boolean | null;
          created_at?: string | null;
          read_at?: string | null;
        };
      };
      stock_transactions: {
        Row: {
          id: string;
          variant_id: string;
          transaction_type: string;
          quantity_change: number;
          previous_quantity: number;
          new_quantity: number;
          reference_id: string | null;
          reference_type: string | null;
          notes: string | null;
          created_by: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          variant_id: string;
          transaction_type: string;
          quantity_change: number;
          previous_quantity: number;
          new_quantity: number;
          reference_id?: string | null;
          reference_type?: string | null;
          notes?: string | null;
          created_by?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          variant_id?: string;
          transaction_type?: string;
          quantity_change?: number;
          previous_quantity?: number;
          new_quantity?: number;
          reference_id?: string | null;
          reference_type?: string | null;
          notes?: string | null;
          created_by?: string | null;
          created_at?: string | null;
        };
      };
      sales_reports: {
        Row: {
          id: string;
          report_date: string;
          report_type: string;
          total_sales: number | null;
          total_orders: number | null;
          total_customers: number | null;
          average_order_value: number | null;
          data: Json | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          report_date: string;
          report_type: string;
          total_sales?: number | null;
          total_orders?: number | null;
          total_customers?: number | null;
          average_order_value?: number | null;
          data?: Json | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          report_date?: string;
          report_type?: string;
          total_sales?: number | null;
          total_orders?: number | null;
          total_customers?: number | null;
          average_order_value?: number | null;
          data?: Json | null;
          created_at?: string | null;
        };
      };
      promotions: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          code: string | null;
          type: string;
          value: number;
          minimum_order_amount: number | null;
          maximum_discount_amount: number | null;
          usage_limit: number | null;
          usage_count: number | null;
          is_active: boolean | null;
          starts_at: string | null;
          ends_at: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          code?: string | null;
          type: string;
          value: number;
          minimum_order_amount?: number | null;
          maximum_discount_amount?: number | null;
          usage_limit?: number | null;
          usage_count?: number | null;
          is_active?: boolean | null;
          starts_at?: string | null;
          ends_at?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          code?: string | null;
          type?: string;
          value?: number;
          minimum_order_amount?: number | null;
          maximum_discount_amount?: number | null;
          usage_limit?: number | null;
          usage_count?: number | null;
          is_active?: boolean | null;
          starts_at?: string | null;
          ends_at?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      shipping_methods: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price: number;
          estimated_days_min: number | null;
          estimated_days_max: number | null;
          is_active: boolean | null;
          sort_order: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          price?: number;
          estimated_days_min?: number | null;
          estimated_days_max?: number | null;
          is_active?: boolean | null;
          sort_order?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          price?: number;
          estimated_days_min?: number | null;
          estimated_days_max?: number | null;
          is_active?: boolean | null;
          sort_order?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      tax_rates: {
        Row: {
          id: string;
          country: string;
          state: string | null;
          city: string | null;
          postal_code: string | null;
          rate: number;
          name: string;
          is_active: boolean | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          country: string;
          state?: string | null;
          city?: string | null;
          postal_code?: string | null;
          rate: number;
          name: string;
          is_active?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          country?: string;
          state?: string | null;
          city?: string | null;
          postal_code?: string | null;
          rate?: number;
          name?: string;
          is_active?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      system_settings: {
        Row: {
          id: string;
          category: string;
          key: string;
          value: Json;
          description: string | null;
          updated_by: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          category: string;
          key: string;
          value: Json;
          description?: string | null;
          updated_by?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          category?: string;
          key?: string;
          value?: Json;
          description?: string | null;
          updated_by?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      promotion_usage: {
        Row: {
          id: string;
          promotion_id: string;
          user_id: string | null;
          order_id: string | null;
          discount_amount: number;
          used_at: string | null;
        };
        Insert: {
          id?: string;
          promotion_id: string;
          user_id?: string | null;
          order_id?: string | null;
          discount_amount: number;
          used_at?: string | null;
        };
        Update: {
          id?: string;
          promotion_id?: string;
          user_id?: string | null;
          order_id?: string | null;
          discount_amount?: number;
          used_at?: string | null;
        };
      };
      customer_segments: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          conditions: Json;
          customer_count: number | null;
          is_active: boolean | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          conditions?: Json;
          customer_count?: number | null;
          is_active?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          conditions?: Json;
          customer_count?: number | null;
          is_active?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      email_campaigns: {
        Row: {
          id: string;
          name: string;
          subject: string;
          content: string;
          segment_id: string | null;
          scheduled_at: string | null;
          sent_at: string | null;
          recipients_count: number | null;
          opened_count: number | null;
          clicked_count: number | null;
          status: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          subject: string;
          content: string;
          segment_id?: string | null;
          scheduled_at?: string | null;
          sent_at?: string | null;
          recipients_count?: number | null;
          opened_count?: number | null;
          clicked_count?: number | null;
          status?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          subject?: string;
          content?: string;
          segment_id?: string | null;
          scheduled_at?: string | null;
          sent_at?: string | null;
          recipients_count?: number | null;
          opened_count?: number | null;
          clicked_count?: number | null;
          status?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      banners: {
        Row: {
          id: string;
          title: string;
          content: string | null;
          image_url: string | null;
          link_url: string | null;
          position: string | null;
          is_active: boolean | null;
          starts_at: string | null;
          ends_at: string | null;
          sort_order: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          content?: string | null;
          image_url?: string | null;
          link_url?: string | null;
          position?: string | null;
          is_active?: boolean | null;
          starts_at?: string | null;
          ends_at?: string | null;
          sort_order?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string | null;
          image_url?: string | null;
          link_url?: string | null;
          position?: string | null;
          is_active?: boolean | null;
          starts_at?: string | null;
          ends_at?: string | null;
          sort_order?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
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

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName]["Row"]
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions]["Row"]
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName]["Insert"]
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions]["Insert"]
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName]["Update"]
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions]["Update"]
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;
