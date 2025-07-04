import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, Gift } from 'lucide-react';

const products = [
  {
    id: 1,
    name: 'Amethyst Luna Nose Ring',
    price: 45,
    image: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=500',
    rating: 4.9,
    reviewCount: 127,
    badge: 'New',
  },
  {
    id: 2,
    name: 'Sapphire Stud Nose Ring',
    price: 52,
    image: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=500',
    rating: 4.7,
    reviewCount: 156,
  },
  {
    id: 3,
    name: 'Turquoise Tribal Nose Ring',
    price: 38,
    image: 'https://images.pexels.com/photos/1191710/pexels-photo-1191710.jpeg?auto=compress&cs=tinysrgb&w=500',
    rating: 4.6,
    reviewCount: 98,
  },
];

export function NoseRingsPage() {
  // Add gift card product to the products array
  const allProducts = [
    ...products,
    {
      id: 'gift-card',
      name: 'Lumicea Gift Card',
      price: 50,
      image: 'https://images.pexels.com/photos/6693655/pexels-photo-6693655.jpeg?auto=compress&cs=tinysrgb&w=500',
      rating: 5.0,
      reviewCount: 42,
      badge: 'Gift',
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-lumicea-gradient text-white py-16">
          <div className="lumicea-container text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Nose Rings Collection
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Discover our exquisite collection of handcrafted nose rings, featuring premium materials and stunning gemstones.
            </p>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-16">
          <div className="lumicea-container">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allProducts.map((product) => (
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
                      <span className="font-semibold text-gray-900">£{product.price}</span>
                      <Button 
                        size="sm" 
                        className="lumicea-button-primary" 
                        onClick={() => {
                          // Add to cart functionality
                          const cartItem = {
                            id: `${product.id}-${Date.now()}`,
                            productId: product.id.toString(),
                            variantId: `default-${product.id}`,
                            name: product.name,
                            price: product.price,
                            quantity: 1,
                            image: product.image,
                            attributes: {
                              material: '940 Argentium Silver',
                              size: '7mm',
                            }
                          };
                          
                          // Use local storage to simulate cart
                          const cart = JSON.parse(localStorage.getItem('lumicea-cart') || '[]');
                          cart.push(cartItem);
                          localStorage.setItem('lumicea-cart', JSON.stringify(cart));
                          
                          alert('Added to cart!');
                        }}
                      >
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