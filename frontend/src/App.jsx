// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Principal from './components/Principal';
import Administrador from './components/AdministradorComponent';
import LoginForm from './components/LoginAdministrador';
import AgregarAdministradorPrimer from './components/primerAdmin';
import useAuthStore from './store/AuthStore';
import useAdministradorStore from './store/AdministradorStore';
import { useState,useEffect } from 'react';

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
        <Route path='/' element={<Principal />} />
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
