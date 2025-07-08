/*
  # Fix infinite recursion in user_profiles RLS policies

  1. Problem
    - The "Admins can read all profiles" policy creates infinite recursion
    - It queries user_profiles table while evaluating access to user_profiles table

  2. Solution
    - Drop existing problematic policies
    - Create new policies that avoid recursion
    - Use auth.jwt() for admin checks or simplified approach

  3. New Policies
    - Users can read their own profile
    - Users can update their own profile
    - Simple admin access without recursion
*/

-- Drop existing policies that cause recursion
DROP POLICY IF EXISTS "Admins can read all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

-- Create new policies without recursion
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create a simple admin policy that doesn't cause recursion
-- This policy allows specific admin emails to access all profiles
CREATE POLICY "Specific admins can read all profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN ('admin@lumicea.com', 'swyatt@lumicea.com', 'olipg@hotmail.co.uk')
  );

CREATE POLICY "Specific admins can update all profiles"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN ('admin@lumicea.com', 'swyatt@lumicea.com', 'olipg@hotmail.co.uk')
  )
  WITH CHECK (
    auth.jwt() ->> 'email' IN ('admin@lumicea.com', 'swyatt@lumicea.com', 'olipg@hotmail.co.uk')
  );

-- Allow admins to insert profiles
CREATE POLICY "Specific admins can insert profiles"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.jwt() ->> 'email' IN ('admin@lumicea.com', 'swyatt@lumicea.com', 'olipg@hotmail.co.uk')
  );

-- Allow profile creation for new users (needed for user registration)
CREATE POLICY "Users can create their own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);