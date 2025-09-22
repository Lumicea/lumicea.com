import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { PlusCircle, Trash2, Image, XCircle, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase';

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
  title: string;
  description: string;
  price: number;
  category: string;
  variants: Variant[];
  images: string[];
  tags: string[];
  quantity: number | null;
  is_made_to_order: boolean;
  is_active: boolean;
  is_featured: boolean;
  created_at: Date;
  updated_at: Date;
}

const ProductEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [existingTags, setExistingTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [openVariantOptions, setOpenVariantOptions] = useState<Record<string, boolean>>({});
  const [categoryInput, setCategoryInput] = useState('');
  const [openCategory, setOpenCategory] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      if (id) {
        const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
        if (error) {
          toast.error("Failed to load product.");
          console.error(error);
          navigate('/admin/products');
        } else if (data) {
          setProduct(data as Product);
          setIsNewProduct(false);
        }
      } else {
        setProduct({
          id: uuidv4(),
          title: '',
          description: '',
          price: 0,
          category: '',
          variants: [],
          images: [],
          tags: [],
          quantity: 0,
          is_made_to_order: false,
          is_active: true,
          is_featured: false,
          created_at: new Date(),
          updated_at: new Date(),
        });
        setIsNewProduct(true);
      }
      setLoading(false);
    };

    const fetchDropdownData = async () => {
      const { data, error } = await supabase.from('products').select('category, tags');
      if (error) {
        console.error("Failed to fetch dropdown data:", error);
      } else {
        const uniqueCategories = new Set<string>();
        const allTags = new Set<string>();
        data.forEach(p => {
          if (p.category) uniqueCategories.add(p.category);
          if (p.tags) p.tags.forEach((tag: string) => allTags.add(tag));
        });
        setCategories(Array.from(uniqueCategories));
        setExistingTags(Array.from(allTags));
      }
    };

    fetchProductData();
    fetchDropdownData();
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (!product) return;
    if (type === 'checkbox') {
      setProduct(prev => prev ? ({ ...prev, [name]: (e.target as HTMLInputElement).checked }) : null);
    } else {
      setProduct(prev => prev ? ({
        ...prev,
        [name]: name === 'price' || name === 'quantity' ? (value === '' ? null : parseFloat(value)) : value,
      }) : null);
    }
  };

  const handleVariantChange = (variantIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!product) return;
    const { name, value } = e.target;
    setProduct(prev => {
      if (!prev) return null;
      const newVariants = [...prev.variants];
      newVariants[variantIndex] = { ...newVariants[variantIndex], [name]: value };
      return { ...prev, variants: newVariants };
    });
  };

  const handleOptionChange = (variantIndex: number, optionIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!product) return;
    const { name, value, type } = e.target;
    setProduct(prev => {
      if (!prev) return null;
      const newVariants = [...prev.variants];
      const newOptions = [...newVariants[variantIndex].options];
      newOptions[optionIndex] = {
        ...newOptions[optionIndex],
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : (name === 'price_change' ? parseFloat(value) : value)
      };
      newVariants[variantIndex] = { ...newVariants[variantIndex], options: newOptions };
      return { ...prev, variants: newVariants };
    });
  };

  const addMasterVariant = () => {
    if (!product) return;
    setProduct(prev => prev ? ({
      ...prev,
      variants: [...prev.variants, { name: '', options: [] }],
    }) : null);
  };

  const addVariantOption = (variantIndex: number, name: string) => {
    if (!product) return;
    setProduct(prev => {
      if (!prev) return null;
      const newVariants = [...prev.variants];
      const newOptions = [...newVariants[variantIndex].options];
      newOptions.push({ name: name, price_change: 0, is_sold_out: false });
      newVariants[variantIndex] = { ...newVariants[variantIndex], options: newOptions };
      return { ...prev, variants: newVariants };
    });
    setOpenVariantOptions(prev => ({ ...prev, [variantIndex]: false }));
  };

  const removeMasterVariant = (variantIndex: number) => {
    if (!product) return;
    setProduct(prev => prev ? ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== variantIndex),
    }) : null);
  };

  const removeVariantOption = (variantIndex: number, optionIndex: number) => {
    if (!product) return;
    setProduct(prev => {
      if (!prev) return null;
      const newVariants = [...prev.variants];
      newVariants[variantIndex].options = newVariants[variantIndex].options.filter((_, i) => i !== optionIndex);
      return { ...prev, variants: newVariants };
    });
  };

  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>, variantIndex?: number, optionIndex?: number) => {
    if (!product) return;
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      if (variantIndex !== undefined && optionIndex !== undefined) {
        setProduct(prev => {
          if (!prev) return null;
          const newVariants = [...prev.variants];
          const newOptions = [...newVariants[variantIndex].options];
          const newImages = [...(newOptions[optionIndex].images || []), imageUrl];
          newOptions[optionIndex] = { ...newOptions[optionIndex], images: newImages };
          newVariants[variantIndex] = { ...newVariants[variantIndex], options: newOptions };
          return { ...prev, variants: newVariants };
        });
      } else {
        setProduct(prev => prev ? ({
          ...prev,
          images: [...prev.images, imageUrl]
        }) : null);
      }
    }
  };

  const handleImageRemove = (imageToRemove: string, variantIndex?: number, optionIndex?: number) => {
    if (!product) return;
    if (variantIndex !== undefined && optionIndex !== undefined) {
      setProduct(prev => {
        if (!prev) return null;
        const newVariants = [...prev.variants];
        const newOptions = [...newVariants[variantIndex].options];
        newOptions[optionIndex].images = (newOptions[optionIndex].images || []).filter(img => img !== imageToRemove);
        newVariants[variantIndex] = { ...newVariants[variantIndex], options: newOptions };
        return { ...prev, variants: newVariants };
      });
    } else {
      setProduct(prev => prev ? ({
        ...prev,
        images: prev.images.filter(img => img !== imageToRemove),
      }) : null);
    }
  };

  const handleTagAdd = (tag: string) => {
    if (!product) return;
    if (tag.trim() !== '' && !product.tags.includes(tag.trim())) {
      setProduct(prev => prev ? ({
        ...prev,
        tags: [...prev.tags, tag.trim()],
      }) : null);
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    if (!product) return;
    setProduct(prev => prev ? ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }) : null);
  };

  const handleAddCategory = () => {
    if (categoryInput.trim() !== '') {
      setCategories(prev => [...new Set([...prev, categoryInput.trim()])]);
      setProduct(prev => prev ? ({ ...prev, category: categoryInput.trim() }) : null);
      setCategoryInput('');
    }
    setOpenCategory(false);
  };

  const handleDuplicateProduct = async () => {
    if (!product) return;
    const newProduct = {
      ...product,
      id: uuidv4(),
      title: `${product.title} (Copy)`,
      created_at: new Date(),
      updated_at: new Date(),
      is_active: false,
      is_featured: false,
    };
    const { error } = await supabase.from('products').insert([newProduct]);
    if (error) {
      toast.error("Failed to duplicate product.");
      console.error(error);
    } else {
      toast.success("Product duplicated successfully!");
      navigate(`/admin/products/${newProduct.id}`);
    }
  };

  const handleDeleteProduct = async () => {
    if (!product) return;
    const { error } = await supabase.from('products').update({ is_active: false }).eq('id', product.id);
    if (error) {
      toast.error("Failed to archive product.");
      console.error(error);
    } else {
      toast.success("Product archived successfully!");
      navigate('/admin/products');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !product.title || !product.description) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const { id, created_at, updated_at, ...updateData } = product;

    if (isNewProduct) {
      const { error } = await supabase.from('products').insert([product]);
      if (error) {
        toast.error("Failed to create product.");
        console.error(error);
      } else {
        toast.success("Product created successfully!");
        navigate('/admin/products');
      }
    } else {
      const { error } = await supabase.from('products').update({ ...updateData, updated_at: new Date() }).eq('id', id);
      if (error) {
        toast.error("Failed to update product.");
        console.error(error);
      } else {
        toast.success("Product updated successfully!");
        navigate('/admin/products');
      }
    }
  };

  if (loading || !product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-[#0a0a4a] min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            {isNewProduct ? 'Create New Product' : 'Edit Product'}
          </h1>
          {!isNewProduct && (
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleDuplicateProduct}>Duplicate</Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive">Archive</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                      This action will archive this product. It will no longer be visible on your storefront.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleDeleteProduct}>Confirm</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-700 font-semibold">Product Title</Label>
              <Input
                id="title"
                name="title"
                value={product.title}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price" className="text-gray-700 font-semibold">Base Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={product.price}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-700 font-semibold">Product Description</Label>
            <Textarea
              id="description"
              name="description"
              value={product.description}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-gray-700 font-semibold">Category</Label>
              <Popover open={openCategory} onOpenChange={setOpenCategory}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openCategory}
                    className="w-full justify-between"
                  >
                    {product.category || "Select a category..."}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput placeholder="Search categories..." value={categoryInput} onValueChange={setCategoryInput} />
                    <CommandList>
                      <CommandEmpty>
                        <Button
                          variant="link"
                          onClick={handleAddCategory}
                          disabled={!categoryInput}
                        >
                          Add new category "{categoryInput}"
                        </Button>
                      </CommandEmpty>
                      <CommandGroup>
                        {categories.map((cat) => (
                          <CommandItem
                            key={cat}
                            onSelect={() => {
                              setProduct(prev => prev ? ({ ...prev, category: cat }) : null);
                              setOpenCategory(false);
                            }}
                          >
                            {cat}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 font-semibold">Quantity</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="madeToOrder"
                  name="is_made_to_order"
                  checked={product.is_made_to_order}
                  onCheckedChange={(checked) => setProduct(prev => prev ? ({ ...prev, is_made_to_order: checked as boolean, quantity: null }) : null)}
                />
                <label htmlFor="madeToOrder" className="text-sm">Made to Order</label>
                <Input
                  type="number"
                  name="quantity"
                  value={product.quantity || ''}
                  onChange={handleChange}
                  disabled={product.is_made_to_order}
                  placeholder="Set quantity"
                  className="w-full rounded-md border-gray-300 shadow-sm disabled:bg-gray-200"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-gray-700 font-semibold">Master Images</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Label htmlFor="image-upload-master" className="cursor-pointer">
                      <div className="flex items-center space-x-2 text-[#ddb866] hover:text-[#c4a259]">
                        <Image className="h-5 w-5" />
                        <span>Add Images</span>
                      </div>
                    </Label>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add images that apply to all variants.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Input
                id="image-upload-master"
                type="file"
                multiple
                onChange={handleImageAdd}
                className="hidden"
              />
            </div>
            <ScrollArea className="w-full whitespace-nowrap rounded-md border p-4">
              <div className="flex w-max space-x-4 p-2">
                {product.images.map((img, index) => (
                  <div key={index} className="relative w-24 h-24 rounded-md overflow-hidden group">
                    <img src={img} alt="Product" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleImageRemove(img)}
                      className="absolute top-1 right-1 text-white bg-gray-900/50 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-gray-700 font-semibold">Tags</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button type="button" variant="outline" className="text-[#ddb866] hover:text-[#c4a259]">
                    <PlusCircle className="h-4 w-4 mr-2" /> Add Tags
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0">
                  <Command>
                    <CommandInput placeholder="Search tags..." />
                    <CommandList>
                      <CommandEmpty>No tags found.</CommandEmpty>
                      <CommandGroup heading="Existing Tags">
                        {existingTags.map(tag => (
                          <CommandItem
                            key={tag}
                            onSelect={() => handleTagAdd(tag)}
                          >
                            {tag}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.tags.map(tag => (
                <Badge
                  key={tag}
                  className="bg-gray-200 text-gray-800 rounded-full px-3 py-1 text-sm flex items-center space-x-1 hover:bg-gray-300"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleTagRemove(tag)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <Label className="text-gray-700 font-semibold">Product Variants</Label>
            {product.variants.map((variant, variantIndex) => (
              <div key={variantIndex} className="bg-gray-100 p-4 rounded-md space-y-4">
                <div className="flex items-center space-x-2">
                  <Label htmlFor={`variant-name-${variantIndex}`} className="flex-grow">Variant Name</Label>
                  <Input
                    id={`variant-name-${variantIndex}`}
                    name="name"
                    value={variant.name}
                    onChange={(e) => handleVariantChange(variantIndex, e)}
                    className="flex-grow rounded-md border-gray-300 shadow-sm"
                    placeholder="e.g., Color, Size, Material"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeMasterVariant(variantIndex)}
                  >
                    <Trash2 className="h-4 w-4 text-gray-500" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Options</Label>
                    <Popover open={openVariantOptions[variantIndex]} onOpenChange={(open) => setOpenVariantOptions(prev => ({ ...prev, [variantIndex]: open }))}>
                      <PopoverTrigger asChild>
                        <Button type="button" variant="outline" className="h-7 px-2">
                          <PlusCircle className="h-3 w-3 mr-1" /> Add Option
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-0">
                        <Command>
                          <CommandInput placeholder="Search or add a new option..." />
                          <CommandList>
                            <CommandEmpty>
                              <Button
                                type="button"
                                variant="link"
                                onClick={() => addVariantOption(variantIndex, (document.querySelector('input[cmdk-input]') as HTMLInputElement)?.value)}
                              >
                                Create new option
                              </Button>
                            </CommandEmpty>
                            <CommandGroup heading="Recent Options">
                              {['Gold', 'Rose Gold', 'Silver', 'Small', 'Large', 'Extra Large'].map(option => (
                                <CommandItem key={option} onSelect={() => addVariantOption(variantIndex, option)}>
                                  {option}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    {variant.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="bg-white p-3 rounded-md border border-gray-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <Label className="text-sm flex-grow">{variant.name || 'Option'} Name</Label>
                          <Input
                            type="text"
                            name="name"
                            value={option.name}
                            onChange={(e) => handleOptionChange(variantIndex, optionIndex, e)}
                            className="flex-grow"
                            placeholder="e.g., Silver"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeVariantOption(variantIndex, optionIndex)}
                          >
                            <Trash2 className="h-4 w-4 text-gray-500" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <Label className="text-xs text-gray-500">Price Change ($)</Label>
                            <Input
                              type="number"
                              name="price_change"
                              value={option.price_change}
                              onChange={(e) => handleOptionChange(variantIndex, optionIndex, e)}
                              placeholder="0.00"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-gray-500">SKU</Label>
                            <Input
                              type="text"
                              name="sku"
                              value={option.sku || ''}
                              onChange={(e) => handleOptionChange(variantIndex, optionIndex, e)}
                              placeholder="SKU"
                            />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <Checkbox
                            id={`sold-out-${variantIndex}-${optionIndex}`}
                            name="is_sold_out"
                            checked={option.is_sold_out}
                            onCheckedChange={(checked) => handleOptionChange(variantIndex, optionIndex, { target: { name: 'is_sold_out', checked } } as any)}
                          />
                          <Label htmlFor={`sold-out-${variantIndex}-${optionIndex}`} className="text-sm">Sold Out?</Label>
                        </div>
                        <div className="mt-4 space-y-2">
                          <Label className="text-xs text-gray-500">Option Images</Label>
                          <div className="flex items-center space-x-2">
                            <Label htmlFor={`image-upload-${variantIndex}-${optionIndex}`} className="cursor-pointer">
                              <div className="flex items-center space-x-2 text-[#ddb866] hover:text-[#c4a259]">
                                <Image className="h-4 w-4" />
                                <span>Add Images</span>
                              </div>
                            </Label>
                            <Input
                              id={`image-upload-${variantIndex}-${optionIndex}`}
                              type="file"
                              multiple
                              onChange={(e) => handleImageAdd(e, variantIndex, optionIndex)}
                              className="hidden"
                            />
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {(option.images || []).map((img, imgIndex) => (
                              <div key={imgIndex} className="relative w-16 h-16 rounded-md overflow-hidden group">
                                <img src={img} alt="Variant" className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => handleImageRemove(img, variantIndex, optionIndex)}
                                  className="absolute top-1 right-1 text-white bg-gray-900/50 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <XCircle className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addMasterVariant} className="w-full border-dashed text-gray-500 hover:text-gray-800">
              <PlusCircle className="h-4 w-4 mr-2" /> Add Variant
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="active"
                name="is_active"
                checked={product.is_active}
                onCheckedChange={(checked) => setProduct(prev => prev ? ({ ...prev, is_active: checked as boolean }) : null)}
              />
              <Label htmlFor="active" className="text-sm">Active</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                name="is_featured"
                checked={product.is_featured}
                onCheckedChange={(checked) => setProduct(prev => prev ? ({ ...prev, is_featured: checked as boolean }) : null)}
              />
              <Label htmlFor="featured" className="text-sm">Featured</Label>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => navigate('/admin/products')}>Cancel</Button>
            <Button type="submit">Save Product</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export { ProductEditor };
