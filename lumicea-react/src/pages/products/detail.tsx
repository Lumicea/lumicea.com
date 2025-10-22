import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
// --- REMOVED Header and Footer imports ---
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card'; // Assuming these exist in your project
import { toast } from 'sonner';
import { gaugeThicknessData, insideDiameterData } from '../sizeGuideData'; // Assuming this file exists

// Helper function to safely render HTML
const sanitizeHtml = (html: string | null) => {
  if (typeof html !== 'string') return { __html: '' };
  // A basic sanitizer. For production, consider a more robust library like DOMPurify.
  const sanitized = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  return { __html: sanitized };
};

const TAB_BUTTON_STYLE = "py-3 px-6 rounded-t-lg transition-colors font-medium whitespace-nowrap";
const TAB_BUTTON_ACTIVE_STYLE = "bg-white text-[#0a0a4a] border-b-2 border-[#ddb866]";
const TAB_BUTTON_INACTIVE_STYLE = "bg-transparent text-gray-600 hover:bg-gray-100";

// --- INTERFACES ---
interface VariantOption {
  name: string;
  price_change: number;
  is_sold_out: boolean;
  images?: string[];
  sku?: string;
}

interface Variant {
  name: string;
  options: VariantOption[];
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  features: string | null;
  care_instructions: string | null;
  processing_times: string | null;
  base_price: number;
  is_made_to_order: boolean;
  quantity: number | null;
  images: string[];
  variants: Variant[];
  product_tags: {
    tag_id: string;
    tag: {
      name: string;
      slug: string;
    }
  }[];
}

interface RecommendedProduct {
  id: string;
  name: string;
  slug: string;
  base_price: number;
  images: string[];
}

// --- ADDED: Shipping Method Interface ---
interface ShippingMethod {
  name: string;
  description: string | null;
  price: number;
  estimated_days_min: number | null;
  estimated_days_max: number | null;
}

