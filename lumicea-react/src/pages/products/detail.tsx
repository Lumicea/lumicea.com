import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase.ts';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, Share2, Facebook, Twitter, Mail, ChevronRight, MessageCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

// Helper function to sanitize HTML content without a library
// WARNING: This is a basic function and is not a comprehensive security solution.
// For a production app, a robust sanitization library like DOMPurify is recommended.
const sanitizeHtml = (html) => {
  if (typeof html !== 'string') return '';
  const scriptRegex = /<script\b[^>]*>[\s\S]*?<\/script>/gi;
  return html.replace(scriptRegex, '');
};

const TAB_BUTTON_STYLE = "py-3 px-6 rounded-t-lg transition-colors";
const TAB_BUTTON_ACTIVE_STYLE = "bg-white text-[#0a0a4a] border-b-2 border-[#ddb866]";
const TAB_BUTTON_INACTIVE_STYLE = "bg-gray-100 text-gray-600 hover:bg-gray-200";

export function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [showPersonalisationModal, setShowPersonalisationModal] = useState(false);
  const [personalisationName, setPersonalisationName] = useState('');
  const [personalisationEmail, setPersonalisationEmail] = useState('');
  const [personalisationMessage, setPersonalisationMessage] = useState('');

  // Helper function to safely get the numeric value from a jsonb price_change
  const getPriceChangeValue = (priceChange) => {
    if (typeof priceChange === 'number') {
      return priceChange;
    }
    if (priceChange && typeof priceChange === 'object' && priceChange.amount !== undefined) {
      return priceChange.amount;
    }
    return 0;
  };

  useEffect(() => {
    async function fetchProduct() {
      if (!slug) {
        setLoading(false);
        return;
      }

      // Step 1: Fetch the product data, including the shipping_method_id
      const { data, error } = await supabase
        .from('products')
        .select(`
          id, name, slug, sku_prefix, base_price, is_made_to_order, quantity, description, features, processing_times, size_guide, shipping_method_id,
          images:product_images(*),
          variants:product_variants (
            id, name,
            options:variant_options (
              id, option_name, price_change, is_sold_out, image_id
            )
          ),
          tags:product_tags!product_tags_product_id_fkey (
            tag:tags (
              name
            )
          )
        `)
        .eq('slug', slug)
        .single();

      if (error) {
        console.error('Error fetching product:', error.message);
        setProduct(null);
        setLoading(false);
        return;
      }

      let shippingMethod = null;
      if (data.shipping_method_id) {
        // Step 2: Fetch the shipping method details using the ID from the product
        const { data: shippingData, error: shippingError } = await supabase
          .from('shipping_methods')
          .select('*')
          .eq('id', data.shipping_method_id)
          .single();

        if (shippingError) {
          console.error('Error fetching shipping method:', shippingError.message);
        } else {
          shippingMethod = shippingData;
        }
      }

      // Combine all the data into a single product object
      const transformedProduct = {
        ...data,
        shipping_method: shippingMethod,
        tags: data.tags.map(t => t.tag.name),
        images: data.images.map(img => ({
          ...img,
          altText: img.altText || data.name,
          isMain: img.is_main // assuming is_main is the column name
        })),
        variants: data.variants.map(v => ({
          ...v,
          options: v.options.map(o => ({
            ...o,
            is_sold_out: o.is_sold_out // assuming is_sold_out is the column name
          }))
        }))
      };
      
      setProduct(transformedProduct);
      if (transformedProduct.images && transformedProduct.images.length > 0) {
        const mainImage = transformedProduct.images.find(img => img.isMain) || transformedProduct.images[0];
        setSelectedImage(mainImage);
      }
      setCalculatedPrice(transformedProduct.base_price);
      setLoading(false);
    }

    fetchProduct();
  }, [slug]);

  useEffect(() => {
    if (product) {
      let newPrice = product.base_price;
      product.variants.forEach(variant => {
        const selectedOptionId = selectedVariants[variant.id];
        if (selectedOptionId) {
          const selectedOption = variant.options.find(opt => opt.id === selectedOptionId);
          if (selectedOption) {
            newPrice += getPriceChangeValue(selectedOption.price_change);
          }
        }
      });
      setCalculatedPrice(newPrice);
    }
  }, [selectedVariants, product]);

  const handleVariantSelect = (variantId, optionId) => {
    setSelectedVariants(prev => ({ ...prev, [variantId]: optionId }));
    if (product) {
      const variantSpecificImage = product.images.find(img => img.variantOptionId === optionId);
      const mainImage = product.images.find(img => img.isMain) || product.images[0];
      setSelectedImage(variantSpecificImage || mainImage || null);
    }
  };

  const handlePersonalisationSubmit = (e) => {
    e.preventDefault();
    console.log("Personalisation request submitted.");
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
          <p className="text-gray-600">The product you are looking for does not exist.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const mainImageUrl = selectedImage?.url || product.images?.find(img => img.isMain)?.url || product.images?.[0]?.url || 'https://placehold.co/800x800/e5e7eb/767982?text=Product+Image';
  const mainImageAltText = selectedImage?.altText || product.name || 'Product Image';

  const displayedImages = product.images.filter(img => img.isMain || img.variantOptionId === selectedImage?.variantOptionId);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-inter">
      <Header />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
          {/* Breadcrumbs */}
          <nav className="mb-4 text-sm text-gray-500 flex items-center space-x-2">
            <Link to="/" className="hover:underline">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="capitalize">{product.tags[0] || 'Uncategorised'}</span>
            <ChevronRight className="h-3 w-3" />
            <span>{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Product Images */}
            <div>
              <div className="aspect-square bg-white rounded-lg overflow-hidden border border-gray-200 mb-4 shadow-sm">
                <img
                  src={mainImageUrl}
                  alt={mainImageAltText}
                  className="w-full h-full object-contain p-4"
                />
              </div>
              {displayedImages.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                  {displayedImages.map((image) => (
                    <div
                      key={image.id}
                      className={`aspect-square bg-white rounded-md overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-105 border-2 ${selectedImage?.id === image.id ? 'border-[#ddb866]' : 'border-transparent'}`}
                      onClick={() => setSelectedImage(image)}
                    >
                      <img
                        src={image.url}
                        alt={image.altText}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-3xl sm:text-4xl font-bold text-[#0a0a4a]">
                  {product.name}
                </h1>
                <div className="text-2xl sm:text-3xl font-bold text-[#ddb866] mt-2 sm:mt-0">
                  £{calculatedPrice.toFixed(2)}
                </div>
              </div>

              {product.is_made_to_order ? (
                <Badge className="bg-[#ddb866] text-sm text-[#0a0a4a] font-semibold">Made to Order</Badge>
              ) : (
                <p className="text-sm text-gray-500">In stock: {product.quantity}</p>
              )}

              <div className="text-gray-700 leading-relaxed [&_p]:my-4 [&_p]:leading-loose" dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.description) }}></div>

              {/* Variant Selects */}
              <div className="space-y-4">
                {product.variants.length > 0 && product.variants.map((variant) => (
                  <div key={variant.id}>
                    <Label htmlFor={variant.id} className="text-sm font-medium text-gray-700">{variant.name}</Label>
                    <Select onValueChange={(value) => handleVariantSelect(variant.id, value)} value={selectedVariants[variant.id] || ''}>
                      <SelectTrigger className="w-full mt-1 border-gray-300 focus:border-[#ddb866] rounded-md">
                        <SelectValue placeholder={`Select a ${variant.name}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {variant.options.map(option => (
                          <SelectItem key={option.id} value={option.id} disabled={option.is_sold_out}>
                            {option.option_name}
                            {option.is_sold_out && <span className="ml-2 text-red-500">(Sold out)</span>}
                            {getPriceChangeValue(option.price_change) !== 0 && !option.is_sold_out && (
                              <span className="ml-2 text-gray-500">({getPriceChangeValue(option.price_change) > 0 ? '+' : ''}£{getPriceChangeValue(option.price_change).toFixed(2)})</span>
                            )}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>

              {/* Quantity and Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="quantity">Qty</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={selectedQuantity}
                    onChange={(e) => setSelectedQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    className="w-20 border-gray-300 focus:border-[#ddb866] rounded-md"
                    disabled={product.is_made_to_order}
                  />
                </div>
                <Button className="flex-1 bg-[#ddb866] text-[#0a0a4a] hover:bg-[#ddb866]/90 shadow-lg font-semibold transition-all duration-300 rounded-md">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="icon" className="border-gray-300 text-gray-500 hover:text-red-500 hover:border-red-500 transition-colors rounded-md">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>

              {/* Product Features & Info */}
              <div className="bg-gray-100 rounded-lg p-6 space-y-3 shadow-inner">
                <div className="text-[#0a0a4a] font-medium text-lg">Product Features</div>
                <div className="text-gray-700 leading-relaxed [&_p]:my-2" dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.features) }}></div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {product.tags.map((tag, index) => (
                  <Link to={`/tags/${tag.toLowerCase()}`} key={index}>
                    <Badge className="bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors cursor-pointer">
                      {tag}
                    </Badge>
                  </Link>
                ))}
              </div>
              
              {/* Personalisation and Social */}
              <div className="flex items-center justify-between mt-4">
                <Button variant="ghost" className="text-[#0a0a4a] hover:bg-transparent hover:underline" onClick={() => setShowPersonalisationModal(true)}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Interested in personalising?
                </Button>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500 text-sm">Share:</span>
                  <Button variant="ghost" size="icon"><Twitter className="h-4 w-4 text-gray-500 hover:text-blue-400" /></Button>
                  <Button variant="ghost" size="icon"><Facebook className="h-4 w-4 text-gray-500 hover:text-blue-600" /></Button>
                  <Button variant="ghost" size="icon"><Mail className="h-4 w-4 text-gray-500 hover:text-gray-700" /></Button>
                </div>
              </div>
            </div>
          </div>

          {/* Tabbed Section */}
          <div className="mt-16">
            <div className="flex border-b border-gray-200">
              <button 
                className={`${TAB_BUTTON_STYLE} ${activeTab === 'description' ? TAB_BUTTON_ACTIVE_STYLE : TAB_BUTTON_INACTIVE_STYLE}`}
                onClick={() => setActiveTab('description')}
              >
                Description
              </button>
              <button 
                className={`${TAB_BUTTON_STYLE} ${activeTab === 'features' ? TAB_BUTTON_ACTIVE_STYLE : TAB_BUTTON_INACTIVE_STYLE}`}
                onClick={() => setActiveTab('features')}
              >
                Product Features
              </button>
              <button 
                className={`${TAB_BUTTON_STYLE} ${activeTab === 'reviews' ? TAB_BUTTON_ACTIVE_STYLE : TAB_BUTTON_INACTIVE_STYLE}`}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews
              </button>
              <button 
                className={`${TAB_BUTTON_STYLE} ${activeTab === 'shipping' ? TAB_BUTTON_ACTIVE_STYLE : TAB_BUTTON_INACTIVE_STYLE}`}
                onClick={() => setActiveTab('shipping')}
              >
                Shipping
              </button>
              <button 
                className={`${TAB_BUTTON_STYLE} ${activeTab === 'processing' ? TAB_BUTTON_ACTIVE_STYLE : TAB_BUTTON_INACTIVE_STYLE}`}
                onClick={() => setActiveTab('processing')}
              >
                Processing
              </button>
              <button 
                className={`${TAB_BUTTON_STYLE} ${activeTab === 'sizeGuide' ? TAB_BUTTON_ACTIVE_STYLE : TAB_BUTTON_INACTIVE_STYLE}`}
                onClick={() => setActiveTab('sizeGuide')}
              >
                Size Guide
              </button>
            </div>
            <div className="bg-white p-6 rounded-b-lg border border-gray-200">
              {activeTab === 'description' && (
                <div className="text-gray-700 leading-relaxed [&_p]:my-2" dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.description) }}></div>
              )}
              {activeTab === 'features' && (
                <div className="text-gray-700 leading-relaxed [&_p]:my-2" dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.features) }}></div>
              )}
              {activeTab === 'reviews' && (
                <div>
                  <h3 className="font-semibold text-lg text-[#0a0a4a]">Customer Reviews</h3>
                  {/* Reviews will be dynamically populated here */}
                  <p className="text-sm text-gray-500 mt-2">No reviews for this product yet. Be the first!</p>
                </div>
              )}
              {activeTab === 'shipping' && (
                <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.shipping_method?.description || 'Shipping information is not available for this product.') }}></div>
              )}
              {activeTab === 'processing' && (
                <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.processing_times) }}></div>
              )}
              {activeTab === 'sizeGuide' && (
                <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.size_guide) }}></div>
              )}
            </div>
          </div>
          
          {/* Recommended Products */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-[#0a0a4a] mb-6">You Might Also Like</h2>
            {/* Placeholder for product carousel. We will build this in a future step. */}
            <div className="flex space-x-4 overflow-x-auto p-2">
              <div className="w-64 h-64 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center text-sm text-gray-500">Placeholder</div>
              <div className="w-64 h-64 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center text-sm text-gray-500">Placeholder</div>
              <div className="w-64 h-64 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center text-sm text-gray-500">Placeholder</div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Personalisation Modal */}
      <Dialog open={showPersonalisationModal} onOpenChange={setShowPersonalisationModal}>
        <DialogContent className="sm:max-w-[425px] rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle>Personalise this Product</DialogTitle>
            <DialogDescription>
              Let us know how we can create your dream piece.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePersonalisationSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input id="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Your Email</Label>
              <Input id="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Your Message</Label>
              <Textarea id="message" required />
            </div>
            {/* Hidden inputs to pass product details */}
            <input type="hidden" name="product_url" value={window.location.href} />
            <input type="hidden" name="sku" value={`${product.sku_prefix}-${Object.values(selectedVariants).join('-')}`} />
            <DialogFooter>
              <Button type="submit">Send Message</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
