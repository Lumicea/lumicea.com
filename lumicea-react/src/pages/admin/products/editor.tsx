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
        <div className="space-y-4">
            <Label className="font-semibold text-gray-800">{title}</Label>
            <div className="flex space-x-2">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder={`Search existing ${title.toLowerCase()}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>
             <div className="flex space-x-2">
                <Input
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <Button type="button" onClick={handleAdd}>Add New</Button>
            </div>
            <ScrollArea className="h-40 w-full rounded-md border p-2 bg-gray-50/50">
                <div className="flex flex-wrap gap-2">
                    {filteredItems.map(item => (
                        <Badge
                            key={item.id}
                            variant={selectedIds.includes(item.id) ? 'default' : 'outline'}
                            onClick={() => onToggle(item.id)}
                            className="cursor-pointer transition-all hover:scale-105"
                        >
                            {item.name}
                        </Badge>
                    ))}
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
    const fetchProductData = async () => { /* ... UNCHANGED ... */ };
    const fetchDropdownData = async () => { /* ... UNCHANGED ... */ };
    const loadData = async () => { setLoading(true); await Promise.all([fetchProductData(), fetchDropdownData()]); setLoading(false); };
    loadData();
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { /* ... UNCHANGED ... */ };
  
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

  const handleVariantChange = (variantIndex: number, e: React.ChangeEvent<HTMLInputElement>) => { /* ... UNCHANGED ... */ };
  const handleOptionChange = (variantIndex: number, optionIndex: number, e: React.ChangeEvent<HTMLInputElement>) => { /* ... UNCHANGED ... */ };
  const addMasterVariant = () => { /* ... UNCHANGED ... */ };
  const addVariantOption = (variantIndex: number, name: string) => { /* ... UNCHANGED ... */ };
  const removeMasterVariant = (variantIndex: number) => { /* ... UNCHANGED ... */ };
  const removeVariantOption = (variantIndex: number, optionIndex: number) => { /* ... UNCHANGED ... */ };
  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>, variantIndex?: number, optionIndex?: number) => { /* ... UNCHANGED ... */ };
  const handleImageRemove = (imageToRemove: string, variantIndex?: number, optionIndex?: number) => { /* ... UNCHANGED ... */ };
  
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
            <div className="flex justify-between items-center mb-8">
                <div><h1 className="text-3xl font-bold text-gray-900">{isNewProduct ? 'Create New Product' : 'Edit Product'}</h1>{!isNewProduct && <p className="text-sm text-gray-500">Editing: {product.name}</p>}</div>
                <div className="flex space-x-2"><Button type="button" variant="outline" onClick={() => navigate('/admin/products')} disabled={isSaving}>Cancel</Button><Button type="submit" disabled={isSaving}>{isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : 'Save Product'}</Button></div>
            </div>
            <div className="grid grid-cols-1 gap-8">
                <Card className="shadow-sm">
                    <CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-lumicea-gold" />Details & Descriptions</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                         {/* Unchanged content here */}
                    </CardContent>
                </Card>
                
                {/* NEW RECODED ORGANIZATION SECTION */}
                <Card className="shadow-sm">
                    <CardHeader><CardTitle className="flex items-center gap-2"><Tag className="h-5 w-5 text-lumicea-gold" />Organization</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <TaxonomyManager
                            title="Categories"
                            items={categories}
                            selectedIds={product.categories}
                            onToggle={(id) => handleMultiSelectToggle('categories', id)}
                            onAdd={(name) => handleAddNewItem('category', name)}
                            placeholder="Create a new category..."
                        />
                        <TaxonomyManager
                            title="Collections"
                            items={collections.map(c => ({ id: c.id, name: c.collection_name }))}
                            selectedIds={product.collections}
                            onToggle={(id) => handleMultiSelectToggle('collections', id)}
                            onAdd={(name) => handleAddNewItem('collection', name)}
                            placeholder="Create a new collection..."
                        />
                        <div className="md:col-span-2">
                             <TaxonomyManager
                                title="Tags"
                                items={existingTags}
                                selectedIds={product.tags}
                                onToggle={(id) => handleMultiSelectToggle('tags', id)}
                                onAdd={(name) => handleAddNewItem('tag', name)}
                                placeholder="Create a new tag..."
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader><CardTitle className="flex items-center gap-2"><Image className="h-5 w-5 text-lumicea-gold" />Images & Variants</CardTitle></CardHeader>
                    <CardContent className="space-y-8">
                        {/* Unchanged content here */}
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader><CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5 text-lumicea-gold" />Settings</CardTitle></CardHeader>
                    <CardContent className="flex items-center space-x-6 pt-4">
                        {/* Unchanged content here */}
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
