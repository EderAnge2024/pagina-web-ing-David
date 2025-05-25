import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      loading: true,

      initAuth: () => {
        set({ loading: false });
      },

      login: (userData, token) => {
        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(userData));
        set({ isAuthenticated: true, user: userData });
      },

      logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        set({ isAuthenticated: false, user: null });
      },
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
    }
  )
);

export default useAuthStore;
