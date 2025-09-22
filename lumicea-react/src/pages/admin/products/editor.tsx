import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, Plus, X } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { v4 as uuidv4 } from 'uuid';

// Define the shape of a single image
interface ProductImage {
  id: string;
  url: string;
  altText: string;
  isMain: boolean;
  variantId?: string; // Optional field to link to a specific variant
}

// Define the shape of a single product variant option
interface VariantOption {
  id: string;
  name: string;
  price_change: number;
}

// Define the shape of a single product variant
interface ProductVariant {
  id: string;
  name: string;
  options: VariantOption[];
}

// Define the shape of our full product data
interface Product {
  id?: string;
  name: string;
  sku_prefix: string;
  base_price: number;
  description: string;
  features: string;
  is_active: boolean;
  is_featured: boolean;
  images: ProductImage[];
  variants: ProductVariant[];
  tags: string[];
}

/**
 * ProductEditor component for creating and editing a product.
 * @param productId The ID of the product to edit, or null for a new product.
 * @param onBack Callback function to navigate back to the product list.
 */
export function ProductEditor({ productId, onBack }: { productId: string | null; onBack: () => void }) {
  const [product, setProduct] = useState<Product>({
    name: '',
    sku_prefix: '',
    base_price: 0,
    description: '',
    features: '',
    is_active: true,
    is_featured: false,
    images: [],
    variants: [],
    tags: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (productId) {
      setIsNewProduct(false);
      const fetchProduct = async () => {
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', productId)
            .single();

          if (error) {
            throw error;
          }
          if (data) {
            // Parse JSON fields from the database
            setProduct({ 
              ...data,
              base_price: parseFloat(data.base_price),
              images: data.images || [],
              variants: data.variants || [],
              tags: data.tags || [],
            });
          }
        } catch (err) {
          console.error('Failed to fetch product:', err);
          setError('Failed to load product details.');
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    } else {
      setIsNewProduct(true);
      setProduct({
        name: '',
        sku_prefix: '',
        base_price: 0,
        description: '',
        features: '',
        is_active: true,
        is_featured: false,
        images: [],
        variants: [],
        tags: [],
      });
    }
  }, [productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target;
    if (type === 'checkbox' && 'checked' in e.target) {
        setProduct(prev => ({ ...prev, [id]: e.target.checked }));
    } else {
        setProduct(prev => ({ ...prev, [id]: value }));
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setProduct(prev => ({
      ...prev,
      base_price: parseFloat(value) || 0,
    }));
  };

  const addVariant = () => {
    setProduct(prev => ({
      ...prev,
      variants: [...prev.variants, { id: uuidv4(), name: '', options: [] }],
    }));
  };

  const addVariantOption = (variantId: string) => {
    setProduct(prev => ({
      ...prev,
      variants: prev.variants.map(variant =>
        variant.id === variantId
          ? { ...variant, options: [...variant.options, { id: uuidv4(), name: '', price_change: 0 }] }
          : variant
      ),
    }));
  };

  const handleVariantChange = (variantId: string, value: string) => {
    setProduct(prev => ({
      ...prev,
      variants: prev.variants.map(variant =>
        variant.id === variantId
          ? { ...variant, name: value }
          : variant
      ),
    }));
  };

  const handleVariantOptionChange = (variantId: string, optionId: string, field: 'name' | 'price_change', value: string | number) => {
    setProduct(prev => ({
      ...prev,
      variants: prev.variants.map(variant =>
        variant.id === variantId
          ? {
              ...variant,
              options: variant.options.map(option =>
                option.id === optionId
                  ? { ...option, [field]: value }
                  : option
              ),
            }
          : variant
      ),
    }));
  };

  const addTag = () => {
    if (newTag.trim() !== '' && !product.tags.includes(newTag.trim())) {
      setProduct(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setProduct(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Prepare data for Supabase by ensuring arrays are JSON strings
    const productToSave = {
      ...product,
      images: JSON.stringify(product.images),
      variants: JSON.stringify(product.variants),
      tags: JSON.stringify(product.tags),
    };

    try {
      if (isNewProduct) {
        const { error } = await supabase.from('products').insert(productToSave);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').update(productToSave).eq('id', productId);
        if (error) throw error;
      }
      onBack();
    } catch (err) {
      console.error('Failed to save product:', err);
      setError('Failed to save product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !product.id) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-gray-50">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack} disabled={loading}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          <span className="text-[#0a0a4a]">Back to List</span>
        </Button>
        <h1 className="text-3xl font-bold text-[#0a0a4a]">{isNewProduct ? 'New Product' : `Edit Product: ${product.name}`}</h1>
      </div>

      <Card className="rounded-xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-[#0a0a4a]">Product Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700">Product Name</Label>
            <Input id="name" value={product.name} onChange={handleChange} required className="border-gray-300 focus:border-[#ddb866]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sku_prefix" className="text-gray-700">SKU Prefix</Label>
            <Input id="sku_prefix" value={product.sku_prefix} onChange={handleChange} required className="border-gray-300 focus:border-[#ddb866]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="base_price" className="text-gray-700">Base Price</Label>
            <Input id="base_price" type="number" value={product.base_price} onChange={handlePriceChange} required min="0" step="0.01" className="border-gray-300 focus:border-[#ddb866]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-700">Product Description</Label>
            <Textarea id="description" value={product.description} onChange={handleChange} className="border-gray-300 focus:border-[#ddb866]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="features" className="text-gray-700">Product Features</Label>
            <Textarea id="features" value={product.features} onChange={handleChange} className="border-gray-300 focus:border-[#ddb866]" />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="is_active" checked={product.is_active} onCheckedChange={(checked) => setProduct(prev => ({ ...prev, is_active: !!checked }))} />
            <Label htmlFor="is_active" className="text-gray-700">Active</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="is_featured" checked={product.is_featured} onCheckedChange={(checked) => setProduct(prev => ({ ...prev, is_featured: !!checked }))} />
            <Label htmlFor="is_featured" className="text-gray-700">Featured</Label>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-[#0a0a4a]">Product Variants</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-500">Add master variant sections like "Hoop Material" or "Gauge".</p>
          {product.variants.map((variant, variantIndex) => (
            <div key={variant.id} className="space-y-2 border-l-2 pl-4 border-[#ddb866]">
              <div className="flex items-center space-x-2">
                <Label className="text-gray-700">Variant Name</Label>
                <Input value={variant.name} onChange={(e) => handleVariantChange(variant.id, e.target.value)} placeholder="e.g., Hoop Material" className="border-gray-300 focus:border-[#ddb866]" />
              </div>
              <div className="space-y-2 ml-4 mt-2">
                <p className="text-sm text-gray-500">Add options for this variant.</p>
                {variant.options.map((option, optionIndex) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Input
                      value={option.name}
                      onChange={(e) => handleVariantOptionChange(variant.id, option.id, 'name', e.target.value)}
                      placeholder="Option Name (e.g., Gold)"
                      className="border-gray-300 focus:border-[#ddb866]"
                    />
                    <Input
                      type="number"
                      value={option.price_change}
                      onChange={(e) => handleVariantOptionChange(variant.id, option.id, 'price_change', parseFloat(e.target.value) || 0)}
                      placeholder="Price Change"
                      step="0.01"
                      className="border-gray-300 focus:border-[#ddb866]"
                    />
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={() => addVariantOption(variant.id)} className="border-[#ddb866] text-[#ddb866] hover:bg-[#ddb866] hover:text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              </div>
            </div>
          ))}
          <Button type="button" onClick={addVariant} className="bg-[#ddb866] text-white hover:bg-[#ddb866]/80 shadow-md">
            <Plus className="h-4 w-4 mr-2" />
            Add Variant Section
          </Button>
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-[#0a0a4a]">Product Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-500">
            This is a placeholder for image uploads. We will integrate with Cloudinary in a future step.
          </p>
          {product.images.map((image, index) => (
            <div key={image.id} className="flex items-center space-x-2">
              <Input
                value={image.url}
                onChange={(e) => {
                  const newImages = [...product.images];
                  newImages[index].url = e.target.value;
                  setProduct(prev => ({ ...prev, images: newImages }));
                }}
                placeholder="Image URL"
                className="border-gray-300 focus:border-[#ddb866]"
              />
            </div>
          ))}
          <Button type="button" variant="outline" onClick={() => {
            setProduct(prev => ({
              ...prev,
              images: [...prev.images, { id: uuidv4(), url: '', altText: '', isMain: false }],
            }));
          }} className="border-[#ddb866] text-[#ddb866] hover:bg-[#ddb866] hover:text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Image
          </Button>
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-[#0a0a4a]">Product Tags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-500">Add tags to categorize this product.</p>
          <div className="flex items-center space-x-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="e.g., gold-plated, handmade"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
              className="border-gray-300 focus:border-[#ddb866]"
            />
            <Button type="button" onClick={addTag} className="bg-[#ddb866] text-white hover:bg-[#ddb866]/80 shadow-md">
              Add Tag
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag, index) => (
              <Badge key={index} style={{ backgroundColor: '#ddb866', color: '#0a0a4a' }} className="pl-3 pr-2 py-1 flex items-center gap-1 hover:bg-[#ddb866]/80">
                {tag}
                <X className="h-3 w-3 cursor-pointer text-gray-800" onClick={() => removeTag(tag)} />
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <CardFooter className="flex justify-end">
        <Button type="submit" disabled={loading} className="bg-[#0a0a4a] text-white hover:bg-[#0a0a4a]/90 shadow-lg transition-all duration-300 transform hover:scale-105">
          {loading ? 'Saving...' : 'Save Product'}
        </Button>
      </CardFooter>
      {error && <div className="p-4 text-red-500">{error}</div>}
    </form>
  );
}
