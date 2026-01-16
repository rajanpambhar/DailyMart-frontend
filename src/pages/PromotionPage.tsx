import { useState, useEffect } from 'react';
import { Tag, ArrowRight, Zap, Gift, ShieldCheck, Truck, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';
import { Product } from '../types';

// Mock Data for Promotion Page
const PROMOTION_PRODUCTS: Product[] = [
  {
    id: 'promo-1',
    name: 'Premium Wireless Headphones',
    description: 'Experience crystal clear sound with active noise cancellation.',
    price: 24999,
    slashedPrice: 34999,
    categorySlug: 'electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    stockQuantity: 15,
    isActive: true,
    isBestSelling: true,
  },
  {
    id: 'promo-2',
    name: 'Smart Fitness Watch',
    description: 'Track your health and fitness goals with precision.',
    price: 4999,
    slashedPrice: 8999,
    categorySlug: 'electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    stockQuantity: 50,
    isActive: true,
    isBestSelling: true,
  },
  {
    id: 'promo-3',
    name: 'Organic Skincare Set',
    description: 'Complete daily routine for glowing, healthy skin.',
    price: 1299,
    slashedPrice: 2499,
    categorySlug: 'beauty-products',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80',
    stockQuantity: 25,
    isActive: true,
    isBestSelling: false,
  },
  {
    id: 'promo-4',
    name: 'Designer Leather Bag',
    description: 'Handcrafted premium leather bag for everyday elegance.',
    price: 8999,
    slashedPrice: 15999,
    categorySlug: 'womens-clothing',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80',
    stockQuantity: 5,
    isActive: true,
    isBestSelling: true,
  }
];

const PromotionPage = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 24,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev; // Timer finished
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-dark-800 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-secondary-600/20 z-0" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20 pb-24 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/20 text-primary-400 border border-primary-500/30 mb-6 backdrop-blur-sm animate-fade-in-up">
                <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-semibold tracking-wide uppercase">Limited Time Offer</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400 animate-fade-in-up delay-100">
                Special Promotion
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 animate-fade-in-up delay-200">
                Enjoy exclusive deals and offers on DailyMart! Get up to 50% off on selected items.
            </p>

            {/* Countdown Timer */}
            <div className="flex justify-center gap-4 mb-12 animate-fade-in-up delay-300">
                <div className="flex flex-col items-center p-4 bg-dark-700/50 backdrop-blur-md border border-dark-600 rounded-2xl min-w-[100px]">
                    <span className="text-4xl font-bold font-mono text-primary-400">{String(timeLeft.hours).padStart(2, '0')}</span>
                    <span className="text-xs text-gray-500 uppercase tracking-widest mt-1">Hours</span>
                </div>
                <div className="text-4xl font-bold pt-2 text-dark-500">:</div>
                <div className="flex flex-col items-center p-4 bg-dark-700/50 backdrop-blur-md border border-dark-600 rounded-2xl min-w-[100px]">
                    <span className="text-4xl font-bold font-mono text-primary-400">{String(timeLeft.minutes).padStart(2, '0')}</span>
                    <span className="text-xs text-gray-500 uppercase tracking-widest mt-1">Mins</span>
                </div>
                <div className="text-4xl font-bold pt-2 text-dark-500">:</div>
                <div className="flex flex-col items-center p-4 bg-dark-700/50 backdrop-blur-md border border-dark-600 rounded-2xl min-w-[100px]">
                    <span className="text-4xl font-bold font-mono text-primary-400">{String(timeLeft.seconds).padStart(2, '0')}</span>
                    <span className="text-xs text-gray-500 uppercase tracking-widest mt-1">Secs</span>
                </div>
            </div>

            <button 
                onClick={() => document.getElementById('flash-sale')?.scrollIntoView({ behavior: 'smooth' })}
                className="group relative px-8 py-4 bg-primary-500 hover:bg-primary-600 text-dark-900 font-bold rounded-full overflow-hidden transition-all duration-300 shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] animate-fade-in-up delay-500"
            >
                <span className="relative z-10 flex items-center gap-2">
                    Shop Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
            </button>
        </div>
      </div>

      {/* Featured Deals Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Deal 1 */}
            <div className="bg-dark-800 p-6 rounded-2xl border border-dark-600 shadow-xl hover:translate-y-[-4px] transition-all duration-300 group">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                    <Truck className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Free Delivery</h3>
                <p className="text-gray-400 text-sm">Free shipping on orders over ₹500</p>
            </div>
            {/* Deal 2 */}
            <div className="bg-dark-800 p-6 rounded-2xl border border-dark-600 shadow-xl hover:translate-y-[-4px] transition-all duration-300 group">
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                    <ShieldCheck className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Secure Payment</h3>
                <p className="text-gray-400 text-sm">100% secure payment processing</p>
            </div>
            {/* Deal 3 */}
            <div className="bg-dark-800 p-6 rounded-2xl border border-dark-600 shadow-xl hover:translate-y-[-4px] transition-all duration-300 group">
                <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                    <Gift className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Easy Returns</h3>
                <p className="text-gray-400 text-sm">30-day return policy on all items</p>
            </div>
        </div>
      </div>

      {/* Flash Sale Grid */}
      <div id="flash-sale" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-dark-900 dark:text-white flex items-center gap-3">
                <Flame className="w-8 h-8 text-orange-500 fill-orange-500 animate-pulse" /> 
                Flash Sale
            </h2>
            <Link to="/products" className="text-primary-600 hover:text-primary-500 font-medium flex items-center gap-1 transition-colors">
                View All <ArrowRight className="w-4 h-4" />
            </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROMOTION_PRODUCTS.map((product) => (
                <div key={product.id} className="transform transition-all hover:scale-[1.02]">
                    <ProductCard product={product} />
                </div>
            ))}
        </div>
      </div>

      {/* Promo Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 p-8 md:p-12">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left">
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Weekend Super Sale
                    </h3>
                    <p className="text-indigo-100 text-lg max-w-xl">
                        Get an extra 20% off on all electronics this weekend. Use code <span className="font-mono font-bold bg-white/20 px-2 py-1 rounded text-white">WEEKEND20</span> at checkout.
                    </p>
                </div>
                <div className="flex-shrink-0">
                    <button className="bg-white text-indigo-600 hover:bg-indigo-50 font-bold py-3 px-8 rounded-xl shadow-lg transition-colors flex items-center gap-2">
                        <Tag className="w-5 h-5" />
                        Grab Deal
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionPage;
