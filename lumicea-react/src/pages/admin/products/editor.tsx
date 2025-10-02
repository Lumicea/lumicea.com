import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Trash2, Image, XCircle, Loader2, Sparkles, Tag, Package, Settings, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase';

// BOLD FIX: Re-added the missing Tooltip imports which caused the white screen error.
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'; // Keep for variant options


// Helper to generate a URL-friendly slug
const generateSlug = (name: string) => {
    if (!name) return '';
    return name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');
};

// Default care instructions
const defaultCareInstructions = `<h4>Sterling Silver & Argentium Silver</h4>
<ul>
  <li>Clean with a soft, lint-free cloth to remove tarnish and restore shine</li>
  <li>For deeper cleaning, use a silver polishing cloth or mild silver cleaner</li>
  <li>Store in an airtight container or anti-tarnish bag when not wearing</li>
  <li>Remove before swimming, bathing, or exposure to chemicals like perfume or hairspray</li>
</ul>
<br/>
<h4>Gold & Rose Gold Filled</h4>
<ul>
  <li>Clean with mild soap and warm water using a soft cloth</li>
  <li>Gently pat dry with a clean, soft cloth</li>
  <li>Store in a jewelry box or pouch to prevent scratches</li>
  <li>Remove before swimming in chlorinated pools or hot tubs</li>
</ul>
<br/>
<h4>General Gemstone Care</h4>
<p>Avoid prolonged sunlight exposure, heat, impacts, and chemicals. Clean most gemstones with mild soap and lukewarm water, but always check for specific gemstone requirements as some are porous (like turquoise) or sensitive to heat (like amethyst).</p>`;

// --- INTERFACES ---
interface VariantOption { name: string; price_change: number; is_sold_out: boolean; images?: string[]; sku?: string; }
interface Variant { name: string; options: VariantOption[]; }
interface Product {
  id: string; name: string; description: string; features: string; care_instructions: string; processing_times: string; base_price: number; slug: string | null; variants: Variant[]; images: string[]; quantity: number | null; is_made_to_order: boolean; is_active: boolean; is_featured: boolean; created_at: string; updated_at: string; categories: string[]; collections: string[]; tags: string[];
}
interface Category { id: string; name: string; }
interface Tag { id: string; name: string; }
interface Collection { id: string; collection_name: string; }
type TaxonomyItem = { id: string; name: string; };

