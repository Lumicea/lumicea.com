// admin/shipping/index.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  DialogTrigger,
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
  Truck,
  Plus,
  Edit,
  Trash2,
  MapPin,
  Clock,
  DollarSign,
  Settings,
  Save,
  Loader2
} from 'lucide-react';
import { fetchShippingMethods, fetchTaxRates } from '@/lib/admin-utils';
import { supabase } from '@/lib/supabase';
import { formatCurrency } from '@/lib/utils';

interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  carrier: string;
  service_code: string;
  base_cost: number;
  cost_per_kg: number;
  free_shipping_threshold: number;
  estimated_delivery_days_min: number;
  estimated_delivery_days_max: number;
  max_weight: number;
  requires_signature: boolean;
  is_tracked: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

interface TaxRate {
  id: string;
  country: string;
  state_province: string;
  tax_class: string;
  rate: number;
  name: string;
  is_active: boolean;
  created_at: string;
}

export default function AdminShippingPage() {
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [taxRates, setTaxRates] = useState<TaxRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [methodDialogOpen, setMethodDialogOpen] = useState(false);
  const [taxDialogOpen, setTaxDialogOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<ShippingMethod | null>(null);
  const [editingTax, setEditingTax] = useState<TaxRate | null>(null);
  const [saving, setSaving] = useState(false);

  const [methodForm, setMethodForm] = useState({
    name: '',
    description: '',
    carrier: 'royal_mail',
    service_code: '',
    base_cost: 0,
    cost_per_kg: 0,
    free_shipping_threshold: 0,
    estimated_delivery_days_min: 1,
    estimated_delivery_days_max: 3,
    max_weight: 2,
    requires_signature: false,
    is_tracked: true,
    is_active: true,
    sort_order: 0,
  });

  const [taxForm, setTaxForm] = useState({
    country: 'GB',
    state_province: '',
    tax_class: 'standard',
    rate: 0.2,
    name: '',
    is_active: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const shippingData = await fetchShippingMethods();
      const taxData = await fetchTaxRates();
      
      setShippingMethods(shippingData);
      setTaxRates(taxData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMethodSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      if (editingMethod) {
        const { error } = await supabase
          .from('shipping_methods')
          .update(methodForm)
          .eq('id', editingMethod.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('shipping_methods')
          .insert([methodForm]);

        if (error) throw error;
      }

      await loadData();
      setMethodDialogOpen(false);
      resetMethodForm();
      alert(editingMethod ? 'Shipping method updated!' : 'Shipping method created!');
    } catch (error) {
      console.error('Error saving shipping method:', error);
      alert('Error saving shipping method. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleTaxSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      if (editingTax) {
        const { error } = await supabase
          .from('tax_rates')
          .update(taxForm)
          .eq('id', editingTax.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('tax_rates')
          .insert([taxForm]);

        if (error) throw error;
      }

      await loadData();
      setTaxDialogOpen(false);
      resetTaxForm();
      alert(editingTax ? 'Tax rate updated!' : 'Tax rate created!');
    } catch (error) {
      console.error('Error saving tax rate:', error);
      alert('Error saving tax rate. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const resetMethodForm = () => {
    setMethodForm({
      name: '',
      description: '',
      carrier: 'royal_mail',
      service_code: '',
      base_cost: 0,
      cost_per_kg: 0,
      free_shipping_threshold: 0,
      estimated_delivery_days_min: 1,
      estimated_delivery_days_max: 3,
      max_weight: 2,
      requires_signature: false,
      is_tracked: true,
      is_active: true,
      sort_order: 0,
    });
    setEditingMethod(null);
  };

  const resetTaxForm = () => {
    setTaxForm({
      country: 'GB',
      state_province: '',
      tax_class: 'standard',
      rate: 0.2,
      name: '',
      is_active: true,
    });
    setEditingTax(null);
  };

  const editMethod = (method: ShippingMethod) => {
    setMethodForm({
      name: method.name,
      description: method.description || '',
      carrier: method.carrier,
      service_code: method.service_code || '',
      base_cost: method.base_cost,
      cost_per_kg: method.cost_per_kg || 0,
      free_shipping_threshold: method.free_shipping_threshold || 0,
      estimated_delivery_days_min: method.estimated_delivery_days_min || 1,
      estimated_delivery_days_max: method.estimated_delivery_days_max || 3,
      max_weight: method.max_weight || 2,
      requires_signature: method.requires_signature,
      is_tracked: method.is_tracked,
      is_active: method.is_active,
      sort_order: method.sort_order,
    });
    setEditingMethod(method);
    setMethodDialogOpen(true);
  };

  const editTax = (tax: TaxRate) => {
    setTaxForm({
      country: tax.country,
      state_province: tax.state_province || '',
      tax_class: tax.tax_class,
      rate: tax.rate,
      name: tax.name,
      is_active: tax.is_active,
    });
    setEditingTax(tax);
    setTaxDialogOpen(true);
  };

  const deleteMethod = async (id: string) => {
    if (!confirm('Are you sure you want to delete this shipping method?')) return;

    try {
      const { error } = await supabase
        .from('shipping_methods')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadData();
      alert('Shipping method deleted!');
    } catch (error) {
      console.error('Error deleting shipping method:', error);
      alert('Error deleting shipping method.');
    }
  };

  const deleteTax = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tax rate?')) return;

    try {
      const { error } = await supabase
        .from('tax_rates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadData();
      alert('Tax rate deleted!');
    } catch (error) {
      console.error('Error deleting tax rate:', error);
      alert('Error deleting tax rate.');
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Shipping & Tax</h1>
          <p className="text-gray-600">Manage shipping methods and tax rates</p>
        </div>
      </div>

      <Tabs defaultValue="shipping" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="shipping">Shipping Methods</TabsTrigger>
          <TabsTrigger value="tax">Tax Rates</TabsTrigger>
        </TabsList>

        <TabsContent value="shipping" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Truck className="h-5 w-5" />
                <span>Shipping Methods</span>
              </CardTitle>
              <Dialog open={methodDialogOpen} onOpenChange={setMethodDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetMethodForm}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Method
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingMethod ? 'Edit Shipping Method' : 'Add Shipping Method'}
                    </DialogTitle>
                  </DialogHeader>
                  
                  <form onSubmit={handleMethodSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Method Name *</Label>
                        <Input
                          value={methodForm.name}
                          onChange={(e) => setMethodForm(prev => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Carrier</Label>
                        <Select
                          value={methodForm.carrier}
                          onValueChange={(value) => setMethodForm(prev => ({ ...prev, carrier: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="royal_mail">Royal Mail</SelectItem>
                            <SelectItem value="dpd">DPD</SelectItem>
                            <SelectItem value="ups">UPS</SelectItem>
                            <SelectItem value="fedex">FedEx</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={methodForm.description}
                        onChange={(e) => setMethodForm(prev => ({ ...prev, description: e.target.value }))}
                        rows={2}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Base Cost (£)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={methodForm.base_cost}
                          onChange={(e) => setMethodForm(prev => ({ ...prev, base_cost: parseFloat(e.target.value) || 0 }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Cost per KG (£)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={methodForm.cost_per_kg}
                          onChange={(e) => setMethodForm(prev => ({ ...prev, cost_per_kg: parseFloat(e.target.value) || 0 }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Free Shipping Threshold (£)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={methodForm.free_shipping_threshold}
                          onChange={(e) => setMethodForm(prev => ({ ...prev, free_shipping_threshold: parseFloat(e.target.value) || 0 }))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Min Delivery Days</Label>
                        <Input
                          type="number"
                          value={methodForm.estimated_delivery_days_min}
                          onChange={(e) => setMethodForm(prev => ({ ...prev, estimated_delivery_days_min: parseInt(e.target.value) || 1 }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Max Delivery Days</Label>
                        <Input
                          type="number"
                          value={methodForm.estimated_delivery_days_max}
                          onChange={(e) => setMethodForm(prev => ({ ...prev, estimated_delivery_days_max: parseInt(e.target.value) || 3 }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Max Weight (kg)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={methodForm.max_weight}
                          onChange={(e) => setMethodForm(prev => ({ ...prev, max_weight: parseFloat(e.target.value) || 2 }))}
                        />
                      </div>
                    </div>

                    <div className="flex space-x-6">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={methodForm.is_tracked}
                          onCheckedChange={(checked) => setMethodForm(prev => ({ ...prev, is_tracked: checked }))}
                        />
                        <Label>Tracked</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={methodForm.requires_signature}
                          onCheckedChange={(checked) => setMethodForm(prev => ({ ...prev, requires_signature: checked }))}
                        />
                        <Label>Requires Signature</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={methodForm.is_active}
                          onCheckedChange={(checked) => setMethodForm(prev => ({ ...prev, is_active: checked }))}
                        />
                        <Label>Active</Label>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setMethodDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="lumicea-button-primary"
                        disabled={saving}
                      >
                        {saving ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            {editingMethod ? 'Update' : 'Create'} Method
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {shippingMethods.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Method</TableHead>
                      <TableHead>Carrier</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>Delivery Time</TableHead>
                      <TableHead>Features</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shippingMethods.map((method) => (
                      <TableRow key={method.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{method.name}</div>
                            <div className="text-sm text-gray-500">{method.description}</div>
                          </div>
                        </TableCell>
                        <TableCell className="capitalize">{method.carrier?.replace('_', ' ') || ''}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>Base: {formatCurrency(method.base_cost)}</div>
                            {method.cost_per_kg > 0 && (
                              <div className="text-gray-500">+{formatCurrency(method.cost_per_kg)}/kg</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {method.estimated_delivery_days_min === method.estimated_delivery_days_max
                            ? `${method.estimated_delivery_days_min} day${method.estimated_delivery_days_min > 1 ? 's' : ''}`
                            : `${method.estimated_delivery_days_min}-${method.estimated_delivery_days_max} days`
                          }
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {method.is_tracked && <Badge variant="outline" className="text-xs">Tracked</Badge>}
                            {method.requires_signature && <Badge variant="outline" className="text-xs">Signature</Badge>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={method.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {method.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button size="sm" variant="outline" onClick={() => editMethod(method)}>
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => deleteMethod(method.id)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <Truck className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No shipping methods found</h3>
                  <p className="text-gray-500 mb-4">
                    Get started by adding your first shipping method
                  </p>
                  <Button onClick={() => setMethodDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Shipping Method
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tax" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Tax Rates</span>
              </CardTitle>
              <Dialog open={taxDialogOpen} onOpenChange={setTaxDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetTaxForm}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Tax Rate
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingTax ? 'Edit Tax Rate' : 'Add Tax Rate'}
                    </DialogTitle>
                  </DialogHeader>
                  
                  <form onSubmit={handleTaxSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Country *</Label>
                        <Select
                          value={taxForm.country}
                          onValueChange={(value) => setTaxForm(prev => ({ ...prev, country: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="GB">United Kingdom</SelectItem>
                            <SelectItem value="US">United States</SelectItem>
                            <SelectItem value="CA">Canada</SelectItem>
                            <SelectItem value="AU">Australia</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>State/Province</Label>
                        <Input
                          value={taxForm.state_province}
                          onChange={(e) => setTaxForm(prev => ({ ...prev, state_province: e.target.value }))}
                          placeholder="Optional"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Tax Class</Label>
                        <Select
                          value={taxForm.tax_class}
                          onValueChange={(value) => setTaxForm(prev => ({ ...prev, tax_class: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="standard">Standard</SelectItem>
                            <SelectItem value="reduced">Reduced</SelectItem>
                            <SelectItem value="zero">Zero Rate</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Rate (decimal) *</Label>
                        <Input
                          type="number"
                          step="0.0001"
                          value={taxForm.rate}
                          onChange={(e) => setTaxForm(prev => ({ ...prev, rate: parseFloat(e.target.value) || 0 }))}
                          placeholder="0.2000 for 20%"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Display Name *</Label>
                      <Input
                        value={taxForm.name}
                        onChange={(e) => setTaxForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., UK VAT"
                        required
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={taxForm.is_active}
                        onCheckedChange={(checked) => setTaxForm(prev => ({ ...prev, is_active: checked }))}
                      />
                      <Label>Active</Label>
                    </div>

                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setTaxDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="lumicea-button-primary"
                        disabled={saving}
                      >
                        {saving ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            {editingTax ? 'Update' : 'Create'} Tax Rate
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {taxRates.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>State/Province</TableHead>
                      <TableHead>Tax Class</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {taxRates.map((tax) => (
                      <TableRow key={tax.id}>
                        <TableCell className="font-medium">{tax.name}</TableCell>
                        <TableCell>{tax.country}</TableCell>
                        <TableCell>{tax.state_province || '-'}</TableCell>
                        <TableCell className="capitalize">{tax.tax_class}</TableCell>
                        <TableCell>{(tax.rate * 100).toFixed(2)}%</TableCell>
                        <TableCell>
                          <Badge className={tax.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {tax.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button size="sm" variant="outline" onClick={() => editTax(tax)}>
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => deleteTax(tax.id)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No tax rates found</h3>
                  <p className="text-gray-500 mb-4">
                    Get started by adding your first tax rate
                  </p>
                  <Button onClick={() => setTaxDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Tax Rate
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
