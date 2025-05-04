import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/hearder/hearder';
import Home from './components/Home/Home';
import Panel from './components/panel/Panel';
import LoginForm from './components/panel/loginFrom'
import CategoriaForm from './components/panel/categorias/CategoriaForm'
import EmpleadoForm from './components/panel/empleados/EmpleadoForm'
import EmpleadoList from './components/panel/empleados/empleadolista/EmpleadoList'


function App() {
  return (
    <BrowserRouter>
      <Header /> 
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/p' element={<Panel />} />
        <Route path='/Login' element={<LoginForm />} />
        <Route path='/categoria' element={<CategoriaForm />} />
        <Route path='/empleado' element={<EmpleadoForm/>} />
        <Route path='/Listaempleado' element={<EmpleadoList/>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;

