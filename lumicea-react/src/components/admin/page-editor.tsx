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
  Loader2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface PageData {
  id?: string;
  title: string;
  slug: string;
  content: string;
  meta_title: string;
  meta_description: string;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

interface PageEditorProps {
  pageId?: string;
  onBack: () => void;
  onSave?: (page: PageData) => void;
}

export function PageEditor({ pageId, onBack, onSave }: PageEditorProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageData, setPageData] = useState<PageData>({
    title: '',
    slug: '',
    content: '',
    meta_title: '',
    meta_description: '',
    is_published: true,
  });

  useEffect(() => {
    if (pageId) {
      loadPage(pageId);
    } else {
      setLoading(false);
    }
  }, [pageId]);

  const loadPage = async (id: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      if (data) {
        setPageData({
          id: data.id,
          title: data.title || '',
          slug: data.slug || '',
          content: data.content || '',
          meta_title: data.meta_title || '',
          meta_description: data.meta_description || '',
          is_published: data.is_published,
          created_at: data.created_at,
          updated_at: data.updated_at,
        });
      }
    } catch (error) {
      console.error('Error loading page:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setPageData(prev => ({ ...prev, [field]: value }));
  };

  const handleContentChange = (content: string) => {
    setPageData(prev => ({ ...prev, content }));
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
    
    // Only auto-generate slug if it's a new page or slug hasn't been manually edited
    if (!pageId || pageData.slug === generateSlug(pageData.title)) {
      handleInputChange('slug', generateSlug(title));
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Validate required fields
      if (!pageData.title || !pageData.slug) {
        alert('Title and slug are required');
        return;
      }
      
      const pageToSave = {
        ...pageData,
        updated_at: new Date().toISOString(),
      };
      
      let result;
      
      if (pageId) {
        // Update existing page
        const { data, error } = await supabase
          .from('pages')
          .update(pageToSave)
          .eq('id', pageId)
          .select()
          .single();
          
        if (error) throw error;
        result = data;
      } else {
        // Create new page
        const { data, error } = await supabase
          .from('pages')
          .insert({
            ...pageToSave,
            created_at: new Date().toISOString(),
          })
          .select()
          .single();
          
        if (error) throw error;
        result = data;
      }
      
      if (onSave) {
        onSave(result);
      }
      
      alert(pageId ? 'Page updated successfully!' : 'Page created successfully!');
    } catch (error) {
      console.error('Error saving page:', error);
      alert('Error saving page. Please try again.');
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
            <title>${pageData.title} - Preview</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
            <style>
              body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 1200px;
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
              .content img {
                max-width: 100%;
                height: auto;
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
            </style>
          </head>
          <body>
            <div class="preview-header">
              <div class="flex justify-between items-center">
                <h1 class="text-lg font-bold">Preview: ${pageData.title}</h1>
                <button onclick="window.close()" class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Close Preview</button>
              </div>
            </div>
            <div class="content">
              ${pageData.content}
            </div>
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
            <h1 className="text-3xl font-bold text-gray-900">{pageId ? 'Edit Page' : 'Create New Page'}</h1>
            <p className="text-gray-600">{pageId ? 'Update page content and settings' : 'Create a new page for your website'}</p>
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
                Save Page
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="content" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="seo">SEO & Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Page Content</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Page Title *</Label>
                <Input
                  id="title"
                  value={pageData.title}
                  onChange={handleTitleChange}
                  placeholder="Enter page title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  value={pageData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  placeholder="page-url-slug"
                  required
                />
                <p className="text-xs text-gray-500">
                  This will be the URL of your page: yourdomain.com/pages/{pageData.slug}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Page Content *</Label>
                <WysiwygEditor
                  id="content"
                  value={pageData.content}
                  onChange={handleContentChange}
                  height="500px"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>SEO Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="meta_title">Meta Title</Label>
                <Input
                  id="meta_title"
                  value={pageData.meta_title}
                  onChange={(e) => handleInputChange('meta_title', e.target.value)}
                  placeholder="SEO optimized title (defaults to page title if empty)"
                />
                <p className="text-xs text-gray-500">
                  Recommended length: 50-60 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta_description">Meta Description</Label>
                <Input
                  id="meta_description"
                  value={pageData.meta_description}
                  onChange={(e) => handleInputChange('meta_description', e.target.value)}
                  placeholder="Brief description for search engines"
                />
                <p className="text-xs text-gray-500">
                  Recommended length: 150-160 characters
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={pageData.is_published}
                  onCheckedChange={(checked) => handleInputChange('is_published', checked)}
                  id="is_published"
                />
                <Label htmlFor="is_published">Published</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}