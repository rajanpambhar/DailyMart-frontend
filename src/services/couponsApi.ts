import { api } from './api';

export interface Coupon {
    id: string;
    code: string;
    discount: number;
    type: 'PERCENTAGE' | 'FIXED';
    expiry: string;
    isActive: boolean;
}

const couponsApi = {
    applyCoupon: async (code: string): Promise<Coupon> => {
        const response = await api.post('/coupons/apply', { code });
        return response.data;
    },

    getAll: async (): Promise<Coupon[]> => {
        const response = await api.get('/coupons');
        return response.data;
    },

    getActive: async (): Promise<Coupon[]> => {
        const response = await api.get('/coupons/active');
        return response.data;
    },

    create: async (data: any): Promise<Coupon> => {
        const response = await api.post('/coupons', data);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/coupons/${id}`);
    },
};

export default couponsApi;
