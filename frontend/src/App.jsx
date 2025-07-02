// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Principal from './components/Principal';
import Administrador from './components/AdministradorComponent';
import LoginForm from './components/LoginAdministrador';
import AgregarAdministradorPrimer from './components/primerAdmin';
import useAdministradorStore from './store/AdministradorStore';
import { useAuth } from './hooks/useAuth'; // Importar el hook
import { useState, useEffect } from 'react';
import TerminosCondiciones from './components/subComponente/TerminosCondiciones';

function App() {
  // Usar el hook useAuth en lugar de useAuthStore directamente
  const { isAuthenticated, checkAuthStatus } = useAuth();
  const { fetchAdministrador, administradors } = useAdministradorStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        await fetchAdministrador();
        // El hook useAuth ya maneja checkAuthStatus automáticamente,
        // pero puedes llamarlo explícitamente si necesitas sincronizar
        await checkAuthStatus();
      } catch (error) {
        console.error('Error al verificar administradores:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [fetchAdministrador, checkAuthStatus]);

  if (loading) {
    return <div>Cargando aplicación...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Principal />} />
        {/* Ruta de términos y condiciones */}
        <Route path='/terminos-condiciones' element={<TerminosCondiciones />} />
        {/* Ruta raíz dinámica */}
        <Route 
          path="/loginFrom" 
          element={
            administradors.length === 0 ? (
              <AgregarAdministradorPrimer />
            ) : (
              <LoginForm />
            )
          }  
        />
        
        {/* Ruta protegida */}
        <Route
          path="/administrador"
          element={
            isAuthenticated ? (
              <Administrador />
            ) : (
              <Navigate to="/loginFrom" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;