/*
  # Fix RLS Infinite Recursion

  This migration fixes the infinite recursion error in RLS policies by:
  
  1. Functions
    - Create `is_admin` function with SECURITY DEFINER to bypass RLS
    - Create `get_user_role` function for role checking
  
  2. Policy Updates
    - Replace all direct user_profiles queries in RLS policies with function calls
    - This prevents circular dependencies that cause infinite recursion
  
  3. Security
    - Maintain proper access control while eliminating recursion
    - Functions are SECURITY DEFINER to bypass RLS when checking roles
*/

-- Create function to check if user is admin (bypasses RLS)
CREATE OR REPLACE FUNCTION is_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user role (bypasses RLS)
CREATE OR REPLACE FUNCTION get_user_role(user_id uuid DEFAULT auth.uid())
RETURNS text AS $$
DECLARE
  user_role text;
BEGIN
  SELECT role INTO user_role
  FROM user_profiles
  WHERE id = user_id;
  
  RETURN COALESCE(user_role, 'customer');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop and recreate user_profiles policies to fix recursion
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON user_profiles;

-- Recreate user_profiles policies without recursion
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (is_admin());

-- Update all other policies to use the is_admin function instead of direct queries

-- Categories policies
DROP POLICY IF EXISTS "Admins can manage categories" ON categories;
CREATE POLICY "Admins can manage categories"
  ON categories
  FOR ALL
  TO authenticated
  USING (is_admin());

-- Tags policies
DROP POLICY IF EXISTS "Admins can manage tags" ON tags;
CREATE POLICY "Admins can manage tags"
  ON tags
  FOR ALL
  TO authenticated
  USING (is_admin());

-- Products policies
DROP POLICY IF EXISTS "Admins can manage products" ON products;
CREATE POLICY "Admins can manage products"
  ON products
  FOR ALL
  TO authenticated
  USING (is_admin());

-- Product variants policies
DROP POLICY IF EXISTS "Admins can manage product variants" ON product_variants;
CREATE POLICY "Admins can manage product variants"
  ON product_variants
  FOR ALL
  TO authenticated
  USING (is_admin());

-- Product tags policies
DROP POLICY IF EXISTS "Admins can manage product tags" ON product_tags;
CREATE POLICY "Admins can manage product tags"
  ON product_tags
  FOR ALL
  TO authenticated
  USING (is_admin());

-- Shipping addresses policies
DROP POLICY IF EXISTS "Admins can read all addresses" ON shipping_addresses;
CREATE POLICY "Admins can read all addresses"
  ON shipping_addresses
  FOR SELECT
  TO authenticated
  USING (is_admin());

-- Orders policies
DROP POLICY IF EXISTS "Admins can manage all orders" ON orders;
CREATE POLICY "Admins can manage all orders"
  ON orders
  FOR ALL
  TO authenticated
  USING (is_admin());

-- Order items policies
DROP POLICY IF EXISTS "Admins can manage all order items" ON order_items;
CREATE POLICY "Admins can manage all order items"
  ON order_items
  FOR ALL
  TO authenticated
  USING (is_admin());

-- Inventory alerts policies
DROP POLICY IF EXISTS "Admins can manage inventory alerts" ON inventory_alerts;
CREATE POLICY "Admins can manage inventory alerts"
  ON inventory_alerts
  FOR ALL
  TO authenticated
  USING (is_admin());

-- Stock transactions policies
DROP POLICY IF EXISTS "Admins can manage stock transactions" ON stock_transactions;
CREATE POLICY "Admins can manage stock transactions"
  ON stock_transactions
  FOR ALL
  TO authenticated
  USING (is_admin());

-- Promotions policies
DROP POLICY IF EXISTS "Admins can manage promotions" ON promotions;
CREATE POLICY "Admins can manage promotions"
  ON promotions
  FOR ALL
  TO authenticated
  USING (is_admin());

-- Shipping methods policies
DROP POLICY IF EXISTS "Admins can manage shipping methods" ON shipping_methods;
CREATE POLICY "Admins can manage shipping methods"
  ON shipping_methods
  FOR ALL
  TO authenticated
  USING (is_admin());

-- Tax rates policies
DROP POLICY IF EXISTS "Admins can manage tax rates" ON tax_rates;
CREATE POLICY "Admins can manage tax rates"
  ON tax_rates
  FOR ALL
  TO authenticated
  USING (is_admin());

-- System settings policies
DROP POLICY IF EXISTS "System settings are viewable by admins" ON system_settings;
DROP POLICY IF EXISTS "Admins can manage system settings" ON system_settings;

CREATE POLICY "System settings are viewable by admins"
  ON system_settings
  FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can manage system settings"
  ON system_settings
  FOR ALL
  TO authenticated
  USING (is_admin());

-- Sales reports policies
DROP POLICY IF EXISTS "Admins can manage sales reports" ON sales_reports;
CREATE POLICY "Admins can manage sales reports"
  ON sales_reports
  FOR ALL
  TO authenticated
  USING (is_admin());