// =====================================================
// PRODUCTS API SERVICE
// =====================================================

import api from './api';
import { Product, ProductsResponse, ProductQueryParams } from '../types';

export const productsApi = {
  // Get all products with filtering
  getProducts: async (params?: ProductQueryParams): Promise<ProductsResponse> => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  // Get best selling products
  getBestSelling: async (limit?: number): Promise<Product[]> => {
    const response = await api.get('/products/best-selling', {
      params: { limit },
    });
    return response.data.data;
  },

  // Get products by category
  getByCategory: async (slug: string): Promise<Product[]> => {
    const response = await api.get(`/products/category/${slug}`);
    return response.data.data;
  },

  // Get single product
  getProduct: async (id: string): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data.data;
  },

  // Create new product (Admin)
  createProduct: async (data: FormData | Partial<Product>): Promise<Product> => {
    const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    const response = await api.post('/products', data, config);
    return response.data.data;
  },

  // Update product (Admin)
  updateProduct: async (id: string, data: FormData | Partial<Product>): Promise<Product> => {
    const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    const response = await api.put(`/products/${id}`, data, config);
    return response.data.data;
  },

  // Delete product (Admin)
  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },

  // Toggle best selling (Admin)
  toggleBestSelling: async (id: string): Promise<Product> => {
    const response = await api.patch(`/products/${id}/toggle-best-selling`);
    return response.data.data;
  },
};

export default productsApi;
