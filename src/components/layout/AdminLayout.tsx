// =====================================================
// ADMIN LAYOUT
// Migrated from: PHP admin sidebar structure
// =====================================================

import { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Star,
  Tags,
  Users,
  ShoppingCart,
  Home,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

const adminNavItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { path: '/admin/products', icon: Package, label: 'Products' },
  { path: '/admin/categories', icon: Tags, label: 'Categories' },
  { path: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { path: '/admin/users', icon: Users, label: 'Users' },
];

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="h-screen bg-transparent flex overflow-hidden">
      {/* Background Orbs (Optional, but helps consistency) */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
         <div className="absolute top-[20%] left-[20%] w-[30%] h-[30%] bg-primary-600/5 rounded-full blur-[100px] mix-blend-screen" />
         <div className="absolute bottom-[20%] right-[20%] w-[30%] h-[30%] bg-secondary-600/5 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-dark-900/90 backdrop-blur-2xl border-r border-white/5 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-white/5">
          <Link to="/admin" className="flex items-center gap-1 text-xl font-bold">
            <span className="text-primary-500">Daily</span>
            <span className="text-secondary-400">Mart</span>
            <span className="text-gray-400 text-sm ml-2 font-mono bg-white/10 px-2 py-0.5 rounded text-xs">ADMIN</span>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {adminNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-primary-600/20 text-primary-400 shadow-[0_0_15px_rgba(51,204,255,0.15)] border border-primary-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Links */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5 bg-black/20">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors mb-2"
          >
            <Home className="w-5 h-5" />
            View Site
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:text-white hover:bg-red-500/20 transition-all border border-transparent hover:border-red-500/20"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Bar */}
        <header className="flex-none h-16 bg-dark-900/70 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 z-20">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm">
              Welcome, <span className="text-white font-medium">{user?.fullname}</span>
            </span>
            <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center border border-primary-500/30 text-primary-400 font-bold">
              {user?.fullname?.charAt(0)}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden bg-transparent relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
