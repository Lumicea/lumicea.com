
import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  Switch,
  Badge
} from '@/components/ui'; // Assuming a combined export from a ui index.ts
import { Plus, Trash2, Save, Loader2, ArrowLeft, Image as ImageIcon, Tags, Copy, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { slugify } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';
import { getProductData } from '@/lib/admin-utils';

// Define interfaces for data types
interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  short_description: string;
  sku_prefix: string;
  is_active: boolean;
  is_featured: boolean;
  is_made_to_order: boolean;
  base_price: string;
  images: { url: string; is_master: boolean; sort_order: number; id?: string; }[];
  product_tags: { tag_name: string }[];
  collections: { id: string, collection_name: string }[];
}

interface ProductVariantData {
  id?: string;
  sku: string;
  stock_quantity: number;
  price: string;
  compare_at_price: string;
  options: { variant_type: string, option_name: string, is_sold_out: boolean }[];
  images: { url: string; sort_order: number; }[];
  prices: { region: string, price: string }[];
}

interface OptionData {
  id: string;
  option_name: string;
  is_sold_out: boolean;
}

interface VariantTypeData {
  id: string;
  type_name: string;
}

interface TagData {
  id: string;
  tag_name: string;
}

interface CollectionData {
  id: string;
  collection_name: string;
}

