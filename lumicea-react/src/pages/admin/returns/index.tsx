'use client'; // This can generally be removed for pure Vite/React, but keep if your setup processes it.

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
  MoreHorizontal,
  Eye,
  RotateCcw,
  DollarSign,
  ShoppingCart,
  Package,
  CheckCircle,
  XCircle,
  Clock,
  Loader2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/lib/supabase'; // Ensure supabase client is correctly initialized for Vite
import { formatCurrency, formatDate } from '@/lib/utils';

interface Return {
  id: string;
  return_number: string;
  order_id: string;
  order: {
    order_number: string;
    customer_email: string;
  };
  reason: string;
  status: string;
  return_items: {
    order_item_id: string;
    product_name: string;
    quantity: number;
    reason: string;
  }[];
  refund_amount: number;
  return_shipping_label_url: string | null;
  notes: string | null;
  created_at: string;
}

export default function AdminReturnsPage() {
  const [returns, setReturns] = useState<Return[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [returnDetailDialog, setReturnDetailDialog] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState<Return | null>(null);
  const [statusUpdateDialog, setStatusUpdateDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadReturns();
  }, []);

  const loadReturns = async () => {
    try {
      setLoading(true);

      // In a real application, this would fetch from the returns table
      // For now, we'll use mock data
      const mockReturns: Return[] = [
        {
          id: '1',
          return_number: 'RET-000001',
          order_id: 'order1',
          order: {
            order_number: 'LUM-000123',
            customer_email: 'sarah@example.com',
          },
          reason: 'Wrong size',
          status: 'requested',
          return_items: [
            {
              order_item_id: 'item1',
              product_name: 'Amethyst Luna Nose Ring',
              quantity: 1,
              reason: 'Too small',
            }
          ],
          refund_amount: 45.00,
          return_shipping_label_url: null,
          notes: 'Customer would like to exchange for a larger size',
          created_at: '2024-06-15T10:30:00Z',
        },
        {
          id: '2',
          return_number: 'RET-000002',
          order_id: 'order2',
          order: {
            order_number: 'LUM-000145',
            customer_email: 'emma@example.com',
          },
          reason: 'Damaged product',
          status: 'approved',
          return_items: [
            {
              order_item_id: 'item2',
              product_name: 'Rose Gold Celestial Hoops',
              quantity: 1,
              reason: 'Arrived broken',
            }
          ],
          refund_amount: 65.00,
          return_shipping_label_url: 'https://example.com/label.pdf',
          notes: 'Photos of damage received. Approved for full refund.',
          created_at: '2024-06-12T14:45:00Z',
        },
        {
          id: '3',
          return_number: 'RET-000003',
          order_id: 'order3',
          order: {
            order_number: 'LUM-000156',
            customer_email: 'james@example.com',
          },
          reason: 'Changed mind',
          status: 'received',
          return_items: [
            {
              order_item_id: 'item3',
              product_name: 'Opal Dreams Threader Earrings',
              quantity: 1,
              reason: 'No longer needed',
            }
          ],
          refund_amount: 55.00,
          return_shipping_label_url: 'https://example.com/label.pdf',
          notes: 'Item received in good condition',
          created_at: '2024-06-10T09:15:00Z',
        },
        {
          id: '4',
          return_number: 'RET-000004',
          order_id: 'order4',
          order: {
            order_number: 'LUM-000178',
            customer_email: 'rachel@example.com',
          },
          reason: 'Not as described',
          status: 'processed',
          return_items: [
            {
              order_item_id: 'item4',
              product_name: 'Sapphire Stud Nose Ring',
              quantity: 1,
              reason: 'Color different than shown',
            }
          ],
          refund_amount: 52.00,
          return_shipping_label_url: 'https://example.com/label.pdf',
          notes: 'Refund processed on June 8, 2024',
          created_at: '2024-06-05T16:20:00Z',
        },
        {
          id: '5',
          return_number: 'RET-000005',
          order_id: 'order5',
          order: {
            order_number: 'LUM-000189',
            customer_email: 'david@example.com',
          },
          reason: 'Ordered by mistake',
          status: 'rejected',
          return_items: [
            {
              order_item_id: 'item5',
              product_name: 'Moonstone Crescent Studs',
              quantity: 1,
              reason: 'Ordered wrong item',
            }
          ],
          refund_amount: 0,
          return_shipping_label_url: null,
          notes: 'Return requested after 45-day return window',
          created_at: '2024-06-01T11:10:00Z',
        },
      ];

      setReturns(mockReturns);
    } catch (error) {
      console.error('Error loading returns:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'requested': { label: 'Requested', color: 'bg-blue-100 text-blue-800', icon: Clock },
      'approved': { label: 'Approved', color: 'bg-yellow-100 text-yellow-800', icon: CheckCircle },
      'received': { label: 'Received', color: 'bg-purple-100 text-purple-800', icon: Package },
      'processed': { label: 'Processed', color: 'bg-green-100 text-green-800', icon: DollarSign },
      'rejected': { label: 'Rejected', color: 'bg-red-100 text-red-800', icon: XCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.requested;
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const viewReturnDetails = (returnItem: Return) => {
    setSelectedReturn(returnItem);
    setReturnDetailDialog(true);
  };

  const openStatusUpdateDialog = (returnItem: Return) => {
    setSelectedReturn(returnItem);
    setNewStatus(returnItem.status);
    setStatusUpdateDialog(true);
  };

  const updateReturnStatus = async () => {
    if (!selectedReturn || newStatus === selectedReturn.status) return;

    try {
      setUpdating(true);

      // In a real application, this would update the return status in the database
      // For now, we'll just update the local state
      await new Promise(resolve => setTimeout(resolve, 1000));

      setReturns(prev => prev.map(r =>
        r.id === selectedReturn.id ? { ...r, status: newStatus } : r
      ));

      setStatusUpdateDialog(false);
      alert('Return status updated successfully!');

    } catch (error) {
      console.error('Error updating return status:', error);
      alert('Error updating return status. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const filteredReturns = returns.filter(r => {
    const matchesSearch = r.return_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.order.customer_email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const returnStats = {
    total: returns.length,
    requested: returns.filter(r => r.status === 'requested').length,
    approved: returns.filter(r => r.status === 'approved').length,
    received: returns.filter(r => r.status === 'received').length,
    processed: returns.filter(r => r.status === 'processed').length,
    totalRefunded: returns.filter(r => r.status === 'processed').reduce((sum, r) => sum + r.refund_amount, 0),
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
          <h1 className="text-3xl font-bold text-gray-900">Returns</h1>
          <p className="text-gray-600">Manage customer returns and refunds</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <RotateCcw className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Returns</p>
                <p className="text-2xl font-bold text-gray-900">{returnStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{returnStats.requested}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Transit</p>
                <p className="text-2xl font-bold text-gray-900">{returnStats.approved}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Processed</p>
                <p className="text-2xl font-bold text-gray-900">{returnStats.processed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Refunded</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(returnStats.totalRefunded)}</p>
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
                placeholder="Search returns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Returns</SelectItem>
                <SelectItem value="requested">Requested</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="received">Received</SelectItem>
                <SelectItem value="processed">Processed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Returns Table */}
      <Card>
        <CardHeader>
          <CardTitle>Return Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredReturns.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Return #</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReturns.map((returnItem) => (
                  <TableRow key={returnItem.id}>
                    <TableCell className="font-medium">
                      {returnItem.return_number}
                    </TableCell>
                    <TableCell>
                      {returnItem.order.order_number}
                    </TableCell>
                    <TableCell>
                      {returnItem.order.customer_email}
                    </TableCell>
                    <TableCell>
                      {returnItem.return_items.reduce((sum, item) => sum + item.quantity, 0)} items
                    </TableCell>
                    <TableCell className="max-w-xs truncate" title={returnItem.reason}>
                      {returnItem.reason}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(returnItem.status)}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {formatDate(returnItem.created_at, 'PP')}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => viewReturnDetails(returnItem)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openStatusUpdateDialog(returnItem)}>
                            <Clock className="mr-2 h-4 w-4" />
                            Update Status
                          </DropdownMenuItem>
                          {returnItem.status === 'received' && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <DollarSign className="mr-2 h-4 w-4" />
                                Process Refund
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <RotateCcw className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No returns found</h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all' ? 'Try adjusting your search or filters' : 'No return requests have been submitted yet'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Return Detail Dialog */}
      <Dialog open={returnDetailDialog} onOpenChange={setReturnDetailDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Return Details</DialogTitle>
            <DialogDescription>
              Return #{selectedReturn?.return_number}
            </DialogDescription>
          </DialogHeader>

          {selectedReturn && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="font-semibold text-sm text-gray-500 mb-1">Order Information</h3>
                  <p className="font-medium">
                    {selectedReturn.order.order_number}
                  </p>
                  <p className="text-sm">{selectedReturn.order.customer_email}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-500 mb-1">Status</h3>
                  <div>
                    {getStatusBadge(selectedReturn.status)}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-500 mb-1">Date Requested</h3>
                  <p>{formatDate(selectedReturn.created_at, 'PPP')}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-sm text-gray-500 mb-2">Return Reason</h3>
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <p>{selectedReturn.reason}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-sm text-gray-500 mb-2">Return Items</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedReturn.return_items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{item.product_name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{item.quantity}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{item.reason}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-sm text-gray-500 mb-2">Refund Amount</h3>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-lg font-bold">{formatCurrency(selectedReturn.refund_amount)}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-500 mb-2">Return Shipping</h3>
                  <div className="bg-gray-50 p-3 rounded">
                    {selectedReturn.return_shipping_label_url ? (
                      <Button variant="outline" size="sm" asChild>
                        <a href={selectedReturn.return_shipping_label_url} target="_blank" rel="noopener noreferrer">
                          Download Shipping Label
                        </a>
                      </Button>
                    ) : (
                      <p className="text-sm text-gray-500">No shipping label generated</p>
                    )}
                  </div>
                </div>
              </div>

              {selectedReturn.notes && (
                <div>
                  <h3 className="font-semibold text-sm text-gray-500 mb-2">Notes</h3>
                  <div className="bg-gray-50 p-3 rounded text-sm">
                    <p>{selectedReturn.notes}</p>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setReturnDetailDialog(false)}>
                  Close
                </Button>
                <Button onClick={() => {
                  setReturnDetailDialog(false);
                  openStatusUpdateDialog(selectedReturn);
                }}>
                  Update Status
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={statusUpdateDialog} onOpenChange={setStatusUpdateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Return Status</DialogTitle>
            <DialogDescription>
              Change the status for return #{selectedReturn?.return_number}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Current Status</Label>
              <div>
                {selectedReturn && getStatusBadge(selectedReturn.status)}
              </div>
            </div>

            <div className="space-y-2">
              <Label>New Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="requested">Requested</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="received">Received</SelectItem>
                  <SelectItem value="processed">Processed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea placeholder="Add notes about this status change" rows={3} />
            </div>

            {newStatus === 'approved' && (
              <div className="space-y-2">
                <Label>Return Shipping Label</Label>
                <Input type="file" />
                <p className="text-xs text-gray-500">
                  Upload a return shipping label or generate one automatically
                </p>
                <Button size="sm" variant="outline" className="mt-2">
                  Generate Label
                </Button>
              </div>
            )}

            {newStatus === 'processed' && (
              <div className="space-y-2">
                <Label>Refund Amount</Label>
                <Input
                  type="number"
                  step="0.01"
                  defaultValue={selectedReturn?.refund_amount.toString()}
                />
                <div className="flex items-center space-x-2 mt-2">
                  <input type="checkbox" id="send-email" />
                  <Label htmlFor="send-email">Send confirmation email to customer</Label>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setStatusUpdateDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={updateReturnStatus}
                className="lumicea-button-primary"
                disabled={updating || (selectedReturn && newStatus === selectedReturn.status)}
              >
                {updating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Status'
                )}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
