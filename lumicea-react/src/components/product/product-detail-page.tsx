import { useState } from 'react';
import { ProductCustomization } from './product-customization';
import { ProductImageGallery } from './product-image-gallery';
import { ProductInformation } from './product-information';
import { ProductReviews } from './product-reviews';
import { RelatedProducts } from './related-products';
import { SizeGuideWidget } from './size-guide-widget';
import { ProductVariant } from './product-customization';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Truck, RotateCcw, Shield } from 'lucide-react';
import { useCart } from '@/lib/cart';

interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  images: string[];
  category: string;
  subcategory: string;
  rating: number;
  reviewCount: number;
  sku: string;
  inStock: boolean;
  stockLevel?: number;
  leadTime?: string;
}

// Mock product data - this will come from Supabase
const mockProduct: Product = {
  id: 'amethyst-luna-nose-ring',
  name: 'Amethyst Luna Nose Ring',
  description: 'A celestial-inspired nose ring featuring a beautiful amethyst gemstone set in premium 940 Argentium silver. This elegant piece combines the mystical properties of amethyst with expert craftsmanship.',
  basePrice: 45.00,
  images: [
    'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1191710/pexels-photo-1191710.jpeg?auto=compress&cs=tinysrgb&w=800',
  ],
  category: 'Nose Rings',
  subcategory: 'Gemstone Rings',
  rating: 4.9,
  reviewCount: 127,
  sku: 'LUM-NR-001',
  inStock: true,
  stockLevel: 8,
  leadTime: '1-3 business days',
};

export function ProductDetailPage() {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [currentPrice, setCurrentPrice] = useState(mockProduct.basePrice);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { addItem } = useCart();

  const handleVariantChange = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    // Update main product image based on variant selection
    // This would typically fetch variant-specific images from the backend
  };

  const handlePriceChange = (price: number) => {
    setCurrentPrice(price);
  };

  const handleAddToCart = () => {
    if (selectedVariant) {
      const cartItem = {
        id: `${mockProduct.id}-${Date.now()}`,
        productId: mockProduct.id,
        variantId: selectedVariant.material.id + (selectedVariant.gemstone?.id || '') + selectedVariant.size.id,
        name: mockProduct.name,
        price: currentPrice,
        quantity: selectedVariant.quantity,
        image: mockProduct.images[0],
        attributes: {
          material: selectedVariant.material.name,
          gemstone: selectedVariant.gemstone?.name,
          size: selectedVariant.size.name,
        }
      };
      
      addItem(cartItem);
      
      alert("Added to cart!");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <ProductImageGallery
              images={mockProduct.images}
              productName={mockProduct.name}
              selectedIndex={selectedImageIndex}
              onImageSelect={setSelectedImageIndex}
            />
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Product Header */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="secondary" className="bg-lumicea-navy/10 text-lumicea-navy">
                  {mockProduct.category}
                </Badge>
                {mockProduct.stockLevel && mockProduct.stockLevel <= 10 && (
                  <Badge variant="outline" className="border-orange-500 text-orange-700">
                    Only {mockProduct.stockLevel} left
                  </Badge>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                {mockProduct.name}
              </h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(mockProduct.rating)
                          ? 'text-lumicea-gold fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {mockProduct.rating} ({mockProduct.reviewCount} reviews)
                  </span>
                </div>
                <span className="text-sm text-gray-500">SKU: {mockProduct.sku}</span>
              </div>

              <p className="text-gray-700 leading-relaxed">
                {mockProduct.description}
              </p>
            </div>

            {/* Size Guide Widget */}
            <SizeGuideWidget />

            {/* Product Customization */}
            <ProductCustomization
              basePrice={mockProduct.basePrice}
              productId={mockProduct.id}
              productName={mockProduct.name}
              onVariantChange={handleVariantChange}
              onPriceChange={handlePriceChange}
              onAddToCart={handleAddToCart}
            />

            {/* Shipping & Returns Info */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-start space-x-3">
                <Truck className="h-5 w-5 text-lumicea-navy mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">Free UK Shipping</h4>
                  <p className="text-sm text-gray-600">
                    Free shipping on orders over £50. Standard delivery 2-3 business days.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <RotateCcw className="h-5 w-5 text-lumicea-navy mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">30-Day Returns</h4>
                  <p className="text-sm text-gray-600">
                    Not completely satisfied? Return within 30 days for a full refund.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-lumicea-navy mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">Lifetime Warranty</h4>
                  <p className="text-sm text-gray-600">
                    We stand behind our craftsmanship with a lifetime warranty on materials.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Information Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="care">Care Instructions</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({mockProduct.reviewCount})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <ProductInformation product={mockProduct} />
            </TabsContent>
            
            <TabsContent value="specifications" className="mt-6">
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-4">Product Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Materials</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• 940 Argentium Silver (default)</li>
                      <li>• 14k Gold Filled option</li>
                      <li>• 14k Rose Gold Filled option</li>
                      <li>• Titanium option</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Dimensions</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Available sizes: 6mm - 10mm</li>
                      <li>• Gauge options: 20G - 12G</li>
                      <li>• Weight: 0.5g - 1.2g (varies by size)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="care" className="mt-6">
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-4">Care Instructions</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Daily Care</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Clean with warm water and mild soap</li>
                      <li>• Pat dry with a soft cloth</li>
                      <li>• Avoid harsh chemicals and perfumes</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Storage</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Store in a dry place</li>
                      <li>• Use provided jewelry pouch</li>
                      <li>• Keep away from other jewelry to prevent scratching</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <ProductReviews productId={mockProduct.id} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <RelatedProducts currentProductId={mockProduct.id} category={mockProduct.category} />
        </div>
      </div>
    </div>
  );
}