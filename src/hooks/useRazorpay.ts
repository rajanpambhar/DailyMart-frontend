// =====================================================
// USE RAZORPAY HOOK
// Custom hook for Razorpay payment integration
// =====================================================

import { useState, useEffect } from 'react';
import { paymentApi } from '../services';
import toast from 'react-hot-toast';

// Razorpay types
interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    handler: (response: RazorpayResponse) => void;
    prefill?: {
        name?: string;
        email?: string;
        contact?: string;
    };
    theme?: {
        color?: string;
    };
    modal?: {
        ondismiss?: () => void;
    };
}

interface RazorpayResponse {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

declare global {
    interface Window {
        Razorpay: any;
    }
}

export const useRazorpay = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        // Load Razorpay script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => setIsLoaded(true);
        script.onerror = () => {
            toast.error('Failed to load Razorpay. Please refresh the page.');
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const initiatePayment = async (
        amount: number,
        orderId: string,
        userDetails: {
            name: string;
            email?: string;
            phone: string;
        },
        onSuccess: (paymentData: any) => void,
        onFailure?: () => void,
    ) => {
        if (!isLoaded) {
            toast.error('Payment system is loading. Please wait...');
            return;
        }

        setIsProcessing(true);

        try {
            // Create Razorpay order
            const razorpayOrder = await paymentApi.createRazorpayOrder(amount, orderId);

            const options: RazorpayOptions = {
                key: razorpayOrder.keyId,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                name: 'DailyMart',
                description: `Order #${orderId}`,
                order_id: razorpayOrder.orderId,
                handler: async (response: RazorpayResponse) => {
                    try {
                        // Verify payment on backend
                        const verificationResult = await paymentApi.verifyPayment({
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                            orderId,
                        });

                        toast.success('Payment successful!');
                        onSuccess(verificationResult);
                    } catch (error: any) {
                        toast.error('Payment verification failed. Please contact support.');
                        onFailure?.();
                    } finally {
                        setIsProcessing(false);
                    }
                },
                prefill: {
                    name: userDetails.name,
                    email: userDetails.email,
                    contact: userDetails.phone,
                },
                theme: {
                    color: '#10b981', // Primary green color
                },
                modal: {
                    ondismiss: () => {
                        setIsProcessing(false);
                        toast.error('Payment cancelled');
                        onFailure?.();
                    },
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error: any) {
            toast.error('Failed to initiate payment. Please try again.');
            setIsProcessing(false);
            onFailure?.();
        }
    };

    return {
        isLoaded,
        isProcessing,
        initiatePayment,
    };
};
