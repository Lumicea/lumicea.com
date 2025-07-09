// Remove 'use client'; as it's a Next.js specific directive

import React, { useState, useEffect } from 'react';
import { Button } from './components/ui/button'; // Update paths based on your new structure
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'; // Update paths
import { Input } from './components/ui/input'; // Update paths
import { Label } from './components/ui/label'; // Update paths
import { Textarea } from './components/ui/textarea'; // Update paths
import { Switch } from './components/ui/switch'; // Update paths
import { Badge } from './components/ui/badge'; // Update paths
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'; // Update paths
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './components/ui/table'; // Update paths
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './components/ui/dialog'; // Update paths
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
// Assuming 'Edit' icon is also from lucide-react, add it here
import { Edit } from 'lucide-react'; // Add Edit icon import
import { supabase } from './lib/supabase'; // Update paths

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
  robots: string;
  canonical_url: string;
  structured_data: string;
}

interface PageSEO {
  id: string;
  page_path: string;
  page_name: string;
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
  robots: string;
  canonical_url: string;
  structured_data: string;
  is_active: boolean;
  last_updated: string;
}

export default function SEOPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [globalSettings, setGlobalSettings] = useState<SEOSettings>({
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    og_title: '',
    og_description: '',
    og_image: '',
    twitter_card: 'summary_large_image',
    twitter_title: '',
    twitter_description: '',
    twitter_image: '',
    robots: 'index, follow',
    canonical_url: '',
    structured_data: '',
  });

  const [pagesSEO, setPagesSEO] = useState<PageSEO[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageSEO | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Fetch global SEO settings
      // This part assumes supabase is correctly configured for Vite as well
      const { data: settingsData, error: settingsError } = await supabase
        .from('system_settings')
        .select('*')
        .eq('category', 'seo');

      if (settingsError) throw settingsError;

      // Transform settings data into a more usable format
      const settings: Partial<SEOSettings> = {};
      settingsData?.forEach(setting => {
        settings[setting.key as keyof SEOSettings] = setting.value;
      });

      setGlobalSettings({
        ...globalSettings,
        ...settings,
      });

      // Fetch page-specific SEO settings
      // In a real application, this would come from a pages_seo table
      // For now, we'll use mock data
      const mockPagesSEO: PageSEO[] = [
        {
          id: '1',
          page_path: '/',
          page_name: 'Homepage',
          meta_title: 'Lumicea - Handcrafted Beaded Jewelry',
          meta_description: 'Discover exquisite handmade beaded jewelry including nose rings, earrings, and unique adornments.',
          meta_keywords: 'handmade jewelry, beaded jewelry, nose rings, earrings',
          og_title: 'Lumicea - Handcrafted Beaded Jewelry',
          og_description: 'Discover exquisite handmade beaded jewelry including nose rings, earrings, and unique adornments.',
          og_image: '/images/og-image.jpg',
          twitter_card: 'summary_large_image',
          twitter_title: 'Lumicea - Handcrafted Beaded Jewelry',
          twitter_description: 'Discover exquisite handmade beaded jewelry including nose rings, earrings, and unique adornments.',
          twitter_image: '/images/twitter-image.jpg',
          robots: 'index, follow',
          canonical_url: 'https://lumicea.com',
          structured_data: '{}',
          is_active: true,
          last_updated: '2024-06-01T12:00:00Z',
        },
        {
          id: '2',
          page_path: '/categories/nose-rings',
          page_name: 'Nose Rings Category',
          meta_title: 'Nose Rings Collection | Lumicea',
          meta_description: 'Explore our collection of handcrafted nose rings in various styles and materials.',
          meta_keywords: 'nose rings, nose jewelry, handmade nose rings',
          og_title: 'Nose Rings Collection | Lumicea',
          og_description: 'Explore our collection of handcrafted nose rings in various styles and materials.',
          og_image: '/images/nose-rings-og.jpg',
          twitter_card: 'summary_large_image',
          twitter_title: 'Nose Rings Collection | Lumicea',
          twitter_description: 'Explore our collection of handcrafted nose rings in various styles and materials.',
          twitter_image: '/images/nose-rings-twitter.jpg',
          robots: 'index, follow',
          canonical_url: 'https://lumicea.com/categories/nose-rings',
          structured_data: '{}',
          is_active: true,
          last_updated: '2024-06-01T12:00:00Z',
        },
        {
          id: '3',
          page_path: '/categories/earrings',
          page_name: 'Earrings Category',
          meta_title: 'Earrings Collection | Lumicea',
          meta_description: 'Discover our handcrafted earrings collection for every occasion.',
          meta_keywords: 'earrings, handmade earrings, beaded earrings',
          og_title: 'Earrings Collection | Lumicea',
          og_description: 'Discover our handcrafted earrings collection for every occasion.',
          og_image: '/images/earrings-og.jpg',
          twitter_card: 'summary_large_image',
          twitter_title: 'Earrings Collection | Lumicea',
          twitter_description: 'Discover our handcrafted earrings collection for every occasion.',
          twitter_image: '/images/earrings-twitter.jpg',
          robots: 'index, follow',
          canonical_url: 'https://lumicea.com/categories/earrings',
          structured_data: '{}',
          is_active: true,
          last_updated: '2024-06-01T12:00:00Z',
        },
      ];

      setPagesSEO(mockPagesSEO);

    } catch (error) {
      console.error('Error loading SEO data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveGlobalSettings = async () => {
    try {
      setSaving(true);

      // In a real application, this would update the system_settings table
      // For now, we'll just simulate a successful save
      await new Promise(resolve => setTimeout(resolve, 1000));

      alert('Global SEO settings saved successfully!');
    } catch (error) {
      console.error('Error saving global SEO settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof SEOSettings, value: string) => {
    setGlobalSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePageInputChange = (field: keyof PageSEO, value: string | boolean) => {
    if (!currentPage) return;

    setCurrentPage(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const savePageSEO = async () => {
    if (!currentPage) return;

    try {
      setSaving(true);

      // In a real application, this would update the pages_seo table
      // For now, we'll just simulate a successful save
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update the local state
      setPagesSEO(prev =>
        prev.map(page =>
          page.id === currentPage.id ? { ...currentPage, last_updated: new Date().toISOString() } : page
        )
      );

      setEditDialogOpen(false);
      alert('Page SEO settings saved successfully!');
    } catch (error) {
      console.error('Error saving page SEO settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const editPageSEO = (page: PageSEO) => {
    setCurrentPage(page);
    setEditDialogOpen(true);
  };

  const filteredPages = pagesSEO.filter(page =>
    page.page_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.page_path.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lumicea-navy"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SEO Settings</h1>
          <p className="text-gray-600">Optimize your store for search engines</p>
        </div>
      </div>

      <Tabs defaultValue="global" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="global">Global Settings</TabsTrigger>
          <TabsTrigger value="pages">Page-Specific SEO</TabsTrigger>
          <TabsTrigger value="tools">SEO Tools</TabsTrigger>
        </TabsList>

        {/* Global SEO Settings */}
        <TabsContent value="global" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>Global SEO Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="meta_title">Default Meta Title</Label>
                  <Input
                    id="meta_title"
                    value={globalSettings.meta_title}
                    onChange={(e) => handleInputChange('meta_title', e.target.value)}
                    placeholder="Lumicea - Handcrafted Beaded Jewelry"
                  />
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Recommended length: 50-60 characters</span>
                    <span className={`${globalSettings.meta_title.length > 60 ? 'text-red-500' : 'text-gray-500'}`}>
                      {globalSettings.meta_title.length}/60
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meta_description">Default Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    value={globalSettings.meta_description}
                    onChange={(e) => handleInputChange('meta_description', e.target.value)}
                    placeholder="Discover exquisite handmade beaded jewelry including nose rings, earrings, and unique adornments."
                    rows={3}
                  />
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Recommended length: 150-160 characters</span>
                    <span className={`${globalSettings.meta_description.length > 160 ? 'text-red-500' : 'text-gray-500'}`}>
                      {globalSettings.meta_description.length}/160
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meta_keywords">Default Meta Keywords</Label>
                  <Input
                    id="meta_keywords"
                    value={globalSettings.meta_keywords}
                    onChange={(e) => handleInputChange('meta_keywords', e.target.value)}
                    placeholder="handmade jewelry, beaded jewelry, nose rings, earrings"
                  />
                  <p className="text-xs text-gray-500">
                    Comma-separated keywords. Note: Meta keywords have minimal SEO impact in modern search engines.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Open Graph Settings</h3>
                <div className="space-y-2">
                  <Label htmlFor="og_title">OG Title</Label>
                  <Input
                    id="og_title"
                    value={globalSettings.og_title}
                    onChange={(e) => handleInputChange('og_title', e.target.value)}
                    placeholder="Lumicea - Handcrafted Beaded Jewelry"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="og_description">OG Description</Label>
                  <Textarea
                    id="og_description"
                    value={globalSettings.og_description}
                    onChange={(e) => handleInputChange('og_description', e.target.value)}
                    placeholder="Discover exquisite handmade beaded jewelry including nose rings, earrings, and unique adornments."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="og_image">OG Image URL</Label>
                  <Input
                    id="og_image"
                    value={globalSettings.og_image}
                    onChange={(e) => handleInputChange('og_image', e.target.value)}
                    placeholder="https://lumicea.com/images/og-image.jpg"
                  />
                  <p className="text-xs text-gray-500">
                    Recommended size: 1200 x 630 pixels
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Twitter Card Settings</h3>
                <div className="space-y-2">
                  <Label htmlFor="twitter_card">Twitter Card Type</Label>
                  <select
                    id="twitter_card"
                    value={globalSettings.twitter_card}
                    onChange={(e) => handleInputChange('twitter_card', e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="summary">Summary</option>
                    <option value="summary_large_image">Summary with Large Image</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter_title">Twitter Title</Label>
                  <Input
                    id="twitter_title"
                    value={globalSettings.twitter_title}
                    onChange={(e) => handleInputChange('twitter_title', e.target.value)}
                    placeholder="Lumicea - Handcrafted Beaded Jewelry"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter_description">Twitter Description</Label>
                  <Textarea
                    id="twitter_description"
                    value={globalSettings.twitter_description}
                    onChange={(e) => handleInputChange('twitter_description', e.target.value)}
                    placeholder="Discover exquisite handmade beaded jewelry including nose rings, earrings, and unique adornments."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter_image">Twitter Image URL</Label>
                  <Input
                    id="twitter_image"
                    value={globalSettings.twitter_image}
                    onChange={(e) => handleInputChange('twitter_image', e.target.value)}
                    placeholder="https://lumicea.com/images/twitter-image.jpg"
                  />
                  <p className="text-xs text-gray-500">
                    Recommended size: 1200 x 675 pixels
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Advanced Settings</h3>
                <div className="space-y-2">
                  <Label htmlFor="robots">Default Robots Directive</Label>
                  <Input
                    id="robots"
                    value={globalSettings.robots}
                    onChange={(e) => handleInputChange('robots', e.target.value)}
                    placeholder="index, follow"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="canonical_url">Default Canonical URL</Label>
                  <Input
                    id="canonical_url"
                    value={globalSettings.canonical_url}
                    onChange={(e) => handleInputChange('canonical_url', e.target.value)}
                    placeholder="https://lumicea.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="structured_data">Default Structured Data (JSON-LD)</Label>
                  <Textarea
                    id="structured_data"
                    value={globalSettings.structured_data}
                    onChange={(e) => handleInputChange('structured_data', e.target.value)}
                    placeholder='{"@context":"https://schema.org","@type":"Organization","name":"Lumicea","url":"https://lumicea.com"}'
                    rows={5}
                  />
                  <p className="text-xs text-gray-500">
                    Enter valid JSON-LD structured data for rich search results
                  </p>
                </div>
              </div>

              <Button
                onClick={saveGlobalSettings}
                className="lumicea-button-primary"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Global Settings
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Page-Specific SEO */}
        <TabsContent value="pages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Page-Specific SEO</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search pages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Page</TableHead>
                    <TableHead>Meta Title</TableHead>
                    <TableHead>Meta Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPages.map((page) => (
                    <TableRow key={page.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{page.page_name}</div>
                          <div className="text-sm text-gray-500">{page.page_path}</div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate" title={page.meta_title}>
                        {page.meta_title}
                      </TableCell>
                      <TableCell className="max-w-xs truncate" title={page.meta_description}>
                        {page.meta_description}
                      </TableCell>
                      <TableCell>
                        <Badge className={page.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {page.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {new Date(page.last_updated).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => editPageSEO(page)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" asChild>
                            <a href={`https://lumicea.com${page.page_path}`} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Edit Page SEO Dialog */}
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Page SEO</DialogTitle>
                <DialogDescription>
                  {currentPage?.page_name} ({currentPage?.page_path})
                </DialogDescription>
              </DialogHeader>

              {currentPage && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Basic SEO</h3>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={currentPage.is_active}
                          onCheckedChange={(checked) => handlePageInputChange('is_active', checked)}
                        />
                        <Label>Active</Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="page_meta_title">Meta Title</Label>
                      <Input
                        id="page_meta_title"
                        value={currentPage.meta_title}
                        onChange={(e) => handlePageInputChange('meta_title', e.target.value)}
                      />
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Recommended length: 50-60 characters</span>
                        <span className={`${currentPage.meta_title.length > 60 ? 'text-red-500' : 'text-gray-500'}`}>
                          {currentPage.meta_title.length}/60
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="page_meta_description">Meta Description</Label>
                      <Textarea
                        id="page_meta_description"
                        value={currentPage.meta_description}
                        onChange={(e) => handlePageInputChange('meta_description', e.target.value)}
                        rows={3}
                      />
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Recommended length: 150-160 characters</span>
                        <span className={`${currentPage.meta_description.length > 160 ? 'text-red-500' : 'text-gray-500'}`}>
                          {currentPage.meta_description.length}/160
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="page_meta_keywords">Meta Keywords</Label>
                      <Input
                        id="page_meta_keywords"
                        value={currentPage.meta_keywords}
                        onChange={(e) => handlePageInputChange('meta_keywords', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Social Media</h3>

                    <div className="space-y-2">
                      <Label htmlFor="page_og_title">OG Title</Label>
                      <Input
                        id="page_og_title"
                        value={currentPage.og_title}
                        onChange={(e) => handlePageInputChange('og_title', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="page_og_description">OG Description</Label>
                      <Textarea
                        id="page_og_description"
                        value={currentPage.og_description}
                        onChange={(e) => handlePageInputChange('og_description', e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="page_og_image">OG Image URL</Label>
                      <Input
                        id="page_og_image"
                        value={currentPage.og_image}
                        onChange={(e) => handlePageInputChange('og_image', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Advanced Settings</h3>

                    <div className="space-y-2">
                      <Label htmlFor="page_robots">Robots Directive</Label>
                      <Input
                        id="page_robots"
                        value={currentPage.robots}
                        onChange={(e) => handlePageInputChange('robots', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="page_canonical_url">Canonical URL</Label>
                      <Input
                        id="page_canonical_url"
                        value={currentPage.canonical_url}
                        onChange={(e) => handlePageInputChange('canonical_url', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="page_structured_data">Structured Data (JSON-LD)</Label>
                      <Textarea
                        id="page_structured_data"
                        value={currentPage.structured_data}
                        onChange={(e) => handlePageInputChange('structured_data', e.target.value)}
                        rows={5}
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={savePageSEO}
                      className="lumicea-button-primary"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Page SEO
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* SEO Tools */}
        <TabsContent value="tools" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <LinkIcon className="h-5 w-5" />
                <span>SEO Tools</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">SEO Audit</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-gray-600">
                        Run a comprehensive SEO audit of your store to identify issues and opportunities for improvement.
                      </p>
                      <Button className="w-full">
                        Run SEO Audit
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">XML Sitemap</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-gray-600">
                        Generate and manage your XML sitemap to help search engines discover and index your pages.
                      </p>
                      <div className="flex space-x-2">
                        <Button className="flex-1">
                          Generate Sitemap
                        </Button>
                        <Button variant="outline" className="flex-1">
                          View Sitemap
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Robots.txt Editor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-gray-600">
                        Edit your robots.txt file to control how search engines crawl your site.
                      </p>
                      <Button className="w-full">
                        Edit Robots.txt
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Redirect Manager</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-gray-600">
                        Manage URL redirects to maintain SEO value when pages change or move.
                      </p>
                      <Button className="w-full">
                        Manage Redirects
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">SEO Health Check</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-green-900">Meta Titles</h4>
                        <p className="text-sm text-green-800">
                          All pages have meta titles within the recommended length.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-900">Meta Descriptions</h4>
                        <p className="text-sm text-yellow-800">
                          2 pages have meta descriptions that are too short or missing.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-red-900">Image Alt Text</h4>
                        <p className="text-sm text-red-800">
                          15 images are missing alt text, which is important for SEO and accessibility.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                      <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900">SEO Tips</h4>
                        <p className="text-sm text-blue-800">
                          Consider adding more internal links between related products to improve site structure.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}