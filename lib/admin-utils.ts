import { supabase } from '@/lib/supabase';

// Function to check if user is admin
export async function isUserAdmin(): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (error || !data) return false;
    return data.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

// Function to fetch dashboard stats
export async function fetchDashboardStats() {
  try {
    // Fetch orders for revenue calculation
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('total_amount, status, created_at');
    
    if (ordersError) throw ordersError;
    
    // Fetch customer count
    const { data: customers, error: customersError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('role', 'customer');
    
    if (customersError) throw customersError;
    
    // Fetch product count
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, is_active');
    
    if (productsError) throw productsError;
    
    // Calculate current period stats (last 30 days)
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    
    const recentOrders = orders?.filter(o => new Date(o.created_at) >= thirtyDaysAgo) || [];
    const previousOrders = orders?.filter(o => 
      new Date(o.created_at) >= sixtyDaysAgo && new Date(o.created_at) < thirtyDaysAgo
    ) || [];
    
    const totalSales = recentOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
    const previousSales = previousOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
    const salesGrowth = previousSales > 0 ? ((totalSales - previousSales) / previousSales) * 100 : 0;
    
    const ordersGrowth = previousOrders.length > 0 ? 
      ((recentOrders.length - previousOrders.length) / previousOrders.length) * 100 : 0;
    
    const pendingOrdersCount = orders?.filter(o => o.status === 'pending').length || 0;
    
    // Fetch low stock products
    const { data: lowStockData, error: lowStockError } = await supabase
      .rpc('get_low_stock_variants');
    
    if (lowStockError) throw lowStockError;
    
    return {
      totalSales,
      totalOrders: recentOrders.length,
      totalCustomers: customers?.length || 0,
      totalProducts: products?.filter(p => p.is_active).length || 0,
      salesGrowth,
      ordersGrowth,
      lowStockCount: lowStockData?.length || 0,
      pendingOrdersCount,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
}

// Function to fetch recent orders
export async function fetchRecentOrders(limit: number = 5) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        id, 
        order_number, 
        customer_email, 
        total_amount, 
        status, 
        created_at,
        shipping_address:shipping_addresses!orders_shipping_address_id_fkey(first_name, last_name)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching recent orders:', error);
    throw error;
  }
}

// Function to fetch low stock products
export async function fetchLowStockProducts(limit: number = 5) {
  try {
    const { data, error } = await supabase
      .rpc('get_low_stock_variants')
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching low stock products:', error);
    throw error;
  }
}

// Function to fetch product categories
export async function fetchCategories() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select(`
        *,
        parent:categories!parent_id(name),
        products(count)
      `)
      .order('sort_order');
    
    if (error) throw error;
    
    const categoriesWithCount = data?.map(cat => ({
      ...cat,
      product_count: cat.products?.length || 0
    })) || [];
    
    return categoriesWithCount;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

// Function to fetch product tags
export async function fetchTags() {
  try {
    const { data, error } = await supabase
      .from('tags')
      .select(`
        *,
        product_tags(count)
      `)
      .order('name');
    
    if (error) throw error;
    
    const tagsWithCount = data?.map(tag => ({
      ...tag,
      product_count: tag.product_tags?.length || 0
    })) || [];
    
    return tagsWithCount;
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }
}

// Function to fetch products
export async function fetchProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(name),
        variants:product_variants(id, sku, stock_quantity, low_stock_threshold)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

// Function to fetch orders
export async function fetchOrders() {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        shipping_address:shipping_addresses!orders_shipping_address_id_fkey(*),
        order_items(quantity, product_name)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
}

// Function to fetch customers
export async function fetchCustomers() {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select(`
        *,
        orders(id, total_amount, created_at)
      `)
      .eq('role', 'customer')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
}

// Function to fetch inventory
export async function fetchInventory() {
  try {
    const { data, error } = await supabase
      .from('product_variants')
      .select(`
        id,
        sku,
        name,
        stock_quantity,
        low_stock_threshold,
        cost_price,
        price,
        product:products(name)
      `)
      .eq('is_active', true)
      .order('stock_quantity', { ascending: true });
    
    if (error) throw error;
    
    const inventoryData = data?.map(item => ({
      variant_id: item.id,
      product_name: item.product?.name || 'Unknown Product',
      variant_name: item.name,
      sku: item.sku,
      current_stock: item.stock_quantity,
      threshold: item.low_stock_threshold,
      cost_price: item.cost_price || 0,
      retail_price: item.price,
    })) || [];
    
    return inventoryData;
  } catch (error) {
    console.error('Error fetching inventory:', error);
    throw error;
  }
}

// Function to update stock levels
export async function updateStockLevel(
  variantId: string,
  quantityChange: number,
  transactionType: 'restock' | 'adjustment' | 'return',
  notes: string
) {
  try {
    const { error } = await supabase.rpc('update_variant_stock', {
      p_variant_id: variantId,
      p_quantity_change: quantityChange,
      p_transaction_type: transactionType,
      p_notes: notes,
    });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating stock level:', error);
    throw error;
  }
}

// Function to fetch promotions
export async function fetchPromotions() {
  try {
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching promotions:', error);
    throw error;
  }
}

// Function to fetch shipping methods
export async function fetchShippingMethods() {
  try {
    const { data, error } = await supabase
      .from('shipping_methods')
      .select('*')
      .order('sort_order');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching shipping methods:', error);
    throw error;
  }
}

// Function to fetch tax rates
export async function fetchTaxRates() {
  try {
    const { data, error } = await supabase
      .from('tax_rates')
      .select('*')
      .order('country', { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching tax rates:', error);
    throw error;
  }
}

// Function to fetch system settings
export async function fetchSystemSettings() {
  try {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*');
    
    if (error) throw error;
    
    const settingsMap: Record<string, any> = {};
    data?.forEach(setting => {
      if (!settingsMap[setting.category]) {
        settingsMap[setting.category] = {};
      }
      settingsMap[setting.category][setting.key] = setting.value;
    });
    
    return settingsMap;
  } catch (error) {
    console.error('Error fetching system settings:', error);
    throw error;
  }
}

// Function to update system setting
export async function updateSystemSetting(category: string, key: string, value: any) {
  try {
    const { error } = await supabase
      .from('system_settings')
      .upsert({
        category,
        key,
        value,
        updated_by: (await supabase.auth.getUser()).data.user?.id
      });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating system setting:', error);
    throw error;
  }
}

// Function to fetch analytics data
export async function fetchAnalyticsData(dateRange: string) {
  try {
    // Fetch sales reports
    const { data: salesReports, error: salesError } = await supabase
      .from('sales_reports')
      .select('*')
      .eq('report_type', 'daily')
      .gte('report_date', new Date(Date.now() - parseInt(dateRange) * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('report_date', { ascending: true });
    
    if (salesError) throw salesError;
    
    // Fetch product sales data
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select(`
        product_name,
        quantity,
        total_price,
        order:orders!inner(status, created_at)
      `)
      .gte('order.created_at', new Date(Date.now() - parseInt(dateRange) * 24 * 60 * 60 * 1000).toISOString())
      .in('order.status', ['processing', 'shipped', 'delivered']);
    
    if (itemsError) throw itemsError;
    
    // Aggregate product sales
    const productSalesMap = new Map();
    orderItems?.forEach(item => {
      const existing = productSalesMap.get(item.product_name) || { total_sold: 0, revenue: 0 };
      productSalesMap.set(item.product_name, {
        product_name: item.product_name,
        total_sold: existing.total_sold + item.quantity,
        revenue: existing.revenue + item.total_price
      });
    });
    
    const productSales = Array.from(productSalesMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
    
    return {
      salesData: salesReports || [],
      productSales
    };
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    throw error;
  }
}