// --- Product Recommendations Component ---
const ProductCarousel = ({ title, products }: { title: string; products: RecommendedProduct[] }) => {
    if (products.length === 0) return null;
    return (
        <div className="py-12">
            <h2 className="text-2xl font-bold text-center mb-8 text-[#0a0a4a]">{title}</h2>
            <div className="flex overflow-x-auto space-x-6 pb-4">
                {products.map(product => (
                    <Link to={`/products/${product.slug}`} key={product.id} className="flex-shrink-0 w-64">
                        <Card className="group overflow-hidden">
                            <div className="aspect-square bg-gray-100 overflow-hidden">
                                <img src={product.images?.[0] || 'https://placehold.co/400x400'} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            </div>
                            <CardContent className="p-4">
                                <h3 className="font-semibold truncate">{product.name}</h3>
                                <p className="text-lumicea-gold font-bold">£{product.base_price.toFixed(2)}</p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
};


export function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<RecommendedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  
  // --- ADDED: State for shipping methods ---
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);

  useEffect(() => {
    // --- MODIFIED: Renamed function and added shipping fetch ---
    async function fetchProductData() {
      if (!slug) { setLoading(false); return; }
      setLoading(true);
      setProduct(null); // Reset previous product state on slug change
      setRecommendedProducts([]);
      setShippingMethods([]); // --- ADDED: Reset shipping methods

      // Fetch Product
      const { data, error } = await supabase
        .from('products')
        .select(`*, product_tags(tag_id, tag:tags(name, slug))`)
        .eq('slug', slug)
        .single();

      if (error || !data) {
        console.error('Error fetching product:', error?.message);
        setProduct(null);
        setLoading(false);
        return;
      }

      const fetchedProduct: Product = {
        ...data,
        variants: data.variants || [],
        images: data.images || [],
        product_tags: data.product_tags || [],
      };

      setProduct(fetchedProduct);
      if (fetchedProduct.images.length > 0) setSelectedImage(fetchedProduct.images[0]);
      setCalculatedPrice(fetchedProduct.base_price);
      
      // --- ADDED: Fetch shipping methods ---
      const { data: shippingData, error: shippingError } = await supabase
        .from('shipping_methods')
        .select('name, description, price, estimated_days_min, estimated_days_max')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (shippingError) {
        console.error('Error fetching shipping methods:', shippingError.message);
      } else if (shippingData) {
        setShippingMethods(shippingData);
      }
      
      // Fetch recommendations (This logic was already present)
      if (fetchedProduct.product_tags.length > 0) {
        const tagIds = fetchedProduct.product_tags.map(t => t.tag_id);
        const { data: relatedProductIds } = await supabase
          .from('product_tags')
          .select('product_id')
          .in('tag_id', tagIds)
          .neq('product_id', fetchedProduct.id)
          .limit(15);
        
        if (relatedProductIds) {
          const uniqueProductIds = [...new Set(relatedProductIds.map(p => p.product_id))];
          const { data: recs } = await supabase
            .from('products')
            .select('id, name, slug, base_price, images')
            .in('id', uniqueProductIds)
            .limit(8);
          if (recs) setRecommendedProducts(recs);
        }
      }
      setLoading(false);
    }
    fetchProductData();
  }, [slug]);
  
  useEffect(() => {
    if (product) {
      let newPrice = product.base_price;
      product.variants.forEach((variant) => {
        const selectedOptionName = selectedVariants[variant.name];
        if (selectedOptionName) {
          const selectedOption = variant.options.find(opt => opt.name === selectedOptionName);
          if (selectedOption) {
            newPrice += selectedOption.price_change || 0;
          }
        }
      });
      setCalculatedPrice(newPrice);
    }
  }, [selectedVariants, product]);

  const handleVariantSelect = (variantName: string, optionName: string) => {
    setSelectedVariants(prev => ({ ...prev, [variantName]: optionName }));
    const variant = product?.variants.find(v => v.name === variantName);
    const option = variant?.options.find(o => o.name === optionName);
    if (option?.images && option.images.length > 0) {
      setSelectedImage(option.images[0]);
    } else if (product?.images && product.images.length > 0) {
      // Revert to the first main product image if the variant has no specific image
      setSelectedImage(product.images[0]);
    }
  };

  const scrollToTabs = () => {
    setActiveTab('description');
    document.getElementById('product-tabs')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      // --- MODIFIED: Removed <Header> from loading state ---
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a0a4a]"></div>
      </div>
    );
  }

  if (!product) {
    return (
      // --- MODIFIED: Removed <Header> and <Footer> from not-found state ---
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow flex items-center justify-center text-center bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4 text-[#0a0a4a]">Product Not Found</h1>
            <p className="text-gray-600 mb-8">The product you are looking for does not exist or has been removed.</p>
            <Button asChild>
                <Link to="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const mainImageUrl = selectedImage || product.images?.[0] || 'https://placehold.co/800x800';
  const tags = product.product_tags.map(pt => pt.tag).filter(Boolean);
  const description = product?.description || '';
  const isTruncated = description.length > 250;
  const truncatedDescription = isTruncated ? `${description.substring(0, 250)}...` : description;

  // --- ADDED: Derived state for stock logic ---
  const isSoldOut = !product.is_made_to_order && (product.quantity === null || product.quantity < 1);

  return (
    // --- MODIFIED: Removed <Header> and <Footer> and root div ---
    // The <main> tag from App.tsx now directly wraps this content
    <div className="bg-gray-50 font-inter">
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Image Gallery */}
            <div>
              <div className="aspect-square bg-white rounded-lg overflow-hidden border border-gray-200 mb-4 shadow-sm">
                <img src={mainImageUrl} alt={product.name} className="w-full h-full object-contain p-4" />
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                  {product.images.map((image, index) => (
                    <div key={index} className={`aspect-square bg-white rounded-md overflow-hidden cursor-pointer transition-all border-2 ${selectedImage === image ? 'border-[#ddb866]' : 'border-transparent'}`} onClick={() => setSelectedImage(image)}>
                      <img src={image} alt={`${product.name} - view ${index + 1}`} className="w-full h-full object-contain p-2" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="flex flex-col space-y-6">
              <div className="flex flex-col">
                <h1 className="text-3xl sm:text-4xl font-bold text-[#0a0a4a]">{product.name}</h1>
                <p className="text-3xl sm:text-4xl font-bold text-[#ddb866] mt-2">£{calculatedPrice.toFixed(2)}</p>
              </div>
              
              {/* --- MODIFIED: Stock Logic (Badge) --- */}
              {product.is_made_to_order ? (
                <Badge className="bg-[#ddb866] text-sm text-[#0a0a4a] font-semibold w-fit">Made to Order</Badge>
              ) : (product.quantity !== null && product.quantity > 0) ? (
                <p className="text-sm text-green-600 font-medium">In stock: {product.quantity}</p>
              ) : (
                <Badge variant="destructive" className="text-sm w-fit">Sold Out</Badge>
              )}
              {/* --- END MODIFICATION --- */}

              <div className="text-gray-700 leading-relaxed space-y-2 prose max-w-none">
                <div dangerouslySetInnerHTML={sanitizeHtml(truncatedDescription)}></div>
                {isTruncated && <Button variant="link" onClick={scrollToTabs} className="p-0 h-auto text-lumicea-gold hover:text-lumicea-gold/80">Read more...</Button>}
              </div>

              {/* Variant Selects */}
              <div className="space-y-4">
                {product.variants.map((variant, index) => (
                  <div key={index}>
                    <Label htmlFor={variant.name} className="text-sm font-medium text-gray-700">{variant.name}</Label>
                    <Select onValueChange={(value) => handleVariantSelect(variant.name, value)} value={selectedVariants[variant.name] || ''}>
                      <SelectTrigger className="w-full mt-1 border-gray-300 focus:border-[#ddb866] rounded-md"><SelectValue placeholder={`Select a ${variant.name}`} /></SelectTrigger>
                      <SelectContent>
                        {variant.options.map(option => (
                          <SelectItem key={option.name} value={option.name} disabled={option.is_sold_out}>
                            {option.name}
                            {option.is_sold_out && <span className="ml-2 text-red-500">(Sold out)</span>}
                            {option.price_change !== 0 && !option.is_sold_out && (<span className="ml-2 text-gray-500">({option.price_change > 0 ? '+' : ''}£{option.price_change.toFixed(2)})</span>)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <div className="flex items-center space-x-2">
                    <Label htmlFor="quantity">Qty</Label>
                    {/* --- MODIFIED: Stock Logic (Input) --- */}
                    <Input id="quantity" type="number" value={selectedQuantity} onChange={(e) => setSelectedQuantity(Math.max(1, parseInt(e.target.value) || 1))} min="1" className="w-20 border-gray-300 focus:border-[#ddb866] rounded-md" disabled={isSoldOut} />
                </div>
                {/* --- MODIFIED: Stock Logic (Button) --- */}
                <Button className="flex-1 bg-[#ddb866] text-[#0a0a4a] hover:bg-[#ddb866]/90 shadow-lg font-semibold transition-all duration-300 rounded-md" disabled={isSoldOut}>
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {isSoldOut ? "Sold Out" : "Add to Cart"}
                </Button>
                <Button variant="outline" size="icon" className="border-gray-300 text-gray-500 hover:text-red-500 hover:border-red-500 transition-colors rounded-md"><Heart className="h-5 w-5" /></Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {tags.map((tag, index) => (<Link to={`/tags/${tag.slug}`} key={index}><Badge className="bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors cursor-pointer">{tag.name}</Badge></Link>))}
              </div>
            </div>
          </div>
          
          <div id="product-tabs" className="mt-16">
            <div className="flex border-b border-gray-200 overflow-x-auto">
              <button className={`${TAB_BUTTON_STYLE} ${activeTab === 'description' ? TAB_BUTTON_ACTIVE_STYLE : TAB_BUTTON_INACTIVE_STYLE}`} onClick={() => setActiveTab('description')}>Description</button>
              {product.features && <button className={`${TAB_BUTTON_STYLE} ${activeTab === 'features' ? TAB_BUTTON_ACTIVE_STYLE : TAB_BUTTON_INACTIVE_STYLE}`} onClick={() => setActiveTab('features')}>Features</button>}
              {product.care_instructions && <button className={`${TAB_BUTTON_STYLE} ${activeTab === 'care' ? TAB_BUTTON_ACTIVE_STYLE : TAB_BUTTON_INACTIVE_STYLE}`} onClick={() => setActiveTab('care')}>Care</button>}
              {product.processing_times && <button className={`${TAB_BUTTON_STYLE} ${activeTab === 'processing' ? TAB_BUTTON_ACTIVE_STYLE : TAB_BUTTON_INACTIVE_STYLE}`} onClick={() => setActiveTab('processing')}>Processing</button>}
              {/* --- ADDED: Shipping Tab Button --- */}
              <button className={`${TAB_BUTTON_STYLE} ${activeTab === 'shipping' ? TAB_BUTTON_ACTIVE_STYLE : TAB_BUTTON_INACTIVE_STYLE}`} onClick={() => setActiveTab('shipping')}>Shipping</button>
              <button className={`${TAB_BUTTON_STYLE} ${activeTab === 'sizeGuide' ? TAB_BUTTON_ACTIVE_STYLE : TAB_BUTTON_INACTIVE_STYLE}`} onClick={() => setActiveTab('sizeGuide')}>Size Guide</button>
            </div>
            <div className="bg-white p-6 rounded-b-lg border border-t-0 border-gray-200">
              {activeTab === 'description' && (<div className="prose max-w-none" dangerouslySetInnerHTML={sanitizeHtml(product.description)}></div>)}
              {activeTab === 'features' && (<div className="prose max-w-none" dangerouslySetInnerHTML={sanitizeHtml(product.features)}></div>)}
              {activeTab === 'care' && (<div className="prose max-w-none" dangerouslySetInnerHTML={sanitizeHtml(product.care_instructions)}></div>)}
              {activeTab === 'processing' && (<div className="prose max-w-none" dangerouslySetInnerHTML={sanitizeHtml(product.processing_times)}></div>)}
              
              {/* --- ADDED: Shipping Tab Panel --- */}
              {activeTab === 'shipping' && (
                <div className="prose max-w-none space-y-4">
                  <h3 className="text-xl font-semibold text-[#0a0a4a]">Shipping Options</h3>
                  {shippingMethods.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-2">
                      {shippingMethods.map((method) => (
                        <li key={method.name}>
                          <strong>{method.name} (£{method.price.toFixed(2)})</strong>
                          {method.description && <p className="text-sm !mt-1">{method.description}</p>}
                          {method.estimated_days_min && (
                            <p className="text-sm text-gray-600 !mt-1">
                              Estimated delivery: {method.estimated_days_min}
                              {method.estimated_days_max ? ` - ${method.estimated_days_max}` : ''} business days.
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Shipping details are being updated. Please check back soon.</p>
                  )}
                </div>
              )}
              
              {activeTab === 'sizeGuide' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-[#0a0a4a]">General Piercing Thickness Guide</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left table-auto">
                        <thead><tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal"><th className="py-3 px-6 text-left">Gauge</th><th className="py-3 px-6 text-left">Thickness (MM)</th></tr></thead>
                        <tbody className="text-gray-600 text-sm font-light">
                          {gaugeThicknessData.map((item, index) => (<tr key={index} className="border-b border-gray-200 hover:bg-gray-50"><td className="py-3 px-6">{item.gauge}</td><td className="py-3 px-6">{item.thickness}</td></tr>))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-[#0a0a4a]">General Inside Diameter Guide</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left table-auto">
                        <thead><tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal"><th className="py-3 px-6 text-left">Size (MM)</th><th className="py-3 px-6 text-left">Comfort Level</th><th className="py-3 px-6 text-left">Best For</th></tr></thead>
                        <tbody className="text-gray-600 text-sm font-light">
                          {insideDiameterData.map((size, index) => (<tr key={index} className="border-b border-gray-200 hover:bg-gray-50"><td className="py-3 px-6">{size.size}</td><td className="py-3 px-6"><Badge variant="outline">{size.comfort}</Badge></td><td className="py-3 px-6">{size.bestFor}</td></tr>))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* This component was already here and functioning as requested */}
          <ProductCarousel title="You Might Also Like" products={recommendedProducts} />
        </div>
      </main>
    </div>
  );
}
