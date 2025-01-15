import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import authApi from '../API/auth-api';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loading: false,

      login: async (googleResponse) => {
        try {
          set({ loading: true });
          const response = await authApi.loginGoogle(googleResponse);
          localStorage.setItem('token', response.token);
          set({ 
            user: response.user,
            isAuthenticated: true,
            loading: false 
          });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, isAuthenticated: false });
      },

      checkAuth: async () => {
        try {
          const user = await authApi.checkAuth();
          set({ 
            user,
            isAuthenticated: !!user
          });
        } catch (error) {
          set({ 
            user: null,
            isAuthenticated: false
          });
        }
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

export default useAuthStore;