// Main component, renamed from ProductEditor to AdminProductsPage
export function AdminProductsPage({ productId, onBack }: { productId?: string; onBack: () => void; }) {
  const isEditing = !!productId;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ProductFormData>({
    name: '',
    slug: '',
    description: '',
    short_description: '',
    sku_prefix: '',
    is_active: false,
    is_featured: false,
    is_made_to_order: false,
    base_price: '0.00',
    images: [],
    product_tags: [],
    collections: [],
  });

  const [variants, setVariants] = useState<ProductVariantData[]>([]);
  const [variantTypes, setVariantTypes] = useState<VariantTypeData[]>([]);
  const [variantOptions, setVariantOptions] = useState<Record<string, OptionData[]>>({});
  const [allTags, setAllTags] = useState<TagData[]>([]);
  const [allCollections, setAllCollections] = useState<CollectionData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all base data for dropdowns/autocompletes
        const { data: types } = await supabase.from('variant_types').select('*');
        const { data: tags } = await supabase.from('product_tag_names').select('*');
        const { data: collections } = await supabase.from('product_collections').select('*');
        setVariantTypes(types || []);
        setAllTags(tags || []);
        setAllCollections(collections || []);

        // Fetch variant options and group them by type
        const { data: options } = await supabase.from('variant_options').select('*');
        const groupedOptions = options?.reduce((acc, option) => {
          const typeId = option.variant_type_id;
          if (!acc[typeId]) acc[typeId] = [];
          acc[typeId].push(option);
          return acc;
        }, {} as Record<string, OptionData[]>) || {};
        setVariantOptions(groupedOptions);

        // If editing, load existing product data
        if (isEditing) {
          const productData = await getProductData(productId as string);
          if (productData) {
            setForm({
              name: productData.name,
              slug: productData.slug,
              description: productData.description || '',
              short_description: productData.short_description || '',
              sku_prefix: productData.sku_prefix || '',
              is_active: productData.is_active,
              is_featured: productData.is_featured,
              is_made_to_order: productData.is_made_to_order,
              base_price: productData.base_price,
              images: productData.images || [],
              product_tags: productData.product_tags?.map(t => ({ tag_name: t })) || [], // Correctly map to { tag_name: string }[]
              collections: productData.collections || [],
            });
            setVariants(productData.variants || []);
          }
        }
      } catch (error) {
        console.error("Failed to load product data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId, isEditing]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setForm(prev => ({
      ...prev,
      [id]: value,
      slug: id === 'name' ? slugify(value) : prev.slug,
    }));
  };

  const handleToggleChange = (id: keyof ProductFormData, checked: boolean) => {
    setForm(prev => ({
      ...prev,
      [id]: checked,
    }));
  };

  const handleVariantChange = (
    index: number,
    field: keyof ProductVariantData,
    value: any
  ) => {
    const newVariants = [...variants];
    (newVariants[index] as any)[field] = value;
    setVariants(newVariants);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, variantId?: string) => {
    // Implementation will use an Edge Function to securely upload to Cloudinary.
    // For now, we'll just add a placeholder.
    // You would replace this with actual Cloudinary upload logic.
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate Cloudinary upload response
    const imageUrl = URL.createObjectURL(file);
    const newImage = { url: imageUrl, is_master: !variantId, sort_order: form.images.length };

    setForm(prev => ({
      ...prev,
      images: [...prev.images, newImage]
    }));
  };

  const handleDeleteImage = (index: number) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // This is a simplified process. In reality, you'd use a single function
      // on a backend to handle all inserts and updates in a transaction.
      const { data: productData, error: productError } = await supabase
        .from('products')
        .upsert({ ...form, id: productId })
        .select()
        .single();

      if (productError) throw productError;

      // Handle variants, prices, tags, and collections
      // This part requires a lot of complex logic to check for existing records, update, and insert
      // We will focus on the UI and a simple upsert for now to get it working.
      // A more robust solution would involve a custom RPC or Edge Function.

      // Save tags
      const tagNames = form.product_tags.map(t => ({ tag_name: t.tag_name }));
      await supabase.from('product_tag_names').upsert(tagNames, { onConflict: 'tag_name' });
      const { data: existingTags } = await supabase.from('product_tag_names').select('id, tag_name').in('tag_name', tagNames.map(t => t.tag_name));
      const tagsToInsert = existingTags?.map(tag => ({ product_id: productData.id, tag_id: tag.id }));
      await supabase.from('product_to_tag').upsert(tagsToInsert || []);

      alert('Product saved successfully!');
      onBack();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const addVariant = () => {
    setVariants(prev => [
      ...prev,
      {
        sku: '',
        stock_quantity: 0,
        price: '0.00',
        compare_at_price: '0.00',
        options: [],
        images: [],
        prices: []
      }
    ]);
  };

  const removeVariant = (index: number) => {
    setVariants(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = (tagName: string) => {
    if (tagName && !form.product_tags.some(t => t.tag_name === tagName)) {
      setForm(prev => ({
        ...prev,
        product_tags: [...prev.product_tags, { tag_name: tagName }]
      }));
    }
  };

  const removeTag = (tagName: string) => {
    setForm(prev => ({
      ...prev,
      product_tags: prev.product_tags.filter(t => t.tag_name !== tagName)
    }));
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
        <div className="flex items-center space-x-4">
          <Button onClick={onBack} variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? `Edit Product: ${form.name}` : 'Create New Product'}
          </h1>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Save Product
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Product Information */}
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input id="name" value={form.name} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku_prefix">SKU Prefix</Label>
                <Input id="sku_prefix" value={form.sku_prefix} onChange={handleInputChange} placeholder="E.g. GOLD-HM-12" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" value={form.slug} onChange={handleInputChange} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={form.description} onChange={handleInputChange} rows={6} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="short_description">Short Description</Label>
              <Textarea id="short_description" value={form.short_description} onChange={handleInputChange} />
            </div>
          </CardContent>
        </Card>

        {/* Pricing and Stock */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing & Stock</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="base_price">Base Price</Label>
                <Input id="base_price" type="number" step="0.01" value={form.base_price} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="is_made_to_order">Stock Type</Label>
                <div className="flex items-center space-x-2 p-2 rounded-md border border-input">
                  <Switch
                    id="is_made_to_order"
                    checked={form.is_made_to_order}
                    onCheckedChange={(checked) => handleToggleChange('is_made_to_order', checked)}
                  />
                  <Label htmlFor="is_made_to_order">
                    {form.is_made_to_order ? 'Made to Order' : 'Fixed Quantity'}
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Variants */}
        <Card>
          <CardHeader>
            <CardTitle>Variants</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {variants.map((variant, index) => (
              <div key={index} className="border p-4 rounded-md space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-lg">Variant {index + 1}</h3>
                  <Button type="button" variant="destructive" size="sm" onClick={() => removeVariant(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>SKU</Label>
                    <Input value={variant.sku} onChange={(e) => handleVariantChange(index, 'sku', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Price</Label>
                    <Input type="number" step="0.01" value={variant.price} onChange={(e) => handleVariantChange(index, 'price', e.target.value)} />
                  </div>
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addVariant}>
              <Plus className="h-4 w-4 mr-2" />
              Add Variant
            </Button>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Product Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {form.images.map((image, index) => (
                <div key={index} className="relative group aspect-square rounded-md overflow-hidden">
                  <img src={image.url} alt={`Product image ${index + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="destructive" size="icon" onClick={() => handleDeleteImage(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Label htmlFor="image-upload" className="cursor-pointer aspect-square rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-colors">
                <ImageIcon className="h-8 w-8" />
                <Input id="image-upload" type="file" onChange={handleImageUpload} className="sr-only" />
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Tags and Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Tags & Collections</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.product_tags.map((tag, index) => (
                  <Badge key={index} className="flex items-center space-x-1">
                    <span>{tag.tag_name}</span>
                    <Button variant="ghost" size="icon" className="h-4 w-4" onClick={() => removeTag(tag.tag_name)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <Select onValueChange={(value) => addTag(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select or type a tag..." />
                </SelectTrigger>
                <SelectContent>
                  {allTags.map(tag => (
                    <SelectItem key={tag.id} value={tag.tag_name}>
                      {tag.tag_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Status Toggles */}
        <Card>
          <CardHeader>
            <CardTitle>Product Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="is_active">Active (Live on site)</Label>
              <Switch id="is_active" checked={form.is_active} onCheckedChange={(checked) => handleToggleChange('is_active', checked)} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="is_featured">Featured (Promoted on homepage)</Label>
              <Switch id="is_featured" checked={form.is_featured} onCheckedChange={(checked) => handleToggleChange('is_featured', checked)} />
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
