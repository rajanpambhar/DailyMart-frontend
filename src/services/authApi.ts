// =====================================================
// AUTH API SERVICE
// =====================================================

import api, { setAccessToken } from './api';
import { LoginCredentials, RegisterCredentials, User, AuthResponse } from '../types';

export const authApi = {
  // Login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    const { accessToken, user } = response.data.data;
    setAccessToken(accessToken);
    return { user, accessToken };
  },

  // Register
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', credentials);
    const { accessToken, user } = response.data.data;
    setAccessToken(accessToken);
    return { user, accessToken };
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } finally {
      setAccessToken(null);
    }
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data.data;
  },

  // Refresh token
  refreshToken: async (): Promise<string> => {
    const response = await api.post('/auth/refresh');
    const { accessToken } = response.data.data;
    setAccessToken(accessToken);
    return accessToken;
  },
};

export default authApi;
