// Remove 'use client'; as it's a Next.js specific directive

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
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
  Tag,
  Plus,
  Edit,
  Trash2,
  Percent,
  DollarSign,
  Truck,
  Gift,
  Calendar,
  Users,
  TrendingUp,
  Save,
  Loader2
} from 'lucide-react';
import { fetchPromotions } from '@/lib/admin-utils'; // Ensure this utility is compatible
import { supabase } from '@/lib/supabase'; // Ensure supabase client is correctly initialized for Vite
import { formatCurrency, formatDate } from '@/lib/utils'; // Ensure these utilities are compatible

interface Promotion {
  id: string;
  name: string;
  code: string;
  description: string;
  type: 'percentage' | 'fixed_amount' | 'free_shipping' | 'buy_x_get_y';
  value: number;
  minimum_order_amount: number;
  maximum_discount_amount: number;
  usage_limit: number;
  usage_limit_per_customer: number;
  current_usage_count: number;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
  created_at: string;
}

export default function AdminPromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [saving, setSaving] = useState(false);

  const [promotionForm, setPromotionForm] = useState({
    name: '',
    code: '',
    description: '',
    type: 'percentage' as const,
    value: 0,
    minimum_order_amount: 0,
    maximum_discount_amount: 0,
    usage_limit: 0,
    usage_limit_per_customer: 1,
    starts_at: '',
    ends_at: '',
    is_active: true,
  });

  useEffect(() => {
    loadPromotions();
  }, []);

  useEffect(() => {
    // Auto-generate code from name
    if (promotionForm.name && !editingPromotion) {
      const code = promotionForm.name
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, '')
        .substring(0, 10);
      setPromotionForm(prev => ({ ...prev, code }));
    }
  }, [promotionForm.name, editingPromotion]);

  const loadPromotions = async () => {
    try {
      setLoading(true);
      // Ensure fetchPromotions (from @/lib/admin-utils) is also Vite compatible
      const promotionsData = await fetchPromotions();
      setPromotions(promotionsData);
    } catch (error) {
      console.error('Error loading promotions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);

      if (editingPromotion) {
        const { error } = await supabase
          .from('promotions')
          .update(promotionForm)
          .eq('id', editingPromotion.id);

        if (error) throw error;
      } else {
        // Ensure supabase.auth.getUser() is handled correctly in Vite environment
        // It's generally better to pass the user ID from a context or prop if available,
        // rather than fetching it directly within a submit handler, for better separation of concerns.
        // For now, keeping as is, assuming supabase auth works.
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;

        const { error } = await supabase
          .from('promotions')
          .insert([{
            ...promotionForm,
            created_by: userData.user?.id // Ensure user ID is available
          }]);

        if (error) throw error;
      }

      await loadPromotions();
      setDialogOpen(false);
      resetForm();
      alert(editingPromotion ? 'Promotion updated!' : 'Promotion created!');
    } catch (error) {
      console.error('Error saving promotion:', error);
      alert('Error saving promotion. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setPromotionForm({
      name: '',
      code: '',
      description: '',
      type: 'percentage',
      value: 0,
      minimum_order_amount: 0,
      maximum_discount_amount: 0,
      usage_limit: 0,
      usage_limit_per_customer: 1,
      starts_at: '',
      ends_at: '',
      is_active: true,
    });
    setEditingPromotion(null);
  };

  const editPromotion = (promotion: Promotion) => {
    setPromotionForm({
      name: promotion.name,
      code: promotion.code || '',
      description: promotion.description || '',
      type: promotion.type,
      value: promotion.value,
      minimum_order_amount: promotion.minimum_order_amount || 0,
      maximum_discount_amount: promotion.maximum_discount_amount || 0,
      usage_limit: promotion.usage_limit || 0,
      usage_limit_per_customer: promotion.usage_limit_per_customer || 1,
      starts_at: promotion.starts_at ? new Date(promotion.starts_at).toISOString().slice(0, 16) : '',
      ends_at: promotion.ends_at ? new Date(promotion.ends_at).toISOString().slice(0, 16) : '',
      is_active: promotion.is_active,
    });
    setEditingPromotion(promotion);
    setDialogOpen(true);
  };

  const deletePromotion = async (id: string) => {
    if (!confirm('Are you sure you want to delete this promotion?')) return;

    try {
      const { error } = await supabase
        .from('promotions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadPromotions();
      alert('Promotion deleted!');
    } catch (error) {
      console.error('Error deleting promotion:', error);
      alert('Error deleting promotion.');
    }
  };

  const getPromotionIcon = (type: string) => {
    switch (type) {
      case 'percentage': return Percent;
      case 'fixed_amount': return DollarSign;
      case 'free_shipping': return Truck;
      case 'buy_x_get_y': return Gift;
      default: return Tag;
    }
  };

  const getPromotionStatus = (promotion: Promotion) => {
    const now = new Date();
    const startDate = new Date(promotion.starts_at);
    const endDate = promotion.ends_at ? new Date(promotion.ends_at) : null;

    if (!promotion.is_active) {
      return { label: 'Inactive', color: 'bg-gray-100 text-gray-800' };
    }

    if (now < startDate) {
      return { label: 'Scheduled', color: 'bg-blue-100 text-blue-800' };
    }

    if (endDate && now > endDate) {
      return { label: 'Expired', color: 'bg-red-100 text-red-800' };
    }

    if (promotion.usage_limit && promotion.current_usage_count >= promotion.usage_limit) {
      return { label: 'Used Up', color: 'bg-orange-100 text-orange-800' };
    }

    return { label: 'Active', color: 'bg-green-100 text-green-800' };
  };

  const formatValue = (promotion: Promotion) => {
    switch (promotion.type) {
      case 'percentage':
        return `${promotion.value}%`;
      case 'fixed_amount':
        return formatCurrency(promotion.value);
      case 'free_shipping':
        return 'Free Shipping';
      case 'buy_x_get_y':
        return `Buy ${promotion.value} Get 1`;
      default:
        return promotion.value.toString();
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
          <h1 className="text-3xl font-bold text-gray-900">Promotions</h1>
          <p className="text-gray-600">Create and manage discount codes and promotions</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Tag className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Promotions</p>
                <p className="text-2xl font-bold text-gray-900">{promotions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Promotions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {promotions.filter(p => getPromotionStatus(p).label === 'Active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Usage</p>
                <p className="text-2xl font-bold text-gray-900">
                  {promotions.reduce((sum, p) => sum + p.current_usage_count, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold text-gray-900">
                  {promotions.filter(p => getPromotionStatus(p).label === 'Scheduled').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Promotions Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Promotion Codes</CardTitle>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Create Promotion
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingPromotion ? 'Edit Promotion' : 'Create New Promotion'}
                </DialogTitle>
                <DialogDescription>
                  Set up discount codes and promotional offers
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Promotion Name *</Label>
                    <Input
                      value={promotionForm.name}
                      onChange={(e) => setPromotionForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Summer Sale 2024"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Promotion Code *</Label>
                    <Input
                      value={promotionForm.code}
                      onChange={(e) => setPromotionForm(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                      placeholder="SUMMER20"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={promotionForm.description}
                    onChange={(e) => setPromotionForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Description of the promotion"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Discount Type *</Label>
                    <Select
                      value={promotionForm.type}
                      onValueChange={(value: any) => setPromotionForm(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage Off</SelectItem>
                        <SelectItem value="fixed_amount">Fixed Amount Off</SelectItem>
                        <SelectItem value="free_shipping">Free Shipping</SelectItem>
                        <SelectItem value="buy_x_get_y">Buy X Get Y</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>
                      {promotionForm.type === 'percentage' ? 'Percentage (%)' :
                       promotionForm.type === 'fixed_amount' ? 'Amount (£)' :
                       promotionForm.type === 'buy_x_get_y' ? 'Buy Quantity' : 'Value'}
                    </Label>
                    <Input
                      type="number"
                      step={promotionForm.type === 'fixed_amount' ? '0.01' : '1'}
                      value={promotionForm.value}
                      onChange={(e) => setPromotionForm(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Minimum Order Amount (£)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={promotionForm.minimum_order_amount}
                      onChange={(e) => setPromotionForm(prev => ({ ...prev, minimum_order_amount: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Maximum Discount (£)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={promotionForm.maximum_discount_amount}
                      onChange={(e) => setPromotionForm(prev => ({ ...prev, maximum_discount_amount: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Usage Limit (0 = unlimited)</Label>
                    <Input
                      type="number"
                      value={promotionForm.usage_limit}
                      onChange={(e) => setPromotionForm(prev => ({ ...prev, usage_limit: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Uses per Customer</Label>
                    <Input
                      type="number"
                      value={promotionForm.usage_limit_per_customer}
                      onChange={(e) => setPromotionForm(prev => ({ ...prev, usage_limit_per_customer: parseInt(e.target.value) || 1 }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date & Time *</Label>
                    <Input
                      type="datetime-local"
                      value={promotionForm.starts_at}
                      onChange={(e) => setPromotionForm(prev => ({ ...prev, starts_at: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date & Time</Label>
                    <Input
                      type="datetime-local"
                      value={promotionForm.ends_at}
                      onChange={(e) => setPromotionForm(prev => ({ ...prev, ends_at: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={promotionForm.is_active}
                    onCheckedChange={(checked) => setPromotionForm(prev => ({ ...prev, is_active: checked }))}
                  />
                  <Label>Active</Label>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
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
                        {editingPromotion ? 'Update' : 'Create'} Promotion
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {promotions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Promotion</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {promotions.map((promotion) => {
                  const Icon = getPromotionIcon(promotion.type);
                  const status = getPromotionStatus(promotion);

                  return (
                    <TableRow key={promotion.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{promotion.name}</div>
                          <div className="text-sm text-gray-500">{promotion.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {promotion.code}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Icon className="h-4 w-4 text-gray-500" />
                          <span className="capitalize">{promotion.type.replace('_', ' ')}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatValue(promotion)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{promotion.current_usage_count}</div>
                          {promotion.usage_limit > 0 && (
                            <div className="text-gray-500">/ {promotion.usage_limit}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div>{formatDate(promotion.starts_at, 'PP')}</div>
                        {promotion.ends_at && (
                          <div className="text-gray-500">
                            to {formatDate(promotion.ends_at, 'PP')}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={status.color}>
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button size="sm" variant="outline" onClick={() => editPromotion(promotion)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => deletePromotion(promotion.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <Tag className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No promotions found</h3>
              <p className="text-gray-500 mb-4">
                Get started by creating your first promotion
              </p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Promotion
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
