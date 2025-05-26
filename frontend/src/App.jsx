// src/App.js
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Principal from './components/Principal';
import Administrador from './components/Administrador';
import LoginForm from './components/LoginAdministrador';
import useAuthStore from './store/AuthStore';
import useAdministradorStore from './store/AdministradorStore';
import AgregarAdministradorPrimer from './components/PrimerAdmin';

function App() {
  const { isAuthenticated } = useAuthStore();
  const { fetchAdministrador, administradors } = useAdministradorStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        await fetchAdministrador();
      } catch (error) {
        console.error('Error al verificar administradores:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [fetchAdministrador]);

  if (loading) {
    return <div>Cargando aplicación...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta raíz dinámica */}
        <Route 
          path="/" 
          element={
            administradors.length === 0 ? (
              <AgregarAdministradorPrimer />
            ) : (
              <Principal />
            )
          } 
        />
        
        <Route path="/loginFrom" element={<LoginForm />} />
        
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