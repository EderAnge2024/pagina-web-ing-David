// src/store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({ 
      isAuthenticated: false,
      user: null,
      loading: true,
      
      // Inicializar el estado de autenticación
      initAuth: () => {
        set({ loading: false });
      },
      
      // Función para iniciar sesión
      login: (userData, token) => {
        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(userData));
        set({ isAuthenticated: true, user: userData });
      },
      
      // Función para cerrar sesión
      logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        set({ isAuthenticated: false, user: null });
      },
    }),
    {
      name: 'auth-storage', // nombre del almacenamiento
      getStorage: () => localStorage, // usar localStorage
    }
  )
);

export default useAuthStore;