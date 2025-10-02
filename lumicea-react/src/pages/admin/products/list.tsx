import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Eye, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

  useEffect(() => {
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
    fetchProducts();
  }, []);

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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>SKU Prefix</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Inventory</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center h-24">Loading products...</TableCell></TableRow>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">
                    <Link to={`/admin/products/${product.id}`} className="hover:underline text-lumicea-navy">
                      {product.name}
                    </Link>
                    {product.is_featured && <Badge className="ml-2 bg-lumicea-gold text-lumicea-navy">Featured</Badge>}
                  </TableCell>
                  <TableCell className="text-gray-500">{product.sku_prefix || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={product.is_active ? 'default' : 'destructive'} className={product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {product.is_active ? 'Active' : 'Archived'}
                    </Badge>
                  </TableCell>
                  <TableCell>£{product.base_price.toFixed(2)}</TableCell>
                  <TableCell>{product.quantity ?? 'Made to order'}</TableCell>
                  <TableCell className="text-right">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                           <a href={`/products/${product.slug}`} target="_blank" rel="noopener noreferrer">
                             <Button variant="ghost" size="icon">
                               <Eye className="h-4 w-4 text-gray-500 hover:text-lumicea-navy" />
                             </Button>
                          </a>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View on site (new tab)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                     <Link to={`/admin/products/${product.id}`}>
                      <Button variant="outline" size="sm">Edit</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={6} className="text-center h-24">No products found matching your search.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
