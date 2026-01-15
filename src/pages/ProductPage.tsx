// =====================================================
// PRODUCT PAGE - Single Product View
// =====================================================

import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Plus, Minus, Loader2 } from 'lucide-react';
import { productsApi } from '../services';
import { Product } from '../types';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

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
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link to="/" className="hover:text-primary-500">Home</Link>
        <span>/</span>
        <Link
          to={`/category/${product.categorySlug}`}
          className="hover:text-primary-500"
        >
          {product.category?.name || product.categorySlug}
        </Link>
        <span>/</span>
        <span className="text-white truncate">{product.name}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="glass-card p-8 animate-scale-in">
          <div className="aspect-square bg-dark-600 rounded-xl overflow-hidden image-zoom">
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

        {/* Product Info */}
        <div className="space-y-6 animate-slide-up">
          {product.isBestSelling && (
            <span className="badge badge-success animate-float">Best Seller</span>
          )}
          
          <h1 className="text-3xl font-bold text-white">{product.name}</h1>
          
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary-500">
              ₹{product.price.toFixed(2)}
            </span>
            {(product.slashedPrice || 0) > 0 && (
              <span className="text-xl text-gray-500 line-through">
                ₹{product.slashedPrice!.toFixed(2)}
              </span>
            )}
          </div>

          {product.description && (
            <p className="text-gray-400 leading-relaxed">{product.description}</p>
          )}

          <div className="py-4 border-t border-dark-500">
            <p className="text-sm text-gray-400 mb-2">Stock Status</p>
            {isOutOfStock ? (
              <span className="badge badge-error">Out of Stock</span>
            ) : (
              <span className="badge badge-success">{product.stockQuantity} in stock</span>
            )}
          </div>

          {!isOutOfStock && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-gray-400">Quantity:</span>
                <div className="flex items-center bg-dark-600 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-gray-400 hover:text-white transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="w-12 text-center text-white font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                    className="p-3 text-gray-400 hover:text-white transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="btn-primary w-full lg:w-auto glass-shine"
              >
                {isAdding ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </>
                )}
              </button>
            </div>
          )}

          <Link
            to={`/category/${product.categorySlug}`}
            className="btn-ghost inline-flex"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to {product.category?.name || 'Category'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
