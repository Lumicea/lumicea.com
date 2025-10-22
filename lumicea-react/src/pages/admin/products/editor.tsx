import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { AlertCircle, Loader2, Plus, Trash2, X, GripVertical } from 'lucide-react';
import { WysiwygEditor } from '@/components/ui/wysiwyg-editor'; // Assuming this exists
import { ImageUploader } from '@/components/admin/image-uploader'; // --- ADDED ---

// (Keep existing interfaces: Variant, Category, Tag)
// ...
interface VariantOption {
  name: string;
  price_change: number;
  is_sold_out: boolean;
  images?: string[];
  sku?: string;
}

interface Variant {
  name: string;
  options: VariantOption[];
}

interface Category {
  id: string;
  name: string;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
  color?: string;
}

interface Product {
  id?: string;
  name: string;
  slug: string;
  description: string | null;
  features: string | null;
  care_instructions: string | null;
  processing_times: string | null;
  base_price: number;
  compare_at_price: number | null;
  cost_price: number | null;
  sku_prefix: string | null;
  quantity: number | null;
  is_active: boolean;
  is_featured: boolean;
  is_made_to_order: boolean;
  images: string[];
  variants: Variant[];
  // These will just hold the IDs for saving
  category_ids: string[]; 
  tag_ids: string[];
}

// ...
// (Keep existing AdminProductEditorProps)
interface AdminProductEditorProps {
  productId?: string | null;
  onSave: () => void;
  onCancel: () => void;
}

const emptyProduct: Product = {
  name: '',
  slug: '',
  description: '',
  features: '',
  care_instructions: '',
  processing_times: '',
  base_price: 0,
  compare_at_price: null,
  cost_price: null,
  sku_prefix: '',
  quantity: 0,
  is_active: true,
  is_featured: false,
  is_made_to_order: false,
  images: [],
  variants: [],
  category_ids: [],
  tag_ids: [],
};

// Simple slugify function
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w-]+/g, '')       // Remove all non-word chars
    .replace(/--+/g, '-');          // Replace multiple - with single -
}

