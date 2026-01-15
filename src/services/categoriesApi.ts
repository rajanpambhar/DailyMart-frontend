// =====================================================
// CATEGORIES API SERVICE
// =====================================================

import api from './api';
import { Category } from '../types';

export const categoriesApi = {
  // Get all categories
  getAll: async (includeInactive: boolean = false): Promise<Category[]> => {
    const response = await api.get('/categories', { 
      params: { includeInactive } 
    });
    // Assuming backend returns { success: true, data: [...] }
    return response.data.data;
  },

  // Get single category
  getBySlug: async (slug: string): Promise<Category> => {
    const response = await api.get(`/categories/${slug}`);
    return response.data.data;
  },

  // Create category (Admin)
  create: async (data: Partial<Category>): Promise<Category> => {
    const response = await api.post('/categories', data);
    return response.data.data;
  },

  // Update category (Admin)
  update: async (id: string, data: Partial<Category>): Promise<Category> => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data.data;
  },

  // Delete category (Admin)
  delete: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },

  // Toggle active status (Admin)
  toggleActive: async (id: string): Promise<Category> => {
    const response = await api.patch(`/categories/${id}/toggle-active`);
    return response.data.data;
  },
};

export default categoriesApi;
