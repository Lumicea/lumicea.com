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

// Helper to generate a URL-friendly slug, required by your schema
const generateSlug = (name: string) => {
    if (!name) return '';
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // remove invalid chars
        .trim()
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes
};

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

// **MODIFIED**: Interface now matches the database schema for the fields you're using.
interface Product {
  id: string;
  name: string; // Formerly 'title'
  description: string;
  base_price: number; // Formerly 'price'
  slug: string | null;
  category: string;
  variants: Variant[];
  images: string[];
  tags: string[];
  quantity: number | null;
  is_made_to_order: boolean;
  is_active: boolean;
  is_featured: boolean;
  created_at: string; // Use string for ISO format consistency
  updated_at: string; // Use string for ISO format consistency
  collections: string[]; // Added collections
}

// NEW: Interfaces for Category, Tag, and Collection
interface Category {
    id: string;
    name: string;
}

interface Tag {
    id: string;
    name: string;
}

interface Collection {
    id: string;
    collection_name: string;
}


const ProductEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [existingTags, setExistingTags] = useState<Tag[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [openVariantOptions, setOpenVariantOptions] = useState<Record<string, boolean>>({});
  const [categoryInput, setCategoryInput] = useState('');
  const [openCategory, setOpenCategory] = useState(false);
  const [openCollections, setOpenCollections] = useState(false);


  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      if (id) {
        // Supabase returns 'name' and 'base_price', so we just need to cast it correctly
        const { data, error } = await supabase.from('products').select('*, product_collections(collection_id)').eq('id', id).single();
        if (error) {
          toast.error("Failed to load product.");
          console.error(error);
          navigate('/admin/products');
        } else if (data) {
          // Add a default 'variants' array for the UI if one doesn't exist on the fetched data
          setProduct({ ...data, variants: data.variants || [], collections: data.product_collections.map((c: any) => c.collection_id) } as Product);
          setIsNewProduct(false);
        }
      } else {
        // **MODIFIED**: Initial state uses correct field names
        setProduct({
          id: uuidv4(),
          name: '',
          description: '',
          base_price: 0,
          slug: '',
          category: '',
          variants: [],
          images: [],
          tags: [],
          quantity: 0,
          is_made_to_order: false,
          is_active: true,
          is_featured: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          collections: [],
        });
        setIsNewProduct(true);
      }
      setLoading(false);
    };

    const fetchDropdownData = async () => {
        // Fetch categories from the 'categories' table
        const { data: categoriesData, error: categoriesError } = await supabase.from('categories').select('id, name');
        if (categoriesError) {
            console.error("Failed to fetch categories:", categoriesError);
        } else {
            setCategories(categoriesData as Category[]);
        }

        // Fetch tags from the 'tags' table
        const { data: tagsData, error: tagsError } = await supabase.from('tags').select('id, name');
        if (tagsError) {
            console.error("Failed to fetch tags:", tagsError);
        } else {
            setExistingTags(tagsData as Tag[]);
        }

        // Fetch collections from the 'product_collections' table
        const { data: collectionsData, error: collectionsError } = await supabase.from('product_collections').select('id, collection_name');
        if (collectionsError) {
            console.error("Failed to fetch collections:", collectionsError);
        } else {
            setCollections(collectionsData as Collection[]);
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
        // **MODIFIED**: Check for 'base_price' instead of 'price'
        [name]: name === 'base_price' || name === 'quantity' ? (value === '' ? null : parseFloat(value)) : value,
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

  const handleTagAdd = (tagId: string) => {
    if (!product) return;
    if (tagId && !product.tags.includes(tagId)) {
        setProduct(prev => prev ? ({
            ...prev,
            tags: [...prev.tags, tagId],
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

  const handleCollectionToggle = (collectionId: string) => {
    if (!product) return;
    const newCollections = product.collections.includes(collectionId)
        ? product.collections.filter(c => c !== collectionId)
        : [...product.collections, collectionId];
    setProduct(prev => prev ? { ...prev, collections: newCollections } : null);
  };

  const handleAddCategory = async () => {
    if (categoryInput.trim() !== '') {
        const newCategory = { name: categoryInput.trim(), slug: generateSlug(categoryInput.trim()) };
        const { data, error } = await supabase.from('categories').insert([newCategory]).select();

        if (error) {
            toast.error("Failed to add new category.");
            console.error(error);
        } else {
            setCategories(prev => [...prev, data[0]]);
            setProduct(prev => prev ? ({ ...prev, category: data[0].id }) : null);
            setCategoryInput('');
            toast.success("New category added successfully!");
        }
    }
    setOpenCategory(false);
  };

  const handleDuplicateProduct = async () => {
    if (!product) return;
    // **MODIFIED**: Create a clean payload that matches the schema
    const { collections, ...productData } = product; // Exclude collections from the main product data
    const newProduct = {
      ...productData,
      id: uuidv4(),
      name: `${product.name} (Copy)`,
      slug: generateSlug(`${product.name} (Copy)`),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
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
    if (!product || !product.name) {
      toast.error("Please fill in all required fields.");
      return;
    }
    
    // **MODIFIED**: Prepare a clean payload for Supabase, removing the UI-only 'variants' property
    const { variants, collections, ...payload } = product;
    // Generate/update slug and timestamp before saving
    payload.slug = generateSlug(payload.name);
    payload.updated_at = new Date().toISOString();

    const saveProduct = async () => {
        if (isNewProduct) {
            const { data, error } = await supabase.from('products').insert([payload]).select();
            if (error) throw error;
            return data?.[0];
        } else {
            const { data, error } = await supabase.from('products').update(payload).eq('id', product.id).select();
            if (error) throw error;
            return data?.[0];
        }
    };

    try {
        const savedProduct = await saveProduct();
        if (!savedProduct) throw new Error("Product saving failed.");

        // Handle Tags
        const { error: deleteTagsError } = await supabase.from('product_tags').delete().eq('product_id', savedProduct.id);
        if (deleteTagsError) throw deleteTagsError;

        if (product.tags.length > 0) {
            const tagsToInsert = product.tags.map(tagId => ({ product_id: savedProduct.id, tag_id: tagId }));
            const { error: insertTagsError } = await supabase.from('product_tags').insert(tagsToInsert);
            if (insertTagsError) throw insertTagsError;
        }

        // Handle Collections
        const { error: deleteCollectionsError } = await supabase.from('product_collection_items').delete().eq('product_id', savedProduct.id);
        if (deleteCollectionsError) throw deleteCollectionsError;

        if (product.collections.length > 0) {
            const collectionsToInsert = product.collections.map(collectionId => ({ product_id: savedProduct.id, collection_id: collectionId }));
            const { error: insertCollectionsError } = await supabase.from('product_collection_items').insert(collectionsToInsert);
            if (insertCollectionsError) throw insertCollectionsError;
        }


        toast.success(`Product ${isNewProduct ? 'created' : 'updated'} successfully!`);
        navigate('/admin/products');

    } catch (error: any) {
        toast.error(`Failed to save product: ${error.message}`);
        console.error(error);
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
              {/* **MODIFIED**: Corrected `htmlFor`, `id`, `name`, and `value` to use `name` */}
              <Label htmlFor="name" className="text-gray-700 font-semibold">Product Title</Label>
              <Input
                id="name"
                name="name"
                value={product.name}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div className="space-y-2">
              {/* **MODIFIED**: Corrected `htmlFor`, `id`, `name`, and `value` to use `base_price` */}
              <Label htmlFor="base_price" className="text-gray-700 font-semibold">Base Price</Label>
              <Input
                id="base_price"
                name="base_price"
                type="number"
                step="0.01"
                value={product.base_price}
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
                    {categories.find(c => c.id === product.category)?.name || "Select a category..."}
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
                            key={cat.id}
                            onSelect={() => {
                              setProduct(prev => prev ? ({ ...prev, category: cat.id }) : null);
                              setOpenCategory(false);
                            }}
                          >
                            {cat.name}
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
                                            key={tag.id}
                                            onSelect={() => handleTagAdd(tag.id)}
                                        >
                                            {tag.name}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
            <div className="flex flex-wrap gap-2">
                {product.tags.map(tagId => (
                    <Badge
                        key={tagId}
                        className="bg-gray-200 text-gray-800 rounded-full px-3 py-1 text-sm flex items-center space-x-1 hover:bg-gray-300"
                    >
                        <span>{existingTags.find(t => t.id === tagId)?.name}</span>
                        <button
                            type="button"
                            onClick={() => handleTagRemove(tagId)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ×
                        </button>
                    </Badge>
                ))}
            </div>
          </div>

            <div className="space-y-4">
                <Label className="text-gray-700 font-semibold">Collections</Label>
                <Popover open={openCollections} onOpenChange={setOpenCollections}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start font-normal">
                            {product.collections.length > 0 ? `${product.collections.length} selected` : "Select collections..."}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                        <Command>
                            <CommandInput placeholder="Search collections..." />
                            <CommandList>
                                <CommandEmpty>No collections found.</CommandEmpty>
                                <CommandGroup>
                                    {collections.map((col) => (
                                        <CommandItem key={col.id} onSelect={() => handleCollectionToggle(col.id)}>
                                            <Checkbox checked={product.collections.includes(col.id)} className="mr-2" />
                                            {col.collection_name}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
                <div className="flex flex-wrap gap-2">
                    {product.collections.map(collectionId => (
                        <Badge key={collectionId}>{collections.find(c => c.id === collectionId)?.collection_name}</Badge>
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
