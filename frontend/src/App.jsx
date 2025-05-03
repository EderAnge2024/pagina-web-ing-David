import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Principal from './components/Principal'
import Administrador from './components/Administrador'
import LoginForm from './components/LoginAdministrador'

function App(){
  return(
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Principal></Principal>}/>
      <Route path='/administrador' element={<Administrador></Administrador>}></Route>
      <Route path='/loginFrom' element={<LoginForm></LoginForm>}></Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App
