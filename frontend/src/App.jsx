import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Inicio from './componentes/Inicio'

function App(){
  return(
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Inicio></Inicio>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
