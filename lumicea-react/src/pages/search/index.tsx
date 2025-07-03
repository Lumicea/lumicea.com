import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search as SearchIcon, 
  Star, 
  Heart,
  X,
  Filter,
  ShoppingCart
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

// Mock search data
const allProducts = [
  {
    id: 'amethyst-luna-nose-ring',
    name: 'Amethyst Luna Nose Ring',
    price: 45.00,
    image: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=500',
    rating: 4.9,
    reviewCount: 127,
    badge: 'New',
    category: 'nose-rings',
    tags: ['amethyst', 'luna', 'silver', 'nose ring']
  },
  {
    id: 'sapphire-stud-nose-ring',
    name: 'Sapphire Stud Nose Ring',
    price: 52.00,
    image: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=500',
    rating: 4.7,
    reviewCount: 156,
    category: 'nose-rings',
    tags: ['sapphire', 'stud', 'silver', 'nose ring']
  },
  {
    id: 'turquoise-tribal-nose-ring',
    name: 'Turquoise Tribal Nose Ring',
    price: 38.00,
    image: 'https://images.pexels.com/photos/1191710/pexels-photo-1191710.jpeg?auto=compress&cs=tinysrgb&w=500',
    rating: 4.6,
    reviewCount: 98,
    category: 'nose-rings',
    tags: ['turquoise', 'tribal', 'silver', 'nose ring']
  },
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
    tags: ['rose gold', 'celestial', 'hoops', 'earrings']
  },
  {
    id: 'opal-dreams-threader',
    name: 'Opal Dreams Threader Earrings',
    price: 55.00,
    image: 'https://images.pexels.com/photos/1191710/pexels-photo-1191710.jpeg?auto=compress&cs=tinysrgb&w=500',
    rating: 5.0,
    reviewCount: 203,
    badge: 'Bestseller',
    category: 'earrings',
    tags: ['opal', 'dreams', 'threader', 'earrings']
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
    tags: ['moonstone', 'crescent', 'studs', 'earrings']
  },
  {
    id: 'gold-gift-card',
    name: 'Lumicea Gift Card',
    price: 50.00,
    image: 'https://images.pexels.com/photos/6693655/pexels-photo-6693655.jpeg?auto=compress&cs=tinysrgb&w=500',
    rating: 5.0,
    reviewCount: 42,
    category: 'gift-cards',
    tags: ['gift card', 'present', 'gift']
  },
];

export function SearchPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialQuery = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<typeof allProducts>([]);
  const [loading, setLoading] = useState(true);
  
  const categories = [
    { id: 'nose-rings', name: 'Nose Rings', count: 3 },
    { id: 'earrings', name: 'Earrings', count: 3 },
    { id: 'gift-cards', name: 'Gift Cards', count: 1 },
  ];

  // Simulate searching
  useEffect(() => {
    setLoading(true);
    
    // Simulate API delay
    const timer = setTimeout(() => {
      let results = [...allProducts];
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        results = results.filter(product => 
          product.name.toLowerCase().includes(query) || 
          product.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }
      
      // Apply category filters
      if (activeFilters.length > 0) {
        results = results.filter(product => activeFilters.includes(product.category));
      }
      
      setSearchResults(results);
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery, activeFilters]);

  const handleFilterToggle = (categoryId: string) => {
    setActiveFilters(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const addToCart = (product: any) => {
    const cartItem = {
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
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
  };

  const addToWishlist = (product: any) => {
    // Check if product is already in wishlist
    const wishlist = JSON.parse(localStorage.getItem('lumicea-wishlist') || '[]');
    const isInWishlist = wishlist.some((item: any) => item.id === product.id);
    
    if (isInWishlist) {
      alert('This item is already in your wishlist!');
      return;
    }
    
    // Add to wishlist
    const wishlistItem = {
      ...product,
      dateAdded: new Date().toISOString().split('T')[0]
    };
    
    wishlist.push(wishlistItem);
    localStorage.setItem('lumicea-wishlist', JSON.stringify(wishlist));
    
    alert('Added to wishlist!');
  };
  
  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-lumicea-gradient text-white py-16">
          <div className="lumicea-container text-center">
            <SearchIcon className="h-16 w-16 text-lumicea-gold mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Search Our Products
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
              Find the perfect piece from our collection of handcrafted jewelry.
            </p>
            
            {/* Search Input */}
            <div className="relative max-w-2xl mx-auto">
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, materials, or styles..."
                className="pl-12 h-14 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-gray-300"
              />
              {searchQuery && (
                <button
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Search Results */}
        <section className="py-16">
          <div className="lumicea-container">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Filters */}
              <div className="md:col-span-1">
                <div className="sticky top-24 space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      Categories
                    </h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div key={category.id} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`category-${category.id}`}
                            checked={activeFilters.includes(category.id)}
                            onChange={() => handleFilterToggle(category.id)}
                            className="h-4 w-4 rounded border-gray-300 text-lumicea-navy focus:ring-lumicea-navy"
                          />
                          <label htmlFor={`category-${category.id}`} className="ml-2 text-sm text-gray-700 cursor-pointer flex items-center justify-between flex-1">
                            <span>{category.name}</span>
                            <span className="text-xs text-gray-500">({category.count})</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {activeFilters.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => setActiveFilters([])}
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Results */}
              <div className="md:col-span-3">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {loading 
                      ? 'Searching...'
                      : searchQuery 
                        ? `Search results for "${searchQuery}"`
                        : 'All Products'
                    }
                  </h2>
                  <p className="text-sm text-gray-600">
                    {loading 
                      ? '...' 
                      : `${searchResults.length} ${searchResults.length === 1 ? 'result' : 'results'}`
                    }
                  </p>
                </div>
                
                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lumicea-navy"></div>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {searchResults.map((product) => (
                      <Card key={product.id} className="group cursor-pointer hover:shadow-lg transition-all duration-300">
                        <div className="relative overflow-hidden rounded-t-lg">
                          <Link to={`/products/${product.id}`}>
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </Link>
                          
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
                            onClick={() => addToWishlist(product)}
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <CardContent className="p-4">
                          <Link to={`/products/${product.id}`}>
                            <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-lumicea-navy transition-colors line-clamp-2">
                              {product.name}
                            </h3>
                          </Link>
                          
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
                            <Button 
                              size="sm" 
                              className="lumicea-button-primary"
                              onClick={() => addToCart(product)}
                            >
                              <ShoppingCart className="h-4 w-4 mr-1" />
                              Add
                            </Button>
                          </div>
                          
                          <div className="mt-2">
                            <Badge variant="outline" className="text-xs">
                              {product.category.split('-').join(' ')}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <SearchIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
                    <p className="text-gray-600 mb-6">
                      We couldn't find any products matching your search.
                      {searchQuery && " Try using different keywords or filters."}
                    </p>
                    <Button className="lumicea-button-primary" asChild>
                      <Link to="/categories/nose-rings">
                        Browse All Products
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}