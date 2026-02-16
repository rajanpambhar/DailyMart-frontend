
import api from './api';

export interface Review {
    id: string;
    userId: string;
    productId: string;
    rating: number;
    comment?: string;
    createdAt: string;
    user: {
        fullname: string;
    };
}

export const getReviews = async (productId: string): Promise<Review[]> => {
    const response = await api.get(`/reviews/${productId}`);
    return response.data;
};

export const createReview = async (productId: string, rating: number, comment?: string) => {
    const response = await api.post(`/reviews/${productId}`, { rating, comment });
    return response.data;
};

export const deleteReview = async (reviewId: string) => {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
};

export default {
    getReviews,
    createReview,
    deleteReview,
};
