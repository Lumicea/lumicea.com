import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PriceDisplay } from '@/components/ui/price-display';
import { Star, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  badge?: string;
  category: string;
}

interface ProductGridProps {
  category?: string;
}

// Mock product data - this will come from Supabase
const mockProducts: Product[] = [
  {
    id: 'amethyst-luna-nose-ring',
    name: 'Amethyst Luna Nose Ring',
    price: 45.00,
    image: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=500',
    rating: 4.9,
    reviewCount: 127,
    badge: 'New',
    category: 'nose-rings',
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
  },
  {
    id: 'sapphire-stud-nose-ring',
    name: 'Sapphire Stud Nose Ring',
    price: 52.00,
    image: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=500',
    rating: 4.7,
    reviewCount: 156,
    category: 'nose-rings',
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
  },
  {
    id: 'turquoise-tribal-nose-ring',
    name: 'Turquoise Tribal Nose Ring',
    price: 38.00,
    image: 'https://images.pexels.com/photos/1191710/pexels-photo-1191710.jpeg?auto=compress&cs=tinysrgb&w=500',
    rating: 4.6,
    reviewCount: 98,
    category: 'nose-rings',
  },
];

export function ProductGrid({ category }: ProductGridProps) {
  // Filter products by category if specified
  const filteredProducts = category 
    ? mockProducts.filter(product => product.category === category)
    : mockProducts;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredProducts.map((product) => (
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
              <PriceDisplay 
                price={product.price} 
                originalPrice={product.originalPrice}
                size="md"
              />
              <Button size="sm" className="lumicea-button-primary">
                Add to Cart
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}