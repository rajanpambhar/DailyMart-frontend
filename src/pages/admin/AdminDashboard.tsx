import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Users, ShoppingCart, DollarSign, TrendingUp, Loader2, Clock, CheckCircle, XCircle, BarChart3, Star } from 'lucide-react';
import { api } from '../../services';

interface DashboardStats {
  products: number;
  users: number;
  orders: number;
  revenue: number;
}

interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  todayOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  recentOrders: any[];
}

interface RevenueTrend {
  date: string;
  revenue: number;
  orders: number;
}

interface TopProduct {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
  totalQuantity: number;
  totalRevenue: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null);
  const [revenueTrends, setRevenueTrends] = useState<RevenueTrend[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, usersRes, ordersRes, trendsRes, topProductsRes] = await Promise.all([
          api.get('/products?limit=1'),
          api.get('/users/statistics'),
          api.get('/orders/statistics'),
          api.get('/orders/analytics/revenue-trends'),
          api.get('/orders/analytics/top-products?limit=5'),
        ]);

        setStats({
          products: productsRes.data.pagination?.total || 0,
          users: usersRes.data.data?.total || 0,
          orders: ordersRes.data.data?.totalOrders || 0,
          revenue: ordersRes.data.data?.totalRevenue || 0,
        });
        setOrderStats(ordersRes.data.data);
        setRevenueTrends(trendsRes.data.data || []);
        setTopProducts(topProductsRes.data.data || []);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      label: 'Total Products',
      value: stats?.products || 0,
      icon: Package,
      color: 'text-primary-400',
      bgColor: 'bg-primary-500/10 border-primary-500/20',
      link: '/admin/products',
    },
    {
      label: 'Total Users',
      value: stats?.users || 0,
      icon: Users,
      color: 'text-secondary-400',
      bgColor: 'bg-secondary-400/10 border-secondary-400/20',
      link: '/admin/users',
    },
    {
      label: 'Total Orders',
      value: stats?.orders || 0,
      icon: ShoppingCart,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10 border-blue-400/20',
      link: '/admin/orders',
    },
    {
      label: 'Total Revenue',
      value: `₹${(stats?.revenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10 border-green-400/20',
      link: '/admin/orders',
    },
  ];

  const getStatusBadge = (status: string) => {
    const badges = {
      PENDING: { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-400/10', label: 'Pending' },
      COMPLETED: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-400/10', label: 'Completed' },
      CANCELLED: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-400/10', label: 'Cancelled' },
      FAILED: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-400/10', label: 'Failed' },
    };
    const badge = badges[status as keyof typeof badges] || badges.PENDING;
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${badge.bg} ${badge.color}`}>
        <Icon className="w-3 h-3" />
        {badge.label}
      </span>
    );
  };

  const maxRevenue = Math.max(...revenueTrends.map(t => t.revenue), 1);
  const maxOrders = Math.max(...revenueTrends.map(t => t.orders), 1);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-6 animate-fade-in custom-scrollbar">
      <h1 className="text-3xl font-bold text-white mb-8 tracking-tight">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            to={stat.link}
            className="glass-card p-6 bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 group rounded-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl border ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <TrendingUp className="w-4 h-4 text-gray-500 group-hover:text-primary-400 transition-colors" />
            </div>
            <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-sm text-gray-400 font-medium">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Revenue Trends Chart */}
      {revenueTrends.length > 0 && (
        <div className="glass-card p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary-500" />
              <h2 className="text-xl font-semibold text-white">Revenue Trends (Last 7 Days)</h2>
            </div>
          </div>

          <div className="space-y-4">
            {revenueTrends.map((trend, index) => {
              const revenuePercent = (trend.revenue / maxRevenue) * 100;
              const ordersPercent = (trend.orders / maxOrders) * 100;
              const date = new Date(trend.date);
              const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
              const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400 font-medium w-24">{dayName}, {dateStr}</span>
                    <div className="flex items-center gap-6">
                      <span className="text-green-400 font-semibold">₹{trend.revenue.toFixed(0)}</span>
                      <span className="text-blue-400 font-semibold w-16 text-right">{trend.orders} orders</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-dark-600 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-500"
                        style={{ width: `${revenuePercent}%` }}
                      />
                    </div>
                    <div className="flex-1 bg-dark-600 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500"
                        style={{ width: `${ordersPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-dark-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-green-400" />
              <span className="text-xs text-gray-400">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-400" />
              <span className="text-xs text-gray-400">Orders</span>
            </div>
          </div>
        </div>
      )}

      {/* Order Stats & Top Products */}
      {orderStats && (
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="glass-card p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold text-white mb-6">Order Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-dark-600/50 rounded-lg text-center">
                <p className="text-2xl font-bold text-white mb-1">{orderStats.todayOrders}</p>
                <p className="text-xs text-gray-400">Today's Orders</p>
              </div>
              <div className="p-4 bg-dark-600/50 rounded-lg text-center">
                <p className="text-2xl font-bold text-yellow-400 mb-1">{orderStats.pendingOrders}</p>
                <p className="text-xs text-gray-400">Pending</p>
              </div>
              <div className="p-4 bg-dark-600/50 rounded-lg text-center">
                <p className="text-2xl font-bold text-green-400 mb-1">{orderStats.completedOrders}</p>
                <p className="text-xs text-gray-400">Completed</p>
              </div>
              <div className="p-4 bg-dark-600/50 rounded-lg text-center">
                <p className="text-2xl font-bold text-red-400 mb-1">{orderStats.cancelledOrders}</p>
                <p className="text-xs text-gray-400">Cancelled</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
            <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/admin/products"
                className="p-4 bg-black/20 rounded-xl hover:bg-white/5 transition-all duration-300 text-center border border-white/5 hover:border-primary-500/30 group"
              >
                <div className="w-12 h-12 mx-auto mb-3 bg-primary-500/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Package className="w-6 h-6 text-primary-400" />
                </div>
                <p className="text-sm text-white font-medium group-hover:text-primary-400 transition-colors">Manage Products</p>
              </Link>
              <Link
                to="/admin/orders"
                className="p-4 bg-black/20 rounded-xl hover:bg-white/5 transition-all duration-300 text-center border border-white/5 hover:border-blue-500/30 group"
              >
                <div className="w-12 h-12 mx-auto mb-3 bg-blue-500/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ShoppingCart className="w-6 h-6 text-blue-400" />
                </div>
                <p className="text-sm text-white font-medium group-hover:text-blue-400 transition-colors">Manage Orders</p>
              </Link>
              <Link
                to="/admin/users"
                className="p-4 bg-black/20 rounded-xl hover:bg-white/5 transition-all duration-300 text-center border border-white/5 hover:border-secondary-500/30 group"
              >
                <div className="w-12 h-12 mx-auto mb-3 bg-secondary-500/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-secondary-400" />
                </div>
                <p className="text-sm text-white font-medium group-hover:text-secondary-400 transition-colors">Manage Users</p>
              </Link>
              <Link
                to="/admin/categories"
                className="p-4 bg-black/20 rounded-xl hover:bg-white/5 transition-all duration-300 text-center border border-white/5 hover:border-purple-500/30 group"
              >
                <div className="w-12 h-12 mx-auto mb-3 bg-purple-500/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  {/* Fixed explicit class icon rendering issues if any by using generic Package or Tags */}
                  <Package className="w-6 h-6 text-purple-400" />
                </div>
                <p className="text-sm text-white font-medium group-hover:text-purple-400 transition-colors">Manage Categories</p>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Top Selling Products */}
      {topProducts.length > 0 && (
        <div className="glass-card p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <h2 className="text-xl font-semibold text-white">Top Selling Products</h2>
            </div>
            <Link to="/admin/products" className="text-sm text-primary-500 hover:text-primary-400 transition-colors">
              View All →
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {topProducts.map((item, index) => (
              <div key={item.product.id} className="bg-dark-600/50 rounded-lg p-4 hover:bg-dark-600 transition-colors">
                <div className="relative mb-3">
                  <div className="aspect-square rounded-lg overflow-hidden bg-dark-700">
                    {item.product.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-12 h-12 text-gray-600" />
                      </div>
                    )}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-sm">
                    #{index + 1}
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-white mb-2 line-clamp-2">{item.product.name}</h3>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Sold:</span>
                    <span className="text-white font-semibold">{item.totalQuantity} units</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Revenue:</span>
                    <span className="text-green-400 font-semibold">₹{item.totalRevenue.toFixed(0)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders Table */}
      {orderStats?.recentOrders && orderStats.recentOrders.length > 0 && (
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm text-primary-500 hover:text-primary-400 transition-colors">
              View All →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-600">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Order ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Date</th>
                </tr>
              </thead>
              <tbody>
                {orderStats.recentOrders.map((order: any) => (
                  <tr key={order.id} className="border-b border-dark-700 hover:bg-dark-600/30 transition-colors">
                    <td className="py-3 px-4">
                      <Link to={`/admin/orders`} className="text-sm text-primary-500 hover:text-primary-400 font-mono">
                        #{order.id.slice(-8)}
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-white">{order.user?.fullname || 'N/A'}</div>
                      <div className="text-xs text-gray-500">{order.user?.email || ''}</div>
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold text-white">
                      ₹{order.totalAmount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(order.paymentStatus)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
