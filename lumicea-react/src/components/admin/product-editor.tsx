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
  Plus, 
  Trash2,
  Package,
  Tag,
  DollarSign,
  Image,
  Loader2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ProductVariant {
  id?: string;
  name: string;
  sku: string;
  price: number;
  cost_price: number;
  stock_quantity: number;
  low_stock_threshold: number;
  options: Record<string, string>;
  is_active: boolean;
}

interface ProductData {
  id?: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  sku_prefix: string;
  category_id: string;
  base_price: number;
  cost_price: number;
  weight: number;
  care_instructions: string;
  is_active: boolean;
  is_featured: boolean;
  requires_shipping: boolean;
  seo_title: string;
  seo_description: string;
  images: string[];
  created_at?: string;
  updated_at?: string;
}

interface Category {
  id: string;
  name: string;
}

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface ProductEditorProps {
  productId?: string;
  onBack: () => void;
  onSave?: (product: ProductData) => void;
}

export function ProductEditor({ productId, onBack, onSave }: ProductEditorProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  
  const [productData, setProductData] = useState<ProductData>({
    name: '',
    slug: '',
    description: '',
    short_description: '',
    sku_prefix: '',
    category_id: '',
    base_price: 0,
    cost_price: 0,
    weight: 0,
    care_instructions: '',
    is_active: true,
    is_featured: false,
    requires_shipping: true,
    seo_title: '',
    seo_description: '',
    images: [],
  });

  const [variants, setVariants] = useState<ProductVariant[]>([
    {
      name: 'Default Variant',
      sku: '',
      price: 0,
      cost_price: 0,
      stock_quantity: 0,
      low_stock_threshold: 5,
      options: {},
      is_active: true,
    }
  ]);

  useEffect(() => {
    fetchCategories();
    fetchTags();
    
    if (productId) {
      loadProduct(productId);
    } else {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    // Auto-generate slug from name
    if (productData.name) {
      const slug = productData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      // Only update if it's a new product or the slug hasn't been manually edited
      if (!productId || productData.slug === generateSlug(productData.name)) {
        setProductData(prev => ({ ...prev, slug }));
      }
    }
  }, [productData.name, productId, productData.slug]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchTags = async () => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('id, name, color')
        .order('name');

      if (error) throw error;
      setTags(data || []);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const loadProduct = async (id: string) => {
    try {
      setLoading(true);
      
      // Fetch product data
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (productError) throw productError;
      
      // Fetch product variants
      const { data: variantsData, error: variantsError } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', id)
        .order('name');
      
      if (variantsError) throw variantsError;
      
      // Fetch product tags
      const { data: productTags, error: tagsError } = await supabase
        .from('product_tags')
        .select('tag_id')
        .eq('product_id', id);
      
      if (tagsError) throw tagsError;
      
      // Set product data
      setProductData({
        id: product.id,
        name: product.name || '',
        slug: product.slug || '',
        description: product.description || '',
        short_description: product.short_description || '',
        sku_prefix: product.sku_prefix || '',
        category_id: product.category_id || '',
        base_price: product.base_price || 0,
        cost_price: product.cost_price || 0,
        weight: product.weight || 0,
        care_instructions: product.care_instructions || '',
        is_active: product.is_active,
        is_featured: product.is_featured,
        requires_shipping: product.requires_shipping,
        seo_title: product.seo_title || '',
        seo_description: product.seo_description || '',
        images: product.images || [],
        created_at: product.created_at,
        updated_at: product.updated_at,
      });
      
      // Set variants
      if (variantsData && variantsData.length > 0) {
        setVariants(variantsData.map(v => ({
          id: v.id,
          name: v.name,
          sku: v.sku,
          price: v.price,
          cost_price: v.cost_price || 0,
          stock_quantity: v.stock_quantity || 0,
          low_stock_threshold: v.low_stock_threshold || 5,
          options: v.options || {},
          is_active: v.is_active,
        })));
      }
      
      // Set selected tags
      if (productTags) {
        setSelectedTags(productTags.map(pt => pt.tag_id));
      }
      
    } catch (error) {
      console.error('Error loading product data:', error);
      alert('Error loading product data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setProductData(prev => ({ ...prev, [field]: value }));
  };

  const handleDescriptionChange = (content: string) => {
    setProductData(prev => ({ ...prev, description: content }));
  };

  const handleCareInstructionsChange = (content: string) => {
    setProductData(prev => ({ ...prev, care_instructions: content }));
  };

  const handleVariantChange = (index: number, field: string, value: string | number | boolean) => {
    setVariants(prev => prev.map((variant, i) => 
      i === index ? { ...variant, [field]: value } : variant
    ));
  };

  const addVariant = () => {
    setVariants(prev => [...prev, {
      name: `Variant ${prev.length + 1}`,
      sku: '',
      price: productData.base_price,
      cost_price: productData.cost_price,
      stock_quantity: 0,
      low_stock_threshold: 5,
      options: {},
      is_active: true,
    }]);
  };

  const removeVariant = (index: number) => {
    if (variants.length > 1) {
      setVariants(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const addImage = () => {
    if (imageUrl.trim()) {
      setProductData(prev => ({
        ...prev,
        images: [...prev.images, imageUrl.trim()]
      }));
      setImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setProductData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const validateForm = () => {
    if (!productData.name.trim()) {
      alert('Product name is required');
      return false;
    }
    if (!productData.sku_prefix.trim()) {
      alert('SKU prefix is required');
      return false;
    }
    if (productData.base_price <= 0) {
      alert('Base price must be greater than 0');
      return false;
    }
    if (variants.some(v => !v.sku.trim())) {
      alert('All variants must have a SKU');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      const now = new Date().toISOString();
      
      // Update product
      let productResult;
      if (productId) {
        // Update existing product
        const { data, error } = await supabase
          .from('products')
          .update({
            ...productData,
            updated_at: now,
          })
          .eq('id', productId)
          .select()
          .single();

        if (error) throw error;
        productResult = data;
      } else {
        // Create new product
        const { data, error } = await supabase
          .from('products')
          .insert({
            ...productData,
            created_at: now,
            updated_at: now,
          })
          .select()
          .single();

        if (error) throw error;
        productResult = data;
      }

      // Update or create variants
      const currentProductId = productResult.id;
      
      for (const variant of variants) {
        if (variant.id) {
          // Update existing variant
          const { error } = await supabase
            .from('product_variants')
            .update({
              name: variant.name,
              sku: variant.sku,
              price: variant.price,
              cost_price: variant.cost_price,
              stock_quantity: variant.stock_quantity,
              low_stock_threshold: variant.low_stock_threshold,
              options: variant.options,
              is_active: variant.is_active,
              updated_at: now,
            })
            .eq('id', variant.id);

          if (error) throw error;
        } else {
          // Add new variant
          const { error } = await supabase
            .from('product_variants')
            .insert({
              product_id: currentProductId,
              name: variant.name,
              sku: variant.sku || `${productData.sku_prefix}-${variant.name.replace(/\s+/g, '-').toLowerCase()}`,
              price: variant.price,
              cost_price: variant.cost_price,
              stock_quantity: variant.stock_quantity,
              low_stock_threshold: variant.low_stock_threshold,
              options: variant.options,
              is_active: variant.is_active,
            });

          if (error) throw error;
        }
      }

      // Update tags - first remove all existing tags
      if (productId) {
        await supabase
          .from('product_tags')
          .delete()
          .eq('product_id', productId);
      }

      // Then add selected tags
      if (selectedTags.length > 0) {
        const tagRelations = selectedTags.map(tagId => ({
          product_id: currentProductId,
          tag_id: tagId,
        }));

        const { error: tagsError } = await supabase
          .from('product_tags')
          .insert(tagRelations);

        if (tagsError) throw tagsError;
      }

      if (onSave) {
        onSave(productResult);
      }

      alert(productId ? 'Product updated successfully!' : 'Product created successfully!');
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product. Please try again.');
    } finally {
      setSaving(false);
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
            <h1 className="text-3xl font-bold text-gray-900">{productId ? 'Edit Product' : 'Add New Product'}</h1>
            <p className="text-gray-600">{productId ? 'Update product information and variants' : 'Create a new product for your catalog'}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onBack}>
            Cancel
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
                Save Product
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="variants">Variants</TabsTrigger>
          <TabsTrigger value="images">Images & SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Basic Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={productData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter product name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    value={productData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder="product-url-slug"
                  />
                  <p className="text-xs text-gray-500">
                    Auto-generated from name if left empty
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="short_description">Short Description</Label>
                <Input
                  id="short_description"
                  value={productData.short_description}
                  onChange={(e) => handleInputChange('short_description', e.target.value)}
                  placeholder="Brief description for product listings"
                />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5" />
                    <span>Pricing</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="base_price">Base Price (£) *</Label>
                      <Input
                        id="base_price"
                        type="number"
                        step="0.01"
                        value={productData.base_price}
                        onChange={(e) => handleInputChange('base_price', parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cost_price">Cost Price (£)</Label>
                      <Input
                        id="cost_price"
                        type="number"
                        step="0.01"
                        value={productData.cost_price}
                        onChange={(e) => handleInputChange('cost_price', parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (g)</Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.1"
                        value={productData.weight}
                        onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
                        placeholder="0.0"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={productData.category_id}
                  onChange={(e) => handleInputChange('category_id', e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sku_prefix">SKU Prefix *</Label>
                <Input
                  id="sku_prefix"
                  value={productData.sku_prefix}
                  onChange={(e) => handleInputChange('sku_prefix', e.target.value.toUpperCase())}
                  placeholder="LUM-NR"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <div
                      key={tag.id}
                      onClick={() => handleTagToggle(tag.id)}
                      className={`cursor-pointer px-3 py-1 rounded-full text-sm transition-colors ${
                        selectedTags.includes(tag.id)
                          ? 'bg-lumicea-navy text-white'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                      style={selectedTags.includes(tag.id) ? {} : { borderColor: tag.color }}
                    >
                      {tag.name}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={productData.is_active}
                    onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                    id="is_active"
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={productData.is_featured}
                    onCheckedChange={(checked) => handleInputChange('is_featured', checked)}
                    id="is_featured"
                  />
                  <Label htmlFor="is_featured">Featured</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={productData.requires_shipping}
                    onCheckedChange={(checked) => handleInputChange('requires_shipping', checked)}
                    id="requires_shipping"
                  />
                  <Label htmlFor="requires_shipping">Requires Shipping</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="description" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="description">Full Description</Label>
                <WysiwygEditor
                  id="description"
                  value={productData.description}
                  onChange={handleDescriptionChange}
                  height="400px"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="care_instructions">Care Instructions</Label>
                <WysiwygEditor
                  id="care_instructions"
                  value={productData.care_instructions}
                  onChange={handleCareInstructionsChange}
                  height="300px"
                  toolbarOptions={[
                    ['bold', 'italic', 'underline'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    ['clean']
                  ]}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="variants" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Product Variants</CardTitle>
              <Button onClick={addVariant} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Variant
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {variants.map((variant, index) => (
                <div key={index} className="border rounded-lg p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Variant {index + 1}</h3>
                    {variants.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeVariant(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Variant Name</Label>
                      <Input
                        value={variant.name}
                        onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                        placeholder="e.g., Silver 7mm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>SKU</Label>
                      <Input
                        value={variant.sku}
                        onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                        placeholder="e.g., LUM-NR-001"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Price (£)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={variant.price}
                        onChange={(e) => handleVariantChange(index, 'price', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Cost Price (£)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={variant.cost_price}
                        onChange={(e) => handleVariantChange(index, 'cost_price', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Stock Quantity</Label>
                      <Input
                        type="number"
                        value={variant.stock_quantity}
                        onChange={(e) => handleVariantChange(index, 'stock_quantity', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Low Stock Threshold</Label>
                      <Input
                        type="number"
                        value={variant.low_stock_threshold}
                        onChange={(e) => handleVariantChange(index, 'low_stock_threshold', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={variant.is_active}
                      onCheckedChange={(checked) => handleVariantChange(index, 'is_active', checked)}
                      id={`variant-${index}-active`}
                    />
                    <Label htmlFor={`variant-${index}-active`}>Active</Label>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Image className="h-5 w-5" />
                <span>Product Images</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="image_url">Add Image URL</Label>
                <div className="flex space-x-2">
                  <Input
                    id="image_url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                  <Button onClick={addImage}>Add</Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {productData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-full h-48 object-cover rounded-md"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                      }}
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t">
                <h3 className="text-lg font-semibold mb-4">SEO Settings</h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="seo_title">SEO Title</Label>
                    <Input
                      id="seo_title"
                      value={productData.seo_title}
                      onChange={(e) => handleInputChange('seo_title', e.target.value)}
                      placeholder="SEO optimized title"
                    />
                    <p className="text-xs text-gray-500">
                      {productData.seo_title.length}/60 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="seo_description">SEO Description</Label>
                    <Input
                      id="seo_description"
                      value={productData.seo_description}
                      onChange={(e) => handleInputChange('seo_description', e.target.value)}
                      placeholder="SEO meta description"
                    />
                    <p className="text-xs text-gray-500">
                      {productData.seo_description.length}/160 characters
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}