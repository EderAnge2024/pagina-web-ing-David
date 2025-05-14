import { useState, useEffect } from "react"
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
import styles from './principal.module.css'  // Importación del CSS modular
import useImagenStore from "../store/ImagenStore";

const Principal = () => {
    const { fetchImagen, imagens } = useImagenStore()
    const [activateComponent, setActivateComponent] = useState('inicio')
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const navigate = useNavigate();
    
    const handleNavClick = (component) => {
        setActivateComponent(component)
        setIsMenuOpen(false)
    }
    
    const goToLogin = () => {
        navigate('/loginFrom');
    };

    // Cargar la lista de imágenes al montar el componente
    useEffect(() => {
        fetchImagen()
    }, [])

    return (
        <div className={styles.principal_container}>
            {/* Header */}
            <header className={styles.modern_header}>
                <div className={styles.logo_container}>
                    {imagens
                        .filter((img) => img.Tipo_Imagen === "Logo")
                        .map((img) => (
                            <div key={img.ID_Imagen} className={styles.logo}>
                                <img src={img.URL} alt="Logo" />
                            </div>
                        ))
                    }
                </div>

                <div className={styles.search_container}>
                    <input type="text" placeholder="Buscar productos..." className={styles.search_input} />
                    <button className={styles.search_button}>
                        <img src={lupa} alt="Buscar" />
                    </button>
                </div>

                {/* Hamburger menu para móviles */}
                <div className={styles.hamburger_menu} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                <nav className={`${styles.main_nav} ${isMenuOpen ? styles.open : ''}`}>
                    <button 
                        onClick={() => handleNavClick('inicio')} 
                        className={activateComponent === 'inicio' ? styles.active : ''}
                    >
                        <img src={casa} alt="Inicio" />
                        <span>Inicio</span>
                    </button>
                    <button 
                        onClick={() => handleNavClick('menu')} 
                        className={activateComponent === 'menu' ? styles.active : ''}
                    >
                        <img src={menu} alt="Menú" />
                        <span>Menú</span>
                    </button>
                    <button 
                        onClick={() => handleNavClick('servicio')} 
                        className={activateComponent === 'servicio' ? styles.active : ''}
                    >
                        <img src={servicio} alt="Servicio" />
                        <span>Servicios</span>
                    </button>
                    <button 
                        onClick={() => handleNavClick('carrito')} 
                        className={activateComponent === 'carrito' ? styles.active : ''}
                    >
                        <img src={carrito} alt="Carrito" />
                        <span>Carrito</span>
                    </button>
                </nav>
            </header>

            {/* Main Content */}
            <main className={styles.main_content}>
                {activateComponent === 'inicio' && <Inicio />}
                {activateComponent === 'menu' && <Menu />}
                {activateComponent === 'servicio' && <Servicio />}
                {activateComponent === 'carrito' && <Carrito />}
            </main>

            {/* Footer */}
            <footer className={styles.modern_footer}>
                <div className={styles.footer_content}>
                    <div className={styles.footer_section}>
                        <div className={styles.info_item}>
                            <span className={styles.icon}>📞</span>
                            <p>Teléfono: 973836976</p>
                        </div>
                        <div className={styles.info_item}>
                            <span className={styles.icon}>✉️</span>
                            <p>Email: bradatecsrl@gmail.com</p>
                        </div>
                        <button onClick={goToLogin} className={styles.admin_button}>
                            Área de Administrador
                        </button>
                    </div>
                    <div className={styles.footer_section}>
                        <div className={styles.info_item}>
                            <span className={styles.icon}>📍</span>
                            <p>Dirección: JR. ZAVALA 501</p>
                        </div>
                        <div className={styles.info_item}>
                            <span className={styles.icon}>🎧</span>
                            <p>Servicios: 57525-8625</p>
                        </div>
                    </div>
                </div>
                <div className={styles.copyright}>
                    <p>© {new Date().getFullYear()} Tu Empresa. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    )
}

export default Principal