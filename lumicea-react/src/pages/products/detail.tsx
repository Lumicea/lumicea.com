import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Label } from '@/components/ui/label';

export function ProductDetailPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        <div className="lumicea-container py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div>
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img
                  src="https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Product"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square bg-gray-100 rounded-md overflow-hidden">
                    <img
                      src={`https://images.pexels.com/photos/119153${i}/pexels-photo-119153${i}.jpeg?auto=compress&cs=tinysrgb&w=200`}
                      alt={`Product view ${i}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <Badge variant="secondary" className="mb-2">Nose Rings</Badge>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  Amethyst Luna Nose Ring
                </h1>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-lumicea-gold fill-current"
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">4.9 (127 reviews)</span>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  A celestial-inspired nose ring featuring a beautiful amethyst gemstone set in premium 940 Argentium silver. 
                  This elegant piece combines the mystical properties of amethyst with expert craftsmanship.
                </p>
              </div>

              <div className="text-3xl font-bold text-gray-900">£45.00</div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Material</Label>
                  <select className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2">
                    <option>940 Argentium Silver</option>
                    <option>14k Gold Filled (+£25)</option>
                    <option>14k Rose Gold Filled (+£28)</option>
                  </select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Size</Label>
                  <select className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2">
                    <option>7mm (Standard)</option>
                    <option>6mm (Petite)</option>
                    <option>8mm (Comfortable)</option>
                    <option>9mm (Roomy)</option>
                  </select>
                </div>
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
                  <li>• Handcrafted with premium materials</li>
                  <li>• Hypoallergenic and safe for sensitive skin</li>
                  <li>• Lifetime warranty included</li>
                  <li>• Free UK shipping on orders over £50</li>
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