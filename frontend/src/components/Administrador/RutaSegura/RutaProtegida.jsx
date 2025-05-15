import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../../store/AuthStore';

const ProtectedRoute = () => {
  const { isAuthenticated, loading, initAuth } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');

    if (token && userData) {
      const user = JSON.parse(userData);
      useAuthStore.setState({ isAuthenticated: true, user });
    }

    initAuth();
  }, []);

  if (loading) return <div>Cargando...</div>;

  if (!isAuthenticated) return <Navigate to="/loginFrom" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
