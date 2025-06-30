import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Gem,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Menu,
  Bell,
  User,
  LogOut,
  Plus,
  AlertTriangle,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { isUserAdmin } from '@/lib/admin-utils';
import { User as SupabaseUser } from '@supabase/supabase-js';

const navigationItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    description: 'Overview and key metrics'
  },
  {
    title: 'Products',
    href: '/admin/products',
    icon: Package,
    description: 'Manage product catalog',
    submenu: [
      { title: 'All Products', href: '/admin/products' },
      { title: 'Add Product', href: '/admin/products/new' },
      { title: 'Categories', href: '/admin/categories' },
      { title: 'Inventory', href: '/admin/inventory' },
    ]
  },
  {
    title: 'Orders',
    href: '/admin/orders',
    icon: ShoppingCart,
    description: 'Order management and fulfillment',
    submenu: [
      { title: 'All Orders', href: '/admin/orders' },
      { title: 'Pending Orders', href: '/admin/orders?status=pending' },
      { title: 'Shipping', href: '/admin/shipping' },
      { title: 'Returns', href: '/admin/returns' },
    ]
  },
  {
    title: 'Customers',
    href: '/admin/customers',
    icon: Users,
    description: 'Customer management and segments'
  },
  {
    title: 'Marketing',
    href: '/admin/marketing',
    icon: Mail,
    description: 'Promotions and campaigns',
    submenu: [
      { title: 'Promotions', href: '/admin/promotions' },
      { title: 'Email Campaigns', href: '/admin/campaigns' },
      { title: 'Banners', href: '/admin/banners' },
      { title: 'SEO', href: '/admin/seo' },
    ]
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
    description: 'Reports and insights'
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    description: 'System configuration'
  },
];

export function AdminLayout() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

useEffect(() => {
  checkUser();
  fetchNotifications();
}, [checkUser, fetchNotifications]); // Added checkUser and fetchNotifications to the dependency array

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }
      
      // Check if user is admin
      const adminStatus = await isUserAdmin();
      if (!adminStatus) {
        navigate('/');
        return;
      }
      
      setUser(user);
      setIsAdmin(adminStatus);
    } catch (error) {
      console.error('Error checking user:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('inventory_alerts')
        .select('*')
        .eq('is_read', false)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (path === '/admin' && location.pathname === '/admin') {
      return true;
    }
    if (path !== '/admin' && location.pathname.startsWith(path)) {
      return true;
    }
    return false;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lumicea-navy"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don&apos;t have permission to access the admin area.</p>
          <Button as={Link} to="/">Return to Homepage</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          {/* Logo and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <Link to="/admin" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-lumicea-navy rounded-lg flex items-center justify-center">
                <Gem className="h-6 w-6 text-lumicea-gold" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">
                  Lumicea
                </span>
                <p className="text-sm text-gray-600">Admin Panel</p>
              </div>
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Quick Actions */}
            <Button size="sm" className="lumicea-button-primary hidden sm:flex">
              <Link to="/admin/products/new" className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Link>
            </Button>

            {/* Notifications */}
            <div className="relative">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
                    {notifications.length}
                  </Badge>
                )}
              </Button>
              {notifications.length > 0 && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-50 border border-gray-200">
                  <div className="p-2 border-b">
                    <h3 className="font-medium">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 border-b border-gray-100">
                        <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{notification.message}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(notification.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative group">
              <Button variant="ghost" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-lumicea-navy rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="hidden sm:block font-medium">{user?.email}</span>
              </Button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-50 border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="p-2 border-b">
                  <h3 className="font-medium">Admin Account</h3>
                </div>
                <div className="p-2">
                  <Link to="/" className="flex items-center p-2 rounded-md hover:bg-gray-100">
                    <Gem className="mr-2 h-4 w-4" />
                    View Store
                  </Link>
                  <Link to="/settings" className="flex items-center p-2 rounded-md hover:bg-gray-100">
                    <User className="mr-2 h-4 w-4" />
                    Profile Settings
                  </Link>
                </div>
                <div className="p-2 border-t">
                  <button 
                    onClick={handleSignOut} 
                    className="flex items-center w-full p-2 rounded-md hover:bg-gray-100 text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:top-16 lg:bg-white lg:border-r lg:border-gray-200 transition-all duration-300 ${
          sidebarOpen ? 'fixed inset-y-0 top-16 left-0 w-64 bg-white border-r border-gray-200 z-40' : 'hidden'
        }`}>
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigationItems.map((item) => (
              <div key={item.href}>
                <Link
                  to={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-lumicea-navy transition-colors group ${
                    isActive(item.href) ? 'bg-lumicea-navy/10 text-lumicea-navy font-medium' : ''
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <div className="flex-1">
                    <span className="font-medium">{item.title}</span>
                    <p className="text-xs text-gray-500 group-hover:text-gray-600">
                      {item.description}
                    </p>
                  </div>
                </Link>
                {item.submenu && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.href}
                        to={subItem.href}
                        className={`block px-3 py-1 text-sm text-gray-600 hover:text-lumicea-navy transition-colors ${
                          location.pathname === subItem.href ? 'text-lumicea-navy font-medium' : ''
                        }`}
                      >
                        {subItem.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 pt-4">
          <div className="px-4 sm:px-6 lg:px-8 pb-8">
            {/* Outlet will be rendered here */}
          </div>
        </main>
      </div>
    </div>
  );
}

