// =====================================================
// PRODUCT PAGE - Single Product View
// =====================================================

import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Plus, Minus, Loader2, Leaf, CheckCircle, Truck, ShieldCheck, Heart } from 'lucide-react';
import { productsApi } from '../services';
import { Product } from '../types';
import { useCartStore } from '../stores/cartStore';
import { useWishlistStore } from '../stores/wishlistStore';
import { useAuthStore } from '../stores/authStore';
import ReviewSection from '../components/product/ReviewSection';

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const inWishlist = product ? isInWishlist(product.id) : false;

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const data = await productsApi.getProduct(id);
        setProduct(data);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!product) return;

    setIsAdding(true);
    setTimeout(() => {
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        stockQuantity: product.stockQuantity,
      }, quantity);
      setQuantity(1);
      setIsAdding(false);
    }, 300);
  };

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!product) return;

    if (inWishlist) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product);
    }
  };

  if (loading) {
    return (
      <div className="container py-16 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Product Not Found</h1>
        <Link to="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stockQuantity <= 0;

  return (
    <div className="container py-8 animate-fade-in">
      {/* Breadcrumb */}
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Link to="/" className="hover:text-primary-500 transition-colors">Home</Link>
          <span>/</span>
          <Link
            to={`/category/${product.categorySlug}`}
            className="hover:text-primary-500 transition-colors"
          >
            {product.category?.name || product.categorySlug}
          </Link>
          <span>/</span>
          <span className="text-white truncate">{product.name}</span>
        </div>

        <Link
          to={`/category/${product.categorySlug}`}
          className="btn-ghost inline-flex text-sm py-2 px-4 bg-dark-600/50 hover:bg-dark-600 border border-dark-500 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {product.category?.name || 'Category'}
        </Link>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Product Image - Constrained & Centered */}
        <div className="lg:col-span-4 glass-card p-6 animate-scale-in max-w-sm mx-auto w-full">
          <div className="aspect-square rounded-xl overflow-hidden image-zoom">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                <ShoppingCart className="w-24 h-24" />
              </div>
            )}
          </div>
        </div>

        {/* Product Info - Reordered Layout */}
        <div className="lg:col-span-8 space-y-8 animate-slide-up">
          {/* 1. Header Section: Title, Price, Status */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                {product.isBestSelling && (
                  <span className="badge badge-success mb-2 inline-block">Best Seller</span>
                )}
                <h1 className="text-4xl font-bold text-white leading-tight">{product.name}</h1>
              </div>
              <div className="text-right">
                {isOutOfStock ? (
                  <span className="badge badge-error">Out of Stock</span>
                ) : (
                  <span className="badge badge-success">{product.stockQuantity} in stock</span>
                )}
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-primary-500">
                ₹{product.price.toFixed(2)}
              </span>
              {(product.slashedPrice || 0) > 0 && (
                <span className="text-2xl text-gray-500 line-through">
                  ₹{product.slashedPrice!.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* 2. Actions Section - Moved Up */}
          {!isOutOfStock && (
            <div className="py-2">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-4">
                  <span className="text-gray-400 text-sm font-medium">Quantity</span>
                  <div className="flex items-center bg-dark-600 rounded-lg h-10 border border-dark-500">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center text-white font-medium text-sm border-x border-dark-500/50">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                      className="w-10 h-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="h-10 w-px bg-dark-600 hidden sm:block"></div>

                {/* Wishlist Button */}
                {isAuthenticated && (
                  <button
                    onClick={handleToggleWishlist}
                    className={`h-10 px-6 rounded-lg transition-all duration-300 flex items-center gap-2 font-semibold text-sm ${inWishlist
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-dark-600 text-gray-300 hover:bg-red-500 hover:text-white'
                      }`}
                    title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
                    {inWishlist ? 'In Wishlist' : 'Wishlist'}
                  </button>
                )}

                <button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="btn-primary flex-1 sm:flex-none glass-shine h-10 px-8 text-sm font-semibold tracking-wide"
                >
                  {isAdding ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* 3. Description Section */}
          <div className="space-y-6 pt-2 border-t border-dark-600">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
              {product.description ? (
                <p className="text-gray-400 leading-relaxed text-sm">{product.description}</p>
              ) : (
                <p className="text-gray-500 italic text-sm">No specific description available for this product.</p>
              )}
            </div>

            <div className="bg-dark-600/50 rounded-xl p-4 border border-dark-500">
              <p className="text-primary-400 font-medium mb-1 flex items-center gap-2 text-sm">
                <Leaf className="w-4 h-4" />
                Freshness Guaranteed
              </p>
              <p className="text-gray-300 text-sm">
                Our products are sourced fresh daily and undergo rigorous quality checks.
                We ensure that this product is of the highest quality, hand-picked for you.
                Experience the difference of premium selection with every order.
              </p>
            </div>
          </div>

          {/* 4. Key Features Grid - Restored */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 border-t border-dark-600">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary-500/10 text-primary-500 shrink-0">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium text-white text-sm">100% Organic Sources</h4>
                <p className="text-xs text-gray-400 mt-0.5">Sourced from certified organic farms.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary-500/10 text-primary-500 shrink-0">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium text-white text-sm">Quality Checked</h4>
                <p className="text-xs text-gray-400 mt-0.5">Verified for quality before dispatch.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary-500/10 text-primary-500 shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium text-white text-sm">Fast Delivery</h4>
                <p className="text-xs text-gray-400 mt-0.5">Same day delivery available in select areas.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary-500/10 text-primary-500 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium text-white text-sm">Secure Packaging</h4>
                <p className="text-xs text-gray-400 mt-0.5">Hygienic and safe packaging guaranteed.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <ReviewSection productId={product.id} />
      </div>
    </div >
  );
};

export default ProductPage;
