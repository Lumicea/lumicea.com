import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, Share2, Facebook, Twitter, Mail, ChevronRight } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { gaugeThicknessData, insideDiameterData } from '../sizeGuideData';
import { toast } from 'sonner';

// Sanitization function for security
const sanitizeHtml = (html: string | null) => {
  if (typeof html !== 'string') return '';
  const scriptRegex = /<script\b[^>]*>[\s\S]*?<\/script>/gi;
  return html.replace(scriptRegex, '');
};

const TAB_BUTTON_STYLE = "py-3 px-6 rounded-t-lg transition-colors font-medium";
const TAB_BUTTON_ACTIVE_STYLE = "bg-white text-[#0a0a4a] border-b-2 border-[#ddb866]";
const TAB_BUTTON_INACTIVE_STYLE = "bg-transparent text-gray-600 hover:bg-gray-100";

// --- INTERFACES to match the data structure from editor.tsx ---
interface VariantOption { name: string; price_change: number; is_sold_out: boolean; images?: string[]; sku?: string; }
interface Variant { name: string; options: VariantOption[]; }
interface Product {
  id: string; name: string; slug: string; description: string | null; features: string | null; care_instructions: string | null; processing_times: string | null; base_price: number;
  is_made_to_order: boolean; quantity: number | null; images: string[]; variants: Variant[];
  tags: { name: string; slug: string }[];
}

export function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [showPersonalisationModal, setShowPersonalisationModal] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      if (!slug) { setLoading(false); return; }

      // BOLD FIX: The query is now unambiguous because the database schema is fixed.
      const { data, error } = await supabase
        .from('products')
        .select(`*, tags:product_tags(tag:tags(name, slug))`)
        .eq('slug', slug)
        .single();

      if (error || !data) {
        toast.error("Product not found.");
        console.error('Error fetching product:', error?.message);
        setProduct(null);
        setLoading(false);
        return;
      }

      const transformedProduct = {
        ...data,
        tags: data.tags.map((t: any) => t.tag),
        variants: data.variants || [],
        images: data.images || [],
      };
      
      setProduct(transformedProduct);
      if (transformedProduct.images && transformedProduct.images.length > 0) {
        setSelectedImage(transformedProduct.images[0]);
      }
      setCalculatedPrice(transformedProduct.base_price);
      setLoading(false);
    }

    fetchProduct();
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
      setSelectedImage(product.images[0]);
    }
  };

  const handlePersonalisationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Personalisation request sent!");
    setShowPersonalisationModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a0a4a]"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen text-center py-20 bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <h1 className="text-4xl font-bold mb-4 text-[#0a0a4a]">Product Not Found</h1>
          <p className="text-gray-600">The product you are looking for does not exist or has been removed.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const mainImageUrl = selectedImage || product.images?.[0] || 'https://placehold.co/800x800/e5e7eb/767982?text=Product+Image';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-inter">
      <Header />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            <div>
              <div className="aspect-square bg-white rounded-lg overflow-hidden border border-gray-200 mb-4 shadow-sm">
                <img src={mainImageUrl} alt={product.name} className="w-full h-full object-contain p-4" />
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                  {product.images.map((image, index) => (
                    <div key={index} className={`aspect-square bg-white rounded-md overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-105 border-2 ${selectedImage === image ? 'border-[#ddb866]' : 'border-transparent'}`} onClick={() => setSelectedImage(image)}>
                      <img src={image} alt={`${product.name} - view ${index + 1}`} className="w-full h-full object-contain p-2" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-3xl sm:text-4xl font-bold text-[#0a0a4a]">{product.name}</h1>
                <div className="text-2xl sm:text-3xl font-bold text-[#ddb866] mt-2 sm:mt-0">£{calculatedPrice.toFixed(2)}</div>
              </div>

              {product.is_made_to_order ? (<Badge className="bg-[#ddb866] text-sm text-[#0a0a4a] font-semibold">Made to Order</Badge>) : (<p className="text-sm text-gray-500">In stock: {product.quantity}</p>)}
              <div className="text-gray-700 leading-relaxed [&_p]:my-4 [&_p]:leading-loose" dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.description) }}></div>

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

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <div className="flex items-center space-x-2"><Label htmlFor="quantity">Qty</Label><Input id="quantity" type="number" value={selectedQuantity} onChange={(e) => setSelectedQuantity(Math.max(1, parseInt(e.target.value) || 1))} min="1" className="w-20 border-gray-300 focus:border-[#ddb866] rounded-md" disabled={product.quantity !== null && product.quantity < 1} /></div>
                <Button className="flex-1 bg-[#ddb866] text-[#0a0a4a] hover:bg-[#ddb866]/90 shadow-lg font-semibold transition-all duration-300 rounded-md"><ShoppingCart className="h-5 w-5 mr-2" />Add to Cart</Button>
                <Button variant="outline" size="icon" className="border-gray-300 text-gray-500 hover:text-red-500 hover:border-red-500 transition-colors rounded-md"><Heart className="h-5 w-5" /></Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">{product.tags.map((tag, index) => (<Link to={`/tags/${tag.slug}`} key={index}><Badge className="bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors cursor-pointer">{tag.name}</Badge></Link>))}</div>
            </div>
          </div>

          <div className="mt-16">
            <div className="flex border-b border-gray-200 overflow-x-auto">
              <button className={`${TAB_BUTTON_STYLE} ${activeTab === 'description' ? TAB_BUTTON_ACTIVE_STYLE : TAB_BUTTON_INACTIVE_STYLE}`} onClick={() => setActiveTab('description')}>Description</button>
              {product.features && <button className={`${TAB_BUTTON_STYLE} ${activeTab === 'features' ? TAB_BUTTON_ACTIVE_STYLE : TAB_BUTTON_INACTIVE_STYLE}`} onClick={() => setActiveTab('features')}>Features</button>}
              {product.care_instructions && <button className={`${TAB_BUTTON_STYLE} ${activeTab === 'care' ? TAB_BUTTON_ACTIVE_STYLE : TAB_BUTTON_INACTIVE_STYLE}`} onClick={() => setActiveTab('care')}>Care</button>}
              {product.processing_times && <button className={`${TAB_BUTTON_STYLE} ${activeTab === 'processing' ? TAB_BUTTON_ACTIVE_STYLE : TAB_BUTTON_INACTIVE_STYLE}`} onClick={() => setActiveTab('processing')}>Processing</button>}
              <button className={`${TAB_BUTTON_STYLE} ${activeTab === 'sizeGuide' ? TAB_BUTTON_ACTIVE_STYLE : TAB_BUTTON_INACTIVE_STYLE}`} onClick={() => setActiveTab('sizeGuide')}>Size Guide</button>
            </div>
            <div className="bg-white p-6 rounded-b-lg border border-t-0 border-gray-200">
              {activeTab === 'description' && (<div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.description) }}></div>)}
              {activeTab === 'features' && (<div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.features) }}></div>)}
              {activeTab === 'care' && (<div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.care_instructions) }}></div>)}
              {activeTab === 'processing' && (<div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.processing_times) }}></div>)}
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
        </div>
      </main>
      <Footer />
    </div>
  );
}
