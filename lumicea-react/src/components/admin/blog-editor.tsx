'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { WysiwygEditor } from '@/components/ui/wysiwyg-editor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Save, 
  ArrowLeft, 
  FileText,
  Globe,
  Eye,
  Loader2,
  Calendar,
  Image,
  Tag
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface BlogPostData {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  category: string;
  tags: string[];
  author_id: string;
  meta_title: string;
  meta_description: string;
  is_published: boolean;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
}

interface BlogEditorProps {
  postId?: string;
  onBack: () => void;
  onSave?: (post: BlogPostData) => void;
}

export function BlogEditor({ postId, onBack, onSave }: BlogEditorProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [postData, setPostData] = useState<BlogPostData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    category: '',
    tags: [],
    author_id: '', // Will be set to current user
    meta_title: '',
    meta_description: '',
    is_published: false,
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    // Get current user
    const getCurrentUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setPostData(prev => ({ ...prev, author_id: data.user!.id }));
      }
    };

    // Load categories
    const loadCategories = async () => {
      const { data } = await supabase
        .from('categories')
        .select('id, name')
        .eq('is_active', true);
      
      if (data) {
        setCategories(data);
      }
    };

    getCurrentUser();
    loadCategories();

    if (postId) {
      loadPost(postId);
    } else {
      setLoading(false);
    }
  }, [postId]);

  const loadPost = async (id: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      if (data) {
        setPostData({
          id: data.id,
          title: data.title || '',
          slug: data.slug || '',
          excerpt: data.excerpt || '',
          content: data.content || '',
          featured_image: data.featured_image || '',
          category: data.category || '',
          tags: data.tags || [],
          author_id: data.author_id,
          meta_title: data.meta_title || '',
          meta_description: data.meta_description || '',
          is_published: data.is_published,
          published_at: data.published_at,
          created_at: data.created_at,
          updated_at: data.updated_at,
        });
      }
    } catch (error) {
      console.error('Error loading blog post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setPostData(prev => ({ ...prev, [field]: value }));
  };

  const handleContentChange = (content: string) => {
    setPostData(prev => ({ ...prev, content }));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    handleInputChange('title', title);
    
    // Only auto-generate slug if it's a new post or slug hasn't been manually edited
    if (!postId || postData.slug === generateSlug(postData.title)) {
      handleInputChange('slug', generateSlug(title));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !postData.tags.includes(tagInput.trim())) {
      setPostData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setPostData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Validate required fields
      if (!postData.title || !postData.slug || !postData.content) {
        alert('Title, slug, and content are required');
        return;
      }
      
      const now = new Date().toISOString();
      const postToSave = {
        ...postData,
        updated_at: now,
        published_at: postData.is_published && !postData.published_at ? now : postData.published_at,
      };
      
      let result;
      
      if (postId) {
        // Update existing post
        const { data, error } = await supabase
          .from('blog_posts')
          .update(postToSave)
          .eq('id', postId)
          .select()
          .single();
          
        if (error) throw error;
        result = data;
      } else {
        // Create new post
        const { data, error } = await supabase
          .from('blog_posts')
          .insert({
            ...postToSave,
            created_at: now,
          })
          .select()
          .single();
          
        if (error) throw error;
        result = data;
      }
      
      if (onSave) {
        onSave(result);
      }
      
      alert(postId ? 'Blog post updated successfully!' : 'Blog post created successfully!');
    } catch (error) {
      console.error('Error saving blog post:', error);
      alert('Error saving blog post. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    // Open preview in new tab
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      previewWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${postData.title} - Preview</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
            <style>
              body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
              }
              .preview-header {
                background-color: #f8f9fa;
                border-bottom: 1px solid #ddd;
                padding: 10px 20px;
                margin-bottom: 20px;
                position: sticky;
                top: 0;
                z-index: 100;
              }
              .featured-image {
                width: 100%;
                height: 400px;
                object-fit: cover;
                margin-bottom: 20px;
                border-radius: 8px;
              }
              .content img {
                max-width: 100%;
                height: auto;
                border-radius: 4px;
              }
              .content h1, .content h2, .content h3, .content h4, .content h5, .content h6 {
                margin-top: 1.5em;
                margin-bottom: 0.5em;
                font-weight: 600;
                line-height: 1.25;
              }
              .content h1 { font-size: 2em; }
              .content h2 { font-size: 1.5em; }
              .content h3 { font-size: 1.25em; }
              .content p, .content ul, .content ol {
                margin-bottom: 1em;
              }
              .content a {
                color: #10105A;
                text-decoration: underline;
              }
              .content blockquote {
                border-left: 4px solid #ddd;
                padding-left: 1em;
                margin-left: 0;
                color: #666;
              }
              .tag {
                display: inline-block;
                background-color: #f0f0f0;
                color: #333;
                padding: 0.25rem 0.5rem;
                border-radius: 9999px;
                font-size: 0.75rem;
                margin-right: 0.5rem;
                margin-bottom: 0.5rem;
              }
            </style>
          </head>
          <body>
            <div class="preview-header">
              <div class="flex justify-between items-center">
                <h1 class="text-lg font-bold">Preview: ${postData.title}</h1>
                <button onclick="window.close()" class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Close Preview</button>
              </div>
            </div>
            
            ${postData.featured_image ? `<img src="${postData.featured_image}" alt="${postData.title}" class="featured-image">` : ''}
            
            <h1 class="text-3xl font-bold mb-4">${postData.title}</h1>
            
            <div class="flex items-center text-gray-600 text-sm mb-6">
              <span class="mr-4">Published: ${new Date().toLocaleDateString()}</span>
              <span>Category: ${postData.category || 'Uncategorized'}</span>
            </div>
            
            ${postData.excerpt ? `<p class="text-lg font-medium text-gray-700 mb-6">${postData.excerpt}</p>` : ''}
            
            <div class="content">
              ${postData.content}
            </div>
            
            ${postData.tags.length > 0 ? `
              <div class="mt-8 pt-4 border-t border-gray-200">
                <h3 class="text-sm font-semibold text-gray-700 mb-2">Tags:</h3>
                <div>
                  ${postData.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
              </div>
            ` : ''}
          </body>
        </html>
      `);
      previewWindow.document.close();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lumicea-navy"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{postId ? 'Edit Blog Post' : 'Create New Blog Post'}</h1>
            <p className="text-gray-600">{postId ? 'Update blog post content and settings' : 'Create a new blog post'}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={saving} 
            className="lumicea-button-primary"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {postData.is_published ? 'Publish' : 'Save Draft'}
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="content" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="media">Media & Categories</TabsTrigger>
          <TabsTrigger value="seo">SEO & Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Post Content</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Post Title *</Label>
                <Input
                  id="title"
                  value={postData.title}
                  onChange={handleTitleChange}
                  placeholder="Enter post title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  value={postData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  placeholder="post-url-slug"
                  required
                />
                <p className="text-xs text-gray-500">
                  This will be the URL of your post: yourdomain.com/blog/{postData.slug}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Input
                  id="excerpt"
                  value={postData.excerpt}
                  onChange={(e) => handleInputChange('excerpt', e.target.value)}
                  placeholder="Brief summary of the post"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Post Content *</Label>
                <WysiwygEditor
                  id="content"
                  value={postData.content}
                  onChange={handleContentChange}
                  height="500px"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Image className="h-5 w-5" />
                <span>Featured Image & Categories</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="featured_image">Featured Image URL</Label>
                <Input
                  id="featured_image"
                  value={postData.featured_image}
                  onChange={(e) => handleInputChange('featured_image', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
                {postData.featured_image && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-2">Preview:</p>
                    <img 
                      src={postData.featured_image} 
                      alt="Featured" 
                      className="w-full max-h-64 object-cover rounded-md"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Image+Not+Found';
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={postData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <div className="flex space-x-2">
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add a tag"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddTag}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {postData.tags.map((tag) => (
                    <div 
                      key={tag} 
                      className="flex items-center bg-gray-100 text-gray-800 rounded-full px-3 py-1 text-sm"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      <span>{tag}</span>
                      <button 
                        type="button" 
                        className="ml-2 text-gray-500 hover:text-red-500"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>SEO & Publishing</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="meta_title">Meta Title</Label>
                <Input
                  id="meta_title"
                  value={postData.meta_title}
                  onChange={(e) => handleInputChange('meta_title', e.target.value)}
                  placeholder="SEO optimized title (defaults to post title if empty)"
                />
                <p className="text-xs text-gray-500">
                  Recommended length: 50-60 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta_description">Meta Description</Label>
                <Input
                  id="meta_description"
                  value={postData.meta_description}
                  onChange={(e) => handleInputChange('meta_description', e.target.value)}
                  placeholder="Brief description for search engines"
                />
                <p className="text-xs text-gray-500">
                  Recommended length: 150-160 characters
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={postData.is_published}
                    onCheckedChange={(checked) => handleInputChange('is_published', checked)}
                    id="is_published"
                  />
                  <Label htmlFor="is_published">Publish</Label>
                </div>
                
                {postData.published_at && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {postData.is_published 
                        ? `Published on: ${new Date(postData.published_at).toLocaleDateString()}` 
                        : `Draft saved on: ${new Date(postData.updated_at || '').toLocaleDateString()}`}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}