import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  TrendingUp, 
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  AlertTriangle,
  Eye,
  Plus,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  fetchDashboardStats, 
  fetchRecentOrders, 
  fetchLowStockProducts 
} from '@/lib/admin-utils';
import { formatCurrency } from '@/lib/utils';

interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  salesGrowth: number;
  ordersGrowth: number;
  lowStockCount: number;
  pendingOrdersCount: number;
}

interface RecentOrder {
  id: string;
  order_number: string;
  customer_email: string;
  total_amount: number;
  status: string;
  created_at: string;
  shipping_address?: {
    first_name: string;
    last_name: string;
  }; // Changed from array to single object
}

interface LowStockProduct {
  id: string;
  product_name?: string;
  variant_name: string;
  sku: string;
  stock_quantity: number;
  low_stock_threshold: number;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    salesGrowth: 0,
    ordersGrowth: 0,
    lowStockCount: 0,
    pendingOrdersCount: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard stats
      const dashboardStats = await fetchDashboardStats();
      setStats(dashboardStats);
      
      // Fetch recent orders
      const recentOrdersData = await fetchRecentOrders(5);
      setRecentOrders(recentOrdersData);
      
      // Fetch low stock products
      const lowStockData = await fetchLowStockProducts(5);
      setLowStockProducts(lowStockData);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      processing: { label: 'Processing', color: 'bg-blue-100 text-blue-800', icon: Package },
      shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-800', icon: Package },
      delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle },
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
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your store.</p>
        </div>
        <div className="flex space-x-2">
          <Button asChild className="lumicea-button-primary">
            <Link to="/admin/products/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sales (30d)</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalSales)}</p>
              </div>
              <div className="flex items-center space-x-1">
                {stats.salesGrowth >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span className={`text-sm font-medium ${stats.salesGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(stats.salesGrowth).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="mt-2">
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Orders (30d)</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
              <div className="flex items-center space-x-1">
                {stats.ordersGrowth >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span className={`text-sm font-medium ${stats.ordersGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(stats.ordersGrowth).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="mt-2">
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Products</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
              <Package className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {(stats.lowStockCount > 0 || stats.pendingOrdersCount > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stats.pendingOrdersCount > 0 && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <Clock className="h-8 w-8 text-yellow-600" />
                  <div>
                    <h3 className="font-semibold text-yellow-900">Pending Orders</h3>
                    <p className="text-yellow-800">
                      You have {stats.pendingOrdersCount} orders waiting to be processed.
                    </p>
                    <Button asChild size="sm" className="mt-2" variant="outline">
                      <Link to="/admin/orders?status=pending">
                        View Pending Orders
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {stats.lowStockCount > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <div>
                    <h3 className="font-semibold text-red-900">Low Stock Alert</h3>
                    <p className="text-red-800">
                      {stats.lowStockCount} products are running low on stock.
                    </p>
                    <Button asChild size="sm" className="mt-2" variant="outline">
                      <Link to="/admin/inventory">
                        Manage Inventory
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link to="/admin/orders">
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{order.order_number}</p>
                      <p className="text-sm text-gray-600">{order.customer_email}</p>
                      {order.shipping_address && (
                        <p className="text-xs text-gray-500">
                          {order.shipping_address.first_name} {order.shipping_address.last_name}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(order.total_amount)}</p>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No recent orders</p>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Low Stock Products</CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link to="/admin/inventory">
                <Package className="h-4 w-4 mr-2" />
                Manage Inventory
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {lowStockProducts.length > 0 ? (
              <div className="space-y-4">
                {lowStockProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-medium">{product.product_name}</p>
                      <p className="text-sm text-gray-600">{product.variant_name} - {product.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-600">{product.stock_quantity} left</p>
                      <p className="text-xs text-gray-500">Threshold: {product.low_stock_threshold}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">All products are well stocked</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link to="/admin/products/new">
                <Plus className="h-6 w-6 mb-2" />
                Add Product
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link to="/admin/orders">
                <ShoppingCart className="h-6 w-6 mb-2" />
                View Orders
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link to="/admin/customers">
                <Users className="h-6 w-6 mb-2" />
                Manage Customers
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link to="/admin/analytics">
                <BarChart3 className="h-6 w-6 mb-2" />
                View Analytics
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminDashboard;
