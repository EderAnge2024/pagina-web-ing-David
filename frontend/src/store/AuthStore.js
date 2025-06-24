// src/store/AuthStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loginTime: null, // Para rastrear cuándo se inició sesión

      login: (userData, token) => {
        set({ 
          user: userData, 
          token, 
          isAuthenticated: true,
          loginTime: Date.now() // Guardar timestamp del login
        });
      },

      logout: () => {
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false,
          loginTime: null
        });
      },

      // Función para verificar si el token sigue siendo válido
      checkAuthStatus: () => {
        const { token, loginTime } = get();
        if (!token) {
          set({ user: null, token: null, isAuthenticated: false, loginTime: null });
          return false;
        }
        
        // Verificar tiempo de sesión (ejemplo: 24 horas)
        const SESSION_DURATION = 5 * 60 * 1000; // 24 horas en milisegundos
        if (loginTime && Date.now() - loginTime > SESSION_DURATION) {
          set({ user: null, token: null, isAuthenticated: false, loginTime: null });
          return false;
        }
        
        // Verificar token JWT si es aplicable
        try {
          if (token.includes('.')) { // Verificar si es un JWT
            const payload = JSON.parse(atob(token.split('.')[1]));
            const isExpired = payload.exp * 1000 < Date.now();
            
            if (isExpired) {
              set({ user: null, token: null, isAuthenticated: false, loginTime: null });
              return false;
            }
          }
          
          return true;
        } catch (error) {
          // Si hay error al decodificar el token, cerrar sesión
          set({ user: null, token: null, isAuthenticated: false, loginTime: null });
          return false;
        }
      },
    }),
    {
      name: 'auth-storage', // nombre único para el storage
      // Por defecto usa localStorage, pero puedes configurarlo
      // storage: createJSONStorage(() => sessionStorage), // si prefieres sessionStorage
      
      // Opcional: configurar qué campos persistir
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loginTime: state.loginTime,
      }),
      
      // Opcional: función que se ejecuta al hidratar el estado
      onRehydrateStorage: () => (state) => {
        // Verificar el estado de autenticación al cargar
        if (state) {
          state.checkAuthStatus();
        }
      },
    }
  )
);

export default useAuthStore;