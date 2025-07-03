import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter,  
  Eye, 
  Mail,
  Users,
  UserPlus,
  Star,
  Download,
} from 'lucide-react';
import { fetchCustomers } from '@/lib/admin-utils';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Customer {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  created_at: string;
  orders: {
    id: string;
    total_amount: number;
    created_at: string;
  }[];
}

export function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [segmentFilter, setSegmentFilter] = useState('all');
  const [customerDetailDialog, setCustomerDetailDialog] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const customersData = await fetchCustomers();
      setCustomers(customersData);
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCustomerStats = (customer: Customer) => {
    const orders = customer.orders || [];
    const totalSpent = orders.reduce((sum, order) => sum + order.total_amount, 0);
    const orderCount = orders.length;
    const avgOrderValue = orderCount > 0 ? totalSpent / orderCount : 0;
    const lastOrderDate = orders.length > 0 ? new Date(Math.max(...orders.map(o => new Date(o.created_at).getTime()))) : null;
    
    return {
      totalSpent,
      orderCount,
      avgOrderValue,
      lastOrderDate
    };
  };

  const getCustomerSegment = (customer: Customer) => {
    const stats = getCustomerStats(customer);
    
    if (stats.totalSpent >= 500) return { label: 'VIP', color: 'bg-purple-100 text-purple-800' };
    if (stats.totalSpent >= 200) return { label: 'Loyal', color: 'bg-blue-100 text-blue-800' };
    if (stats.orderCount >= 3) return { label: 'Regular', color: 'bg-green-100 text-green-800' };
    if (stats.orderCount === 0) return { label: 'Prospect', color: 'bg-gray-100 text-gray-800' };
    return { label: 'New', color: 'bg-yellow-100 text-yellow-800' };
  };

  const viewCustomerDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCustomerDetailDialog(true);
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${customer.first_name} ${customer.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (segmentFilter === 'all') return matchesSearch;
    
    const segment = getCustomerSegment(customer);
    return matchesSearch && segment.label.toLowerCase() === segmentFilter;
  });

  const customerStats = {
    total: customers.length,
    vip: customers.filter(c => getCustomerSegment(c).label === 'VIP').length,
    loyal: customers.filter(c => getCustomerSegment(c).label === 'Loyal').length,
    new: customers.filter(c => getCustomerSegment(c).label === 'New').length,
    totalRevenue: customers.reduce((sum, c) => sum + getCustomerStats(c).totalSpent, 0),
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
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600">Manage customer relationships and segments</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="lumicea-button-primary">
            <Mail className="h-4 w-4 mr-2" />
            Send Campaign
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{customerStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">VIP Customers</p>
                <p className="text-2xl font-bold text-gray-900">{customerStats.vip}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Loyal Customers</p>
                <p className="text-2xl font-bold text-gray-900">{customerStats.loyal}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <UserPlus className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">New Customers</p>
                <p className="text-2xl font-bold text-gray-900">{customerStats.new}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total CLV</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(customerStats.totalRevenue)}</p>
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
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={segmentFilter}
              onChange={(e) => setSegmentFilter(e.target.value)}
              className="w-[180px] rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="all">All Customers</option>
              <option value="vip">VIP</option>
              <option value="loyal">Loyal</option>
              <option value="regular">Regular</option>
              <option value="new">New</option>
              <option value="prospect">Prospects</option>
            </select>

            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCustomers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Customer</th>
                    <th className="text-left py-3 px-4 font-semibold">Segment</th>
                    <th className="text-left py-3 px-4 font-semibold">Orders</th>
                    <th className="text-left py-3 px-4 font-semibold">Total Spent</th>
                    <th className="text-left py-3 px-4 font-semibold">Avg Order</th>
                    <th className="text-left py-3 px-4 font-semibold">Last Order</th>
                    <th className="text-left py-3 px-4 font-semibold">Joined</th>
                    <th className="text-left py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => {
                    const stats = getCustomerStats(customer);
                    const segment = getCustomerSegment(customer);
                    
                    return (
                      <tr key={customer.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium">
                              {customer.first_name} {customer.last_name}
                            </div>
                            <div className="text-sm text-gray-500">{customer.email}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={segment.color}>
                            {segment.label}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">{stats.orderCount}</td>
                        <td className="py-3 px-4 font-medium">
                          {formatCurrency(stats.totalSpent)}
                        </td>
                        <td className="py-3 px-4">
                          {formatCurrency(stats.avgOrderValue)}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500">
                          {stats.lastOrderDate ? formatDate(stats.lastOrderDate, 'PP') : 'Never'}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500">
                          {formatDate(new Date(customer.created_at), 'PP')}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-1">
                            <Button size="sm" variant="outline" onClick={() => viewCustomerDetails(customer)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Mail className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No customers found</h3>
              <p className="text-gray-500">
                {searchTerm || segmentFilter !== 'all' ? 'Try adjusting your search or filters' : 'No customers have registered yet'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Customer Detail Dialog */}
      {customerDetailDialog && selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Customer Profile</h2>
              <Button variant="ghost" size="sm" onClick={() => setCustomerDetailDialog(false)}>
                &times;
              </Button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <h3 className="font-semibold text-sm text-gray-500 mb-1">Contact Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p>
                      <span className="font-medium">Name:</span> {selectedCustomer.first_name} {selectedCustomer.last_name}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span> {selectedCustomer.email}
                    </p>
                    <p>
                      <span className="font-medium">Customer Since:</span> {formatDate(new Date(selectedCustomer.created_at), 'PPP')}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-500 mb-1">Customer Value</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-center">
                      <Badge className={getCustomerSegment(selectedCustomer).color}>
                        {getCustomerSegment(selectedCustomer).label}
                      </Badge>
                      <p className="text-2xl font-bold mt-2">
                        {formatCurrency(getCustomerStats(selectedCustomer).totalSpent)}
                      </p>
                      <p className="text-sm text-gray-500">Lifetime Value</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-sm text-gray-500 mb-2">Order History</h3>
                {selectedCustomer.orders && selectedCustomer.orders.length > 0 ? (
                  <div className="border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedCustomer.orders.map((order) => (
                          <tr key={order.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(new Date(order.created_at), 'PP')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {order.id.substring(0, 8)}...
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              {formatCurrency(order.total_amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-gray-500">No orders yet</p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
                <Button className="lumicea-button-primary">
                  <Eye className="h-4 w-4 mr-2" />
                  View Full Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}