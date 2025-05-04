// components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from './utils/auth';

const ProtectedRoute = ({ children }) => {
  const auth = isAuthenticated();  // Verifica si el usuario está autenticado
  console.log("¿Usuario autenticado?:", auth);

  if (!auth) {
    return <Navigate to="/login" replace />;  // Redirige si no está autenticado
  }
  return children;  // Si está autenticado, muestra el componente hijo
};

export default ProtectedRoute;
