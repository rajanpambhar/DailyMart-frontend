// =====================================================
// ALL PRODUCTS PAGE
// New page for displaying all products with advanced filtering
// =====================================================

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Filter, X, Search, ChevronDown, SlidersHorizontal, 
  ArrowLeft, ArrowRight 
} from 'lucide-react';
import { productsApi, categoriesApi } from '../services';
import { Product, Category, Pagination } from '../types';
import ProductCard from '../components/product/ProductCard';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A to Z' },
];

const AllProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // UI State
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Filter State
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    search: searchParams.get('search') || '',
    sortBy: searchParams.get('sortBy') || 'newest',
    page: Number(searchParams.get('page')) || 1,
  });

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoriesApi.getAll(false); // Only active categories
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      // Parse sort option
      let sortField = 'createdAt';
      let sortOrder: 'asc' | 'desc' = 'desc';

      if (filters.sortBy === 'price_asc') {
        sortField = 'price';
        sortOrder = 'asc';
      } else if (filters.sortBy === 'price_desc') {
        sortField = 'price';
        sortOrder = 'desc';
      } else if (filters.sortBy === 'name_asc') {
        sortField = 'name';
        sortOrder = 'asc';
      }

      // Prepare query params
      const params: any = {
        page: filters.page,
        limit: 15, // Items per page
        sortBy: sortField,
        sortOrder,
        isActive: true,
      };

      if (filters.category) params.category = filters.category;
      if (filters.minPrice) params.minPrice = Number(filters.minPrice);
      if (filters.maxPrice) params.maxPrice = Number(filters.maxPrice);
      if (filters.search) params.search = filters.search;

      const response = await productsApi.getProducts(params);
      
      if (response && response.success) {
        setProducts(response.data);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProducts([]); // Clear on error
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
    
    // Update URL params
    const params: any = {};
    if (filters.category) params.category = filters.category;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.search) params.search = filters.search;
    if (filters.sortBy !== 'newest') params.sortBy = filters.sortBy;
    if (filters.page > 1) params.page = filters.page.toString();
    
    setSearchParams(params);
  }, [filters, fetchProducts, setSearchParams]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      if (key !== 'page') newFilters.page = 1;
      return newFilters;
    });
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      search: '',
      sortBy: 'newest',
      page: 1,
    });
  };

  return (
    <div className="min-h-screen bg-transparent pt-8 pb-16 relative">
      {/* Ambient Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[10%] right-[10%] w-[40%] h-[40%] bg-primary-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '7s' }} />
        <div className="absolute bottom-[10%] left-[5%] w-[40%] h-[40%] bg-secondary-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '8s', animationDelay: '1s' }} />
      </div>

      <div className="container">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">All Products</h1>
            <p className="text-gray-300 font-light">
              Explore our wide range of premium products
            </p>
          </div>
          
          {/* Mobile Filter Button */}
          <button 
            onClick={() => setShowMobileFilters(true)}
            className="md:hidden w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl text-white font-medium active:bg-white/10"
          >
            <Filter className="w-5 h-5" />
            Filters & Sort
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters - Desktop */}
          <aside className={`
            fixed inset-0 z-40 bg-dark-900/95 backdrop-blur-2xl p-6 overflow-y-auto w-full max-w-[300px] transition-transform duration-300 ease-in-out lg:static lg:transform-none lg:w-72 lg:p-0 lg:bg-transparent lg:backdrop-blur-none lg:overflow-visible lg:block
            ${showMobileFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
            <div className="lg:sticky lg:top-24 space-y-6">
              
              {/* Mobile Header */}
              <div className="flex items-center justify-between lg:hidden mb-6">
                <h2 className="text-xl font-bold text-white">Filters</h2>
                <button onClick={() => setShowMobileFilters(false)} className="p-2 text-gray-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Search */}
              <div className="glass-card p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Search className="w-4 h-4 text-primary-400" />
                  Search
                </h3>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all"
                />
              </div>

              {/* Categories */}
              <div className="glass-card p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-primary-400" />
                  Categories
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                  <label className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-white/5 transition-colors">
                    <input
                      type="radio"
                      name="category"
                      checked={filters.category === ''}
                      onChange={() => handleFilterChange('category', '')}
                      className="w-4 h-4 border-white/20 text-primary-500 focus:ring-primary-500 bg-black/40"
                    />
                    <span className={`text-sm transition-colors ${filters.category === '' ? 'text-white font-medium' : 'text-gray-400 group-hover:text-gray-200'}`}>
                      All Categories
                    </span>
                  </label>
                  
                  {loadingCategories ? (
                    <div className="space-y-2">
                       {[1, 2, 3].map(i => <div key={i} className="h-8 bg-white/5 rounded-lg animate-pulse" />)}
                    </div>
                  ) : (
                    categories.map(cat => (
                      <label key={cat.id} className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-white/5 transition-colors">
                        <input
                          type="radio"
                          name="category"
                          value={cat.slug}
                          checked={filters.category === cat.slug}
                          onChange={() => handleFilterChange('category', cat.slug)}
                          className="w-4 h-4 border-white/20 text-primary-500 focus:ring-primary-500 bg-black/40"
                        />
                        <span className={`text-sm transition-colors ${filters.category === cat.slug ? 'text-white font-medium' : 'text-gray-400 group-hover:text-gray-200'}`}>
                          {cat.name}
                        </span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              {/* Price Range */}
              <div className="glass-card p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
                <h3 className="text-white font-semibold mb-4">Price Range</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-2.5 text-gray-400 text-sm">$</span>
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-xl pl-6 pr-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all no-spinner"
                    />
                  </div>
                  <span className="text-gray-400">-</span>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-2.5 text-gray-400 text-sm">$</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-xl pl-6 pr-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all no-spinner"
                    />
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              {(filters.category || filters.minPrice || filters.maxPrice || filters.search) && (
                <button
                  onClick={clearFilters}
                  className="w-full py-3 text-sm text-red-300 hover:text-white hover:bg-red-500/20 rounded-xl transition-all border border-dashed border-red-500/30 font-medium"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </aside>

          {/* Backdrop for mobile */}
          {showMobileFilters && (
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
              onClick={() => setShowMobileFilters(false)}
            />
          )}

          {/* Main Content */}
          <main className="flex-1">
            
            {/* Toolbar */}
            <div className="glass-card p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 mb-6 flex flex-wrap items-center justify-between gap-4">
              <p className="text-gray-400 text-sm">
                Showing <span className="text-white font-medium">{pagination?.total || products.length}</span> results
              </p>
              
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400 hidden sm:inline">Sort by:</span>
                <div className="relative group">
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="appearance-none bg-black/20 border border-white/10 text-white text-sm rounded-lg px-4 py-2 pr-8 focus:outline-none focus:border-primary-500/50 hover:bg-white/5 cursor-pointer transition-all"
                  >
                    {SORT_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value} className="bg-dark-800 text-white">{opt.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none group-hover:text-primary-400 transition-colors" />
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="bg-white/5 rounded-2xl h-[340px] animate-pulse border border-white/5" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {products.map((product, i) => (
                  <div 
                    key={product.id} 
                    className="animate-slide-up"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="image-zoom rounded-2xl h-full shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all duration-300">
                      <ProductCard product={product} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10 border-dashed backdrop-blur-sm">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4 border border-white/10">
                  <Search className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No products found</h3>
                <p className="text-gray-400 max-w-sm mx-auto mb-6">
                  We couldn't find any products matching your current filters. Try adjusting your search or clearing filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-primary-600/90 text-white font-bold rounded-xl hover:bg-primary-500 hover:scale-105 transition-all shadow-lg hover:shadow-primary-500/30"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center mt-12 gap-2">
                <button
                  onClick={() => handleFilterChange('page', Math.max(1, filters.page - 1))}
                  disabled={filters.page === 1}
                  className="p-2 rounded-xl bg-white/5 border border-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors backdrop-blur-sm"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                
                {[...Array(Math.min(5, pagination.totalPages))].map((_, idx) => {
                  let pageNum = idx + 1;
                  if (pagination.totalPages > 5 && filters.page > 3) {
                     const start = Math.min(pagination.totalPages - 4, filters.page - 2);
                     pageNum = start + idx;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handleFilterChange('page', pageNum)}
                      className={`w-10 h-10 rounded-xl font-medium transition-all duration-300 ${
                        filters.page === pageNum
                          ? 'bg-primary-600 text-white shadow-[0_0_15px_rgba(51,204,255,0.4)] border border-primary-500/50'
                          : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white hover:border-white/20'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => handleFilterChange('page', Math.min(pagination.totalPages, filters.page + 1))}
                  disabled={filters.page === pagination.totalPages}
                  className="p-2 rounded-xl bg-white/5 border border-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors backdrop-blur-sm"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AllProductsPage;
