
import api from './api';
import { Product } from '../types';

export const addToWishlist = async (productId: string) => {
    const response = await api.post(`/wishlist/${productId}`);
    return response.data;
};

export const removeFromWishlist = async (productId: string) => {
    const response = await api.delete(`/wishlist/${productId}`);
    return response.data;
};

export const getWishlist = async (): Promise<Product[]> => {
    const response = await api.get('/wishlist');
    return response.data;
};

export default {
    addToWishlist,
    removeFromWishlist,
    getWishlist,
};
