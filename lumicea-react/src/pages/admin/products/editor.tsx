import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { ChevronLeft } from 'lucide-react';

interface Product {
  id?: string;
  name: string;
  sku_prefix: string;
  base_price: number;
  is_active: boolean;
  is_featured: boolean;
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
    is_active: true,
    is_featured: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);

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
            setProduct({ ...data, base_price: parseFloat(data.base_price) });
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
        is_active: true,
        is_featured: false,
      });
    }
  }, [productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setProduct(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setProduct(prev => ({
      ...prev,
      base_price: parseFloat(value) || 0,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isNewProduct) {
        const { error } = await supabase.from('products').insert(product);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').update(product).eq('id', productId);
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
          <div className="flex items-center space-x-2">
            <Checkbox id="is_active" checked={product.is_active} onCheckedChange={(checked) => setProduct(prev => ({ ...prev, is_active: !!checked }))} />
            <Label htmlFor="is_active">Active</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="is_featured" checked={product.is_featured} onCheckedChange={(checked) => setProduct(prev => ({ ...prev, is_featured: !!checked }))} />
            <Label htmlFor="is_featured">Featured</Label>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Product'}
          </Button>
        </CardFooter>
      </Card>
      {error && <div className="p-4 text-red-500">{error}</div>}
    </form>
  );
}
