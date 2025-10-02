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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

const generateSlug = (name: string) => {
    if (!name) return '';
    return name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');
};

const defaultCareInstructions = `<h4>Sterling Silver & Argentium Silver</h4>
<ul>
  <li>Clean with a soft, lint-free cloth to remove tarnish and restore shine</li>
  <li>For deeper cleaning, use a silver polishing cloth or mild silver cleaner</li>
</ul>`;

interface VariantOption { name: string; price_change: number; is_sold_out: boolean; images?: string[]; sku?: string; }
interface Variant { name: string; options: VariantOption[]; }
interface Product {
  id: string; name: string; description: string | null; features: any; care_instructions: string | null; processing_times: string | null; base_price: number; slug: string; updated_at: string;
  images: string[]; quantity: number | null; is_made_to_order: boolean; is_active: boolean; is_featured: boolean; created_at: string;
  // UI arrays for managing relationships
  categories: string[]; collections: string[]; tags: string[]; variants: Variant[];
}
interface Category { id: string; name: string; }
interface Tag { id: string; name: string; }
interface Collection { id: string; collection_name: string; }
type TaxonomyItem = { id: string; name: string; };

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
    const filteredItems = useMemo(() => items.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())), [items, searchTerm]);

    const handleAdd = async () => { if (inputValue.trim()) { await onAdd(inputValue.trim()); setInputValue(''); setSearchTerm(''); } };

    return (
        <div className="space-y-4 rounded-lg border bg-slate-50 p-4">
            <Label className="font-semibold text-lg text-gray-800">{title}</Label>
            <div className="flex space-x-2">
                <Input placeholder={placeholder} value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAdd(); }}} />
                <Button type="button" onClick={handleAdd} style={{ backgroundColor: '#ddb866', color: '#0a0a4a' }} className="hover:bg-opacity-90">Add New</Button>
            </div>
             <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder={`Search existing ${title.toLowerCase()}...`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
            </div>
            <ScrollArea className="h-40 w-full rounded-md border p-2 bg-white">
                <div className="flex flex-wrap gap-2">
                    {filteredItems.map(item => (
                        <Badge
                            key={item.id}
                            onClick={() => onToggle(item.id)}
                            className={`cursor-pointer transition-all text-sm py-1 px-3 ${selectedIds.includes(item.id) ? 'bg-[#0a0a4a] text-white hover:bg-[#0a0a4a]/90' : 'bg-white text-[#0a0a4a] border border-[#0a0a4a] hover:bg-[#0a0a4a]/10'}`}
                        >
                            {item.name}
                        </Badge>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
};

const ProductEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [existingTags, setExistingTags] = useState<Tag[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [openVariantOptions, setOpenVariantOptions] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setLoading(true);
    const fetchRelatedData = async () => {
      try {
        const [catRes, tagRes, colRes] = await Promise.all([ supabase.from('categories').select('id, name'), supabase.from('tags').select('id, name'), supabase.from('product_collections').select('id, collection_name') ]);
        if (catRes.error) throw new Error("Could not fetch categories."); setCategories(catRes.data);
        if (tagRes.error) throw new Error("Could not fetch tags."); setExistingTags(tagRes.data);
        if (colRes.error) throw new Error("Could not fetch collections."); setCollections(colRes.data);
      } catch (error: any) { toast.error(error.message); }
    };

    if (id) {
      const fetchProduct = async () => {
        const { data, error } = await supabase.from('products').select(`*, product_categories(category_id), product_to_collection(collection_id), product_tags(tag_id)`).eq('id', id).single();
        if (error) { toast.error(`Error loading product: ${error.message}`); navigate('/admin/products');
        } else { setProduct({ ...data, variants: data.variants || [], categories: data.product_categories.map((c: any) => c.category_id), collections: data.product_to_collection.map((c: any) => c.collection_id), tags: data.product_tags.map((t: any) => t.tag_id) }); }
      };
      Promise.all([fetchProduct(), fetchRelatedData()]).finally(() => setLoading(false));
    } else {
      setProduct({ id: uuidv4(), name: '', description: '', features: null, care_instructions: defaultCareInstructions, processing_times: 'Usually ships in 3-5 business days.', base_price: 0, slug: '', variants: [], images: [], quantity: 0, is_made_to_order: false, is_active: true, is_featured: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), categories: [], collections: [], tags: [] });
      fetchRelatedData().finally(() => setLoading(false));
    }
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { if (!product) return; const { name, value, type } = e.target; const isChecked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined; setProduct(prev => prev ? { ...prev, [name]: isChecked !== undefined ? isChecked : (name === 'base_price' || name === 'quantity' ? (value === '' ? null : parseFloat(value)) : value) } : null); };
  const handleMultiSelectToggle = (field: 'categories' | 'collections' | 'tags', id: string) => { if (!product) return; setProduct(prev => { if (!prev) return null; const currentValues = prev[field]; const newValues = currentValues.includes(id) ? currentValues.filter(val => val !== id) : [...currentValues, id]; return { ...prev, [field]: newValues }; }); };
  const handleAddNewItem = async (type: 'category' | 'tag' | 'collection', name: string) => { if (!name) return; let table = ''; let payload: any = {}; if (type === 'category') { table = 'categories'; payload = { name, slug: generateSlug(name) }; } else if (type === 'tag') { table = 'tags'; payload = { name, slug: generateSlug(name) }; } else if (type === 'collection') { table = 'product_collections'; payload = { collection_name: name }; } const { data, error } = await supabase.from(table).insert([payload]).select().single(); if (error) { toast.error(`Error creating ${type}: ${error.message}.`); } else if (data) { toast.success(`Successfully added ${type}: "${name}".`); if (type === 'category') { setCategories(prev => [...prev, data]); handleMultiSelectToggle('categories', data.id); } else if (type === 'tag') { setExistingTags(prev => [...prev, data]); handleMultiSelectToggle('tags', data.id); } else if (type === 'collection') { setCollections(prev => [...prev, data]); handleMultiSelectToggle('collections', data.id); } } };
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
    if (!product || !product.name) { toast.error("Product name is required."); return; }
    setIsSaving(true);
    
    const { categories, collections, tags, variants, category_id, ...payload } = product; // Remove UI arrays AND old category_id
    payload.slug = generateSlug(payload.name); payload.updated_at = new Date().toISOString();
    
    try {
        const { data: savedProduct, error: productError } = id ? await supabase.from('products').update(payload).eq('id', product.id).select().single() : await supabase.from('products').insert(payload).select().single();
        if (productError) throw productError;
        if (!savedProduct) throw new Error("An unknown error occurred while saving the product.");

        const relationalTables = [ { name: 'product_categories', ids: categories, column: 'category_id' }, { name: 'product_to_collection', ids: collections, column: 'collection_id' }, { name: 'product_tags', ids: tags, column: 'tag_id' }];
        for (const table of relationalTables) {
            await supabase.from(table.name).delete().eq('product_id', savedProduct.id);
            if (table.ids.length > 0) {
                const toInsert = table.ids.map(id => ({ product_id: savedProduct.id, [table.column]: id }));
                const { error } = await supabase.from(table.name).insert(toInsert);
                if (error) throw new Error(`Error saving relationships for ${table.name}: ${error.message}`);
            }
        }
        toast.success(`Product "${savedProduct.name}" saved successfully!`);
        navigate('/admin/products');
    } catch (error: any) {
        if (error.message.includes('duplicate key value violates unique constraint')) { toast.error("Save Failed: A product with this name or slug already exists.");
        } else if (error.message.includes('violates foreign key constraint')) { toast.error(`Save Failed: A database relationship is incorrect.`);
        } else if (error.message.includes('violates check constraint')) { toast.error(`Save Failed: A field does not meet database requirements.`);
        } else { toast.error(`An unexpected database error occurred: ${error.message}`); }
    } finally { setIsSaving(false); }
  };
  
  if (loading || !product) { return <div className="flex justify-center items-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-gray-500" /><p className="ml-4">Loading Product Editor...</p></div>; }

  return (
    <div className="bg-gray-50/50 min-h-screen">
      <form onSubmit={handleSubmit}>
        <div className="max-w-5xl mx-auto p-4 md:p-8">
            <div className="flex justify-between items-center mb-8"><div><h1 className="text-3xl font-bold text-gray-900">{!id ? 'Create New Product' : 'Edit Product'}</h1>{id && <p className="text-sm text-gray-500">Editing: {product.name}</p>}</div><div className="flex space-x-2"><Button type="button" variant="outline" onClick={() => navigate('/admin/products')} disabled={isSaving}>Cancel</Button><Button type="submit" disabled={isSaving} style={{ backgroundColor: '#0a0a4a', color: 'white' }} className="hover:bg-opacity-90">{isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : 'Save Product'}</Button></div></div>
            <div className="grid grid-cols-1 gap-8">
                <Card className="shadow-sm"><CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-[#ddb866]" />Details & Descriptions</CardTitle></CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6"><div className="space-y-2"><Label htmlFor="name">Product Title</Label><Input id="name" name="name" value={product.name} onChange={handleChange} /></div><div className="space-y-2"><Label htmlFor="base_price">Base Price (£)</Label><Input id="base_price" name="base_price" type="number" step="0.01" value={product.base_price} onChange={handleChange} /></div></div>
                        <div className="space-y-2"><Label htmlFor="description">Description</Label><Textarea id="description" name="description" value={product.description || ''} onChange={handleChange} rows={6} /></div>
                        <div className="space-y-2"><Label htmlFor="features">Features</Label><Textarea id="features" name="features" value={product.features || ''} onChange={handleChange} rows={6} placeholder="Use HTML for formatting if needed." /></div>
                        <div className="space-y-2"><Label htmlFor="care_instructions">Care Instructions</Label><Textarea id="care_instructions" name="care_instructions" value={product.care_instructions || ''} onChange={handleChange} rows={10} /></div>
                        <div className="space-y-2"><Label htmlFor="processing_times">Processing Times</Label><Textarea id="processing_times" name="processing_times" value={product.processing_times || ''} onChange={handleChange} rows={2} /></div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm"><CardHeader><CardTitle className="flex items-center gap-2"><Tag className="h-5 w-5 text-[#ddb866]" />Organization</CardTitle></CardHeader>
                    <CardContent className="space-y-8 pt-6">
                        <TaxonomyManager title="Categories" items={categories} selectedIds={product.categories} onToggle={(id) => handleMultiSelectToggle('categories', id)} onAdd={(name) => handleAddNewItem('category', name)} placeholder="Create a new category..."/>
                        <TaxonomyManager title="Collections" items={collections.map(c => ({ id: c.id, name: c.collection_name }))} selectedIds={product.collections} onToggle={(id) => handleMultiSelectToggle('collections', id)} onAdd={(name) => handleAddNewItem('collection', name)} placeholder="Create a new collection..."/>
                        <TaxonomyManager title="Tags" items={existingTags} selectedIds={product.tags} onToggle={(id) => handleMultiSelectToggle('tags', id)} onAdd={(name) => handleAddNewItem('tag', name)} placeholder="Create a new tag..."/>
                    </CardContent>
                </Card>
                <Card className="shadow-sm"><CardHeader><CardTitle className="flex items-center gap-2"><Image className="h-5 w-5 text-[#ddb866]" />Images & Variants</CardTitle></CardHeader>
                    <CardContent className="space-y-8 pt-6">{/* ... Unchanged Variants and Images JSX ... */}</CardContent>
                </Card>
                 <Card className="shadow-sm"><CardHeader><CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5 text-[#ddb866]" />Settings</CardTitle></CardHeader>
                    <CardContent className="flex items-center space-x-6 pt-6">{/* ... Unchanged Settings JSX ... */}</CardContent>
                </Card>
            </div>
            <div className="pt-8 flex justify-end space-x-4 border-t mt-8"><Button type="button" variant="outline" onClick={() => navigate('/admin/products')} disabled={isSaving}>Cancel</Button><Button type="submit" disabled={isSaving} style={{ backgroundColor: '#0a0a4a', color: 'white' }} className="hover:bg-opacity-90">{isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : 'Save Product'}</Button></div>
        </div>
      </form>
    </div>
  );
};

export { ProductEditor };
