import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Principal from './components/Principal'
import Panel from './components/panel/Panel'
import LoginForm from './components/panel/loginFrom'
import ProductForm from './components/panel/productos/ProductForm'
import EmpleadoForm from './components/panel/empleados/EmpleadoForm'
import EmpleadoList from './components/panel/empleados/empleadolista/EmpleadoList'
import CategoriaForm from './components/panel/categorias/CategoriaForm'
import ProyectoForm from './components/panel/proyecto/ProyectoForm'
import ProyectoList from './components/panel/proyecto/proyectolista/ProyectoList'
import CursorEffect from './components/panel/cursorEfec/CursorEffect'

function App(){
  return(
    
    <BrowserRouter>
    <CursorEffect/>
    <Routes>
      <Route path='/' element={<Principal></Principal>}/>
      <Route path='/panel' element={<Panel></Panel>}/>
      <Route path='/login' element={<LoginForm></LoginForm>}/>
      <Route path='/productos' element={<ProductForm></ProductForm>}/>
      <Route path='/empleados' element={<EmpleadoForm></EmpleadoForm>}/>
      <Route path='/empleadoslista' element={<EmpleadoList></EmpleadoList>}/>
      <Route path='/categorias' element={<CategoriaForm></CategoriaForm>}/>
      <Route path='/proyectos' element={<ProyectoForm></ProyectoForm>}/>
      <Route path='/proyectoslista' element={<ProyectoList></ProyectoList>}/>

      

    </Routes>
    </BrowserRouter>
  )
}

export default App
