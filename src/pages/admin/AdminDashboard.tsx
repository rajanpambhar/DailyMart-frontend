// =====================================================
// ADMIN DASHBOARD
// Migrated from: PHP admin_index.php
// =====================================================

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Users, ShoppingCart, DollarSign, TrendingUp, Loader2 } from 'lucide-react';
import { api } from '../../services';

interface DashboardStats {
  products: number;
  users: number;
  orders: number;
  revenue: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orderStats, setOrderStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, usersRes, ordersRes] = await Promise.all([
          api.get('/products?limit=1'),
          api.get('/users/statistics'),
          api.get('/orders/statistics'),
        ]);

        setStats({
          products: productsRes.data.pagination?.total || 0,
          users: usersRes.data.data?.total || 0,
          orders: ordersRes.data.data?.totalOrders || 0,
          revenue: ordersRes.data.data?.totalRevenue || 0,
        });
        setOrderStats(ordersRes.data.data);
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

      {/* Order Stats */}
      {orderStats && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass-card p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
            <h2 className="text-xl font-semibold text-white mb-6">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                <span className="text-gray-400">Today's Orders</span>
                <span className="font-bold text-white text-lg">{orderStats.todayOrders}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                <span className="text-gray-400">Pending Orders</span>
                <span className="font-bold text-yellow-400 text-lg">{orderStats.pendingOrders}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                <span className="text-gray-400">Completed Orders</span>
                <span className="font-bold text-green-400 text-lg">{orderStats.completedOrders}</span>
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
    </div>
  );
};

export default AdminDashboard;
