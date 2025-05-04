import { useState,useEffect} from "react"
import { useNavigate } from 'react-router-dom';
import Carrito from "./subComponente/Carrito"
import Inicio from "./subComponente/Inicio"
import Menu from "./subComponente/Menu"
import Servicio from "./subComponente/Servicio"
import carrito from '../img/carrito.png'
import casa from '../img/casa.png'
import menu from '../img/menu.png'
import lupa from '../img/lupa.png'
import servicio from '../img/servicio.png'
import './principal.css'
import useImagenStore from "../store/ImagenStore";

const Principal=()=>{
    const { fetchImagen, imagens } = useImagenStore()
    const [activateComponent, setActivateComponent] = useState('inicio')
    const navigate = useNavigate();
    const handleNavClick = (component) =>{
        setActivateComponent(component)
    }
    const goToLogin = () => {
        navigate('/loginFrom');
    };

      // Cargar la lista de imagens al montar el componente
      useEffect(() => {
        console.log('Cargando imágenes...');
        fetchImagen()
    }, [])
    console.log("Imágenes cargadas:", imagens) 

    return(
                <div className="Principal">
                    <header>
                        <div>
                                  {imagens
                                      .filter((img) => img.Tipo_Imagen === "Logo")
                                      .map((img) => (
                                          <div key={img.ID_Imagen}>
                                              <img 
                                                  src={img.URL} 
                                              />
                                          </div>
                                      ))
                                  }
                        </div>
                        <div className="lupa">
                            <input type="lupa" ></input>
                            <img src={lupa} />
                        </div>
                        <nav>
                            <button onClick={() => handleNavClick('inicio')}><img src={casa} />Inicio</button>
                            <button onClick={() => handleNavClick('menu')}><img src={menu} />menu</button>
                            <button onClick={() => handleNavClick('servicio')}><img src={servicio} />servicio</button>
                            <button onClick={() => handleNavClick('carrito')}><img src={carrito} />carrito</button>
                        </nav>
                    </header>
                    <main>
                            {activateComponent === 'inicio' && <Inicio/>}
                            {activateComponent === 'menu' && <Menu/>}
                            {activateComponent === 'servicio' && <Servicio/>}
                            {activateComponent === 'carrito' && <Carrito/>}
                    </main>
                    <footer>
                        <div className="secPadre">
                            <div className="seccion1">
                                <p>Contactenos: 999999999</p>
                                <button onClick={goToLogin}>Administrador Click 👈🤛</button>  
                            </div>
                            <div className="seccion2">
                                <p>ubiquenos: en un lugar</p>
                            </div>
                        </div>   
                    </footer>
                </div>
    )
}

export default Principal