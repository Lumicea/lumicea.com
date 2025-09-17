import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PriceDisplay } from '@/components/ui/price-display';
import { Star, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

// The Product interface should match your Supabase table columns
interface Product {
  id: string;
  name: string;
  base_price: number; // Use base_price from your table
  compare_at_price?: number; // Use compare_at_price
  images: string[]; // This is an array of strings
  rating?: number; // Optional
  reviewCount?: number; // Optional
  badge?: string;
  slug: string; // The slug for the URL
}

interface ProductGridProps {
  products: Product[]; // The component now expects a 'products' array
}

// The component now takes 'products' as a prop
export function ProductGrid({ products }: ProductGridProps) {
  // The filtering logic is now handled by the parent component (e.g., NoseRingsPage)
  // so this component can focus on just rendering the list.

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="group cursor-pointer hover:shadow-lg transition-all duration-300">
          <div className="relative overflow-hidden rounded-t-lg">
            {/* Use product.slug for the Link */}
            <Link to={`/products/${product.slug}`}>
              <img
                // Use the first image from the 'images' array
                src={product.images?.[0] || 'https://via.placeholder.com/500'}
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
            {/* Use product.slug for the Link */}
            <Link to={`/products/${product.slug}`}>
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-lumicea-navy transition-colors line-clamp-2">
                {product.name}
              </h3>
            </Link>
            
            <div className="flex items-center mb-2">
              <div className="flex items-center">
                {/* Dynamic star ratings */}
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating || 0)
                        ? 'text-lumicea-gold fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-2">
                ({product.reviewCount || 0})
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <PriceDisplay
                price={product.base_price}
                originalPrice={product.compare_at_price}
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
