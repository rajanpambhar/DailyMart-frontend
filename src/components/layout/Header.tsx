// =====================================================
// HEADER COMPONENT
// Migrated from: PHP header.php
// =====================================================

import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, LogOut, Settings, ChevronDown, MapPin, Heart } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';
import { useWishlistStore } from '../../stores/wishlistStore';
import { addressesApi } from '../../services';
import type { Address } from '../../services/addressesApi';
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
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [currentAddress, setCurrentAddress] = useState<Address | null>(null);
  const { user, isAuthenticated, isAdmin, logout } = useAuthStore();
  const { totalItems } = useCartStore();
  const { items: wishlistItems, fetchWishlist, clearWishlist } = useWishlistStore();
  const navigate = useNavigate();

  const cartCount = totalItems();
  const wishlistCount = wishlistItems.length;

  // Fetch wishlist when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated, fetchWishlist]);

  const handleLogout = async () => {
    clearWishlist(); // Clear wishlist data on logout
    await logout();
    navigate('/login');
  };

  useEffect(() => {
    const fetchAddresses = async () => {
      if (isAuthenticated) {
        try {
          const data = await addressesApi.getAddresses();
          setAddresses(data);
          const defaultAddr = data.find(a => a.isDefault);
          if (defaultAddr) setCurrentAddress(defaultAddr);
          else if (data.length > 0) setCurrentAddress(data[0]);
        } catch (error) {
          console.error('Failed to fetch addresses');
        }
      }
    };
    fetchAddresses();
  }, [isAuthenticated]);

  return (
    <header className="sticky top-0 z-50 bg-dark-900/70 backdrop-blur-xl border-b border-white/5 support-backdrop-blur:bg-dark-900/95 transition-all duration-300">
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

          {/* Location Selector (Desktop) */}
          <div className="hidden lg:flex items-center ml-8 mr-auto relative">
            <button
              onClick={() => setIsLocationOpen(!isLocationOpen)}
              className="flex items-center gap-2 group hover:bg-dark-700/50 p-2 rounded-lg transition-colors"
              title="Select Delivery Location"
            >
              <div className="p-2 bg-dark-700 rounded-full group-hover:bg-primary-500/20 transition-colors">
                <MapPin className="w-5 h-5 text-primary-500" />
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-400 font-medium">Delivering to</p>
                <p className="text-sm text-white font-bold flex items-center gap-1 max-w-[150px] truncate">
                  {currentAddress ? `${currentAddress.city} ${currentAddress.zipCode}` : 'Select Location'}
                  <ChevronDown className="w-3 h-3 text-gray-500" />
                </p>
              </div>
            </button>

            {isLocationOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsLocationOpen(false)} />
                <div className="absolute top-full left-0 mt-2 w-72 bg-dark-800 border border-dark-600 rounded-xl shadow-2xl z-20 overflow-hidden animate-slide-down">
                  <div className="p-4 border-b border-dark-600 bg-dark-700/50">
                    <h3 className="text-white font-semibold flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary-500" />
                      Choose Location
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">Select a delivery address</p>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto p-2 space-y-2 scroller">
                    {!isAuthenticated ? (
                      <div className="text-center py-6 px-4">
                        <p className="text-sm text-gray-300 mb-4">Please login to see your saved addresses.</p>
                        <Link
                          to="/login"
                          onClick={() => setIsLocationOpen(false)}
                          className="btn-primary text-sm px-6 py-2 inline-flex items-center gap-2"
                        >
                          <User className="w-4 h-4" />
                          Login Now
                        </Link>
                      </div>
                    ) : addresses.length === 0 ? (
                      <div className="text-center py-6 px-4">
                        <p className="text-sm text-gray-300 mb-4">No saved addresses found.</p>
                        <Link
                          to="/profile?tab=addresses"
                          onClick={() => setIsLocationOpen(false)}
                          className="text-primary-400 text-sm hover:text-primary-300 hover:underline font-medium"
                        >
                          + Add New Address
                        </Link>
                      </div>
                    ) : (
                      addresses.map(addr => (
                        <button
                          key={addr.id}
                          onClick={() => {
                            setCurrentAddress(addr);
                            setIsLocationOpen(false);
                          }}
                          className={`w-full text-left p-3 rounded-lg border transition-all group ${currentAddress?.id === addr.id
                            ? 'border-primary-500 bg-primary-500/10'
                            : 'border-dark-600 hover:border-dark-500 hover:bg-dark-700'
                            }`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className={`text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded ${addr.type === 'Home' ? 'bg-blue-500/20 text-blue-400' :
                              addr.type === 'Work' ? 'bg-purple-500/20 text-purple-400' :
                                'bg-gray-500/20 text-gray-400'
                              }`}>
                              {addr.type}
                            </span>
                            {currentAddress?.id === addr.id && <span className="w-2 h-2 rounded-full bg-primary-500 shadow-sm shadow-primary-500/50"></span>}
                          </div>
                          <p className="text-sm text-white font-medium truncate mb-0.5 group-hover:text-primary-400 transition-colors">{addr.fullName}</p>
                          <p className="text-xs text-gray-400 truncate">{addr.street}, {addr.city}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{addr.zipCode}</p>
                        </button>
                      ))
                    )}
                  </div>
                  {isAuthenticated && (
                    <div className="p-3 border-t border-dark-600 bg-dark-700/30 text-center">
                      <Link
                        to="/profile?tab=addresses"
                        onClick={() => setIsLocationOpen(false)}
                        className="text-xs text-primary-400 hover:text-primary-300 font-medium hover:underline"
                      >
                        Manage Addresses
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${isActive
                  ? 'text-primary-400 bg-white/10 shadow-[0_0_15px_rgba(51,204,255,0.2)] border border-white/5'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`
              }
            >
              All Products
            </NavLink>
            {categories.map((cat) => (
              <NavLink
                key={cat.slug}
                to={`/category/${cat.slug}`}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${isActive
                    ? 'text-primary-400 bg-white/10 shadow-[0_0_15px_rgba(51,204,255,0.2)] border border-white/5'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {cat.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Wishlist */}
            {isAuthenticated && (
              <Link
                to="/wishlist"
                className="relative p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Heart className="w-6 h-6" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                    {wishlistCount > 99 ? '99+' : wishlistCount}
                  </span>
                )}
              </Link>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-primary-500 text-dark-900 text-xs font-bold rounded-full shadow-[0_0_10px_rgba(51,204,255,0.5)]">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center border border-primary-500/30">
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
                    <div className="absolute right-0 mt-2 w-56 bg-dark-900/90 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl z-20 overflow-hidden animate-slide-down">
                      <div className="p-4 border-b border-white/10 bg-white/5">
                        <p className="font-medium text-white">{user.fullname}</p>
                        <p className="text-sm text-gray-400">{user.email}</p>
                      </div>
                      <div className="py-2">
                        <Link
                          to="/profile"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <User className="w-4 h-4" />
                          My Profile
                        </Link>
                        <Link
                          to="/orders"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          My Orders
                        </Link>
                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                          >
                            <Settings className="w-4 h-4" />
                            Admin Panel
                          </Link>
                        )}
                      </div>
                      <div className="py-2 border-t border-white/10">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2 text-red-400 hover:text-red-300 hover:bg-white/10 transition-colors"
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
                className="flex items-center gap-2 px-4 py-2 bg-primary-600/90 hover:bg-primary-500 text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-primary-500/30 backdrop-blur-sm"
              >
                <User className="w-4 h-4" />
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-white/10 animate-slide-down bg-dark-900/95 backdrop-blur-xl absolute top-16 left-0 w-full shadow-2xl">
            <div className="container grid grid-cols-2 gap-2">
              <NavLink
                to="/products"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                    ? 'text-primary-400 bg-white/10 border border-white/5'
                    : 'text-gray-300 hover:text-white bg-white/5 hover:bg-white/10'
                  }`
                }
              >
                All Products
              </NavLink>
              {categories.map((cat) => (
                <NavLink
                  key={cat.slug}
                  to={`/category/${cat.slug}`}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                      ? 'text-primary-400 bg-white/10 border border-white/5'
                      : 'text-gray-300 hover:text-white bg-white/5 hover:bg-white/10'
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
