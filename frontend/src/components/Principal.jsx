import { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom'
import Carrito from "./subComponente/Carrito"
import Inicio from "./subComponente/Inicio"
import Menu from "./subComponente/Menu"
import Servicio from "./subComponente/Servicio" 
import carrito from '../img/carrito.png'
import casa from '../img/casa.png'
import menu from '../img/menu.png'
import lupa from '../img/lupa.png'
import servicio from '../img/servicio.png'
import styles from './principal.module.css'
import useImagenStore from "../store/ImagenStore"
import useBusquedaStore from "../store/BusquedaStore";

const Principal = () => { 
    const { fetchImagen, imagens } = useImagenStore()
    const { searchQuery, setSearchQuery } = useBusquedaStore();
    const [activateComponent, setActivateComponent] = useState('inicio')
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const navigate = useNavigate()
    
    const handleNavClick = (component) => {
        setActivateComponent(component)
        setIsMenuOpen(false)
    }
    
    const goToLogin = () => {
        navigate('/loginFrom')
    }

    // En Principal.jsx, modifica handleSearch:
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Redirigir al menú si no está ya en él
            if (activateComponent !== 'menu') {
                handleNavClick('menu');
            }
            // Forzar actualización de la vista
            window.scrollTo(0, 0);
        }
    }

    useEffect(() => {
        fetchImagen()
    }, [])

    return (
        <div className={styles.app}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerTop}>
                    <div className={styles.logoContainer}>
                        {imagens
                            .filter((img) => img.Tipo_Imagen === "Logo")
                            .map((img) => (
                                <img 
                                    key={img.ID_Imagen} 
                                    src={img.URL} 
                                    alt="Logo" 
                                    className={styles.logo}
                                />
                            ))
                        }
                    </div>
 
                    <div className={styles.searchContainer}>
                        <form onSubmit={handleSearch} className={styles.searchForm}>
                            <input 
                                type="text" 
                                placeholder="Buscar productos..." 
                                className={styles.searchInput} 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button type="submit" className={styles.searchButton}>
                                <img src={lupa} alt="Buscar" className={styles.searchIcon} />
                            </button>
                        </form>
                    </div>

                    <div 
                        className={`${styles.hamburger} ${isMenuOpen ? styles.open : ''}`} 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>

                <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
                    <button 
                        onClick={() => handleNavClick('inicio')} 
                        className={`${styles.navButton} ${activateComponent === 'inicio' ? styles.active : ''}`}
                    >
                        <img src={casa} alt="Inicio" className={styles.navIcon} />
                        <span>Inicio</span>
                    </button>
                    <button 
                        onClick={() => handleNavClick('menu')} 
                        className={`${styles.navButton} ${activateComponent === 'menu' ? styles.active : ''}`}
                    >
                        <img src={menu} alt="Menú" className={styles.navIcon} />
                        <span>Menú</span>
                    </button>
                    <button 
                        onClick={() => handleNavClick('servicio')} 
                        className={`${styles.navButton} ${activateComponent === 'servicio' ? styles.active : ''}`}
                    >
                        <img src={servicio} alt="Servicio" className={styles.navIcon} />
                        <span>Servicios</span>
                    </button>
                    <button 
                        onClick={() => handleNavClick('carrito')} 
                        className={`${styles.navButton} ${activateComponent === 'carrito' ? styles.active : ''}`}
                    >
                        <img src={carrito} alt="Carrito" className={styles.navIcon} />
                        <span>Carrito</span>
                    </button>
                </nav>
            </header>

            {/* Main Content */}
            <main className={styles.main}>
                {activateComponent === 'inicio' && <Inicio />}
                {activateComponent === 'menu' && <Menu searchTerm={searchQuery} />}
                {activateComponent === 'servicio' && <Servicio />}
                {activateComponent === 'carrito' && <Carrito />}
            </main>

            {/* Footer */}
            <footer className={styles.footer}>
                <div className={styles.footerContent}>
                    <div className={styles.footerSection}>
                        <h3 className={styles.footerTitle}>Contacto</h3>
                        <div className={styles.contactItem}>
                            <span className={styles.contactIcon}>📞</span>
                            <p>Teléfono: 973836976</p>
                        </div>
                        <div className={styles.contactItem}>
                            <span className={styles.contactIcon}>✉️</span>
                            <p>Email: bradatecsrl@gmail.com</p>
                        </div>
                        <div className={styles.contactItem}>
                            <span className={styles.contactIcon}>📍</span>
                            <p>Dirección: JR. ZAVALA 501</p>
                        </div>
                    </div>

                    <div className={styles.footerSection}>
                        <h3 className={styles.footerTitle}>Horario</h3>
                        <p>Lunes a Viernes: 9:00 - 18:00</p>
                        <p>Sábados: 10:00 - 15:00</p>
                        <p>Domingos: Cerrado</p>
                    </div>

                    <div className={styles.footerSection}>
                        <h3 className={styles.footerTitle}>Accesos</h3>
                        <button 
                            onClick={goToLogin} 
                            className={styles.adminButton}
                        >
                            Área de Administrador
                        </button>
                        <div className={styles.socialIcons}>
                            {/* Aquí puedes añadir iconos de redes sociales */}
                        </div>
                    </div>
                </div>

                <div className={styles.footerBottom}>
                    <p>© {new Date().getFullYear()} Bradatec SRL. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    )
}

export default Principal