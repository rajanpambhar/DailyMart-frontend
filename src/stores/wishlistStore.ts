
import { create } from 'zustand';
import { Product } from '../types';
import { wishlistApi } from '../services';
import toast from 'react-hot-toast';

interface WishlistState {
    items: Product[];
    isLoading: boolean;

    // Actions
    fetchWishlist: () => Promise<void>;
    addToWishlist: (product: Product) => Promise<void>;
    removeFromWishlist: (productId: string) => Promise<void>;
    isInWishlist: (productId: string) => boolean;
    clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
    items: [],
    isLoading: false,

    fetchWishlist: async () => {
        set({ isLoading: true });
        try {
            const items = await wishlistApi.getWishlist();
            set({ items });
        } catch (error) {
            console.error('Failed to fetch wishlist', error);
            // We don't toast here to avoid spamming on page load
        } finally {
            set({ isLoading: false });
        }
    },

    addToWishlist: async (product) => {
        // Optimistic update
        const currentItems = get().items;

        // Check if already in wishlist
        if (get().isInWishlist(product.id)) {
            toast.error('Product already in wishlist');
            return;
        }

        set({ items: [product, ...currentItems] });
        toast.success('Added to wishlist');

        try {
            await wishlistApi.addToWishlist(product.id);
        } catch (error: any) {
            // Revert on failure
            set({ items: currentItems });
            const status = error.response?.status;
            if (status === 404) {
                toast.error('Wishlist feature not available yet. Please restart backend.');
            } else {
                toast.error(error.response?.data?.message || 'Failed to add to wishlist');
            }
            console.error(error);
        }
    },

    removeFromWishlist: async (productId) => {
        // Optimistic update
        const currentItems = get().items;
        set({ items: currentItems.filter(item => item.id !== productId) });
        toast.success('Removed from wishlist');

        try {
            await wishlistApi.removeFromWishlist(productId);
        } catch (error: any) {
            // Revert on failure
            set({ items: currentItems });
            const status = error.response?.status;
            if (status === 404) {
                toast.error('Feature not ready: Please restart backend server');
            } else {
                toast.error(error.response?.data?.message || 'Failed to remove from wishlist');
            }
            console.error(error);
        }
    },

    isInWishlist: (productId) => {
        return get().items.some(item => item.id === productId);
    },

    clearWishlist: () => {
        set({ items: [] });
    }
}));

export default useWishlistStore;
