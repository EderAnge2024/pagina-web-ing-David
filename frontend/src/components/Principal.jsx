import { useState } from "react"
import Carrito from "./subComponente/Carrito"
import Inicio from "./subComponente/Inicio"
import Menu from "./subComponente/Menu"
import Servicio from "./subComponente/Servicio"



const Principal=()=>{
    const [activateComponent, setActivateComponent] = useState('inicio')
    const handleNavClick = (component) =>{
        setActivateComponent(component)
    }
    return(
                <div className="Principal">
                    <header>
                        <nav>
                            <button onClick={() => handleNavClick('inicio')}>Inicio</button>
                            <button onClick={() => handleNavClick('menu')}>menu</button>
                            <button onClick={() => handleNavClick('servicio')}>servicio</button>
                            <button onClick={() => handleNavClick('carrito')}>carrito</button>
                        </nav>
                        </header>
                        <main>
                            {activateComponent === 'inicio' && <Inicio setActivateComponent={setActivateComponent} />}
                            {activateComponent === 'menu' && <Menu/>}
                            {activateComponent === 'servicio' && <Servicio/>}
                            {activateComponent === 'carrito' && <Carrito setActivateComponent={setActivateComponent} />}

                        </main>
                </div>
    )
}

export default Principal