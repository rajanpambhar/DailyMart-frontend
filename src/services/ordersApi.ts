// =====================================================
// ORDERS API SERVICE
// =====================================================

import api from './api';
import { Order, OrdersResponse, CreateOrderData, OrderQueryParams } from '../types';

export const ordersApi = {
  // Create order (checkout)
  createOrder: async (data: CreateOrderData): Promise<Order> => {
    const response = await api.post('/orders', data);
    return response.data.data;
  },

  // Get all orders (Admin)
  getOrders: async (params?: OrderQueryParams): Promise<OrdersResponse> => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  // Get user's orders
  getMyOrders: async (): Promise<Order[]> => {
    const response = await api.get('/orders/my-orders');
    return response.data.data;
  },

  // Get order by ID
  getOrder: async (id: string): Promise<Order> => {
    const response = await api.get(`/orders/${id}`);
    return response.data.data;
  },

  // Get order statistics (Admin)
  getStatistics: async () => {
    const response = await api.get('/orders/statistics');
    return response.data.data;
  },

  // Update payment status (Admin)
  updatePaymentStatus: async (id: string, status: string): Promise<Order> => {
    const response = await api.patch(`/orders/${id}/payment-status`, {
      paymentStatus: status,
    });
    return response.data.data;
  },

  // Update delivery status (Admin)
  updateDeliveryStatus: async (id: string, status: string): Promise<Order> => {
    const response = await api.patch(`/orders/${id}/delivery-status`, {
      deliveryStatus: status,
    });
    return response.data.data;
  },

  // Cancel order
  cancelOrder: async (id: string): Promise<void> => {
    await api.post(`/orders/${id}/cancel`);
  },
};

export default ordersApi;
