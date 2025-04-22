import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Inicio from "./components/INICIO/Inicio"
import Registro from './components/Registro/Registro'
import Iniciar from './components/Incio_Sesion/Iniciar'
import Interfaz1 from './components/Interfaz/Interfaz'

function App(){
  return(
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Inicio></Inicio>}/>
      <Route path="/registro" element={<Registro />} />
      <Route path="/iniciar" element={<Iniciar />} />
      <Route path="/interfaz1" element={<Interfaz1 />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
