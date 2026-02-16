
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useWishlistStore } from '../stores/wishlistStore';
import ProductCard from '../components/product/ProductCard';

const WishlistPage = () => {
    const { items, isLoading, fetchWishlist } = useWishlistStore();

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    if (isLoading && items.length === 0) {
        return (
            <div className="container py-16 text-center">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="container py-16 animate-fade-in">
                <div className="text-center max-w-md mx-auto">
                    <div className="w-24 h-24 bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Heart className="w-12 h-12 text-gray-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-4">Your Wishlist is Empty</h1>
                    <p className="text-gray-400 mb-8">
                        Create your personalized collection of favorites.
                    </p>
                    <Link to="/products" className="btn-primary">
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-8 animate-fade-in">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">My Wishlist</h1>
                <p className="text-gray-400">{items.length} products in your wishlist</p>
            </div>

            {/* Products Grid - Matching CategoryPage */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                {items.map((product, i) => (
                    <div
                        key={product.id}
                        className="animate-slide-up"
                        style={{ animationDelay: `${i * 50}ms` }}
                    >
                        <div className="image-zoom rounded-xl h-full">
                            <ProductCard product={product} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WishlistPage;
