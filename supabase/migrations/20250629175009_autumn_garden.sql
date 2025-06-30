/*
  # Fix Missing Database Tables

  This migration creates all the missing tables that are causing the application errors:
  
  1. New Tables
    - `user_profiles` - User profile information with roles
    - `inventory_alerts` - Low stock and inventory notifications
    - `categories` - Product categories
    - `tags` - Product tags
    - `products` - Main product catalog
    - `product_variants` - Product variations (size, color, etc.)
    - `product_tags` - Many-to-many relationship between products and tags
    - `orders` - Customer orders
    - `order_items` - Individual items within orders
    - `shipping_addresses` - Customer shipping information
    - `promotions` - Marketing promotions and discounts
    - `promotion_usage` - Track promotion usage by customers
    - `shipping_methods` - Available shipping options
    - `tax_rates` - Tax rates by location
    - `system_settings` - Application configuration
    - `sales_reports` - Analytics and reporting data
    - `stock_transactions` - Inventory movement tracking
    - `customer_segments` - Customer segmentation for marketing
    - `email_campaigns` - Email marketing campaigns
    - `banners` - Website banners and announcements

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for authenticated users
    - Admin-only access for sensitive operations

  3. Functions
    - Stock management functions
    - Low stock alert triggers
    - Order management functions
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  first_name text,
  last_name text,
  phone text,
  role text DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can read all profiles" ON user_profiles;
CREATE POLICY "Admins can read all profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  parent_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;
CREATE POLICY "Categories are viewable by everyone"
  ON categories
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage categories" ON categories;
CREATE POLICY "Admins can manage categories"
  ON categories
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  color text DEFAULT '#6B7280',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tags are viewable by everyone" ON tags;
CREATE POLICY "Tags are viewable by everyone"
  ON tags
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can manage tags" ON tags;
CREATE POLICY "Admins can manage tags"
  ON tags
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  short_description text,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  base_price decimal(10,2) NOT NULL DEFAULT 0,
  compare_at_price decimal(10,2),
  cost_price decimal(10,2),
  sku text,
  weight decimal(8,2),
  dimensions jsonb,
  materials text[],
  care_instructions text,
  is_active boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  requires_shipping boolean DEFAULT true,
  is_customizable boolean DEFAULT false,
  customization_options jsonb,
  seo_title text,
  seo_description text,
  images text[] DEFAULT '{}',
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
CREATE POLICY "Products are viewable by everyone"
  ON products
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage products" ON products;
CREATE POLICY "Admins can manage products"
  ON products
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Product variants table
CREATE TABLE IF NOT EXISTS product_variants (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name text NOT NULL,
  sku text UNIQUE NOT NULL,
  price decimal(10,2) NOT NULL,
  compare_at_price decimal(10,2),
  cost_price decimal(10,2),
  stock_quantity integer DEFAULT 0,
  low_stock_threshold integer DEFAULT 5,
  weight decimal(8,2),
  dimensions jsonb,
  options jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Product variants are viewable by everyone" ON product_variants;
CREATE POLICY "Product variants are viewable by everyone"
  ON product_variants
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage product variants" ON product_variants;
CREATE POLICY "Admins can manage product variants"
  ON product_variants
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Product tags junction table
CREATE TABLE IF NOT EXISTS product_tags (
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, tag_id)
);

ALTER TABLE product_tags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Product tags are viewable by everyone" ON product_tags;
CREATE POLICY "Product tags are viewable by everyone"
  ON product_tags
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can manage product tags" ON product_tags;
CREATE POLICY "Admins can manage product tags"
  ON product_tags
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Shipping addresses table
CREATE TABLE IF NOT EXISTS shipping_addresses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  company text,
  address_line_1 text NOT NULL,
  address_line_2 text,
  city text NOT NULL,
  state text NOT NULL,
  postal_code text NOT NULL,
  country text NOT NULL DEFAULT 'US',
  phone text,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE shipping_addresses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own addresses" ON shipping_addresses;
CREATE POLICY "Users can manage own addresses"
  ON shipping_addresses
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can read all addresses" ON shipping_addresses;
CREATE POLICY "Admins can read all addresses"
  ON shipping_addresses
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Orders table (Fixed foreign key relationship)
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number text UNIQUE NOT NULL,
  user_id uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  customer_email text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  subtotal decimal(10,2) NOT NULL DEFAULT 0,
  tax_amount decimal(10,2) DEFAULT 0,
  shipping_amount decimal(10,2) DEFAULT 0,
  discount_amount decimal(10,2) DEFAULT 0,
  total_amount decimal(10,2) NOT NULL DEFAULT 0,
  currency text DEFAULT 'USD',
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_method text,
  shipping_address_id uuid REFERENCES shipping_addresses(id),
  billing_address_id uuid REFERENCES shipping_addresses(id),
  shipping_method text,
  tracking_number text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own orders" ON orders;
CREATE POLICY "Users can read own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can manage all orders" ON orders;
CREATE POLICY "Admins can manage all orders"
  ON orders
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  variant_id uuid REFERENCES product_variants(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  variant_name text,
  sku text,
  quantity integer NOT NULL DEFAULT 1,
  unit_price decimal(10,2) NOT NULL,
  total_price decimal(10,2) NOT NULL,
  customization_data jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own order items" ON order_items;
CREATE POLICY "Users can read own order items"
  ON order_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins can manage all order items" ON order_items;
CREATE POLICY "Admins can manage all order items"
  ON order_items
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Inventory alerts table
CREATE TABLE IF NOT EXISTS inventory_alerts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  variant_id uuid NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  alert_type text NOT NULL CHECK (alert_type IN ('low_stock', 'out_of_stock', 'restock')),
  message text NOT NULL,
  current_stock integer NOT NULL,
  threshold integer,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  read_at timestamptz
);

ALTER TABLE inventory_alerts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage inventory alerts" ON inventory_alerts;
CREATE POLICY "Admins can manage inventory alerts"
  ON inventory_alerts
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Stock transactions table
CREATE TABLE IF NOT EXISTS stock_transactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  variant_id uuid NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  transaction_type text NOT NULL CHECK (transaction_type IN ('sale', 'restock', 'adjustment', 'return')),
  quantity_change integer NOT NULL,
  previous_quantity integer NOT NULL,
  new_quantity integer NOT NULL,
  reference_id uuid,
  reference_type text,
  notes text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE stock_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage stock transactions" ON stock_transactions;
CREATE POLICY "Admins can manage stock transactions"
  ON stock_transactions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Promotions table
CREATE TABLE IF NOT EXISTS promotions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  code text UNIQUE,
  type text NOT NULL CHECK (type IN ('percentage', 'fixed_amount', 'free_shipping')),
  value decimal(10,2) NOT NULL,
  minimum_order_amount decimal(10,2),
  maximum_discount_amount decimal(10,2),
  usage_limit integer,
  usage_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Promotions are viewable by everyone" ON promotions;
CREATE POLICY "Promotions are viewable by everyone"
  ON promotions
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true AND (starts_at IS NULL OR starts_at <= now()) AND (ends_at IS NULL OR ends_at >= now()));

DROP POLICY IF EXISTS "Admins can manage promotions" ON promotions;
CREATE POLICY "Admins can manage promotions"
  ON promotions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Promotion usage table
CREATE TABLE IF NOT EXISTS promotion_usage (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  promotion_id uuid NOT NULL REFERENCES promotions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
  discount_amount decimal(10,2) NOT NULL,
  used_at timestamptz DEFAULT now()
);

ALTER TABLE promotion_usage ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own promotion usage" ON promotion_usage;
CREATE POLICY "Users can read own promotion usage"
  ON promotion_usage
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can manage promotion usage" ON promotion_usage;
CREATE POLICY "Admins can manage promotion usage"
  ON promotion_usage
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Customer segments table
CREATE TABLE IF NOT EXISTS customer_segments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  conditions jsonb NOT NULL DEFAULT '{}',
  customer_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE customer_segments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage customer segments" ON customer_segments;
CREATE POLICY "Admins can manage customer segments"
  ON customer_segments
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Email campaigns table
CREATE TABLE IF NOT EXISTS email_campaigns (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  subject text NOT NULL,
  content text NOT NULL,
  segment_id uuid REFERENCES customer_segments(id) ON DELETE SET NULL,
  scheduled_at timestamptz,
  sent_at timestamptz,
  recipients_count integer DEFAULT 0,
  opened_count integer DEFAULT 0,
  clicked_count integer DEFAULT 0,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage email campaigns" ON email_campaigns;
CREATE POLICY "Admins can manage email campaigns"
  ON email_campaigns
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Banners table
CREATE TABLE IF NOT EXISTS banners (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  content text,
  image_url text,
  link_url text,
  position text DEFAULT 'top' CHECK (position IN ('top', 'middle', 'bottom', 'sidebar')),
  is_active boolean DEFAULT true,
  starts_at timestamptz,
  ends_at timestamptz,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Banners are viewable by everyone" ON banners;
CREATE POLICY "Banners are viewable by everyone"
  ON banners
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true AND (starts_at IS NULL OR starts_at <= now()) AND (ends_at IS NULL OR ends_at >= now()));

DROP POLICY IF EXISTS "Admins can manage banners" ON banners;
CREATE POLICY "Admins can manage banners"
  ON banners
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Shipping methods table
CREATE TABLE IF NOT EXISTS shipping_methods (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL DEFAULT 0,
  estimated_days_min integer,
  estimated_days_max integer,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE shipping_methods ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Shipping methods are viewable by everyone" ON shipping_methods;
CREATE POLICY "Shipping methods are viewable by everyone"
  ON shipping_methods
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage shipping methods" ON shipping_methods;
CREATE POLICY "Admins can manage shipping methods"
  ON shipping_methods
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Tax rates table
CREATE TABLE IF NOT EXISTS tax_rates (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  country text NOT NULL,
  state text,
  city text,
  postal_code text,
  rate decimal(5,4) NOT NULL,
  name text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tax_rates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tax rates are viewable by everyone" ON tax_rates;
CREATE POLICY "Tax rates are viewable by everyone"
  ON tax_rates
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage tax rates" ON tax_rates;
CREATE POLICY "Admins can manage tax rates"
  ON tax_rates
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- System settings table
CREATE TABLE IF NOT EXISTS system_settings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  category text NOT NULL,
  key text NOT NULL,
  value jsonb NOT NULL,
  description text,
  updated_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(category, key)
);

ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "System settings are viewable by admins" ON system_settings;
CREATE POLICY "System settings are viewable by admins"
  ON system_settings
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can manage system settings" ON system_settings;
CREATE POLICY "Admins can manage system settings"
  ON system_settings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Sales reports table
CREATE TABLE IF NOT EXISTS sales_reports (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_date date NOT NULL,
  report_type text NOT NULL CHECK (report_type IN ('daily', 'weekly', 'monthly')),
  total_sales decimal(10,2) DEFAULT 0,
  total_orders integer DEFAULT 0,
  total_customers integer DEFAULT 0,
  average_order_value decimal(10,2) DEFAULT 0,
  data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  UNIQUE(report_date, report_type)
);

ALTER TABLE sales_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage sales reports" ON sales_reports;
CREATE POLICY "Admins can manage sales reports"
  ON sales_reports
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Functions and triggers

-- Function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number() RETURNS text AS $$
DECLARE
  new_number text;
  counter integer;
BEGIN
  -- Get the current date in YYYYMMDD format
  SELECT TO_CHAR(CURRENT_DATE, 'YYYYMMDD') INTO new_number;
  
  -- Get count of orders created today
  SELECT COUNT(*) + 1 INTO counter
  FROM orders
  WHERE DATE(created_at) = CURRENT_DATE;
  
  -- Combine date with zero-padded counter
  new_number := new_number || LPAD(counter::text, 4, '0');
  
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Function to generate return numbers
CREATE OR REPLACE FUNCTION generate_return_number() RETURNS text AS $$
DECLARE
  new_number text;
  counter integer;
BEGIN
  -- Get the current date in YYYYMMDD format
  SELECT 'RET' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') INTO new_number;
  
  -- Get count of returns created today (assuming you have a returns table)
  SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 12) AS INTEGER)), 0) + 1 INTO counter
  FROM orders
  WHERE order_number LIKE 'RET' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '%';
  
  -- Combine date with zero-padded counter
  new_number := new_number || LPAD(counter::text, 4, '0');
  
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Function to update order status
CREATE OR REPLACE FUNCTION update_order_status(
  p_order_id uuid,
  p_new_status text,
  p_tracking_number text DEFAULT NULL
) RETURNS void AS $$
BEGIN
  UPDATE orders
  SET 
    status = p_new_status,
    tracking_number = COALESCE(p_tracking_number, tracking_number),
    updated_at = now()
  WHERE id = p_order_id;
  
  -- If status is shipped, set shipped_at timestamp
  IF p_new_status = 'shipped' THEN
    UPDATE orders
    SET updated_at = now()
    WHERE id = p_order_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update stock and create transactions
CREATE OR REPLACE FUNCTION update_variant_stock(
  p_variant_id uuid,
  p_quantity_change integer,
  p_transaction_type text,
  p_notes text DEFAULT NULL,
  p_reference_id uuid DEFAULT NULL,
  p_reference_type text DEFAULT NULL
) RETURNS void AS $$
DECLARE
  v_current_stock integer;
  v_new_stock integer;
BEGIN
  -- Get current stock
  SELECT stock_quantity INTO v_current_stock
  FROM product_variants
  WHERE id = p_variant_id;
  
  IF v_current_stock IS NULL THEN
    RAISE EXCEPTION 'Product variant not found';
  END IF;
  
  -- Calculate new stock
  v_new_stock := v_current_stock + p_quantity_change;
  
  -- Ensure stock doesn't go negative
  IF v_new_stock < 0 THEN
    RAISE EXCEPTION 'Insufficient stock. Current: %, Requested: %', v_current_stock, ABS(p_quantity_change);
  END IF;
  
  -- Update stock
  UPDATE product_variants
  SET stock_quantity = v_new_stock,
      updated_at = now()
  WHERE id = p_variant_id;
  
  -- Create stock transaction record
  INSERT INTO stock_transactions (
    variant_id,
    transaction_type,
    quantity_change,
    previous_quantity,
    new_quantity,
    reference_id,
    reference_type,
    notes,
    created_by
  ) VALUES (
    p_variant_id,
    p_transaction_type,
    p_quantity_change,
    v_current_stock,
    v_new_stock,
    p_reference_id,
    p_reference_type,
    p_notes,
    auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get low stock variants
CREATE OR REPLACE FUNCTION get_low_stock_variants()
RETURNS TABLE (
  variant_id uuid,
  product_name text,
  variant_name text,
  sku text,
  current_stock integer,
  threshold integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pv.id as variant_id,
    p.name as product_name,
    pv.name as variant_name,
    pv.sku,
    pv.stock_quantity as current_stock,
    pv.low_stock_threshold as threshold
  FROM product_variants pv
  JOIN products p ON p.id = pv.product_id
  WHERE pv.is_active = true 
    AND p.is_active = true
    AND pv.stock_quantity <= pv.low_stock_threshold;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger function to create inventory alerts
CREATE OR REPLACE FUNCTION create_inventory_alert() RETURNS trigger AS $$
BEGIN
  -- Check for low stock
  IF NEW.stock_quantity <= NEW.low_stock_threshold AND NEW.stock_quantity > 0 THEN
    INSERT INTO inventory_alerts (variant_id, alert_type, message, current_stock, threshold)
    VALUES (
      NEW.id,
      'low_stock',
      'Low stock alert: ' || (SELECT p.name FROM products p WHERE p.id = NEW.product_id) || ' - ' || NEW.name,
      NEW.stock_quantity,
      NEW.low_stock_threshold
    )
    ON CONFLICT DO NOTHING;
  END IF;
  
  -- Check for out of stock
  IF NEW.stock_quantity = 0 AND OLD.stock_quantity > 0 THEN
    INSERT INTO inventory_alerts (variant_id, alert_type, message, current_stock, threshold)
    VALUES (
      NEW.id,
      'out_of_stock',
      'Out of stock: ' || (SELECT p.name FROM products p WHERE p.id = NEW.product_id) || ' - ' || NEW.name,
      NEW.stock_quantity,
      NEW.low_stock_threshold
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for inventory alerts
DROP TRIGGER IF EXISTS trigger_inventory_alerts ON product_variants;
CREATE TRIGGER trigger_inventory_alerts
  AFTER UPDATE OF stock_quantity ON product_variants
  FOR EACH ROW
  EXECUTE FUNCTION create_inventory_alert();

-- Trigger to auto-generate order numbers
CREATE OR REPLACE FUNCTION set_order_number() RETURNS trigger AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_order_number ON orders;
CREATE TRIGGER trigger_set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION set_order_number();

-- Insert default admin user (you'll need to update this with your actual user ID)
-- This is a placeholder - you should update it with your actual authenticated user ID
INSERT INTO user_profiles (id, email, first_name, last_name, role)
VALUES (
  '764efd67-2676-4d3a-963f-d3fc72d2d4c9', -- Replace with your actual user ID
  'admin@lumicea.com', -- Replace with your actual email
  'Admin',
  'User',
  'admin'
) ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  updated_at = now();

-- Insert some default categories
INSERT INTO categories (name, slug, description, sort_order) VALUES
  ('Earrings', 'earrings', 'Beautiful earrings for every occasion', 1),
  ('Nose Rings', 'nose-rings', 'Elegant nose rings and studs', 2),
  ('Necklaces', 'necklaces', 'Stunning necklaces and pendants', 3),
  ('Bracelets', 'bracelets', 'Stylish bracelets and bangles', 4),
  ('Rings', 'rings', 'Exquisite rings for every finger', 5)
ON CONFLICT (slug) DO NOTHING;

-- Insert default customer segments
INSERT INTO customer_segments (name, description, conditions) VALUES
  ('All Customers', 'All registered customers', '{}'),
  ('VIP Customers', 'Customers with high lifetime value', '{"min_orders": 10, "min_total_spent": 500}'),
  ('New Customers', 'Customers who joined in the last 30 days', '{"days_since_signup": 30}'),
  ('Inactive Customers', 'Customers who haven''t ordered in 90+ days', '{"days_since_last_order": 90}')
ON CONFLICT DO NOTHING;

-- Insert default shipping methods
INSERT INTO shipping_methods (name, description, price, estimated_days_min, estimated_days_max, sort_order) VALUES
  ('Standard Shipping', 'Standard delivery within 5-7 business days', 5.99, 5, 7, 1),
  ('Express Shipping', 'Fast delivery within 2-3 business days', 12.99, 2, 3, 2),
  ('Overnight Shipping', 'Next business day delivery', 24.99, 1, 1, 3),
  ('Free Shipping', 'Free standard shipping on orders over $50', 0.00, 5, 7, 4)
ON CONFLICT DO NOTHING;

-- Insert default tax rates
INSERT INTO tax_rates (country, state, rate, name) VALUES
  ('US', 'CA', 0.0875, 'California Sales Tax'),
  ('US', 'NY', 0.08, 'New York Sales Tax'),
  ('US', 'TX', 0.0625, 'Texas Sales Tax'),
  ('US', 'FL', 0.06, 'Florida Sales Tax')
ON CONFLICT DO NOTHING;

-- Insert default system settings
INSERT INTO system_settings (category, key, value, description) VALUES
  ('store', 'name', '"Lumicea"', 'Store name'),
  ('store', 'currency', '"USD"', 'Default currency'),
  ('store', 'tax_inclusive', 'false', 'Whether prices include tax'),
  ('inventory', 'track_stock', 'true', 'Enable stock tracking'),
  ('inventory', 'allow_backorders', 'false', 'Allow orders when out of stock'),
  ('shipping', 'free_shipping_threshold', '50.00', 'Minimum order for free shipping')
ON CONFLICT (category, key) DO NOTHING;