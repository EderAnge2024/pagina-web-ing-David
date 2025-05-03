import { useState } from "react"
import AdministradorFrom from "./Administrador/Administrador"
import ClienteFrom from "./Administrador/Clientes"
import ImagenFrom from "./Administrador/imgFrom"
import ProductosFrom from "./Administrador/Productos"


const Administrador=()=>{
    const [activateComponent, setActivateComponent] = useState('AdministradorFrom')
    const handleNavClick = (component) =>{
        setActivateComponent(component)
    }
    return(
                <div className="Administrador">
                    <header>
                        <nav>
                            <button onClick={() => handleNavClick('AdministradorFrom')}>AdministradorFrom</button>
                            <button onClick={() => handleNavClick('ClienteFrom')}>ClienteFrom</button>
                            <button onClick={() => handleNavClick('ImagenFrom')}>ImagenFrom</button>
                            <button onClick={() => handleNavClick('ProductosFrom')}>ProductosFrom</button>
                        </nav>
                        </header>
                        <main>
                            {activateComponent === 'AdministradorFrom' && <AdministradorFrom/>}
                            {activateComponent === 'ClienteFrom' && <ClienteFrom/>}
                            {activateComponent === 'ImagenFrom' && <ImagenFrom/>}
                            {activateComponent === 'ProductosFrom' && <ProductosFrom/>}
                        </main>
                </div>
    )
}

export default Administrador