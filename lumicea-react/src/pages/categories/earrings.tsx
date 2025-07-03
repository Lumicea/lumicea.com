import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Heart } from 'lucide-react';

const products = [
  {
    id: 1,
    name: 'Rose Gold Celestial Hoops',
    price: 65,
    originalPrice: 85,
    image: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=500',
    rating: 4.8,
    reviewCount: 89,
    badge: 'Sale',
  },
  {
    id: 2,
    name: 'Opal Dreams Threader Earrings',
    price: 55,
    image: 'https://images.pexels.com/photos/1191710/pexels-photo-1191710.jpeg?auto=compress&cs=tinysrgb&w=500',
    rating: 5.0,
    reviewCount: 203,
    badge: 'Bestseller',
  },
  {
    id: 3,
    name: 'Moonstone Crescent Studs',
    price: 42,
    image: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=500',
    rating: 4.9,
    reviewCount: 134,
    badge: 'New',
  },
];

export function EarringsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-lumicea-gradient text-white py-16">
          <div className="lumicea-container text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Earrings Collection
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Elegant handcrafted earrings that complement your unique style, from delicate studs to statement pieces.
            </p>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-16">
          <div className="lumicea-container">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="group cursor-pointer hover:shadow-lg transition-all duration-300">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {product.badge && (
                      <Badge 
                        className={`absolute top-3 left-3 ${
                          product.badge === 'Sale' 
                            ? 'bg-red-500 hover:bg-red-600' 
                            : product.badge === 'New'
                            ? 'bg-green-500 hover:bg-green-600'
                            : 'bg-lumicea-gold text-lumicea-navy hover:bg-lumicea-gold-light'
                        }`}
                      >
                        {product.badge}
                      </Badge>
                    )}
                    
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-3 right-3 bg-white/80 hover:bg-white text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-lumicea-navy transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating)
                                ? 'text-lumicea-gold fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-2">
                        ({product.reviewCount})
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-900">£{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            £{product.originalPrice}
                          </span>
                        )}
                      </div>
                      <Button size="sm" className="lumicea-button-primary">
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}