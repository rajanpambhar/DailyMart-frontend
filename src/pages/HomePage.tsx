// =====================================================
// HOME PAGE
// Migrated from: PHP index.php
// =====================================================

import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, CreditCard, ChevronLeft, ChevronRight } from 'lucide-react';
import { productsApi } from '../services';
import { Product } from '../types';
import ProductCard from '../components/product/ProductCard';

const categories = [
  { slug: 'vegetables', name: 'Vegetables', image: '/images/spinach.png' },
  { slug: 'fruits', name: 'Fruits', image: '/images/bananas.png' },
  { slug: 'home-essentials', name: 'Home Essentials', image: '/images/detergent.png' },
  { slug: 'mens-clothing', name: "Men's Clothing", image: '/images/mens_tshirt.png' },
  { slug: 'womens-clothing', name: "Women's Clothing", image: '/images/womens_dress.png' },
  { slug: 'electronics', name: 'Electronics', image: '/images/earbuds.png' },
  { slug: 'kids', name: 'Kids', image: '/images/blocks.png' },
  { slug: 'beauty-products', name: 'Beauty Products', image: '/images/face_cream.png' },
];

const HomePage = () => {
  const [bestSelling, setBestSelling] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBestSelling = async () => {
      try {
        const products = await productsApi.getBestSelling(50);
        setBestSelling(products);
      } catch (error) {
        console.error('Failed to fetch best selling products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBestSelling();
  }, []);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer || loading) return;

    const interval = setInterval(() => {
      if (!isPaused) {
        // Check if we've reached the end
        if (Math.ceil(scrollContainer.scrollLeft + scrollContainer.clientWidth) >= scrollContainer.scrollWidth) {
          scrollContainer.scrollLeft = 0; // Loop back to start
        } else {
          scrollContainer.scrollLeft += 1; // Auto-scroll speed
        }
      }
    }, 20); // 50fps approx

    return () => clearInterval(interval);
  }, [loading, isPaused]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 350; // Card width + gap
      const newScrollLeft = direction === 'left' 
        ? scrollContainerRef.current.scrollLeft - scrollAmount 
        : scrollContainerRef.current.scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-dark-800 via-dark-700 to-dark-800 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(51,204,255,0.1),transparent_50%)]" />
        <div className="container py-20 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                <span className="block overflow-hidden whitespace-nowrap animate-typewriter">
                  Shop smarter.
                </span>
                <span className="text-gradient block">Live better.</span>
              </h1>
              <p className="text-lg text-gray-400 mb-8 max-w-lg">
                Fresh groceries, curated fashion and gadgets. Explore categories and find what you need.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/category/vegetables" className="btn-primary group">
                  Buy Fresh Products
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/category/electronics" className="btn-secondary">
                  Top Electronics
                </Link>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-3 mt-8">
                <span className="badge badge-info flex items-center gap-2">
                  <Truck className="w-4 h-4" /> Fast delivery
                </span>
                <span className="badge badge-success flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Quality guaranteed
                </span>
                <span className="badge badge-info flex items-center gap-2">
                  <CreditCard className="w-4 h-4" /> Secure checkout
                </span>
              </div>
            </div>

            {/* Quick Links Card */}
            <div className="glass-card p-6 animate-scale-in">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    to={`/category/${cat.slug}`}
                    className="flex items-center gap-3 p-3 bg-dark-600/50 rounded-lg hover:bg-dark-600 transition-colors group link-underline"
                  >
                    <span className="text-sm font-medium text-gray-300 group-hover:text-white relative z-10">
                      {cat.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Selling Section */}
      <section className="py-16 bg-dark-800">
        <div 
          className="container relative group/carousel"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Best Selling Products
            </h2>
            <Link to="/category/vegetables" className="btn-ghost text-primary-500">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-[60%] -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-dark-700/80 backdrop-blur-sm border border-dark-600 rounded-full flex items-center justify-center text-white opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:bg-primary-500 hover:text-dark-900 shadow-xl"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-[60%] -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-dark-700/80 backdrop-blur-sm border border-dark-600 rounded-full flex items-center justify-center text-white opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:bg-primary-500 hover:text-dark-900 shadow-xl"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {loading ? (
            <div className="flex gap-6 overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="min-w-[280px] skeleton h-96 rounded-xl flex-shrink-0" />
              ))}
            </div>
          ) : (
            <div 
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto no-scrollbar py-4 -mx-4 px-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {bestSelling.map((product) => (
                <div key={product.id} className="min-w-[280px] max-w-[280px] image-zoom rounded-xl flex-shrink-0">
                  <ProductCard product={product} compact />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-12 bg-gradient-to-r from-primary-500/10 via-dark-800 to-secondary-400/10">
        <div className="container">
          <div className="glass-card p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Special Promotion
            </h2>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Enjoy exclusive deals and offers on DailyMart! Get up to 50% off on selected items.
            </p>
            <Link to="/category/mens-clothing" className="btn-primary">
              Shop Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-dark-900">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-primary-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Free Delivery</h3>
              <p className="text-gray-400">Free shipping on orders over ₹500</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-secondary-400/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-secondary-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Secure Payment</h3>
              <p className="text-gray-400">100% secure payment processing</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-primary-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Easy Returns</h3>
              <p className="text-gray-400">30-day return policy on all items</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
