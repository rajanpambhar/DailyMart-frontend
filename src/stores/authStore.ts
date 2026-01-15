// =====================================================
// AUTH STORE (Zustand)
// Global authentication state management
// Replaces PHP $_SESSION
// =====================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, LoginCredentials, RegisterCredentials } from '../types';
import { authApi } from '../services';
import { setAccessToken, getAccessToken } from '../services/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isAdmin: false,

      login: async (credentials) => {
        try {
          const { user } = await authApi.login(credentials);
          set({
            user,
            isAuthenticated: true,
            isAdmin: user.role === 'ADMIN',
            isLoading: false,
          });
        } catch (error) {
          set({ user: null, isAuthenticated: false, isAdmin: false });
          throw error;
        }
      },

      register: async (credentials) => {
        try {
          const { user } = await authApi.register(credentials);
          set({
            user,
            isAuthenticated: true,
            isAdmin: user.role === 'ADMIN',
            isLoading: false,
          });
        } catch (error) {
          set({ user: null, isAuthenticated: false, isAdmin: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authApi.logout();
        } finally {
          setAccessToken(null);
          set({
            user: null,
            isAuthenticated: false,
            isAdmin: false,
            isLoading: false,
          });
        }
      },

      checkAuth: async () => {
        const token = getAccessToken();
        if (!token) {
          set({ isLoading: false, isAuthenticated: false });
          return;
        }

        try {
          const user = await authApi.getCurrentUser();
          set({
            user,
            isAuthenticated: true,
            isAdmin: user.role === 'ADMIN',
            isLoading: false,
          });
        } catch (error) {
          setAccessToken(null);
          set({
            user: null,
            isAuthenticated: false,
            isAdmin: false,
            isLoading: false,
          });
        }
      },

      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
          isAdmin: user?.role === 'ADMIN',
        });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
      }),
    }
  )
);

export default useAuthStore;
