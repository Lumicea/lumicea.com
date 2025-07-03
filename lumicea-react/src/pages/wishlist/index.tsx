import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

// Wishlist item interface
interface WishlistItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  badge?: string;
  category: string;
  dateAdded: string;
}

export function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from an API
    // For now, we'll use localStorage
    const loadWishlist = () => {
      try {
        const savedWishlist = localStorage.getItem('lumicea-wishlist');
        if (savedWishlist) {
          setWishlistItems(JSON.parse(savedWishlist));
        } else {
          // Sample data for demonstration
          const sampleWishlist: WishlistItem[] = [
            {
              id: 'rose-gold-celestial-hoops',
              name: 'Rose Gold Celestial Hoops',
              price: 65.00,
              originalPrice: 85.00,
              image: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=500',
              rating: 4.8,
              reviewCount: 89,
              badge: 'Sale',
              category: 'earrings',
              dateAdded: '2024-07-01',
            },
            {
              id: 'moonstone-crescent-studs',
              name: 'Moonstone Crescent Studs',
              price: 42.00,
              image: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=500',
              rating: 4.9,
              reviewCount: 134,
              badge: 'New',
              category: 'earrings',
              dateAdded: '2024-06-28',
            },
          ];
          setWishlistItems(sampleWishlist);
          localStorage.setItem('lumicea-wishlist', JSON.stringify(sampleWishlist));
        }
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, []);

  const removeFromWishlist = (id: string) => {
    const updatedWishlist = wishlistItems.filter(item => item.id !== id);
    setWishlistItems(updatedWishlist);
    localStorage.setItem('lumicea-wishlist', JSON.stringify(updatedWishlist));
  };

  const addToCart = (item: WishlistItem) => {
    // In a real app, this would integrate with your cart system
    const cartItem = {
      id: `${item.id}-${Date.now()}`,
      productId: item.id,
      variantId: `default-${item.id}`,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
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
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-lumicea-gradient text-white py-16">
          <div className="lumicea-container text-center">
            <Heart className="h-16 w-16 text-lumicea-gold mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Your Wishlist
            </h1>
            {wishlistItems.length > 0 ? (
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                You have {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} in your wishlist.
              </p>
            ) : (
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Your wishlist is currently empty.
              </p>
            )}
          </div>
        </section>

        {/* Wishlist Content */}
        <section className="py-16">
          <div className="lumicea-container">
            {loading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lumicea-navy"></div>
              </div>
            ) : wishlistItems.length > 0 ? (
              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {wishlistItems.map((item) => (
                    <Card key={item.id} className="group cursor-pointer hover:shadow-lg transition-all duration-300">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <Link to={`/products/${item.id}`}>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </Link>
                        
                        {item.badge && (
                          <Badge 
                            className={`absolute top-3 left-3 ${
                              item.badge === 'Sale' 
                                ? 'bg-red-500 hover:bg-red-600' 
                                : item.badge === 'New'
                                ? 'bg-green-500 hover:bg-green-600'
                                : 'bg-lumicea-gold text-lumicea-navy hover:bg-lumicea-gold-light'
                            }`}
                          >
                            {item.badge}
                          </Badge>
                        )}
                        
                        <Button
                          size="icon"
                          variant="ghost"
                          className="absolute top-3 right-3 bg-white/80 hover:bg-white text-red-500"
                          onClick={() => removeFromWishlist(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <CardContent className="p-4">
                        <Link to={`/products/${item.id}`}>
                          <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-lumicea-navy transition-colors line-clamp-2">
                            {item.name}
                          </h3>
                        </Link>
                        
                        <div className="flex items-center mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(item.rating)
                                    ? 'text-lumicea-gold fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600 ml-2">
                            ({item.reviewCount})
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-gray-900">£{item.price}</span>
                            {item.originalPrice && (
                              <span className="text-sm text-gray-500 line-through">
                                £{item.originalPrice}
                              </span>
                            )}
                          </div>
                          <Button 
                            size="sm" 
                            className="lumicea-button-primary"
                            onClick={() => addToCart(item)}
                          >
                            Add to Cart
                          </Button>
                        </div>
                        
                        <div className="text-xs text-gray-500 mt-2">
                          Added on {new Date(item.dateAdded).toLocaleDateString()}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="flex justify-between items-center pt-6">
                  <Button variant="outline" asChild>
                    <Link to="/categories/nose-rings">
                      Continue Shopping
                    </Link>
                  </Button>
                  
                  <Button className="lumicea-button-primary" asChild>
                    <Link to="/cart">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      View Cart
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-12 w-12 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Your wishlist is empty
                </h2>
                <p className="text-gray-600 mb-8">
                  Add your favorite items to your wishlist to save them for later.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="lumicea-button-primary" asChild>
                    <Link to="/categories/nose-rings">
                      Browse Nose Rings
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/categories/earrings">
                      Explore Earrings
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}