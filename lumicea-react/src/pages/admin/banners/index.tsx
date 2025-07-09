import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
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
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Edit,
  Trash2,
  Image,
  Layout,
  Link as LinkIcon,
  Calendar,
  Save,
  Loader2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatDate } from '@/lib/utils'; // Ensure this utility is available

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  mobile_image_url: string;
  link_url: string;
  link_text: string;
  position: string;
  target_page: string;
  target_category_id: string | null;
  background_color: string;
  text_color: string;
  button_color: string;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

interface Category {
  id: string;
  name: string;
}

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [saving, setSaving] = useState(false);

  const [bannerForm, setBannerForm] = useState({
    title: '',
    subtitle: '',
    image_url: '',
    mobile_image_url: '',
    link_url: '',
    link_text: '',
    position: 'homepage_hero',
    target_page: 'homepage',
    target_category_id: '',
    background_color: '#FFFFFF',
    text_color: '#000000',
    button_color: '#10105A',
    starts_at: '',
    ends_at: '',
    is_active: true,
    sort_order: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Fetch banners
      const { data: bannersData, error: bannersError } = await supabase
        .from('banners')
        .select('*')
        .order('sort_order');

      if (bannersError) throw bannersError;
      setBanners(bannersData || []);

      // Fetch categories for target selection
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name')
        .eq('is_active', true)
        .order('name');

      if (categoriesError) throw categoriesError;
      setCategories(categoriesData || []);

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);

      const formData = {
        ...bannerForm,
        starts_at: bannerForm.starts_at || null,
        ends_at: bannerForm.ends_at || null,
        target_category_id: bannerForm.target_category_id || null,
      };

      if (editingBanner) {
        const { error } = await supabase
          .from('banners')
          .update(formData)
          .eq('id', editingBanner.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('banners')
          .insert([formData]);

        if (error) throw error;
      }

      await loadData();
      setDialogOpen(false);
      resetForm();
      alert(editingBanner ? 'Banner updated successfully!' : 'Banner created successfully!');
    } catch (error) {
      console.error('Error saving banner:', error);
      alert('Error saving banner. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setBannerForm({
      title: '',
      subtitle: '',
      image_url: '',
      mobile_image_url: '',
      link_url: '',
      link_text: '',
      position: 'homepage_hero',
      target_page: 'homepage',
      target_category_id: '',
      background_color: '#FFFFFF',
      text_color: '#000000',
      button_color: '#10105A',
      starts_at: '',
      ends_at: '',
      is_active: true,
      sort_order: 0,
    });
    setEditingBanner(null);
  };

  const editBanner = (banner: Banner) => {
    setEditingBanner(banner);
    setBannerForm({
      title: banner.title,
      subtitle: banner.subtitle || '',
      image_url: banner.image_url || '',
      mobile_image_url: banner.mobile_image_url || '',
      link_url: banner.link_url || '',
      link_text: banner.link_text || '',
      position: banner.position,
      target_page: banner.target_page,
      target_category_id: banner.target_category_id || '',
      background_color: banner.background_color,
      text_color: banner.text_color,
      button_color: banner.button_color,
      starts_at: banner.starts_at ? new Date(banner.starts_at).toISOString().slice(0, 16) : '',
      ends_at: banner.ends_at ? new Date(banner.ends_at).toISOString().slice(0, 16) : '',
      is_active: banner.is_active,
      sort_order: banner.sort_order,
    });
    setDialogOpen(true);
  };

  const deleteBanner = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;

    try {
      const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadData();
      alert('Banner deleted successfully!');
    } catch (error) {
      console.error('Error deleting banner:', error);
      alert('Error deleting banner. Please try again.');
    }
  };

  const getBannerStatus = (banner: Banner) => {
    const now = new Date();
    const startDate = banner.starts_at ? new Date(banner.starts_at) : null;
    const endDate = banner.ends_at ? new Date(banner.ends_at) : null;

    if (!banner.is_active) {
      return { label: 'Inactive', color: 'bg-gray-100 text-gray-800' };
    }

    if (startDate && now < startDate) {
      return { label: 'Scheduled', color: 'bg-blue-100 text-blue-800' };
    }

    if (endDate && now > endDate) {
      return { label: 'Expired', color: 'bg-red-100 text-red-800' };
    }

    return { label: 'Active', color: 'bg-green-100 text-green-800' };
  };

  const getPositionLabel = (position: string) => {
    const positions = {
      'homepage_hero': 'Homepage Hero',
      'homepage_secondary': 'Homepage Secondary',
      'category_header': 'Category Header',
      'product_page': 'Product Page',
      'collection_page': 'Collection Page',
    };
    return positions[position as keyof typeof positions] || position;
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Banners</h1>
          <p className="text-gray-600">Manage promotional banners across your store</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {editingBanner ? 'Edit Banner' : 'Create New Banner'}
              </DialogTitle>
              <DialogDescription>
                Create or edit promotional banners for your store
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Banner Content */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Banner Content</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={bannerForm.title}
                      onChange={(e) => setBannerForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Banner title"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subtitle">Subtitle</Label>
                    <Input
                      id="subtitle"
                      value={bannerForm.subtitle}
                      onChange={(e) => setBannerForm(prev => ({ ...prev, subtitle: e.target.value }))}
                      placeholder="Optional subtitle"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="image_url">Desktop Image URL *</Label>
                    <Input
                      id="image_url"
                      value={bannerForm.image_url}
                      onChange={(e) => setBannerForm(prev => ({ ...prev, image_url: e.target.value }))}
                      placeholder="https://example.com/image.jpg"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile_image_url">Mobile Image URL</Label>
                    <Input
                      id="mobile_image_url"
                      value={bannerForm.mobile_image_url}
                      onChange={(e) => setBannerForm(prev => ({ ...prev, mobile_image_url: e.target.value }))}
                      placeholder="https://example.com/mobile-image.jpg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="link_url">Link URL</Label>
                    <Input
                      id="link_url"
                      value={bannerForm.link_url}
                      onChange={(e) => setBannerForm(prev => ({ ...prev, link_url: e.target.value }))}
                      placeholder="https://example.com/page"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="link_text">Button Text</Label>
                    <Input
                      id="link_text"
                      value={bannerForm.link_text}
                      onChange={(e) => setBannerForm(prev => ({ ...prev, link_text: e.target.value }))}
                      placeholder="Shop Now"
                    />
                  </div>
                </div>
              </div>

              {/* Banner Placement */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Banner Placement</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="position">Position *</Label>
                    <Select
                      value={bannerForm.position}
                      onValueChange={(value) => setBannerForm(prev => ({ ...prev, position: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="homepage_hero">Homepage Hero</SelectItem>
                        <SelectItem value="homepage_secondary">Homepage Secondary</SelectItem>
                        <SelectItem value="category_header">Category Header</SelectItem>
                        <SelectItem value="product_page">Product Page</SelectItem>
                        <SelectItem value="collection_page">Collection Page</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="target_page">Target Page *</Label>
                    <Select
                      value={bannerForm.target_page}
                      onValueChange={(value) => setBannerForm(prev => ({ ...prev, target_page: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="homepage">Homepage</SelectItem>
                        <SelectItem value="category_page">Category Page</SelectItem>
                        <SelectItem value="product_page">Product Page</SelectItem>
                        <SelectItem value="collection_page">Collection Page</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {bannerForm.target_page === 'category_page' && (
                  <div className="space-y-2">
                    <Label htmlFor="target_category_id">Target Category</Label>
                    <Select
                      value={bannerForm.target_category_id}
                      onValueChange={(value) => setBannerForm(prev => ({ ...prev, target_category_id: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="background_color">Background Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="background_color"
                        type="color"
                        value={bannerForm.background_color}
                        onChange={(e) => setBannerForm(prev => ({ ...prev, background_color: e.target.value }))}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        value={bannerForm.background_color}
                        onChange={(e) => setBannerForm(prev => ({ ...prev, background_color: e.target.value }))}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="text_color">Text Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="text_color"
                        type="color"
                        value={bannerForm.text_color}
                        onChange={(e) => setBannerForm(prev => ({ ...prev, text_color: e.target.value }))}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        value={bannerForm.text_color}
                        onChange={(e) => setBannerForm(prev => ({ ...prev, text_color: e.target.value }))}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="button_color">Button Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="button_color"
                        type="color"
                        value={bannerForm.button_color}
                        onChange={(e) => setBannerForm(prev => ({ ...prev, button_color: e.target.value }))}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        value={bannerForm.button_color}
                        onChange={(e) => setBannerForm(prev => ({ ...prev, button_color: e.target.value }))}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Banner Schedule */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Banner Schedule</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="starts_at">Start Date & Time</Label>
                    <Input
                      id="starts_at"
                      type="datetime-local"
                      value={bannerForm.starts_at}
                      onChange={(e) => setBannerForm(prev => ({ ...prev, starts_at: e.target.value }))}
                    />
                    <p className="text-xs text-gray-500">Leave blank for immediate start</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ends_at">End Date & Time</Label>
                    <Input
                      id="ends_at"
                      type="datetime-local"
                      value={bannerForm.ends_at}
                      onChange={(e) => setBannerForm(prev => ({ ...prev, ends_at: e.target.value }))}
                    />
                    <p className="text-xs text-gray-500">Leave blank for no end date</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={bannerForm.is_active}
                    onCheckedChange={(checked) => setBannerForm(prev => ({ ...prev, is_active: checked }))}
                  />
                  <Label>Active</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sort_order">Sort Order</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    value={bannerForm.sort_order}
                    onChange={(e) => setBannerForm(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                  />
                  <p className="text-xs text-gray-500">Lower numbers appear first</p>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
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
                      {editingBanner ? 'Update' : 'Create'} Banner
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Banners Table */}
      <Card>
        <CardHeader>
          <CardTitle>Banner List</CardTitle>
        </CardHeader>
        <CardContent>
          {banners.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Banner</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sort Order</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {banners.map((banner) => {
                  const status = getBannerStatus(banner);

                  return (
                    <TableRow key={banner.id}>
                      <TableCell>
                        <div className="flex items-start space-x-3">
                          {banner.image_url && (
                            <div className="w-16 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                              <img
                                src={banner.image_url}
                                alt={banner.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/160x120?text=No+Image';
                                }}
                              />
                            </div>
                          )}
                          <div>
                            <div className="font-medium">{banner.title}</div>
                            {banner.subtitle && (
                              <div className="text-sm text-gray-500">{banner.subtitle}</div>
                            )}
                            {banner.link_url && (
                              <div className="text-xs text-blue-600 mt-1 truncate max-w-xs">
                                {banner.link_url}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getPositionLabel(banner.position)}
                        </Badge>
                        {banner.target_page === 'category_page' && banner.target_category_id && (
                          <div className="text-xs text-gray-500 mt-1">
                            Category: {categories.find(c => c.id === banner.target_category_id)?.name || 'Unknown'}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {banner.starts_at ? (
                            <div>From: {formatDate(banner.starts_at, 'PP')}</div>
                          ) : (
                            <div>No start date</div>
                          )}
                          {banner.ends_at ? (
                            <div>To: {formatDate(banner.ends_at, 'PP')}</div>
                          ) : (
                            <div>No end date</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={status.color}>
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {banner.sort_order}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button size="sm" variant="outline" onClick={() => editBanner(banner)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => deleteBanner(banner.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <Layout className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No banners found</h3>
              <p className="text-gray-500 mb-4">
                Get started by creating your first banner
              </p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Banner
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Banner Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Banner Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Image className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">Banner Preview</h3>
            <p className="text-gray-500">
              Banner preview will be available in a future update
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}