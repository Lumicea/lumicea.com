import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, Plus, X, UploadCloud, EyeOff, Tag, LayoutGrid } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { v4 as uuidv4 } from 'uuid';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";

// Define the shape of a single image
interface ProductImage {
  id: string;
  url: string;
  altText: string;
  isMain: boolean;
  variantOptionId?: string; // Optional field to link to a specific variant option
}

// Define the shape of a single product variant option
interface VariantOption {
  id: string;
  name: string;
  price_change: number;
  is_sold_out: boolean;
}

// Define the shape of a single product variant master section
interface ProductVariant {
  id: string;
  name: string;
  options: VariantOption[];
}

// Define the shape of our full product data
interface Product {
  id?: string;
  name: string;
  slug: string;
  sku_prefix: string;
  base_price: number;
  quantity?: number;
  is_made_to_order: boolean;
  description: string;
  features: string;
  is_active: boolean;
  is_featured: boolean;
  images: ProductImage[];
  variants: ProductVariant[];
  tags: string[];
  categories: string[];
}

// Mock database for tags and variant options for autocomplete
const MOCK_TAGS_DB = [
  'gold-plated', 'handmade', 'minimalist', 'boho', 'statement', 'bridal',
];
const MOCK_VARIANT_OPTIONS_DB = {
  'Hoop Material': ['Gold', 'Rose Gold', 'Argentium'],
  'Wrapping Material': ['Copper Wire', 'Silver Wire'],
  'Gauge (Hoop Thickness)': ['18g', '20g', '22g'],
  'Size (Hoop Inner Diameter)': ['8mm', '10mm', '12mm', '15mm'],
};

/**
 * ProductEditor component for creating and editing a product.
 * @param productId The ID of the product to edit, or null for a new product.
 * @param onBack Callback function to navigate back to the product list.
 */
