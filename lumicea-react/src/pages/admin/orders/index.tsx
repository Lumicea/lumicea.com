import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Package,
  Truck,
  DollarSign,
  ShoppingCart,
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { fetchOrders } from '@/lib/admin-utils';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Order {
  id: string;
  order_number: string;
  customer_email: string;
  status: string;
  payment_status: string;
  total_amount: number;
  created_at: string;
  shipping_address: {
    first_name: string;
    last_name: string;
    city: string;
    country: string;
  };
  order_items: {
    quantity: number;
    product_name: string;
  }[];
}

export function AdminOrdersPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialStatusFilter = searchParams.get('status') || 'all';
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialStatusFilter);
  const [orderDetailDialog, setOrderDetailDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusUpdateDialog, setStatusUpdateDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await fetchOrders();
      setOrders(ordersData);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      processing: { label: 'Processing', color: 'bg-blue-100 text-blue-800', icon: Package },
      shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-800', icon: Truck },
      delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: AlertCircle },
      refunded: { label: 'Refunded', color: 'bg-gray-100 text-gray-800', icon: DollarSign },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
      paid: { label: 'Paid', color: 'bg-green-100 text-green-800' },
      failed: { label: 'Failed', color: 'bg-red-100 text-red-800' },
      refunded: { label: 'Refunded', color: 'bg-gray-100 text-gray-800' },
      partially_refunded: { label: 'Partial Refund', color: 'bg-orange-100 text-orange-800' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setOrderDetailDialog(true);
  };

  const openStatusUpdateDialog = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setStatusUpdateDialog(true);
  };

  const updateOrderStatus = async () => {
    if (!selectedOrder || newStatus === selectedOrder.status) return;
    
    try {
      setUpdating(true);
      
      // Call the RPC function to update order status
      const { error } = await supabase.rpc('update_order_status', {
        p_order_id: selectedOrder.id,
        p_new_status: newStatus,
        p_notes: `Status updated from ${selectedOrder.status} to ${newStatus} by admin`
      });
      
      if (error) throw error;
      
      // Update local state
      setOrders(prev => prev.map(order => 
        order.id === selectedOrder.id ? { ...order, status: newStatus } : order
      ));
      
      setStatusUpdateDialog(false);
      alert('Order status updated successfully!');
      
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer_email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    totalRevenue: orders.reduce((sum, o) => sum + o.total_amount, 0),
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
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600">Manage customer orders and fulfillment</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <ShoppingCart className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{orderStats.total}</p>
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
                <p className="text-2xl font-bold text-gray-900">{orderStats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Processing</p>
                <p className="text-2xl font-bold text-gray-900">{orderStats.processing}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Truck className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Shipped</p>
                <p className="text-2xl font-bold text-gray-900">{orderStats.shipped}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(orderStats.totalRevenue)}</p>
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
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-[180px] rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Order List</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Order</th>
                    <th className="text-left py-3 px-4 font-semibold">Customer</th>
                    <th className="text-left py-3 px-4 font-semibold">Items</th>
                    <th className="text-left py-3 px-4 font-semibold">Total</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Payment</th>
                    <th className="text-left py-3 px-4 font-semibold">Date</th>
                    <th className="text-left py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">{order.order_number}</div>
                          <div className="text-sm text-gray-500">
                            {order.shipping_address?.city}, {order.shipping_address?.country}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">
                            {order.shipping_address?.first_name} {order.shipping_address?.last_name}
                          </div>
                          <div className="text-sm text-gray-500">{order.customer_email}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">
                          {order.order_items?.reduce((sum, item) => sum + item.quantity, 0) || 0} items
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium">
                        {formatCurrency(order.total_amount)}
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="py-3 px-4">
                        {getPaymentStatusBadge(order.payment_status)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {formatDate(new Date(order.created_at), 'PPP')}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-1">
                          <Button size="sm" variant="outline" onClick={() => viewOrderDetails(order)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => openStatusUpdateDialog(order)}>
                            <Package className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No orders found</h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all' ? 'Try adjusting your search or filters' : 'No orders have been placed yet'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      {orderDetailDialog && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Order Details</h2>
              <Button variant="ghost" size="sm" onClick={() => setOrderDetailDialog(false)}>
                &times;
              </Button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="font-semibold text-sm text-gray-500 mb-1">Customer</h3>
                  <p className="font-medium">
                    {selectedOrder.shipping_address?.first_name} {selectedOrder.shipping_address?.last_name}
                  </p>
                  <p className="text-sm">{selectedOrder.customer_email}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-500 mb-1">Status</h3>
                  <div className="flex space-x-2">
                    {getStatusBadge(selectedOrder.status)}
                    {getPaymentStatusBadge(selectedOrder.payment_status)}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-500 mb-1">Date</h3>
                  <p>{formatDate(new Date(selectedOrder.created_at), 'PPP')}</p>
                </div>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedOrder.order_items?.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{item.product_name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{item.quantity}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                          {/* We don't have individual prices in this mock, so showing total */}
                          {formatCurrency(selectedOrder.total_amount / (selectedOrder.order_items?.length || 1))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>Total</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-900 uppercase tracking-wider">
                        {formatCurrency(selectedOrder.total_amount)}
                      </th>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-sm text-gray-500 mb-2">Shipping Address</h3>
                  <div className="bg-gray-50 p-3 rounded text-sm">
                    <p>{selectedOrder.shipping_address?.first_name} {selectedOrder.shipping_address?.last_name}</p>
                    <p>{selectedOrder.shipping_address?.city}, {selectedOrder.shipping_address?.country}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-500 mb-2">Actions</h3>
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={() => {
                      setOrderDetailDialog(false);
                      openStatusUpdateDialog(selectedOrder);
                    }}>
                      Update Status
                    </Button>
                    <Button size="sm" variant="outline">
                      Send Email
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Dialog */}
      {statusUpdateDialog && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Update Order Status</h2>
              <Button variant="ghost" size="sm" onClick={() => setStatusUpdateDialog(false)}>
                &times;
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Current Status</label>
                <div>
                  {getStatusBadge(selectedOrder.status)}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">New Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
              
              {newStatus === 'shipped' && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Tracking Number (Optional)</label>
                  <Input placeholder="Enter tracking number" />
                </div>
              )}
              
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={() => setStatusUpdateDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={updateOrderStatus} 
                  className="lumicea-button-primary"
                  disabled={updating || (selectedOrder && newStatus === selectedOrder.status)}
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
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}