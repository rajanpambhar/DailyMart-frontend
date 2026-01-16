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

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
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
      <div 
        className="product-card group cursor-pointer" 
        onClick={handleCardClick}
      >
        <div className="relative aspect-square mb-2 overflow-hidden rounded-lg bg-dark-600">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain p-1.5 group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <ShoppingCart className="w-10 h-10" />
            </div>
          )}
          {product.isBestSelling && (
            <span className="absolute top-1.5 left-1.5 px-2 py-0.5 bg-secondary-400 text-dark-900 text-[10px] font-bold rounded">
              Best Seller
            </span>
          )}
        </div>
        <h3 className="font-medium text-white text-xs mb-1 line-clamp-1">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mb-2">
          <span className="price-tag text-sm">₹{product.price.toFixed(0)}</span>
          {(product.slashedPrice || 0) > 0 && (
            <span className="price-slashed text-[10px]">₹{product.slashedPrice?.toFixed(0)}</span>
          )}
        </div>
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAdding}
          className="w-full py-1.5 px-3 bg-primary-500/10 text-primary-500 text-xs font-medium rounded-lg hover:bg-primary-500 hover:text-dark-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isOutOfStock ? 'Out of Stock' : inCart ? 'Add More' : 'Add'}
        </button>
      </div>
    );
  }

  return (
    <div 
      className="product-card cursor-pointer" 
      onClick={handleCardClick}
    >
      <div className="relative aspect-square mb-3 overflow-hidden rounded-xl bg-dark-600">
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
          <span className="absolute top-2 left-2 px-2.5 py-1 bg-secondary-400 text-dark-900 text-xs font-bold rounded-lg">
            Best Seller
          </span>
        )}
      </div>

      <div className="space-y-2">
        <div>
          <h3 className="font-semibold text-white text-base mb-1">{product.name}</h3>
          {product.description && (
            <p className="text-gray-400 text-xs line-clamp-2">{product.description}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="price-tag text-lg">₹{product.price.toFixed(2)}</span>
          {(product.slashedPrice || 0) > 0 && (
            <span className="price-slashed text-sm">₹{product.slashedPrice?.toFixed(2)}</span>
          )}
        </div>

        {!isOutOfStock && (
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center bg-dark-600 rounded-lg h-8">
              <button
                onClick={(e) => { e.stopPropagation(); setQuantity(Math.max(1, quantity - 1)); }}
                className="w-7 h-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                type="button"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-6 text-center text-white font-medium text-xs">{quantity}</span>
              <button
                onClick={(e) => { e.stopPropagation(); setQuantity(Math.min(product.stockQuantity, quantity + 1)); }}
                className="w-7 h-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                type="button"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="flex-1 h-8 btn-primary px-3 text-xs font-medium"
            >
              {isAdding ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Add</span>
                </>
              )}
            </button>
          </div>
        )}

        {isOutOfStock && (
          <button disabled className="w-full py-2 bg-dark-600 text-gray-500 text-sm font-medium rounded-lg cursor-not-allowed">
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
