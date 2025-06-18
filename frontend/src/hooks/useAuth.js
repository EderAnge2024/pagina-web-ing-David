// src/hooks/useAuth.js
import { useEffect } from 'react';
import useAuthStore from '../store/AuthStore';

export const useAuth = () => {
  const { 
    user, 
    token, 
    isAuthenticated, 
    login, 
    logout, 
    checkAuthStatus 
  } = useAuthStore();

  // Verificar el estado de autenticación al montar el componente
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Verificar periódicamente el estado de autenticación
  useEffect(() => {
    const interval = setInterval(() => {
      checkAuthStatus();
    }, 5 * 60 * 1000); // Verificar cada 5 minutos

    return () => clearInterval(interval);
  }, [checkAuthStatus]);

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    checkAuthStatus,
  };
};