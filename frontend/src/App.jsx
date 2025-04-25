import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Principal from './components/Principal'

function App(){
  return(
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Principal></Principal>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
