// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Principal from './components/Principal';
import Administrador from './components/AdministradorComponent';
import LoginForm from './components/LoginAdministrador';
import ProtectedRoute from './components/Administrador/rutaProtegida/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Principal />} />
        <Route path='/loginFrom' element={<LoginForm />} />
        
        {/* Ruta protegida */}
        <Route element={<ProtectedRoute />}>
          <Route path='/administrador' element={<Administrador />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;