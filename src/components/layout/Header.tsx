// =====================================================
// HEADER COMPONENT
// Migrated from: PHP header.php
// =====================================================

import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';
import Logo from '../common/Logo';

const categories = [
  { slug: 'vegetables', label: 'Vegetables' },
  { slug: 'fruits', label: 'Fruits' },
  { slug: 'home-essentials', label: 'Home Essentials' },
  { slug: 'mens-clothing', label: 'Men' },
  { slug: 'womens-clothing', label: 'Women' },
  { slug: 'electronics', label: 'Electronics' },
  { slug: 'kids', label: 'Kids' },
  { slug: 'beauty-products', label: 'Beauty Products' },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuthStore();
  const { totalItems } = useCartStore();
  const navigate = useNavigate();

  const cartCount = totalItems();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-dark-800/95 backdrop-blur-lg border-b border-dark-600">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold group">
            <Logo className="w-8 h-8 group-hover:scale-110 transition-transform duration-200" />
            <div className="flex items-baseline">
              <span className="text-primary-500">Daily</span>
              <span className="text-secondary-400">Mart</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {categories.map((cat) => (
              <NavLink
                key={cat.slug}
                to={`/category/${cat.slug}`}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'text-primary-500 bg-primary-500/10'
                      : 'text-gray-300 hover:text-white hover:bg-dark-600'
                  }`
                }
              >
                {cat.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 rounded-lg text-gray-300 hover:text-white hover:bg-dark-600 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-primary-500 text-dark-900 text-xs font-bold rounded-full">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 p-2 rounded-lg text-gray-300 hover:text-white hover:bg-dark-600 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-primary-500" />
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {isDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-dark-700 border border-dark-500 rounded-xl shadow-xl z-20 overflow-hidden animate-slide-down">
                      <div className="p-4 border-b border-dark-500">
                        <p className="font-medium text-white">{user.fullname}</p>
                        <p className="text-sm text-gray-400">{user.email}</p>
                      </div>
                      <div className="py-2">
                        <Link
                          to="/profile"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-dark-600 transition-colors"
                        >
                          <User className="w-4 h-4" />
                          My Profile
                        </Link>
                        <Link
                          to="/orders"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-dark-600 transition-colors"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          My Orders
                        </Link>
                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-dark-600 transition-colors"
                          >
                            <Settings className="w-4 h-4" />
                            Admin Panel
                          </Link>
                        )}
                      </div>
                      <div className="py-2 border-t border-dark-500">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2 text-red-400 hover:text-red-300 hover:bg-dark-600 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Log Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-dark-900 font-medium rounded-lg hover:bg-primary-400 transition-colors"
              >
                <User className="w-4 h-4" />
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-dark-600 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-dark-600 animate-slide-down">
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <NavLink
                  key={cat.slug}
                  to={`/category/${cat.slug}`}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'text-primary-500 bg-primary-500/10'
                        : 'text-gray-300 hover:text-white bg-dark-700'
                    }`
                  }
                >
                  {cat.label}
                </NavLink>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
