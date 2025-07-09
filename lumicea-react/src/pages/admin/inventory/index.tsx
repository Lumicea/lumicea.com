import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Filter,
  Package,
  AlertTriangle,
  Plus,
  Minus,
  Edit,
  History,
  Download,
  Loader2
} from 'lucide-react';
import { fetchInventory, updateStockLevel } from '@/lib/admin-utils';
import { formatCurrency } from '@/lib/utils';

interface InventoryItem {
  variant_id: string;
  product_name: string;
  variant_name: string;
  sku: string;
  current_stock: number;
  threshold: number;
  cost_price: number;
  retail_price: number;
}

interface StockAdjustment {
  variant_id: string;
  adjustment_type: 'restock' | 'adjustment' | 'return';
  quantity_change: number;
  notes: string;
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [adjustmentDialog, setAdjustmentDialog] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<InventoryItem | null>(null);
  const [adjustment, setAdjustment] = useState<StockAdjustment>({
    variant_id: '',
    adjustment_type: 'adjustment',
    quantity_change: 0,
    notes: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const inventoryData = await fetchInventory();
      setInventory(inventoryData);
    } catch (error) {
      console.error('Error loading inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.variant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = stockFilter === 'all' ||
                          (stockFilter === 'low' && item.current_stock <= item.threshold) ||
                          (stockFilter === 'out' && item.current_stock === 0) ||
                          (stockFilter === 'in' && item.current_stock > item.threshold);
    
    return matchesSearch && matchesFilter;
  });

  const getStockStatus = (current: number, threshold: number) => {
    if (current === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (current <= threshold) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'In Stock', color: 'bg-green-100 text-green-800' };
  };

  const handleAdjustStock = (item: InventoryItem) => {
    setSelectedVariant(item);
    setAdjustment({
      variant_id: item.variant_id,
      adjustment_type: 'adjustment',
      quantity_change: 0,
      notes: '',
    });
    setAdjustmentDialog(true);
  };

  const submitStockAdjustment = async () => {
    if (!selectedVariant || adjustment.quantity_change === 0) return;

    try {
      setSaving(true);
      await updateStockLevel(
        adjustment.variant_id,
        adjustment.quantity_change,
        adjustment.adjustment_type,
        adjustment.notes
      );

      // Update local state
      setInventory(prev => prev.map(item =>
        item.variant_id === adjustment.variant_id
          ? { ...item, current_stock: item.current_stock + adjustment.quantity_change }
          : item
      ));

      setAdjustmentDialog(false);
      alert('Stock updated successfully!');
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Error updating stock. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const inventoryStats = {
    total: inventory.length,
    lowStock: inventory.filter(item => item.current_stock <= item.threshold && item.current_stock > 0).length,
    outOfStock: inventory.filter(item => item.current_stock === 0).length,
    totalValue: inventory.reduce((sum, item) => sum + (item.current_stock * item.cost_price), 0),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lumicea-navy"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">Track and manage product stock levels</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <History className="h-4 w-4 mr-2" />
            Stock History
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">{inventoryStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-gray-900">{inventoryStats.lowStock}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-gray-900">{inventoryStats.outOfStock}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(inventoryStats.totalValue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by stock" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="in">In Stock</SelectItem>
                <SelectItem value="low">Low Stock</SelectItem>
                <SelectItem value="out">Out of Stock</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredInventory.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Threshold</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Cost Price</TableHead>
                  <TableHead>Retail Price</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => {
                  const status = getStockStatus(item.current_stock, item.threshold);
                  return (
                    <TableRow key={item.variant_id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.product_name}</div>
                          <div className="text-sm text-gray-500">{item.variant_name}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">{item.sku}</TableCell>
                      <TableCell className="font-bold">{item.current_stock}</TableCell>
                      <TableCell>{item.threshold}</TableCell>
                      <TableCell>
                        <Badge className={status.color}>
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(item.cost_price)}</TableCell>
                      <TableCell>{formatCurrency(item.retail_price)}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAdjustStock(item)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Adjust
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No inventory items found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || stockFilter !== 'all' ? 'Try adjusting your search or filters' : 'Add products to manage inventory'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stock Adjustment Dialog */}
      <Dialog open={adjustmentDialog} onOpenChange={setAdjustmentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Stock Level</DialogTitle>
            <DialogDescription>
              Update the stock level for {selectedVariant?.product_name} - {selectedVariant?.variant_name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Current Stock</Label>
                <p className="text-2xl font-bold">{selectedVariant?.current_stock}</p>
              </div>
              <div>
                <Label>SKU</Label>
                <p className="font-mono">{selectedVariant?.sku}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Adjustment Type</Label>
              <Select
                value={adjustment.adjustment_type}
                onValueChange={(value: any) => setAdjustment(prev => ({ ...prev, adjustment_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="restock">Restock</SelectItem>
                  <SelectItem value="adjustment">Manual Adjustment</SelectItem>
                  <SelectItem value="return">Customer Return</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Quantity Change</Label>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setAdjustment(prev => ({ ...prev, quantity_change: prev.quantity_change - 1 }))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={adjustment.quantity_change}
                  onChange={(e) => setAdjustment(prev => ({ ...prev, quantity_change: parseInt(e.target.value) || 0 }))}
                  className="text-center"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setAdjustment(prev => ({ ...prev, quantity_change: prev.quantity_change + 1 }))}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                New stock level: {(selectedVariant?.current_stock || 0) + adjustment.quantity_change}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                value={adjustment.notes}
                onChange={(e) => setAdjustment(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Reason for adjustment..."
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setAdjustmentDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={submitStockAdjustment}
                className="lumicea-button-primary"
                disabled={saving || adjustment.quantity_change === 0}
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Stock'
                )}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}