export function ProductEditor({ productId, onBack }: { productId: string | null; onBack: () => void }) {
  const [product, setProduct] = useState<Product>({
    name: '',
    slug: '',
    sku_prefix: '',
    base_price: 0,
    quantity: 0,
    is_made_to_order: false,
    description: '',
    features: '',
    is_active: true,
    is_featured: false,
    images: [],
    variants: [],
    tags: [],
    categories: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [tagAutocomplete, setTagAutocomplete] = useState<string[]>([]);
  const [variantOptionAutocomplete, setVariantOptionAutocomplete] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    // Populate autocomplete lists from mock data
    setTagAutocomplete(MOCK_TAGS_DB);
    setVariantOptionAutocomplete(MOCK_VARIANT_OPTIONS_DB);

    if (productId) {
      setIsNewProduct(false);
      const fetchProduct = async () => {
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', productId)
            .single();

          if (error) {
            throw error;
          }
          if (data) {
            setProduct({
              ...data,
              base_price: parseFloat(data.base_price),
              images: data.images || [],
              variants: data.variants || [],
              tags: data.tags || [],
              categories: data.categories || [],
            });
          }
        } catch (err) {
          console.error('Failed to fetch product:', err);
          setError('Failed to load product details.');
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    } else {
      setIsNewProduct(true);
      setProduct({
        name: '',
        slug: '',
        sku_prefix: '',
        base_price: 0,
        quantity: 0,
        is_made_to_order: false,
        description: '',
        features: '',
        is_active: true,
        is_featured: false,
        images: [],
        variants: [],
        tags: [],
        categories: [],
      });
    }
  }, [productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target;
    if (type === 'checkbox' && 'checked' in e.target) {
        setProduct(prev => ({ ...prev, [id]: e.target.checked }));
    } else {
        setProduct(prev => ({ ...prev, [id]: value }));
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setProduct(prev => ({
      ...prev,
      base_price: parseFloat(value) || 0,
    }));
  };
  
  const handleQuantityToggle = (checked: boolean) => {
    setProduct(prev => ({
      ...prev,
      is_made_to_order: checked,
      quantity: checked ? undefined : (prev.quantity || 0),
    }));
  };

  const addVariant = () => {
    setProduct(prev => ({
      ...prev,
      variants: [...prev.variants, { id: uuidv4(), name: '', options: [] }],
    }));
  };

  const addVariantOption = (variantId: string, optionName: string) => {
    if (optionName.trim() === '') return;
    setProduct(prev => ({
      ...prev,
      variants: prev.variants.map(variant =>
        variant.id === variantId
          ? { ...variant, options: [...variant.options, { id: uuidv4(), name: optionName, price_change: 0, is_sold_out: false }] }
          : variant
      ),
    }));
  };

  const handleVariantChange = (variantId: string, value: string) => {
    setProduct(prev => ({
      ...prev,
      variants: prev.variants.map(variant =>
        variant.id === variantId
          ? { ...variant, name: value }
          : variant
      ),
    }));
  };

  const handleVariantOptionChange = (variantId: string, optionId: string, field: 'name' | 'price_change' | 'is_sold_out', value: string | number | boolean) => {
    setProduct(prev => ({
      ...prev,
      variants: prev.variants.map(variant =>
        variant.id === variantId
          ? {
              ...variant,
              options: variant.options.map(option =>
                option.id === optionId
                  ? { ...option, [field]: value }
                  : option
              ),
            }
          : variant
      ),
    }));
  };

  const addTag = () => {
    if (newTag.trim() !== '' && !product.tags.includes(newTag.trim())) {
      setProduct(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setProduct(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const addCategory = () => {
    if (newCategory.trim() !== '' && !product.categories.includes(newCategory.trim())) {
      setProduct(prev => ({
        ...prev,
        categories: [...prev.categories, newCategory.trim()],
      }));
      setNewCategory('');
    }
  };

  const removeCategory = (categoryToRemove: string) => {
    setProduct(prev => ({
      ...prev,
      categories: prev.categories.filter(cat => cat !== categoryToRemove),
    }));
  };

  const addImage = (isMain: boolean, variantOptionId?: string) => {
    setProduct(prev => ({
      ...prev,
      images: [...prev.images, { id: uuidv4(), url: '', altText: '', isMain, variantOptionId }],
    }));
  };

  const handleImageChange = (imageId: string, field: 'url' | 'altText' | 'isMain', value: string | boolean) => {
    setProduct(prev => ({
      ...prev,
      images: prev.images.map(img => 
        img.id === imageId ? { ...img, [field]: value } : img
      ),
    }));
  };

  const handleSetMainImage = (imageId: string) => {
    setProduct(prev => ({
      ...prev,
      images: prev.images.map(img => ({
        ...img,
        isMain: img.id === imageId,
      })),
    }));
  };

  const handleRemoveImage = (imageId: string) => {
    setProduct(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== imageId),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Prepare data for Supabase by ensuring arrays are JSON strings
    const productToSave = {
      ...product,
      images: JSON.stringify(product.images),
      variants: JSON.stringify(product.variants),
      tags: JSON.stringify(product.tags),
      categories: JSON.stringify(product.categories),
      slug: product.slug || product.name.toLowerCase().replace(/\s+/g, '-'),
    };

    try {
      if (isNewProduct) {
        const { error } = await supabase.from('products').insert(productToSave);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').update(productToSave).eq('id', productId);
        if (error) throw error;
      }
      onBack();
    } catch (err) {
      console.error('Failed to save product:', err);
      setError('Failed to save product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !product.id) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-gray-50 font-inter">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack} disabled={loading} className="text-[#0a0a4a] hover:bg-gray-200 transition-colors rounded-md">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to List
        </Button>
        <h1 className="text-3xl font-bold text-[#0a0a4a]">{isNewProduct ? 'New Product' : `Edit Product: ${product.name}`}</h1>
      </div>

      <Card className="rounded-xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-[#0a0a4a]">General Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700">Product Name</Label>
            <Input id="name" value={product.name} onChange={handleChange} required className="border-gray-300 focus:border-[#ddb866] rounded-md" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug" className="text-gray-700">Custom URL Slug</Label>
            <Input id="slug" value={product.slug} onChange={handleChange} placeholder="e.g., gold-hoop-earrings" className="border-gray-300 focus:border-[#ddb866] rounded-md" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sku_prefix" className="text-gray-700">SKU Prefix (for automatic SKU creation)</Label>
            <Input id="sku_prefix" value={product.sku_prefix} onChange={handleChange} required className="border-gray-300 focus:border-[#ddb866] rounded-md" />
          </div>
          <div className="flex space-x-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="base_price" className="text-gray-700">Base Price (£)</Label>
              <Input id="base_price" type="number" value={product.base_price} onChange={handlePriceChange} required min="0" step="0.01" className="border-gray-300 focus:border-[#ddb866] rounded-md" />
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="quantity" className="text-gray-700">Quantity</Label>
              <Input id="quantity" type="number" value={product.is_made_to_order ? '' : (product.quantity || 0)} onChange={handleChange} min="0" disabled={product.is_made_to_order} className="border-gray-300 focus:border-[#ddb866] rounded-md" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="is_made_to_order" checked={product.is_made_to_order} onCheckedChange={handleQuantityToggle} />
            <Label htmlFor="is_made_to_order" className="text-gray-700">Made to Order</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="is_active" checked={product.is_active} onCheckedChange={(checked) => setProduct(prev => ({ ...prev, is_active: !!checked }))} />
            <Label htmlFor="is_active" className="text-gray-700">Active (Live)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="is_featured" checked={product.is_featured} onCheckedChange={(checked) => setProduct(prev => ({ ...prev, is_featured: !!checked }))} />
            <Label htmlFor="is_featured" className="text-gray-700">Featured</Label>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-[#0a0a4a]">Product Description & Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-700">Product Description</Label>
            <Textarea id="description" value={product.description} onChange={handleChange} className="border-gray-300 focus:border-[#ddb866] rounded-md min-h-[150px]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="features" className="text-gray-700">Product Features</Label>
            <Textarea id="features" value={product.features} onChange={handleChange} className="border-gray-300 focus:border-[#ddb866] rounded-md min-h-[150px]" />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-[#0a0a4a]">Images</CardTitle>
          <p className="text-sm text-gray-500">
            **Future Integration:** This will connect to Cloudinary for image uploads. For now, use image URLs.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-md font-semibold text-gray-700 flex items-center gap-2">
              <LayoutGrid className="h-4 w-4 text-[#ddb866]" />
              Master Product Images
            </h4>
            {product.images.filter(img => img.isMain).map((image) => (
              <div key={image.id} className="flex items-center space-x-2">
                <Input
                  value={image.url}
                  onChange={(e) => handleImageChange(image.id, 'url', e.target.value)}
                  placeholder="Image URL"
                  className="border-gray-300 focus:border-[#ddb866] rounded-md"
                />
                <Input
                  value={image.altText}
                  onChange={(e) => handleImageChange(image.id, 'altText', e.target.value)}
                  placeholder="Alt Text"
                  className="border-gray-300 focus:border-[#ddb866] rounded-md"
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveImage(image.id)} className="text-red-500 hover:bg-red-500/10 rounded-md">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" onClick={() => addImage(true)} className="bg-gray-200 text-gray-700 hover:bg-gray-300 shadow-sm rounded-md">
              <Plus className="h-4 w-4 mr-2" />
              Add Master Image
            </Button>
          </div>

          <div className="space-y-2 mt-6">
            <h4 className="text-md font-semibold text-gray-700 flex items-center gap-2">
              <LayoutGrid className="h-4 w-4 text-[#ddb866]" />
              Variant-Specific Images
            </h4>
            {product.images.filter(img => !img.isMain).map((image) => (
              <div key={image.id} className="flex items-center space-x-2">
                <Select value={image.variantOptionId || ''} onValueChange={(value) => handleImageChange(image.id, 'variantOptionId', value)}>
                  <SelectTrigger className="w-52 rounded-md">
                    <SelectValue placeholder="Link to a variant option" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.variants.map(variant => (
                      <div key={variant.id} className="py-1">
                        <p className="px-2 text-sm text-gray-500 font-semibold">{variant.name}</p>
                        {variant.options.map(option => (
                          <SelectItem key={option.id} value={option.id}>
                            {option.name}
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  value={image.url}
                  onChange={(e) => handleImageChange(image.id, 'url', e.target.value)}
                  placeholder="Image URL"
                  className="border-gray-300 focus:border-[#ddb866] rounded-md"
                />
                <Input
                  value={image.altText}
                  onChange={(e) => handleImageChange(image.id, 'altText', e.target.value)}
                  placeholder="Alt Text"
                  className="border-gray-300 focus:border-[#ddb866] rounded-md"
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveImage(image.id)} className="text-red-500 hover:bg-red-500/10 rounded-md">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" onClick={() => addImage(false)} className="bg-gray-200 text-gray-700 hover:bg-gray-300 shadow-sm rounded-md">
              <Plus className="h-4 w-4 mr-2" />
              Add Variant Image
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-[#0a0a4a]">Product Variants</CardTitle>
          <p className="text-sm text-gray-500">
            Create "master sections" like "Hoop Material" and add options within them.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {product.variants.map((variant, variantIndex) => (
            <div key={variant.id} className="space-y-4 border-l-2 pl-4 border-[#ddb866] relative">
              <div className="absolute -left-2 top-0 mt-1 h-4 w-4 bg-[#ddb866] rounded-full"></div>
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold text-[#0a0a4a]">Variant: {variant.name || 'Untitled'}</Label>
                <Button type="button" variant="ghost" size="icon" onClick={() => setProduct(prev => ({ ...prev, variants: prev.variants.filter(v => v.id !== variant.id) }))} className="text-red-500 hover:bg-red-500/10 rounded-full">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Input value={variant.name} onChange={(e) => handleVariantChange(variant.id, e.target.value)} placeholder="e.g., Hoop Material" className="border-gray-300 focus:border-[#ddb866] rounded-md" />
              
              <div className="space-y-2 mt-4">
                <h5 className="text-md font-medium text-gray-700">Options</h5>
                {variant.options.map((option, optionIndex) => (
                  <div key={option.id} className="flex items-center space-x-2 p-2 bg-gray-100 rounded-lg">
                    <Input
                      value={option.name}
                      onChange={(e) => handleVariantOptionChange(variant.id, option.id, 'name', e.target.value)}
                      placeholder="Option Name (e.g., Gold)"
                      className="flex-1 border-gray-300 focus:border-[#ddb866] rounded-md"
                    />
                    <Input
                      type="number"
                      value={option.price_change}
                      onChange={(e) => handleVariantOptionChange(variant.id, option.id, 'price_change', parseFloat(e.target.value) || 0)}
                      placeholder="Price Change"
                      step="0.01"
                      className="w-24 border-gray-300 focus:border-[#ddb866] rounded-md"
                    />
                    <div className="flex items-center space-x-1">
                      <Label htmlFor={`soldout-${option.id}`} className="text-sm">Sold Out</Label>
                      <Checkbox
                        id={`soldout-${option.id}`}
                        checked={option.is_sold_out}
                        onCheckedChange={(checked) => handleVariantOptionChange(variant.id, option.id, 'is_sold_out', !!checked)}
                      />
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={() => setProduct(prev => ({ ...prev, variants: prev.variants.map(v => v.id === variant.id ? { ...v, options: v.options.filter(o => o.id !== option.id) } : v) }))} className="text-red-500 hover:bg-red-500/10 rounded-full">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button type="button" variant="outline" className="border-[#ddb866] text-[#ddb866] hover:bg-[#ddb866] hover:text-white rounded-md">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Option
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0 rounded-md">
                    <Command>
                      <CommandInput placeholder="Search or add option..." className="rounded-md" />
                      <CommandGroup>
                        {variantOptionAutocomplete[variant.name]?.map((option) => (
                          <CommandItem
                            key={option}
                            onSelect={() => addVariantOption(variant.id, option)}
                          >
                            {option}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          ))}
          <Button type="button" onClick={addVariant} className="bg-[#ddb866] text-[#0a0a4a] hover:bg-[#ddb866]/80 shadow-md transition-colors rounded-md">
            <Plus className="h-4 w-4 mr-2" />
            Add Variant Section
          </Button>
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-[#0a0a4a]">Tags & Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-md font-semibold text-gray-700 flex items-center gap-2">
              <Tag className="h-4 w-4 text-[#ddb866]" />
              Product Tags
            </h4>
            <div className="flex items-center space-x-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="e.g., gold-plated, handmade"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
                className="border-gray-300 focus:border-[#ddb866] rounded-md"
              />
              <Button type="button" onClick={addTag} className="bg-[#ddb866] text-[#0a0a4a] hover:bg-[#ddb866]/80 shadow-md rounded-md">
                Add Tag
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {product.tags.map((tag, index) => (
                <Badge key={index} className="bg-gray-200 text-gray-700 pl-3 pr-2 py-1 flex items-center gap-1 rounded-full shadow-sm hover:bg-gray-300 transition-colors">
                  {tag}
                  <X className="h-3 w-3 cursor-pointer text-gray-500" onClick={() => removeTag(tag)} />
                </Badge>
              ))}
            </div>
            {tagAutocomplete.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-sm text-gray-500">Suggestions:</span>
                {tagAutocomplete.filter(t => !product.tags.includes(t)).map((tag) => (
                  <Badge key={tag} onClick={() => setNewTag(tag)} className="cursor-pointer bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors rounded-full">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h4 className="text-md font-semibold text-gray-700 flex items-center gap-2">
              <LayoutGrid className="h-4 w-4 text-[#ddb866]" />
              Product Categories
            </h4>
            <div className="flex items-center space-x-2">
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="e.g., Earrings, Necklaces"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCategory();
                  }
                }}
                className="border-gray-300 focus:border-[#ddb866] rounded-md"
              />
              <Button type="button" onClick={addCategory} className="bg-[#ddb866] text-[#0a0a4a] hover:bg-[#ddb866]/80 shadow-md rounded-md">
                Add Category
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {product.categories.map((category, index) => (
                <Badge key={index} className="bg-gray-200 text-gray-700 pl-3 pr-2 py-1 flex items-center gap-1 rounded-full shadow-sm hover:bg-gray-300 transition-colors">
                  {category}
                  <X className="h-3 w-3 cursor-pointer text-gray-500" onClick={() => removeCategory(category)} />
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <CardFooter className="flex justify-end p-6">
        <Button type="submit" disabled={loading} className="bg-[#0a0a4a] text-white hover:bg-[#0a0a4a]/90 shadow-lg transition-all duration-300 transform hover:scale-105 rounded-md font-semibold">
          {loading ? 'Saving...' : 'Save Product'}
        </Button>
      </CardFooter>
      {error && <div className="p-4 text-red-500">{error}</div>}
    </form>
  );
}
