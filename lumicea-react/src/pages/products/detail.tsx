import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient.ts';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Label } from '@/components/ui/label';

export function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      if (!slug) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error('Error fetching product:', error.message);
        setProduct(null);
      } else {
        setProduct(data);
      }
      setLoading(false);
    }

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading product details...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen text-center py-20">
        <Header />
        <div className="lumicea-container">
          <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
          <p className="text-gray-600">The product you are looking for does not exist.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        <div className="lumicea-container py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images - Updated to use the 'images' column */}
            <div>
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img
                  src={product.images?.[0] || 'https://via.placeholder.com/800'}
                  alt={product.name || 'Product Image'}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* This section now maps through the 'images' array for thumbnails */}
              {product.images?.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image, index) => (
                    <div key={index} className="aspect-square bg-gray-100 rounded-md overflow-hidden">
                      <img
                        src={image}
                        alt={`${product.name} view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details - Now uses dynamic data from your columns */}
            <div className="space-y-6">
              <div>
                {/* Category data needs to be fetched separately if not included in this query */}
                {product.category_id && <Badge variant="secondary" className="mb-2">Category</Badge>}
                
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  {product.name}
                </h1>
                
                <p className="text-gray-700 leading-relaxed">
                  {product.short_description || product.description}
                </p>
              </div>

              <div className="text-3xl font-bold text-gray-900">
                £{product.base_price?.toFixed(2) || '0.00'}
              </div>

              {/* Variant Selects */}
              <div className="space-y-4">
                {/* This will require more complex logic to dynamically render based on customization_options */}
                {/* For example:
                {product.customization_options?.materials && (
                  <div>
                    <Label className="text-sm font-medium">Material</Label>
                    <select className="...">
                      {product.customization_options.materials.map(mat => <option key={mat}>{mat}</option>)}
                    </select>
                  </div>
                )}
                */}
              </div>

              <div className="flex space-x-3">
                <Button className="flex-1 lumicea-button-primary">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="icon">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Product Features</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• SKU: {product.sku}</li>
                  {product.materials && <li>• Materials: {product.materials}</li>}
                  {product.care_instructions && <li>• Care Instructions: {product.care_instructions}</li>}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
