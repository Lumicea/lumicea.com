-- Create pages table
CREATE TABLE IF NOT EXISTS pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text,
  meta_title text,
  meta_description text,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create blog_categories table
CREATE TABLE IF NOT EXISTS blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text,
  featured_image text,
  category text,
  tags text[],
  author_id uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  meta_title text,
  meta_description text,
  is_published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create blog_comments table
CREATE TABLE IF NOT EXISTS blog_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES blog_posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  parent_id uuid REFERENCES blog_comments(id) ON DELETE CASCADE,
  author_name text,
  author_email text,
  content text NOT NULL,
  is_approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;

-- Public can read published pages and blog posts
DROP POLICY IF EXISTS "Public can read published pages" ON pages;
CREATE POLICY "Public can read published pages"
  ON pages FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

DROP POLICY IF EXISTS "Public can read active blog categories" ON blog_categories;
CREATE POLICY "Public can read active blog categories"
  ON blog_categories FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "Public can read published blog posts" ON blog_posts;
CREATE POLICY "Public can read published blog posts"
  ON blog_posts FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

DROP POLICY IF EXISTS "Public can read approved blog comments" ON blog_comments;
CREATE POLICY "Public can read approved blog comments"
  ON blog_comments FOR SELECT
  TO anon, authenticated
  USING (is_approved = true);

-- Admins can manage all content
DROP POLICY IF EXISTS "Admins can manage pages" ON pages;
CREATE POLICY "Admins can manage pages"
  ON pages FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can manage blog categories" ON blog_categories;
CREATE POLICY "Admins can manage blog categories"
  ON blog_categories FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can manage blog posts" ON blog_posts;
CREATE POLICY "Admins can manage blog posts"
  ON blog_posts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can manage blog comments" ON blog_comments;
CREATE POLICY "Admins can manage blog comments"
  ON blog_comments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Authors can manage their own blog posts
DROP POLICY IF EXISTS "Authors can manage their own blog posts" ON blog_posts;
CREATE POLICY "Authors can manage their own blog posts"
  ON blog_posts FOR ALL
  TO authenticated
  USING (author_id = auth.uid());

-- Users can create comments
DROP POLICY IF EXISTS "Users can create comments" ON blog_comments;
CREATE POLICY "Users can create comments"
  ON blog_comments FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Users can update their own comments
DROP POLICY IF EXISTS "Users can update their own comments" ON blog_comments;
CREATE POLICY "Users can update their own comments"
  ON blog_comments FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Users can delete their own comments
DROP POLICY IF EXISTS "Users can delete their own comments" ON blog_comments;
CREATE POLICY "Users can delete their own comments"
  ON blog_comments FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create indexes
CREATE INDEX idx_pages_slug ON pages(slug);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_author ON blog_posts(author_id);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);
CREATE INDEX idx_blog_comments_post ON blog_comments(post_id);

-- Insert default pages
INSERT INTO pages (title, slug, content, is_published) VALUES
  ('About Us', 'about', '<h1>About Lumicea</h1><p>Lumicea is a premium handcrafted jewelry brand specializing in unique, artisanal pieces made with love and attention to detail.</p>', true),
  ('Contact Us', 'contact', '<h1>Contact Us</h1><p>Get in touch with our team for any questions or custom orders.</p>', true),
  ('Privacy Policy', 'privacy-policy', '<h1>Privacy Policy</h1><p>This privacy policy outlines how we collect and use your information.</p>', true),
  ('Terms of Service', 'terms-of-service', '<h1>Terms of Service</h1><p>By using our website, you agree to these terms and conditions.</p>', true)
ON CONFLICT (slug) DO NOTHING;

-- Insert default blog categories
INSERT INTO blog_categories (name, slug, description) VALUES
  ('Jewelry Care', 'jewelry-care', 'Tips and guides for caring for your jewelry'),
  ('Behind the Scenes', 'behind-the-scenes', 'A look at our crafting process and workshop'),
  ('New Collections', 'new-collections', 'Announcements about our latest jewelry collections'),
  ('Styling Tips', 'styling-tips', 'How to style and wear your jewelry pieces')
ON CONFLICT (slug) DO NOTHING;