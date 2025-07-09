'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { 
  Search, 
  Globe, 
  FileText, 
  Link as LinkIcon,
  ExternalLink,
  Save,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Corrected import path for Card components
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

interface SEOSettings {
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  og_title: string;
  og_description: string;
  og_image: string;
  twitter_card: string;
  twitter_title: string;
  twitter_description: string;
  twitter_image: string;
  // Add any other SEO specific settings here
}

export default function AdminSeoPage() {
  const [seoSettings, setSeoSettings] = useState<SEOSettings>({
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    og_title: '',
    og_description: '',
    og_image: '',
    twitter_card: '',
    twitter_title: '',
    twitter_description: '',
    twitter_image: '',
  });
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean | null>(null);

  // Dummy data for common SEO issues - in a real app, this would come from a crawler/analytics
  const commonSeoIssues = {
    critical: [
      { id: 1, title: 'Missing Title Tags', description: '3 pages are missing title tags.', status: 'High' },
      { id: 2, title: 'Broken Internal Links', description: '5 internal links are broken.', status: 'High' },
    ],
    warnings: [
      { id: 3, title: 'Short Meta Descriptions', description: '2 pages have meta descriptions that are too short.', status: 'Medium' },
      { id: 4, title: 'Duplicate Content', description: 'Potential duplicate content on product detail pages.', status: 'Medium' },
    ],
    info: [
      { id: 5, title: 'Images Missing Alt Text', description: '15 images are missing alt text.', status: 'Low' },
      { id: 6, title: 'Poor URL Structure', description: 'Some URLs are not SEO-friendly.', status: 'Low' },
    ],
  };

  useEffect(() => {
    const fetchSeoSettings = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('seo_settings')
          .select('*')
          .single(); // Assuming a single row for global SEO settings

        if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
          throw error;
        }

        if (data) {
          setSeoSettings(data);
        }
      } catch (error) {
        console.error('Error fetching SEO settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSeoSettings();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setSeoSettings((prev) => ({ ...prev, [id]: value }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setSaveSuccess(null);
    try {
      const { error } = await supabase
        .from('seo_settings')
        .upsert(seoSettings, { onConflict: 'id' }); // Upsert based on an assumed 'id' column

      if (error) {
        throw error;
      }
      setSaveSuccess(true);
    } catch (error) {
      console.error('Error saving SEO settings:', error);
      setSaveSuccess(false);
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveSuccess(null), 3000); // Hide status after 3 seconds
    }
  };

  return (
    <div className="flex flex-col space-y-6 p-8">
      <h1 className="text-3xl font-bold">SEO & Site Optimization</h1>
      <p className="text-gray-600">
        Manage your website's search engine optimization (SEO) settings to improve visibility and organic traffic.
      </p>

      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <TabsTrigger value="settings">
            <Search className="h-4 w-4 mr-2" />
            General SEO
          </TabsTrigger>
          <TabsTrigger value="social">
            <Globe className="h-4 w-4 mr-2" />
            Social Share
          </TabsTrigger>
          <TabsTrigger value="issues">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Detected Issues
          </TabsTrigger>
          <TabsTrigger value="pages">
            <FileText className="h-4 w-4 mr-2" />
            Page SEO
          </TabsTrigger>
        </TabsList>

        {/* General SEO Settings Tab */}
        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Global SEO Meta Tags</CardTitle>
              <CardDescription>
                These settings apply site-wide unless overridden by specific page settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meta_title">Meta Title</Label>
                <Input
                  id="meta_title"
                  value={seoSettings.meta_title}
                  onChange={handleInputChange}
                  placeholder="Your Website's Catchy Title"
                />
                <p className="text-sm text-gray-500">Appears in browser tabs and search results. (Max 60 characters recommended)</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta_description">Meta Description</Label>
                <Textarea
                  id="meta_description"
                  value={seoSettings.meta_description}
                  onChange={handleInputChange}
                  placeholder="A brief, compelling summary of your website..."
                />
                <p className="text-sm text-gray-500">Summarizes your page content for search engines. (Max 160 characters recommended)</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta_keywords">Meta Keywords</Label>
                <Input
                  id="meta_keywords"
                  value={seoSettings.meta_keywords}
                  onChange={handleInputChange}
                  placeholder="keyword1, keyword2, keyword3"
                />
                <p className="text-sm text-gray-500">Comma-separated keywords relevant to your site (less impactful for SEO now).</p>
              </div>
              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {isSaving ? 'Saving...' : 'Save Settings'}
              </Button>
              {saveSuccess === true && <p className="text-green-600 text-sm mt-2 flex items-center"><CheckCircle className="h-4 w-4 mr-1"/> Settings saved successfully!</p>}
              {saveSuccess === false && <p className="text-red-600 text-sm mt-2 flex items-center"><XCircle className="h-4 w-4 mr-1"/> Failed to save settings. Please try again.</p>}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Share Settings Tab */}
        <TabsContent value="social" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Sharing (Open Graph & Twitter Cards)</CardTitle>
              <CardDescription>
                Control how your website appears when shared on social media platforms like Facebook and Twitter.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="font-semibold text-lg">Open Graph (Facebook, LinkedIn, etc.)</h3>
              <div className="space-y-2">
                <Label htmlFor="og_title">OG Title</Label>
                <Input
                  id="og_title"
                  value={seoSettings.og_title}
                  onChange={handleInputChange}
                  placeholder="Your Website Title for Social Media"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="og_description">OG Description</Label>
                <Textarea
                  id="og_description"
                  value={seoSettings.og_description}
                  onChange={handleInputChange}
                  placeholder="A compelling description for social shares..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="og_image">OG Image URL</Label>
                <Input
                  id="og_image"
                  value={seoSettings.og_image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/social-share-image.jpg"
                />
                <p className="text-sm text-gray-500">URL to an image that will appear when your site is shared. (Recommended: 1200x630px)</p>
              </div>

              <h3 className="font-semibold text-lg mt-6">Twitter Cards</h3>
              <div className="space-y-2">
                <Label htmlFor="twitter_card">Twitter Card Type</Label>
                <Input
                  id="twitter_card"
                  value={seoSettings.twitter_card}
                  onChange={handleInputChange}
                  placeholder="summary_large_image (e.g.)"
                />
                <p className="text-sm text-gray-500">e.g., 'summary', 'summary_large_image', 'app', or 'player'</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter_title">Twitter Title</Label>
                <Input
                  id="twitter_title"
                  value={seoSettings.twitter_title}
                  onChange={handleInputChange}
                  placeholder="Your Website Title for Twitter"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter_description">Twitter Description</Label>
                <Textarea
                  id="twitter_description"
                  value={seoSettings.twitter_description}
                  onChange={handleInputChange}
                  placeholder="A short description for Twitter shares..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter_image">Twitter Image URL</Label>
                <Input
                  id="twitter_image"
                  value={seoSettings.twitter_image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/twitter-image.jpg"
                />
                <p className="text-sm text-gray-500">URL to an image that will appear when your site is shared on Twitter.</p>
              </div>
              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {isSaving ? 'Saving...' : 'Save Settings'}
              </Button>
              {saveSuccess === true && <p className="text-green-600 text-sm mt-2 flex items-center"><CheckCircle className="h-4 w-4 mr-1"/> Settings saved successfully!</p>}
              {saveSuccess === false && <p className="text-red-600 text-sm mt-2 flex items-center"><XCircle className="h-4 w-4 mr-1"/> Failed to save settings. Please try again.</p>}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Detected Issues Tab */}
        <TabsContent value="issues" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <span>Detected SEO Issues</span>
              </CardTitle>
              <CardDescription>
                Below are potential SEO issues detected on your website. Addressing these can improve your search ranking. (Note: This is simulated data.)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {commonSeoIssues.critical.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-red-700 mb-2">Critical Issues</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {commonSeoIssues.critical.map((issue) => (
                        <Card key={issue.id} className="bg-red-50 border-red-200">
                          <CardContent className="p-4 flex items-start space-x-3">
                            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-red-900">{issue.title}</h4>
                              <p className="text-sm text-red-800">{issue.description}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {commonSeoIssues.warnings.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-700 mb-2">Warnings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {commonSeoIssues.warnings.map((issue) => (
                        <Card key={issue.id} className="bg-yellow-50 border-yellow-200">
                          <CardContent className="p-4 flex items-start space-x-3">
                            <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-yellow-900">{issue.title}</h4>
                              <p className="text-sm text-yellow-800">{issue.description}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {commonSeoIssues.info.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-blue-700 mb-2">Information & Suggestions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {commonSeoIssues.info.map((issue) => (
                        <Card key={issue.id} className="bg-blue-50 border-blue-200">
                          <CardContent className="p-4 flex items-start space-x-3">
                            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-blue-900">{issue.title}</h4>
                              <p className="text-sm text-blue-800">{issue.description}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {commonSeoIssues.critical.length === 0 && commonSeoIssues.warnings.length === 0 && commonSeoIssues.info.length === 0 && (
                  <p className="text-center text-gray-500">No major SEO issues detected at this time. Great job!</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Page SEO Overview Tab */}
        <TabsContent value="pages" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Page-Specific SEO</span>
              </CardTitle>
              <CardDescription>
                Overview of SEO health for individual pages. You can click to edit specific page SEO. (Note: This is simulated data.)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Page</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Title Present</TableHead>
                    <TableHead>Meta Desc. Present</TableHead>
                    <TableHead>Indexable</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { id: 1, name: 'Home Page', url: '/', title: true, meta: true, indexable: true },
                    { id: 2, name: 'Product: Gold Ring', url: '/products/gold-ring', title: true, meta: false, indexable: true },
                    { id: 3, name: 'About Us', url: '/about', title: false, meta: true, indexable: true },
                    { id: 4, name: 'Privacy Policy', url: '/legal/privacy', title: true, meta: true, indexable: false }, // Example of non-indexable
                  ].map((page) => (
                    <TableRow key={page.id}>
                      <TableCell className="font-medium">{page.name}</TableCell>
                      <TableCell>
                        <LinkIcon className="inline-block h-4 w-4 mr-1 text-gray-500" />
                        <a href={page.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {page.url}
                          <ExternalLink className="inline-block h-3 w-3 ml-1 text-blue-600" />
                        </a>
                      </TableCell>
                      <TableCell>
                        {page.title ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
                      </TableCell>
                      <TableCell>
                        {page.meta ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
                      </TableCell>
                      <TableCell>
                        {page.indexable ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">Edit SEO</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