// --- NEW TAXONOMY MANAGER COMPONENT ---
const TaxonomyManager = ({ title, items, selectedIds, onToggle, onAdd, placeholder }: {
    title: string;
    items: TaxonomyItem[];
    selectedIds: string[];
    onToggle: (id: string) => void;
    onAdd: (name: string) => Promise<void>;
    placeholder: string;
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [inputValue, setInputValue] = useState('');

    const filteredItems = useMemo(() => {
        return items.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [items, searchTerm]);

    const handleAdd = async () => {
        if (inputValue.trim()) {
            await onAdd(inputValue.trim());
            setInputValue('');
            setSearchTerm('');
        }
    };

    return (
        <div className="space-y-4 rounded-lg border bg-gray-50/50 p-4">
            <Label className="font-semibold text-gray-800">{title}</Label>
            <div className="flex space-x-2">
                <Input
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAdd(); }}}
                />
                <Button type="button" onClick={handleAdd}>Add New</Button>
            </div>
             <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    placeholder={`Search existing ${title.toLowerCase()}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                />
            </div>
            <ScrollArea className="h-40 w-full rounded-md border p-2 bg-white">
                <div className="flex flex-wrap gap-2">
                    {filteredItems.length > 0 ? filteredItems.map(item => (
                        <Badge
                            key={item.id}
                            variant={selectedIds.includes(item.id) ? 'default' : 'outline'}
                            onClick={() => onToggle(item.id)}
                            className="cursor-pointer transition-all hover:scale-105 text-base"
                        >
                            {item.name}
                        </Badge>
                    )) : <p className="text-sm text-gray-500 p-2">No {title.toLowerCase()} found.</p>}
                </div>
            </ScrollArea>
        </div>
    );
};


// --- MAIN PRODUCT EDITOR COMPONENT ---
const ProductEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [existingTags, setExistingTags] = useState<Tag[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [openVariantOptions, setOpenVariantOptions] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setLoading(true);

    const fetchRelatedData = async () => {
      try {
        const [catRes, tagRes, colRes] = await Promise.all([
          supabase.from('categories').select('id, name'),
          supabase.from('tags').select('id, name'),
          supabase.from('product_collections').select('id, collection_name')
        ]);
        if (catRes.error) throw new Error("Could not fetch categories.");
        setCategories(catRes.data);
        if (tagRes.error) throw new Error("Could not fetch tags.");
        setExistingTags(tagRes.data);
        if (colRes.error) throw new Error("Could not fetch collections.");
        setCollections(colRes.data);
      } catch (error: any) {
        toast.error(error.message);
      }
    };

    if (id) {
      setIsNewProduct(false);
      const fetchProduct = async () => {
        const { data, error } = await supabase.from('products').select(`*, product_categories(category_id), product_collections(collection_id), product_tags(tag_id)`).eq('id', id).single();
        if (error) {
          toast.error("Error: Could not load product data.");
          navigate('/admin/products');
        } else {
          setProduct({ ...data, variants: data.variants || [], categories: data.product_categories.map((c: any) => c.category_id), collections: data.product_collections.map((c: any) => c.collection_id), tags: data.product_tags.map((t: any) => t.tag_id) });
        }
      };
      Promise.all([fetchProduct(), fetchRelatedData()]).finally(() => setLoading(false));
    } else {
      setIsNewProduct(true);
      setProduct({
        id: uuidv4(), name: '', description: '', features: '', care_instructions: defaultCareInstructions, processing_times: 'Usually ships within 3-5 business days.', base_price: 0, slug: '', variants: [], images: [], quantity: 0, is_made_to_order: false, is_active: true, is_featured: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), categories: [], collections: [], tags: []
      });
      fetchRelatedData().finally(() => setLoading(false));
    }
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!product) return;
    const { name, value, type } = e.target;
    const isChecked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    setProduct(prev => prev ? { ...prev, [name]: isChecked !== undefined ? isChecked : (name === 'base_price' || name === 'quantity' ? (value === '' ? null : parseFloat(value)) : value) } : null);
  };
  
  const handleMultiSelectToggle = (field: 'categories' | 'collections' | 'tags', id: string) => {
    if (!product) return;
    setProduct(prev => {
      if (!prev) return null;
      const currentValues = prev[field];
      const newValues = currentValues.includes(id) ? currentValues.filter(val => val !== id) : [...currentValues, id];
      return { ...prev, [field]: newValues };
    });
  };
  
  const handleAddNewItem = async (type: 'category' | 'tag' | 'collection', name: string) => {
    if (!name) return;
    let table = '';
    let payload: any = {};
    if (type === 'category') { table = 'categories'; payload = { name, slug: generateSlug(name) }; }
    else if (type === 'tag') { table = 'tags'; payload = { name }; }
    else if (type === 'collection') { table = 'product_collections'; payload = { collection_name: name }; }
    
    const { data, error } = await supabase.from(table).insert([payload]).select().single();
    
    if (error) { toast.error(`Error creating ${type}: ${error.message}.`);
    } else if (data) {
        toast.success(`Successfully added ${type}: "${name}".`);
        if (type === 'category') { setCategories(prev => [...prev, data]); handleMultiSelectToggle('categories', data.id); }
        else if (type === 'tag') { setExistingTags(prev => [...prev, data]); handleMultiSelectToggle('tags', data.id); }
        else if (type === 'collection') { setCollections(prev => [...prev, data]); handleMultiSelectToggle('collections', data.id); }
    }
  };

  const handleVariantChange = (variantIndex: number, e: React.ChangeEvent<HTMLInputElement>) => { if (!product) return; const { name, value } = e.target; setProduct(prev => { if (!prev) return null; const newVariants = [...prev.variants]; newVariants[variantIndex] = { ...newVariants[variantIndex], [name]: value }; return { ...prev, variants: newVariants }; }); };
  const handleOptionChange = (variantIndex: number, optionIndex: number, e: React.ChangeEvent<HTMLInputElement>) => { if (!product) return; const { name, value, type } = e.target; setProduct(prev => { if (!prev) return null; const newVariants = [...prev.variants]; const newOptions = [...newVariants[variantIndex].options]; newOptions[optionIndex] = { ...newOptions[optionIndex], [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : (name === 'price_change' ? parseFloat(value) : value) }; newVariants[variantIndex] = { ...newVariants[variantIndex], options: newOptions }; return { ...prev, variants: newVariants }; }); };
  const addMasterVariant = () => { if (!product) return; setProduct(prev => prev ? ({ ...prev, variants: [...prev.variants, { name: '', options: [] }] }) : null); };
  const addVariantOption = (variantIndex: number, name: string) => { if (!product || !name.trim()) return; setProduct(prev => { if (!prev) return null; const newVariants = [...prev.variants]; const newOptions = [...newVariants[variantIndex].options]; newOptions.push({ name: name.trim(), price_change: 0, is_sold_out: false }); newVariants[variantIndex] = { ...newVariants[variantIndex], options: newOptions }; return { ...prev, variants: newVariants }; }); setOpenVariantOptions(prev => ({ ...prev, [variantIndex]: false })); };
  const removeMasterVariant = (variantIndex: number) => { if (!product) return; setProduct(prev => prev ? ({ ...prev, variants: prev.variants.filter((_, i) => i !== variantIndex) }) : null); };
  const removeVariantOption = (variantIndex: number, optionIndex: number) => { if (!product) return; setProduct(prev => { if (!prev) return null; const newVariants = [...prev.variants]; newVariants[variantIndex].options = newVariants[variantIndex].options.filter((_, i) => i !== optionIndex); return { ...prev, variants: newVariants }; }); };
  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>, variantIndex?: number, optionIndex?: number) => { if (!product || !e.target.files) return; const file = e.target.files[0]; if (!file) return; const imageUrl = URL.createObjectURL(file); setProduct(prev => { if (!prev) return null; if (variantIndex !== undefined && optionIndex !== undefined) { const newVariants = [...prev.variants]; const newOptions = [...newVariants[variantIndex].options]; const newImages = [...(newOptions[optionIndex].images || []), imageUrl]; newOptions[optionIndex] = { ...newOptions[optionIndex], images: newImages }; newVariants[variantIndex] = { ...newVariants[variantIndex], options: newOptions }; return { ...prev, variants: newVariants }; } else { return { ...prev, images: [...prev.images, imageUrl] }; } }); };
  const handleImageRemove = (imageToRemove: string, variantIndex?: number, optionIndex?: number) => { if (!product) return; setProduct(prev => { if (!prev) return null; if (variantIndex !== undefined && optionIndex !== undefined) { const newVariants = [...prev.variants]; const newOptions = [...newVariants[variantIndex].options]; newOptions[optionIndex].images = (newOptions[optionIndex].images || []).filter(img => img !== imageToRemove); newVariants[variantIndex] = { ...newVariants[variantIndex], options: newOptions }; return { ...prev, variants: newVariants }; } else { return { ...prev, images: prev.images.filter(img => img !== imageToRemove) }; } }); };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !product.name) { toast.error("Please provide a Product Title before saving."); return; }
    setIsSaving(true);
    const { categories, collections, tags, ...payload } = product;
    payload.slug = generateSlug(payload.name); payload.updated_at = new Date().toISOString();
    try {
        const { data: savedProduct, error: productError } = isNewProduct ? await supabase.from('products').insert(payload).select().single() : await supabase.from('products').update(payload).eq('id', product.id).select().single();
        if (productError) throw new Error(`Could not save product: ${productError.message}`);
        if (!savedProduct) throw new Error("There was a problem saving the product data.");
        const relationalTables = [ { name: 'product_categories', ids: categories, column: 'category_id' }, { name: 'product_collections', ids: collections, column: 'collection_id' }, { name: 'product_tags', ids: tags, column: 'tag_id' }];
        for (const table of relationalTables) {
            await supabase.from(table.name).delete().eq('product_id', savedProduct.id);
            if (table.ids.length > 0) {
                const toInsert = table.ids.map(id => ({ product_id: savedProduct.id, [table.column]: id }));
                const { error } = await supabase.from(table.name).insert(toInsert);
                if (error) throw new Error(`Error saving ${table.name}: ${error.message}`);
            }
        }
        toast.success(`Product "${savedProduct.name}" has been saved successfully!`);
        navigate('/admin/products');
    } catch (error: any) { toast.error(error.message);
    } finally { setIsSaving(false); }
  };
  
  if (loading || !product) { return <div className="flex justify-center items-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-gray-500" /><p className="ml-4">Loading Product Editor...</p></div>; }

  return (
    <div className="bg-gray-50/50 min-h-screen">
      <form onSubmit={handleSubmit}>
        <div className="max-w-5xl mx-auto p-4 md:p-8">
            <div className="flex justify-between items-center mb-8"><div><h1 className="text-3xl font-bold text-gray-900">{isNewProduct ? 'Create New Product' : 'Edit Product'}</h1>{!isNewProduct && <p className="text-sm text-gray-500">Editing: {product.name}</p>}</div><div className="flex space-x-2"><Button type="button" variant="outline" onClick={() => navigate('/admin/products')} disabled={isSaving}>Cancel</Button><Button type="submit" disabled={isSaving}>{isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : 'Save Product'}</Button></div></div>
            <div className="grid grid-cols-1 gap-8">
                <Card className="shadow-sm"><CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-lumicea-gold" />Details & Descriptions</CardTitle></CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6"><div className="space-y-2"><Label htmlFor="name">Product Title</Label><Input id="name" name="name" value={product.name} onChange={handleChange} /></div><div className="space-y-2"><Label htmlFor="base_price">Base Price (£)</Label><Input id="base_price" name="base_price" type="number" step="0.01" value={product.base_price} onChange={handleChange} /></div></div>
                        <div className="space-y-2"><Label htmlFor="description">Description</Label><Textarea id="description" name="description" value={product.description} onChange={handleChange} rows={6} /></div>
                        <div className="space-y-2"><Label htmlFor="features">Features</Label><Textarea id="features" name="features" value={product.features} onChange={handleChange} rows={6} placeholder="Use HTML for formatting if needed." /></div>
                        <div className="space-y-2"><Label htmlFor="care_instructions">Care Instructions</Label><Textarea id="care_instructions" name="care_instructions" value={product.care_instructions} onChange={handleChange} rows={10} /></div>
                        <div className="space-y-2"><Label htmlFor="processing_times">Processing Times</Label><Textarea id="processing_times" name="processing_times" value={product.processing_times} onChange={handleChange} rows={2} /></div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm"><CardHeader><CardTitle className="flex items-center gap-2"><Tag className="h-5 w-5 text-lumicea-gold" />Organization</CardTitle></CardHeader>
                    <CardContent className="space-y-8 pt-6">
                        <TaxonomyManager title="Categories" items={categories} selectedIds={product.categories} onToggle={(id) => handleMultiSelectToggle('categories', id)} onAdd={(name) => handleAddNewItem('category', name)} placeholder="Create a new category..."/>
                        <TaxonomyManager title="Collections" items={collections.map(c => ({ id: c.id, name: c.collection_name }))} selectedIds={product.collections} onToggle={(id) => handleMultiSelectToggle('collections', id)} onAdd={(name) => handleAddNewItem('collection', name)} placeholder="Create a new collection..."/>
                        <TaxonomyManager title="Tags" items={existingTags} selectedIds={product.tags} onToggle={(id) => handleMultiSelectToggle('tags', id)} onAdd={(name) => handleAddNewItem('tag', name)} placeholder="Create a new tag..."/>
                    </CardContent>
                </Card>
                <Card className="shadow-sm"><CardHeader><CardTitle className="flex items-center gap-2"><Image className="h-5 w-5 text-lumicea-gold" />Images & Variants</CardTitle></CardHeader>
                    <CardContent className="space-y-8 pt-6">
                        <div className="space-y-4"><div className="flex justify-between items-center"><Label className="font-semibold">Master Images</Label><TooltipProvider><Tooltip><TooltipTrigger asChild><Label htmlFor="image-upload-master" className="cursor-pointer text-sm font-medium text-lumicea-navy hover:text-lumicea-gold transition-colors"><div className="flex items-center space-x-2"><PlusCircle className="h-4 w-4" /><span>Add</span></div></Label></TooltipTrigger><TooltipContent><p>Add images that apply to all variants.</p></TooltipContent></Tooltip></TooltipProvider><Input id="image-upload-master" type="file" multiple onChange={handleImageAdd} className="hidden"/></div><ScrollArea className="w-full whitespace-nowrap rounded-md border p-4 bg-gray-50/50"><div className="flex w-max space-x-4 p-2">{product.images.map((img, index) => (<div key={index} className="relative w-24 h-24 rounded-md overflow-hidden group"><img src={img} alt="Product" className="w-full h-full object-cover" /><button type="button" onClick={() => handleImageRemove(img)} className="absolute top-1 right-1 text-white bg-gray-900/50 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><XCircle className="h-4 w-4" /></button></div>))}</div></ScrollArea></div>
                        <div className="space-y-6"><Label className="text-lg font-semibold text-gray-800">Product Variants</Label>
                            {product.variants.map((variant, variantIndex) => (
                                <div key={variantIndex} className="bg-gray-50 border border-gray-200 p-4 rounded-lg space-y-4">
                                <div className="flex items-center space-x-4"><Input id={`variant-name-${variantIndex}`} name="name" value={variant.name} onChange={(e) => handleVariantChange(variantIndex, e)} className="flex-grow" placeholder="e.g., Color, Size, Material"/><Button type="button" variant="ghost" size="icon" onClick={() => removeMasterVariant(variantIndex)}><Trash2 className="h-5 w-5 text-red-500" /></Button></div>
                                <div className="space-y-3 pl-2 border-l-2 border-gray-200"><div className="flex items-center justify-between"><Label className="text-sm font-medium">Variant Options</Label>
                                    <Popover open={openVariantOptions[variantIndex]} onOpenChange={(open) => setOpenVariantOptions(prev => ({ ...prev, [variantIndex]: open }))}><PopoverTrigger asChild><Button type="button" variant="outline" size="sm"><PlusCircle className="h-4 w-4 mr-2" />Add Option</Button></PopoverTrigger>
                                        <PopoverContent className="w-80 p-0"><div className="p-2 flex space-x-2"><Input placeholder="Add new option name..." onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); addVariantOption(variantIndex, e.currentTarget.value); e.currentTarget.value = ''; } }}/><Button type='button' onClick={() => { const input = document.querySelector<HTMLInputElement>('input[placeholder="Add new option name..."]'); if(input) { addVariantOption(variantIndex, input.value); input.value = ''; }}}>Add</Button></div></PopoverContent>
                                    </Popover></div>
                                    {variant.options.map((option, optionIndex) => (
                                    <div key={optionIndex} className="bg-white p-3 rounded-md border"><div className="flex items-center space-x-2 mb-2"><Input type="text" name="name" value={option.name} onChange={(e) => handleOptionChange(variantIndex, optionIndex, e)} className="flex-grow"/><Button type="button" variant="ghost" size="icon" onClick={() => removeVariantOption(variantIndex, optionIndex)}><Trash2 className="h-4 w-4 text-gray-500" /></Button></div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2"><div className="space-y-1"><Label className="text-xs text-gray-500">Price Change (£)</Label><Input type="number" step="0.01" name="price_change" value={option.price_change} onChange={(e) => handleOptionChange(variantIndex, optionIndex, e)} placeholder="0.00"/></div><div className="space-y-1"><Label className="text-xs text-gray-500">SKU</Label><Input type="text" name="sku" value={option.sku || ''} onChange={(e) => handleOptionChange(variantIndex, optionIndex, e)} placeholder="SKU-123"/></div></div>
                                        <div className="flex items-center space-x-2 mt-2"><Checkbox id={`sold-out-${variantIndex}-${optionIndex}`} name="is_sold_out" checked={option.is_sold_out} onCheckedChange={(checked) => handleOptionChange(variantIndex, optionIndex, { target: { name: 'is_sold_out', checked } } as any)}/><Label htmlFor={`sold-out-${variantIndex}-${optionIndex}`} className="text-sm">Mark as Sold Out</Label></div>
                                        <div className="mt-4 space-y-2"><Label htmlFor={`image-upload-${variantIndex}-${optionIndex}`} className="cursor-pointer text-sm font-medium flex items-center space-x-2 text-lumicea-navy hover:text-lumicea-gold transition-colors"><Image className="h-4 w-4" /><span>Add Option Images</span></Label><Input id={`image-upload-${variantIndex}-${optionIndex}`} type="file" multiple onChange={(e) => handleImageAdd(e, variantIndex, optionIndex)} className="hidden"/>
                                        <div className="flex flex-wrap gap-2 mt-2">{(option.images || []).map((img, imgIndex) => (<div key={imgIndex} className="relative w-16 h-16 rounded-md overflow-hidden group"><img src={img} alt="Variant" className="w-full h-full object-cover" /><button type="button" onClick={() => handleImageRemove(img, variantIndex, optionIndex)} className="absolute top-1 right-1 text-white bg-gray-900/50 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><XCircle className="h-3 w-3" /></button></div>))}</div>
                                        </div>
                                    </div>
                                    ))}
                                </div>
                                </div>
                            ))}
                            <Button type="button" variant="outline" onClick={addMasterVariant} className="w-full border-dashed text-gray-500 hover:text-gray-800"><PlusCircle className="h-4 w-4 mr-2" />Add New Variant Type</Button>
                        </div>
                    </CardContent>
                </Card>
                 <Card className="shadow-sm"><CardHeader><CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5 text-lumicea-gold" />Settings</CardTitle></CardHeader>
                    <CardContent className="flex items-center space-x-6 pt-6">
                        <div className="flex items-center space-x-2"><Checkbox id="active" name="is_active" checked={product.is_active} onCheckedChange={(checked) => setProduct(prev => prev ? ({ ...prev, is_active: checked as boolean }) : null)}/><Label htmlFor="active" className="text-sm font-medium">Product is Active</Label></div>
                        <div className="flex items-center space-x-2"><Checkbox id="featured" name="is_featured" checked={product.is_featured} onCheckedChange={(checked) => setProduct(prev => prev ? ({ ...prev, is_featured: checked as boolean }) : null)}/><Label htmlFor="featured" className="text-sm font-medium">Featured Product</Label></div>
                    </CardContent>
                </Card>
            </div>
            <div className="pt-8 flex justify-end space-x-4 border-t mt-8">
                <Button type="button" variant="outline" onClick={() => navigate('/admin/products')} disabled={isSaving}>Cancel</Button>
                <Button type="submit" disabled={isSaving}>
                    {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : 'Save Product'}
                </Button>
            </div>
        </div>
      </form>
    </div>
  );
};

export { ProductEditor };
