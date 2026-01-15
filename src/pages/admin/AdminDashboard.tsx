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
      color: 'text-primary-500',
      bgColor: 'bg-primary-500/10',
      link: '/admin/products',
    },
    {
      label: 'Total Users',
      value: stats?.users || 0,
      icon: Users,
      color: 'text-secondary-400',
      bgColor: 'bg-secondary-400/10',
      link: '/admin/users',
    },
    {
      label: 'Total Orders',
      value: stats?.orders || 0,
      icon: ShoppingCart,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      link: '/admin/orders',
    },
    {
      label: 'Total Revenue',
      value: `₹${(stats?.revenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
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
    <div className="h-full overflow-auto p-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            to={stat.link}
            className="glass-card p-6 hover:border-primary-500/50 transition-colors group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <TrendingUp className="w-4 h-4 text-gray-500 group-hover:text-primary-500 transition-colors" />
            </div>
            <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-sm text-gray-400">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Order Stats */}
      {orderStats && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-dark-600/50 rounded-lg">
                <span className="text-gray-400">Today's Orders</span>
                <span className="font-semibold text-white">{orderStats.todayOrders}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-dark-600/50 rounded-lg">
                <span className="text-gray-400">Pending Orders</span>
                <span className="font-semibold text-yellow-400">{orderStats.pendingOrders}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-dark-600/50 rounded-lg">
                <span className="text-gray-400">Completed Orders</span>
                <span className="font-semibold text-green-400">{orderStats.completedOrders}</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/admin/products"
                className="p-4 bg-dark-600/50 rounded-lg hover:bg-dark-600 transition-colors text-center"
              >
                <Package className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                <p className="text-sm text-white font-medium">Products</p>
              </Link>
              <Link
                to="/admin/orders"
                className="p-4 bg-dark-600/50 rounded-lg hover:bg-dark-600 transition-colors text-center"
              >
                <ShoppingCart className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-sm text-white font-medium">Orders</p>
              </Link>
              <Link
                to="/admin/users"
                className="p-4 bg-dark-600/50 rounded-lg hover:bg-dark-600 transition-colors text-center"
              >
                <Users className="w-8 h-8 text-secondary-400 mx-auto mb-2" />
                <p className="text-sm text-white font-medium">Users</p>
              </Link>
              <Link
                to="/admin/categories"
                className="p-4 bg-dark-600/50 rounded-lg hover:bg-dark-600 transition-colors text-center"
              >
                <Package className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-sm text-white font-medium">Categories</p>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
