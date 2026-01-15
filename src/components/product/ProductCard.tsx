// =====================================================
// PRODUCT CARD COMPONENT
// Reusable product display card with add to cart
// =====================================================

import { useState } from 'react';
import { ShoppingCart, Plus, Minus, Loader2 } from 'lucide-react';
import { Product } from '../../types';
import { useCartStore } from '../../stores/cartStore';
import { useAuthStore } from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

const ProductCard = ({ product, compact = false }: ProductCardProps) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { addItem, getItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const cartItem = getItem(product.id);
  const inCart = !!cartItem;
  const isOutOfStock = product.stockQuantity <= 0;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setIsAdding(true);
    
    // Simulate a brief loading state
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

  if (compact) {
    return (
      <div className="product-card group">
        <div className="relative aspect-square mb-3 overflow-hidden rounded-lg bg-dark-600">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <ShoppingCart className="w-12 h-12" />
            </div>
          )}
          {product.isBestSelling && (
            <span className="absolute top-2 left-2 px-2 py-1 bg-secondary-400 text-dark-900 text-xs font-bold rounded">
              Best Seller
            </span>
          )}
        </div>
        <h3 className="font-medium text-white text-sm mb-1 line-clamp-1">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mb-3">
          <span className="price-tag text-base">₹{product.price.toFixed(0)}</span>
          {(product.slashedPrice || 0) > 0 && (
            <span className="price-slashed text-xs">₹{product.slashedPrice?.toFixed(0)}</span>
          )}
        </div>
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAdding}
          className="w-full py-2 px-3 bg-primary-500/10 text-primary-500 text-sm font-medium rounded-lg hover:bg-primary-500 hover:text-dark-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isOutOfStock ? 'Out of Stock' : inCart ? 'Add More' : 'Add'}
        </button>
      </div>
    );
  }

  return (
    <div className="product-card">
      <div className="relative aspect-square mb-4 overflow-hidden rounded-xl bg-dark-600">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <ShoppingCart className="w-16 h-16" />
          </div>
        )}
        {product.isBestSelling && (
          <span className="absolute top-3 left-3 px-3 py-1 bg-secondary-400 text-dark-900 text-sm font-bold rounded-lg">
            Best Seller
          </span>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-white text-lg mb-1">{product.name}</h3>
          {product.description && (
            <p className="text-gray-400 text-sm line-clamp-2">{product.description}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="price-tag">₹{product.price.toFixed(2)}</span>
          {(product.slashedPrice || 0) > 0 && (
            <span className="price-slashed">₹{product.slashedPrice?.toFixed(2)}</span>
          )}
        </div>

        {!isOutOfStock && (
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-dark-600 rounded-lg h-10">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                type="button"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 text-center text-white font-medium text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                className="w-8 h-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                type="button"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="flex-1 h-10 btn-primary px-3 text-sm font-medium"
            >
              {isAdding ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add</span>
                </>
              )}
            </button>
          </div>
        )}

        {isOutOfStock && (
          <button disabled className="w-full py-3 bg-dark-600 text-gray-500 font-medium rounded-lg cursor-not-allowed">
            Out of Stock
          </button>
        )}

        <p className="text-xs text-gray-500">
          {isOutOfStock ? 'Currently unavailable' : `${product.stockQuantity} in stock`}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
