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
      {/* Ambient Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-primary-400/10 rounded-full blur-[100px] mix-blend-screen animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10">
        <div className="container py-20 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up relative z-10">
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-white to-secondary-400 animate-gradient-x">
                  Shop smarter.
                </span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-white to-secondary-400 animate-gradient-x">
                  Live better.
                </span>
              </h1>
              <p className="text-lg text-gray-300 mb-8 max-w-lg font-light leading-relaxed">
                Everything you need, right at your doorstep. Fresh groceries, latest electronics, and fashion essentials delivered in minutes.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/category/vegetables" className="btn-primary group shadow-[0_0_40px_rgba(51,204,255,0.3)]">
                  Start Shopping
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/category/electronics" className="btn-secondary">
                  Explore Electronics
                </Link>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-4 mt-12">
                <div className="glass-card px-4 py-2 flex items-center gap-3">
                  <div className="p-2 bg-primary-500/20 rounded-lg text-primary-300">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-primary-200 uppercase tracking-wider font-semibold">Delivery</p>
                    <p className="text-sm font-medium">Fast & Free</p>
                  </div>
                </div>
                <div className="glass-card px-4 py-2 flex items-center gap-3">
                  <div className="p-2 bg-secondary-500/20 rounded-lg text-secondary-300">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-secondary-200 uppercase tracking-wider font-semibold">Payment</p>
                    <p className="text-sm font-medium">100% Secure</p>
                   </div>
                </div>
              </div>
            </div>

            {/* Quick Links Card - Floating Glass */}
            <div className="glass-card p-8 animate-scale-in relative z-10 backdrop-blur-2xl bg-white/5 border-white/20">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl pointer-events-none" />
              <h3 className="text-xl font-semibold text-white mb-6 tracking-wide">Popular Categories</h3>
              <div className="grid grid-cols-2 gap-4">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    to={`/category/${cat.slug}`}
                    className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] transition-all duration-300 group"
                  >
                    <span className="text-sm font-medium text-gray-200 group-hover:text-white">
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
      <section className="py-20 relative">
        <div
          className="container relative group/carousel"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Trending Now
              </h2>
              <p className="text-gray-400">Top picked items just for you</p>
            </div>
            <Link to="/products" className="btn-ghost text-white border border-white/10 hover:border-white/30 backdrop-blur-sm">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-[60%] -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full flex items-center justify-center text-white opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:bg-white/20 hover:scale-110 shadow-lg"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-[60%] -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full flex items-center justify-center text-white opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:bg-white/20 hover:scale-110 shadow-lg"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {loading ? (
            <div className="flex gap-6 overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="min-w-[280px] h-96 bg-white/5 rounded-2xl animate-pulse border border-white/5" />
              ))}
            </div>
          ) : (
            <div
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto no-scrollbar py-4 -mx-4 px-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {bestSelling.map((product) => (
                <div key={product.id} className="min-w-[280px] max-w-[280px] flex-shrink-0 transform transition-transform duration-500 hover:scale-105">
                  <ProductCard product={product} compact />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Truck, title: "Global Shipping", desc: "Fast & reliable delivery worldwide" },
              { icon: Shield, title: "Buyer Protection", desc: "Full refund if item not as described" },
              { icon: CreditCard, title: "Secure Payment", desc: "Encrypted & safe transactions" }
            ].map((feature, idx) => (
              <div key={idx} className="glass-card p-8 text-center hover:bg-white/10 transition-colors duration-300 group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <feature.icon className="w-8 h-8 text-white" />
            </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
