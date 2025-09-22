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
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack} disabled={loading}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to List
        </Button>
        <h1 className="text-3xl font-bold">{isNewProduct ? 'New Product' : `Edit Product: ${product.name}`}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" value={product.name} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sku_prefix">SKU Prefix</Label>
            <Input id="sku_prefix" value={product.sku_prefix} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="base_price">Base Price</Label>
            <Input id="base_price" type="number" value={product.base_price} onChange={handlePriceChange} required min="0" step="0.01" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Product Description</Label>
            <Textarea id="description" value={product.description} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="features">Product Features</Label>
            <Textarea id="features" value={product.features} onChange={handleChange} />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="is_active" checked={product.is_active} onCheckedChange={(checked) => setProduct(prev => ({ ...prev, is_active: !!checked }))} />
            <Label htmlFor="is_active">Active</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="is_featured" checked={product.is_featured} onCheckedChange={(checked) => setProduct(prev => ({ ...prev, is_featured: !!checked }))} />
            <Label htmlFor="is_featured">Featured</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Product Variants</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-500">Add master variant sections like "Hoop Material" or "Gauge".</p>
          {product.variants.map((variant, variantIndex) => (
            <div key={variant.id} className="space-y-2 border-l-2 pl-4">
              <div className="flex items-center space-x-2">
                <Label>Variant Name</Label>
                <Input value={variant.name} onChange={(e) => handleVariantChange(variant.id, e.target.value)} placeholder="e.g., Hoop Material" />
              </div>
              <div className="space-y-2 ml-4 mt-2">
                <p className="text-sm text-gray-500">Add options for this variant.</p>
                {variant.options.map((option, optionIndex) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Input
                      value={option.name}
                      onChange={(e) => handleVariantOptionChange(variant.id, option.id, 'name', e.target.value)}
                      placeholder="Option Name (e.g., Gold)"
                    />
                    <Input
                      type="number"
                      value={option.price_change}
                      onChange={(e) => handleVariantOptionChange(variant.id, option.id, 'price_change', parseFloat(e.target.value) || 0)}
                      placeholder="Price Change"
                      step="0.01"
                    />
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={() => addVariantOption(variant.id)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              </div>
            </div>
          ))}
          <Button type="button" onClick={addVariant}>
            <Plus className="h-4 w-4 mr-2" />
            Add Variant Section
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Product Images</CardTitle>
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
              />
            </div>
          ))}
          <Button type="button" variant="outline" onClick={() => {
            setProduct(prev => ({
              ...prev,
              images: [...prev.images, { id: uuidv4(), url: '', altText: '', isMain: false }],
            }));
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Image
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Product Tags</CardTitle>
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
            />
            <Button type="button" onClick={addTag}>
              Add Tag
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="pl-3 pr-2 py-1 flex items-center gap-1">
                {tag}
                <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <CardFooter className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Product'}
        </Button>
      </CardFooter>
      {error && <div className="p-4 text-red-500">{error}</div>}
    </form>
  );
}
