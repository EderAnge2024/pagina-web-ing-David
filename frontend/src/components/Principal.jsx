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
import stiloPrin from './principal.module.css'
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
                <div className={stiloPrin.Principal}>
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
                        <div className={stiloPrin.lupa}>
                            <input type="lupa" placeholder="  ...buscar algo"></input>
                            <button><img src={lupa} /></button>
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
                        <div className={stiloPrin.secPadre}>
                            <div className={stiloPrin.seccion1}>
                                <p>Teléfonos : 973836976</p>
                                <p>Email : bradatecsrlgmail.com</p>
                                <button onClick={goToLogin}>Administrador Click 👈🤛</button>  
                            </div>
                            <div className={stiloPrin.seccion2}>
                                <p>Dirección : JR. ZAVALA 501</p>
                                <p>Servicios : 57525-8625</p>
                            </div>
                        </div>   
                    </footer>
                </div>
    )
}

export default Principal