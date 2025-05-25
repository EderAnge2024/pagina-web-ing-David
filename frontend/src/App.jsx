// src/App.js
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Principal from './components/Principal';
import Administrador from './components/Administrador';
import LoginForm from './components/LoginAdministrador';
import useAuthStore from './store/AuthStore';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Principal />} />
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