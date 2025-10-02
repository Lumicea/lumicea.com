import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Eye, Search, Copy, Trash2, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Card, CardContent } from '@/components/ui/card';
import { v4 as uuidv4 } from 'uuid';

const generateSlug = (name: string) => {
    if (!name) return '';
    return name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');
};

interface Product {
  id: string;
  name: string;
  slug: string;
  base_price: number;
  is_active: boolean;
  quantity: number | null;
  is_featured: boolean;
  sku_prefix: string | null;
}

export function AdminProductsListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('id, name, slug, base_price, is_active, quantity, is_featured, sku_prefix')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error("Failed to fetch products.");
      console.error(error);
    } else {
      setProducts(data as Product[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDuplicate = async (productId: string) => {
    const originalProduct = products.find(p => p.id === productId);
    if (!originalProduct) {
        toast.error("Original product not found.");
        return;
    }

    // Fetch the full original product data to duplicate
    const { data: fullProduct, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();
    
    if (fetchError || !fullProduct) {
        toast.error("Failed to fetch full product details to duplicate.");
        return;
    }

    const newName = `${fullProduct.name} (Copy)`;
    const newProductData = {
        ...fullProduct,
        id: uuidv4(), // Generate a new ID
        name: newName,
        slug: generateSlug(newName),
        is_active: false, // Duplicates are inactive by default
        is_featured: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };

    const { error: insertError } = await supabase.from('products').insert(newProductData);

    if (insertError) {
        toast.error(`Failed to duplicate product: ${insertError.message}`);
    } else {
        toast.success(`Product "${originalProduct.name}" duplicated successfully.`);
        await fetchProducts(); // Refresh the list
    }
  };

  const handleDelete = async (productId: string) => {
    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (error) {
        toast.error(`Failed to delete product: ${error.message}`);
    } else {
        toast.success("Product deleted successfully.");
        setProducts(products.filter(p => p.id !== productId)); // Optimistically update UI
    }
  };


  const filteredProducts = useMemo(() =>
    products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.sku_prefix && product.sku_prefix.toLowerCase().includes(searchTerm.toLowerCase()))
    ), [products, searchTerm]);

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link to="/admin/products/new">
          <Button style={{ backgroundColor: '#0a0a4a', color: 'white' }} className="hover:bg-opacity-90">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </Link>
      </div>

      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search by product name or SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      <Card className="shadow-sm">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Inventory</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} className="text-center h-24">Loading products...</TableCell></TableRow>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">
                    <Link to={`/admin/products/${product.id}`} className="hover:underline text-lumicea-navy">
                      {product.name}
                    </Link>
                    {product.is_featured && <Badge className="ml-2 bg-lumicea-gold text-lumicea-navy">Featured</Badge>}
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.is_active ? 'default' : 'outline'} className={product.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {product.is_active ? 'Active' : 'Draft'}
                    </Badge>
                  </TableCell>
                  <TableCell>{product.quantity ?? 'Made to order'}</TableCell>
                  <TableCell className="text-right">
                    <TooltipProvider>
                      <div className="flex items-center justify-end space-x-1">
                        <Tooltip><TooltipTrigger asChild><a href={`/products/${product.slug}`} target="_blank" rel="noopener noreferrer"><Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button></a></TooltipTrigger><TooltipContent><p>View on site</p></TooltipContent></Tooltip>
                        <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={() => handleDuplicate(product.id)}><Copy className="h-4 w-4" /></Button></TooltipTrigger><TooltipContent><p>Duplicate</p></TooltipContent></Tooltip>
                        <Link to={`/admin/products/${product.id}`}><Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button></Link>
                        <AlertDialog>
                            <Tooltip><TooltipTrigger asChild><AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-red-500" /></Button></AlertDialogTrigger></TooltipContent><TooltipContent><p>Delete</p></TooltipContent></Tooltip>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>This action cannot be undone. This will permanently delete the product from the database.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(product.id)} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={4} className="text-center h-24">No products found matching your search.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
        </CardContent>
      </Card>
    </div>
  );
};
