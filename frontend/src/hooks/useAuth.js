// src/hooks/useAuth.js
import { useEffect, useCallback } from 'react';
import useAuthStore from '../store/AuthStore';
import useImagenStore from '../store/ImagenStore';

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
    }, 10 * 60 * 1000); // Verificar cada 5 minutos

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

// Hook personalizado para sincronización del logo principal
export const useLogoSync = () => {
  const { fetchImagen, getLogoPrincipal } = useImagenStore();

  // Función para forzar actualización del logo
  const forceLogoUpdate = useCallback(async () => {
    try {
      await fetchImagen();
      console.log('🔄 Logo actualizado desde useLogoSync');
    } catch (error) {
      console.error('❌ Error actualizando logo:', error);
    }
  }, [fetchImagen]);

  // Escuchar eventos de cambio de logo
  useEffect(() => {
    const handleLogoChange = async (event) => {
      console.log('🎯 Evento logoChanged recibido en useLogoSync:', event.detail);
      
      try {
        // Esperar un momento para asegurar la actualización en el servidor
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Refrescar datos desde el servidor
        await fetchImagen();
        
        console.log('✅ Logo actualizado después del evento en useLogoSync');
        
      } catch (error) {
        console.error('❌ Error actualizando logo después del evento:', error);
      }
    };

    window.addEventListener('logoChanged', handleLogoChange);
    
    return () => {
      window.removeEventListener('logoChanged', handleLogoChange);
    };
  }, [fetchImagen]);

  return {
    forceLogoUpdate,
    getLogoPrincipal
  };
};