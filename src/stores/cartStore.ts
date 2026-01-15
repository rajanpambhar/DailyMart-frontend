// =====================================================
// CART STORE (Zustand)
// Client-side cart state management
// Replaces PHP $_SESSION['cart']
// =====================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem } from '../types';
import toast from 'react-hot-toast';

interface CartState {
  items: CartItem[];
  
  // Computed
  totalItems: () => number;
  totalPrice: () => number;
  
  // Actions
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItem: (productId: string) => CartItem | undefined;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      totalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      totalPrice: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },

      addItem: (item, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (i) => i.productId === item.productId
          );

          if (existingItem) {
            // Update quantity if item exists
            const newQuantity = existingItem.quantity + quantity;
            
            // Check stock limit
            if (newQuantity > item.stockQuantity) {
              toast.error(`Only ${item.stockQuantity} items available`);
              return {
                items: state.items.map((i) =>
                  i.productId === item.productId
                    ? { ...i, quantity: item.stockQuantity }
                    : i
                ),
              };
            }

            toast.success('Cart updated');
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: newQuantity }
                  : i
              ),
            };
          }

          // Add new item
          toast.success('Added to cart');
          return {
            items: [...state.items, { ...item, quantity }],
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
        toast.success('Item removed from cart');
      },

      updateQuantity: (productId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((item) => item.productId !== productId),
            };
          }

          const item = state.items.find((i) => i.productId === productId);
          if (item && quantity > item.stockQuantity) {
            toast.error(`Only ${item.stockQuantity} items available`);
            return {
              items: state.items.map((i) =>
                i.productId === productId
                  ? { ...i, quantity: item.stockQuantity }
                  : i
              ),
            };
          }

          return {
            items: state.items.map((item) =>
              item.productId === productId ? { ...item, quantity } : item
            ),
          };
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getItem: (productId) => {
        return get().items.find((item) => item.productId === productId);
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCartStore;
