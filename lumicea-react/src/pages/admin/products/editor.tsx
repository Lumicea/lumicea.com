import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, addDoc, updateDoc, collection, getDocs, setDoc } from "firebase/firestore";
import { getAuth, signInWithCustomToken, signInAnonymously } from "firebase/auth";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

// Firestore database security rules summary:
// Public data: /artifacts/{appId}/public/data/{your_collection_name}
// Private data: /artifacts/{appId}/users/{userId}/{your_collection_name}
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let userId = '';

const authenticate = async () => {
  try {
    if (initialAuthToken) {
      await signInWithCustomToken(auth, initialAuthToken);
    } else {
      await signInAnonymously(auth);
    }
    userId = auth.currentUser?.uid || '';
    console.log("Authentication successful, user ID:", userId);
  } catch (error) {
    console.error("Authentication failed:", error);
  }
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

interface Product {
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
  const [product, setProduct] = useState<Product>({
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
  const [categories, setCategories] = useState<string[]>([]);
  const [existingTags, setExistingTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [openVariantOptions, setOpenVariantOptions] = useState<Record<string, boolean>>({});
  const [categoryInput, setCategoryInput] = useState('');
  const [openCategory, setOpenCategory] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await authenticate();
      if (id) {
        const docRef = doc(db, `/artifacts/${appId}/users/${userId}/products/${id}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const productData = docSnap.data() as Product;
          // Ensure variants field is properly structured
          if (!productData.variants) {
            productData.variants = [];
          }
          setProduct(productData);
        } else {
          toast.error("Product not found.");
          navigate('/admin/products');
        }
      } else {
        setIsNewProduct(true);
      }
      setLoading(false);
    };

    fetchData();
  }, [id, navigate]);

  useEffect(() => {
    const fetchCategoriesAndTags = async () => {
      const productCollectionRef = collection(db, `/artifacts/${appId}/users/${userId}/products`);
      const querySnapshot = await getDocs(productCollectionRef);
      const uniqueCategories = new Set<string>();
      const allTags = new Set<string>();
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.category) {
          uniqueCategories.add(data.category);
        }
        if (data.tags && Array.isArray(data.tags)) {
          data.tags.forEach((tag: string) => allTags.add(tag));
        }
      });
      setCategories(Array.from(uniqueCategories));
      setExistingTags(Array.from(allTags));
    };

    if (userId) {
      fetchCategoriesAndTags();
    }
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setProduct(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setProduct(prev => ({
        ...prev,
        [name]: name === 'price' || name === 'quantity' ? (value === '' ? null : parseFloat(value)) : value,
      }));
    }
  };

  const handleVariantChange = (variantIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct(prev => {
      const newVariants = [...prev.variants];
      newVariants[variantIndex] = { ...newVariants[variantIndex], [name]: value };
      return { ...prev, variants: newVariants };
    });
  };

  const handleOptionChange = (variantIndex: number, optionIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setProduct(prev => {
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
    setProduct(prev => ({
      ...prev,
      variants: [...prev.variants, { name: '', options: [] }],
    }));
  };

  const addVariantOption = (variantIndex: number, name: string) => {
    setProduct(prev => {
      const newVariants = [...prev.variants];
      const newOptions = [...newVariants[variantIndex].options];
      newOptions.push({ name: name, price_change: 0, is_sold_out: false });
      newVariants[variantIndex] = { ...newVariants[variantIndex], options: newOptions };
      return { ...prev, variants: newVariants };
    });
    setOpenVariantOptions(prev => ({ ...prev, [variantIndex]: false }));
  };

  const removeMasterVariant = (variantIndex: number) => {
    setProduct(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== variantIndex),
    }));
  };

  const removeVariantOption = (variantIndex: number, optionIndex: number) => {
    setProduct(prev => {
      const newVariants = [...prev.variants];
      newVariants[variantIndex].options = newVariants[variantIndex].options.filter((_, i) => i !== optionIndex);
      return { ...prev, variants: newVariants };
    });
  };

  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>, variantIndex?: number, optionIndex?: number) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      if (variantIndex !== undefined && optionIndex !== undefined) {
        setProduct(prev => {
          const newVariants = [...prev.variants];
          const newOptions = [...newVariants[variantIndex].options];
          const newImages = [...(newOptions[optionIndex].images || []), imageUrl];
          newOptions[optionIndex] = { ...newOptions[optionIndex], images: newImages };
          newVariants[variantIndex] = { ...newVariants[variantIndex], options: newOptions };
          return { ...prev, variants: newVariants };
        });
      } else {
        setProduct(prev => ({
          ...prev,
          images: [...prev.images, imageUrl]
        }));
      }
    }
  };

  const handleImageRemove = (imageToRemove: string, variantIndex?: number, optionIndex?: number) => {
    if (variantIndex !== undefined && optionIndex !== undefined) {
      setProduct(prev => {
        const newVariants = [...prev.variants];
        const newOptions = [...newVariants[variantIndex].options];
        newOptions[optionIndex].images = (newOptions[optionIndex].images || []).filter(img => img !== imageToRemove);
        newVariants[variantIndex] = { ...newVariants[variantIndex], options: newOptions };
        return { ...prev, variants: newVariants };
      });
    } else {
      setProduct(prev => ({
        ...prev,
        images: prev.images.filter(img => img !== imageToRemove),
      }));
    }
  };

  const handleTagAdd = (tag: string) => {
    if (tag.trim() !== '' && !product.tags.includes(tag.trim())) {
      setProduct(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()],
      }));
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setProduct(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleAddCategory = () => {
    if (categoryInput.trim() !== '') {
      setCategories(prev => [...new Set([...prev, categoryInput.trim()])]);
      setProduct(prev => ({ ...prev, category: categoryInput.trim() }));
      setCategoryInput('');
    }
    setOpenCategory(false);
  };

  const handleDuplicateProduct = async () => {
    try {
      const newProduct = {
        ...product,
        title: `${product.title} (Copy)`,
        created_at: new Date(),
        updated_at: new Date(),
        is_active: false,
        is_featured: false,
      };
      // Remove the id and any document-specific fields
      delete newProduct.id;
      const docRef = await addDoc(collection(db, `/artifacts/${appId}/users/${userId}/products`), newProduct);
      toast.success("Product duplicated successfully!");
      navigate(`/admin/products/${docRef.id}`);
    } catch (e) {
      console.error("Error duplicating document: ", e);
      toast.error("Failed to duplicate product.");
    }
  };

  const handleDeleteProduct = async () => {
    try {
      if (id) {
        await setDoc(doc(db, `/artifacts/${appId}/users/${userId}/products/${id}`), {
          is_active: false, // Soft delete
          updated_at: new Date(),
        }, { merge: true });
        toast.success("Product archived successfully!");
        navigate('/admin/products');
      }
    } catch (e) {
      console.error("Error deleting document: ", e);
      toast.error("Failed to archive product.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product.title || !product.description) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      if (isNewProduct) {
        await addDoc(collection(db, `/artifacts/${appId}/users/${userId}/products`), {
          ...product,
          created_at: new Date(),
          updated_at: new Date(),
        });
        toast.success("Product created successfully!");
      } else {
        const docRef = doc(db, `/artifacts/${appId}/users/${userId}/products/${id}`);
        await updateDoc(docRef, {
          ...product,
          updated_at: new Date(),
        });
        toast.success("Product updated successfully!");
      }
      navigate('/admin/products');
    } catch (e) {
      console.error("Error adding/updating document: ", e);
      toast.error("Failed to save product.");
    }
  };

  if (loading) {
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
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Archive</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will archive this product. It will no longer be visible on your storefront.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteProduct}>Confirm</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
                              setProduct(prev => ({ ...prev, category: cat }));
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
                  onCheckedChange={(checked) => setProduct(prev => ({ ...prev, is_made_to_order: checked as boolean, quantity: null }))}
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
                      <div key={optionIndex} className="p-2 bg-white rounded-md border border-gray-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <Input
                            name="name"
                            value={option.name}
                            onChange={(e) => handleOptionChange(variantIndex, optionIndex, e)}
                            placeholder="Option Name"
                            className="flex-grow"
                          />
                          <Input
                            type="number"
                            name="price_change"
                            value={option.price_change}
                            onChange={(e) => handleOptionChange(variantIndex, optionIndex, e)}
                            placeholder="Price Change"
                            className="w-24 text-right"
                          />
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Checkbox
                                  id={`sold-out-${variantIndex}-${optionIndex}`}
                                  name="is_sold_out"
                                  checked={option.is_sold_out}
                                  onCheckedChange={(checked) => handleOptionChange(variantIndex, optionIndex, { target: { name: 'is_sold_out', checked } } as any)}
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Sold Out</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeVariantOption(variantIndex, optionIndex)}
                          >
                            <Trash2 className="h-4 w-4 text-gray-400" />
                          </Button>
                        </div>
                        <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
                          <span>Images for this variant option:</span>
                          <Label htmlFor={`option-image-upload-${variantIndex}-${optionIndex}`} className="cursor-pointer">
                            <span className="text-[#ddb866] hover:text-[#c4a259] flex items-center space-x-1">
                              <Image className="h-4 w-4" />
                              <span>Add</span>
                            </span>
                          </Label>
                          <Input
                            id={`option-image-upload-${variantIndex}-${optionIndex}`}
                            type="file"
                            multiple
                            onChange={(e) => handleImageAdd(e, variantIndex, optionIndex)}
                            className="hidden"
                          />
                        </div>
                        <ScrollArea className="w-full whitespace-nowrap rounded-md border bg-gray-50 p-2">
                          <div className="flex w-max space-x-2">
                            {(option.images || []).map((img, imgIndex) => (
                              <div key={imgIndex} className="relative w-16 h-16 rounded-md overflow-hidden group">
                                <img src={img} alt="Variant Option" className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => handleImageRemove(img, variantIndex, optionIndex)}
                                  className="absolute top-0.5 right-0.5 text-white bg-gray-900/50 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <XCircle className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addMasterVariant} className="text-[#ddb866] hover:text-[#c4a259]">
              <PlusCircle className="h-4 w-4 mr-2" /> Add Variant Type
            </Button>
          </div>
          
          <Separator />
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isFeatured"
                name="is_featured"
                checked={product.is_featured}
                onCheckedChange={(checked) => setProduct(prev => ({ ...prev, is_featured: checked as boolean }))}
              />
              <Label htmlFor="isFeatured">Featured Product</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                name="is_active"
                checked={product.is_active}
                onCheckedChange={(checked) => setProduct(prev => ({ ...prev, is_active: checked as boolean }))}
              />
              <Label htmlFor="isActive">Active (Visible)</Label>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/products')}
              className="text-gray-700 border-gray-300 hover:bg-gray-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#ddb866] text-[#0a0a4a] hover:bg-[#c4a259] transition-colors"
            >
              {isNewProduct ? 'Create Product' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductEditor;
