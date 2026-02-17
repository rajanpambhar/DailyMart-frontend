// =====================================================
// PAYMENT API SERVICE
// Handles Razorpay payment API calls
// =====================================================

import api from './api';

export interface CreateRazorpayOrderResponse {
    orderId: string;
    amount: number;
    currency: string;
    keyId: string;
}

export interface VerifyPaymentRequest {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    orderId: string;
}

export const paymentApi = {
    // Create Razorpay order
    createRazorpayOrder: async (amount: number, orderId?: string): Promise<CreateRazorpayOrderResponse> => {
        const response = await api.post('/payment/create-order', { amount, orderId });
        return response.data;
    },

    // Verify Razorpay payment
    verifyPayment: async (data: VerifyPaymentRequest) => {
        const response = await api.post('/payment/verify', data);
        return response.data;
    },

    // Get Razorpay key
    getRazorpayKey: async (): Promise<{ keyId: string }> => {
        const response = await api.get('/payment/key');
        return response.data;
    },
};
