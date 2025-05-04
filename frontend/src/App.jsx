import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Principal from './components/Principal';
import Panel from './components/panel/Panel';
import LoginForm from './components/panel/loginFrom';
import ProductForm from './components/panel/productos/ProductForm';
import EmpleadoForm from './components/panel/empleados/EmpleadoForm';
import EmpleadoList from './components/panel/empleados/empleadolista/EmpleadoList';
import CategoriaForm from './components/panel/categorias/CategoriaForm';
import ProyectoForm from './components/panel/proyecto/ProyectoForm';
import ProyectoList from './components/panel/proyecto/proyectolista/ProyectoList';
import CursorEffect from './components/panel/cursorEfec/CursorEffect';
import ProductoList from './components/panel/productos/productolista/ProductoList';
import Servicio from './components/subComponente/Servicio';
import Carrito from './components/subComponente/Carrito';
import Inicio from './components/subComponente/Inicio';
import Header from './components/Header/Header';
import FormularioImagen from './components/panel/imagen/FormularioImagen';
import ImagenLista from './components/panel/imagen/imagenlista/imagenlista';
import FormularioLogo from './components/panel/logo/FormularioLogo';
import LogoLista from './components/panel/logo/logolista/LogoLista';
import ProtectedRoute from './components/ProtectedRoute'; // importado

function App() {
  return (
    <BrowserRouter>
      <Header />
      <CursorEffect />
      <Routes>
        <Route path='/' element={<Inicio />} />
        <Route path='/login' element={<LoginForm />} />
        <Route path='/servicio' element={<Servicio />} />
        <Route path='/carrito' element={<Carrito />} />
        

        {/* Rutas protegidas */}
        <Route path='/panel' element={
          <ProtectedRoute>
            <Panel />
          </ProtectedRoute>
        } />
        <Route path='/productos' element={
          <ProtectedRoute>
            <ProductForm />
          </ProtectedRoute>
        } />
        <Route path='/imagenes' element={
          <ProtectedRoute>
            <FormularioImagen />
          </ProtectedRoute>
        } />
        <Route path='/imagenenlista' element={
          <ProtectedRoute>
            <ImagenLista />
          </ProtectedRoute>
        } />
        <Route path='/logos' element={
          <ProtectedRoute>
            <FormularioLogo />
          </ProtectedRoute>
        } />
        <Route path='/logoslista' element={
          <ProtectedRoute>
            <LogoLista />
          </ProtectedRoute>
        } />
        <Route path='/empleados' element={
          <ProtectedRoute>
            <EmpleadoForm />
          </ProtectedRoute>
        } />
        <Route path='/empleadoslista' element={
          <ProtectedRoute>
            <EmpleadoList />
          </ProtectedRoute>
        } />
        <Route path='/categorias' element={
          <ProtectedRoute>
            <CategoriaForm />
          </ProtectedRoute>
        } />
        <Route path='/proyectos' element={
          <ProtectedRoute>
            <ProyectoForm />
          </ProtectedRoute>
        } />
        <Route path='/proyectoslista' element={
          <ProtectedRoute>
            <ProyectoList />
          </ProtectedRoute>
        } />
        <Route path='/productoslistas' element={
          <ProtectedRoute>
            <ProductoList />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