export function AdminProductEditor({ productId, onSave, onCancel }: AdminProductEditorProps) {
  const [product, setProduct] = useState<Product>(emptyProduct);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- START: NEW STATE FOR IMAGES, CATEGORIES, AND TAGS ---
  const [images, setImages] = useState<string[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<string>>(new Set());
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<Set<string>>(new Set());
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#6B7280'); // default gray
  // --- END: NEW STATE ---


  // Fetch existing product data
  useEffect(() => {
    // Reset state for 'new' product
    if (!productId) {
      setProduct(emptyProduct);
      setImages([]); // --- ADDED ---
      setSelectedCategoryIds(new Set()); // --- ADDED ---
      setSelectedTagIds(new Set()); // --- ADDED ---
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_categories ( category_id ),
          product_tags ( tag_id )
        `)
        .eq('id', productId)
        .single();

      if (error || !data) {
        toast.error(`Error fetching product: ${error?.message}`);
        setError('Failed to load product data.');
      } else {
        const productData = {
          ...data,
          base_price: data.base_price || 0,
          variants: data.variants || [],
          images: data.images || [],
          // Extract the IDs from the junction tables
          category_ids: data.product_categories.map((pc: any) => pc.category_id),
          tag_ids: data.product_tags.map((pt: any) => pt.tag_id),
        };
        setProduct(productData as Product);

        // --- POPULATE NEW STATE ---
        setImages(productData.images);
        setSelectedCategoryIds(new Set(productData.category_ids));
        setSelectedTagIds(new Set(productData.tag_ids));
      }
      setLoading(false);
    };

    fetchProduct();
  }, [productId]);
  
  // --- ADDED: Fetch all categories and tags on load ---
  useEffect(() => {
    const fetchMeta = async () => {
      // Fetch Categories
      const { data: categories, error: catError } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');
      if (categories) setAllCategories(categories);

      // Fetch Tags
      const { data: tags, error: tagError } = await supabase
        .from('tags')
        .select('id, name, slug, color')
        .order('name');
      if (tags) setAllTags(tags);
    };
    fetchMeta();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Handle slug generation automatically
    if (name === 'name') {
      setProduct(prev => ({
        ...prev,
        name: value,
        slug: slugify(value), // Auto-update slug
      }));
    } else {
      setProduct(prev => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) || 0 : value,
      }));
    }
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setProduct(prev => ({
      ...prev,
      [name]: checked,
      // If 'Made to Order' is checked, nullify quantity
      ...(name === 'is_made_to_order' && checked && { quantity: null }),
      // If 'Made to Order' is unchecked, set quantity to 0
      ...(name === 'is_made_to_order' && !checked && { quantity: 0 }),
    }));
  };
  
  const handleEditorChange = (name: string, content: string) => {
    setProduct(prev => ({ ...prev, [name]: content }));
  };

  // --- START: NEW IMAGE HANDLERS ---
  const handleImageUploadSuccess = (url: string) => {
    setImages(prev => [...prev, url]);
    toast.success('Image added!');
  };

  const handleImageDelete = (urlToDelete: string) => {
    setImages(prev => prev.filter(url => url !== urlToDelete));
    toast.info('Image removed.');
  };
  // --- END: NEW IMAGE HANDLERS ---
  
  // --- START: NEW CATEGORY/TAG HANDLERS ---
  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategoryIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };
  
  const handleTagToggle = (tagId: string) => {
    setSelectedTagIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(tagId)) {
        newSet.delete(tagId);
      } else {
        newSet.add(tagId);
      }
      return newSet;
    });
  };

  const handleCreateNewTag = async () => {
    if (!newTagName.trim()) {
      toast.error('Tag name cannot be empty.');
      return;
    }
    
    const slug = slugify(newTagName);
    
    // Check if tag with this slug already exists
    const { data: existing, error: checkError } = await supabase
      .from('tags')
      .select('id')
      .eq('slug', slug)
      .single();
      
    if (existing) {
      toast.error('A tag with this name/slug already exists.');
      return;
    }

    const { data: newTag, error } = await supabase
      .from('tags')
      .insert({
        name: newTagName.trim(),
        slug: slug,
        color: newTagColor,
      })
      .select('id, name, slug, color')
      .single();
      
    if (error) {
      toast.error(`Failed to create tag: ${error.message}`);
    } else if (newTag) {
      toast.success(`Tag "${newTag.name}" created!`);
      setAllTags(prev => [...prev, newTag].sort((a, b) => a.name.localeCompare(b.name)));
      // Automatically select the new tag
      setSelectedTagIds(prev => new Set(prev).add(newTag.id));
      setNewTagName('');
    }
  };
  // --- END: NEW CATEGORY/TAG HANDLERS ---

  // ... (Keep existing variant handlers: handleAddVariant, handleVariantChange, etc.) ...
  // (These are complex and not related to the image upload, so we leave them as-is)
  // ...

  const handleSaveProduct = async () => {
    setLoading(true);
    setError(null);
    
    // Prepare the final product object for saving
    const productToSave = {
      ...product,
      images: images, // Use the state-managed images
      // We don't save category_ids or tag_ids directly to the products table
      // So we remove them from the main object
    };
    // @ts-ignore
    delete productToSave.category_ids;
    // @ts-ignore
    delete productToSave.tag_ids;
    // @ts-ignore
    delete productToSave.product_categories;
    // @ts-ignore
    delete productToSave.product_tags;


    // 1. Upsert (Insert or Update) the product
    let savedProductId = productId;
    
    if (productId) {
      // Update existing product
      const { error: productError } = await supabase
        .from('products')
        .update(productToSave)
        .eq('id', productId);
        
      if (productError) {
        toast.error(`Save failed: ${productError.message}`);
        setError(productError.message);
        setLoading(false);
        return;
      }
    } else {
      // Create new product and get its ID
      const { data: newProduct, error: productError } = await supabase
        .from('products')
        .insert(productToSave)
        .select('id')
        .single();
        
      if (productError || !newProduct) {
        toast.error(`Save failed: ${productError.message}`);
        setError(productError.message);
        setLoading(false);
        return;
      }
      savedProductId = newProduct.id;
    }
    
    if (!savedProductId) {
       toast.error('Save failed: Could not get product ID.');
       setLoading(false);
       return;
    }

    // --- START: SYNC JUNCTION TABLES (CATEGORIES & TAGS) ---

    // 2. Sync Categories
    const categoryLinks = Array.from(selectedCategoryIds).map(catId => ({
      product_id: savedProductId,
      category_id: catId,
    }));
    // Remove all existing links for this product
    const { error: deleteCatError } = await supabase
      .from('product_categories')
      .delete()
      .eq('product_id', savedProductId);
    if (deleteCatError) toast.error('Failed to clear old categories.');
    // Add the new links
    if (categoryLinks.length > 0) {
      const { error: insertCatError } = await supabase
        .from('product_categories')
        .insert(categoryLinks);
      if (insertCatError) toast.error('Failed to save categories.');
    }

    // 3. Sync Tags
    const tagLinks = Array.from(selectedTagIds).map(tagId => ({
      product_id: savedProductId,
      tag_id: tagId,
    }));
    // Remove all existing links
    const { error: deleteTagError } = await supabase
      .from('product_tags')
      .delete()
      .eq('product_id', savedProductId);
    if (deleteTagError) toast.error('Failed to clear old tags.');
    // Add new links
    if (tagLinks.length > 0) {
      const { error: insertTagError } = await supabase
        .from('product_tags')
        .insert(tagLinks);
      if (insertTagError) toast.error('Failed to save tags.');
    }
    // --- END: SYNC JUNCTION TABLES ---

    setLoading(false);
    toast.success(`Product ${productId ? 'updated' : 'created'} successfully!`);
    onSave(); // Call parent callback
  };

  if (loading && !product?.name) { // Show full page loader only on initial load
    return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{productId ? 'Edit Product' : 'Create New Product'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* General Information */}
          <Card className="border-gray-300">
            <CardHeader><CardTitle className="text-lg">General Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input id="name" name="name" value={product.name} onChange={handleChange} placeholder="e.g., Gold Hoop Earrings" />
                </div>
                <div>
                  <Label htmlFor="slug">Product Slug</Label>
                  <Input id="slug" name="slug" value={product.slug} onChange={handleChange} placeholder="e.g., gold-hoop-earrings" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description (Full)</Label>
                <WysiwygEditor
                  id="description"
                  value={product.description || ''}
                  onChange={(content) => handleEditorChange('description', content)}
                />
              </div>
            </CardContent>
          </Card>

          {/* --- START: NEW IMAGE UPLOADER SECTION --- */}
          <Card className="border-gray-300">
            <CardHeader><CardTitle className="text-lg">Product Images</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {images.map((url) => (
                  <div key={url} className="relative group aspect-square rounded-md border bg-gray-50 overflow-hidden">
                    <img
                      src={url}
                      alt="Product image"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleImageDelete(url)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <ImageUploader 
                onUploadSuccess={handleImageUploadSuccess}
                folder="products" 
              />
            </CardContent>
          </Card>
          {/* --- END: NEW IMAGE UPLOADER SECTION --- */}

          {/* Pricing */}
          <Card className="border-gray-300">
            <CardHeader><CardTitle className="text-lg">Pricing</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="base_price">Base Price (£)</Label>
                <Input id="base_price" name="base_price" type="number" value={product.base_price} onChange={handleChange} placeholder="e.g., 49.99" />
              </div>
              <div>
                <Label htmlFor="compare_at_price">Compare At Price (£) (Optional)</Label>
                <Input id="compare_at_price" name="compare_at_price" type="number" value={product.compare_at_price || ''} onChange={handleChange} placeholder="e.g., 59.99" />
              </div>
              <div>
                <Label htmlFor="cost_price">Cost Price (£) (Optional)</Label>
                <Input id="cost_price" name="cost_price" type="number" value={product.cost_price || ''} onChange={handleChange} placeholder="e.g., 20.00" />
              </div>
            </CardContent>
          </Card>
          
          {/* Inventory */}
          <Card className="border-gray-300">
            <CardHeader><CardTitle className="text-lg">Inventory</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_made_to_order"
                  checked={product.is_made_to_order}
                  onCheckedChange={(checked) => handleSwitchChange('is_made_to_order', checked)}
                />
                <Label htmlFor="is_made_to_order">Made to Order (Disables quantity)</Label>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sku_prefix">SKU Prefix (Optional)</Label>
                  <Input id="sku_prefix" name="sku_prefix" value={product.sku_prefix || ''} onChange={handleChange} placeholder="e.g., LJH-" />
                </div>
                <div>
                  <Label htmlFor="quantity">Quantity in Stock</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    value={product.quantity === null ? '' : product.quantity}
                    onChange={handleChange}
                    disabled={product.is_made_to_order}
                    placeholder={product.is_made_to_order ? 'N/A (Made to Order)' : 'e.g., 100'}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Organization (Categories & Tags) --- THIS SECTION IS NEW/HEAVILY MODIFIED */}
          <Card className="border-gray-300">
            <CardHeader><CardTitle className="text-lg">Organization</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              {/* Categories */}
              <div>
                <Label className="font-semibold">Categories</Label>
                <div className="mt-2 p-3 max-h-48 overflow-y-auto rounded-md border border-gray-200 bg-gray-50/50 space-y-2">
                  {allCategories.length > 0 ? allCategories.map(cat => (
                    <div key={cat.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`cat-${cat.id}`}
                        checked={selectedCategoryIds.has(cat.id)}
                        onChange={() => handleCategoryToggle(cat.id)}
                        className="h-4 w-4 rounded border-gray-300 text-lumicea-navy focus:ring-lumicea-gold"
                      />
                      <Label htmlFor={`cat-${cat.id}`} className="font-normal">{cat.name}</Label>
                    </div>
                  )) : <p className="text-sm text-gray-500">No categories found.</p>}
                </div>
              </div>
              
              {/* Tags */}
              <div>
                <Label className="font-semibold">Tags</Label>
                <div className="mt-2 p-3 max-h-48 overflow-y-auto rounded-md border border-gray-200 bg-gray-50/50 space-y-2">
                  {allTags.length > 0 ? allTags.map(tag => (
                    <div key={tag.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`tag-${tag.id}`}
                        checked={selectedTagIds.has(tag.id)}
                        onChange={() => handleTagToggle(tag.id)}
                        className="h-4 w-4 rounded border-gray-300 text-lumicea-navy focus:ring-lumicea-gold"
                      />
                      <Label htmlFor={`tag-${tag.id}`} className="font-normal flex items-center">
                        <span className="h-2 w-2 rounded-full mr-2" style={{ backgroundColor: tag.color || '#6B7280' }}></span>
                        {tag.name}
                      </Label>
                    </div>
                  )) : <p className="text-sm text-gray-500">No tags found. Create one below.</p>}
                </div>
              </div>
              
              {/* Create New Tag */}
              <div>
                <Label className="font-semibold">Create New Tag</Label>
                <div className="mt-2 flex items-center gap-2 p-3 rounded-md border border-gray-200">
                  <Input
                    type="color"
                    value={newTagColor}
                    onChange={(e) => setNewTagColor(e.target.value)}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    type="text"
                    placeholder="New tag name (e.g., Best Seller)"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" onClick={handleCreateNewTag} className="shrink-0">
                    <Plus className="h-4 w-4 mr-2" /> Create
                  </Button>
                </div>
              </div>

            </CardContent>
          </Card>
          
          {/* Other Details */}
          <Card className="border-gray-300">
            <CardHeader><CardTitle className="text-lg">Other Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="features">Features (HTML)</Label>
                <WysiwygEditor
                  id="features"
                  value={product.features || ''}
                  onChange={(content) => handleEditorChange('features', content)}
                />
              </div>
              <div>
                <Label htmlFor="care_instructions">Care Instructions (HTML)</Label>
                <WysiwygEditor
                  id="care_instructions"
                  value={product.care_instructions || ''}
                  onChange={(content) => handleEditorChange('care_instructions', content)}
                />
              </div>
              <div>
                <Label htmlFor="processing_times">Processing Times (HTML)</Label>
                 <WysiwygEditor
                  id="processing_times"
                  value={product.processing_times || ''}
                  onChange={(content) => handleEditorChange('processing_times', content)}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Status */}
          <Card className="border-gray-300">
            <CardHeader><CardTitle className="text-lg">Status</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={product.is_active}
                  onCheckedChange={(checked) => handleSwitchChange('is_active', checked)}
                />
                <Label htmlFor="is_active">Active (Visible on storefront)</Label>
              </div>
               <div className="flex items-center space-x-2">
                <Switch
                  id="is_featured"
                  checked={product.is_featured}
                  onCheckedChange={(checked) => handleSwitchChange('is_featured', checked)}
                />
                <Label htmlFor="is_featured">Featured (Show on homepage)</Label>
              </div>
            </CardContent>
          </Card>

          {/* (Variants section would go here - unchanged from your original) */}

        </CardContent>
        <CardFooter>
          <div className="flex w-full justify-end space-x-4">
            {error && <p className="text-sm text-red-600 flex items-center mr-auto"><AlertCircle className="h-4 w-4 mr-2" />{error}</p>}
            <Button variant="outline" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSaveProduct} disabled={loading} className="lumicea-button-primary">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (productId ? 'Save Changes' : 'Create Product')}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
