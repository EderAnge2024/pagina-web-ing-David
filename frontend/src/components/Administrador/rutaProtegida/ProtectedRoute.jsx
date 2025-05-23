// src/components/Administrador/rutaProtegida/ProtectedRoute.jsx
import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../../store/AuthStore';
 
const ProtectedRoute = () => { 
  const { isAuthenticated, loading, initAuth } = useAuthStore();
  
  useEffect(() => {
    // Verificar si hay un token al montar el componente
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      // Si existe un token en localStorage pero no está en el estado,
      // actualizamos el estado de autenticación
      if (!isAuthenticated) {
        const user = JSON.parse(userData);
        useAuthStore.setState({ isAuthenticated: true, user });
      }
    }
    
    // Marcar la carga como completa
    initAuth();
  }, [isAuthenticated, initAuth]);
  
  // Si está cargando, muestra un indicador de carga
  if (loading) {
    return <div>Cargando...</div>;
  }
  
  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/loginFrom" replace />;
  }
  
  // Si está autenticado, mostrar el contenido protegido
  return <Outlet />;
};

export default ProtectedRoute;