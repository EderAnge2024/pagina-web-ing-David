import { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';

// Subcomponentes
import Carrito from "./subComponente/Carrito";
import Inicio from "./subComponente/Inicio";
import Menu from "./subComponente/Menu";
import Servicio from "./subComponente/Servicio";

// Imágenes
import carrito from '../img/carrito.png';
import casa from '../img/casa.png';
import menu from '../img/menu.png';
import servicio from '../img/servicio.png';

// Estilos y stores
import styles from './principal.module.css';
import useImagenStore from "../store/ImagenStore";

// Constantes
const NAVIGATION_ITEMS = [
  { key: 'inicio', icon: casa, label: 'Inicio', alt: 'Inicio' },
  { key: 'menu', icon: menu, label: 'Menú', alt: 'Menú' },
  { key: 'servicio', icon: servicio, label: 'Servicios', alt: 'Servicio' },
  { key: 'carrito', icon: carrito, label: 'Carrito', alt: 'Carrito' }
];

const COMPANY_INFO = {
  phone: '973836976',
  email: 'bradatecsrl@gmail.com',
  address: 'JR. ZAVALA 501',
  services: '57525-8625'
};

const Principal = () => {
  // Hooks de estado
  const [activateComponent, setActivateComponent] = useState('inicio');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Hooks de navegación y stores
  const navigate = useNavigate();
  const { fetchImagen, imagenes, getLogoPrincipal } = useImagenStore();

  // Efectos
  useEffect(() => {
    fetchImagen();
  }, [fetchImagen]);

  useEffect(() => {
    console.log('Imágenes actualizadas en Principal:', imagenes);
    console.log('Logo principal:', getLogoPrincipal());
  }, [imagenes, getLogoPrincipal]);

  // Handlers
  const handleNavClick = useCallback((component) => {
    setActivateComponent(component);
    setIsMenuOpen(false);
  }, []);

  const goToLogin = useCallback(() => {
    navigate('/loginFrom');
  }, [navigate]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  // Componentes auxiliares
  const renderLogo = () => {
    const logoPrincipal = getLogoPrincipal();
    
    console.log('Logo principal actual:', logoPrincipal);
    
    if (!logoPrincipal) {
      const primerLogo = imagenes.find(img => img.Tipo_Imagen === "Logo");
      if (primerLogo) {
        return (
          <div className={styles.logo_container}>
            <div 
              className={styles.logo}
              onClick={() => window.location.href = "/"}
            >
              <img src={primerLogo.URL} alt="Logo de la empresa" />
            </div>
          </div>
        );
      }
      
      return (
        <div className={styles.logo_container}>
          <div className={styles.logo}>
            <span>Sin Logo</span>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.logo_container}>
        <div 
          className={styles.logo}
          onClick={() => window.location.href = "/"}
        >
          <img 
            src={logoPrincipal.URL} 
            alt="Logo de la empresa"
            key={logoPrincipal.ID_Imagen}
          />
        </div>
      </div>
    );
  };

  const renderHamburgerMenu = () => (
    <button 
      className={styles.hamburger_menu} 
      onClick={toggleMenu}
      aria-label="Menú de navegación"
      aria-expanded={isMenuOpen}
    >
      <span></span>
      <span></span>
      <span></span>
    </button>
  );

  const renderNavigation = () => (
    <nav className={`${styles.main_nav} ${isMenuOpen ? styles.open : ''}`}>
      {NAVIGATION_ITEMS.map(({ key, icon, label, alt }) => (
        <button 
          key={key}
          onClick={() => handleNavClick(key)} 
          className={activateComponent === key ? styles.active : ''}
          aria-label={`Navegar a ${label}`}
        >
          <img src={icon} alt={alt} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );

  const renderMainContent = () => {
    const components = {
      inicio: <Inicio />,
      menu: <Menu />,
      servicio: <Servicio />,
      carrito: <Carrito />
    };

    return (
      <main className={styles.main_content}>
        {components[activateComponent]}
      </main>
    );
  };

  const renderContactInfo = () => (
    <>
      <div className={styles.info_item}>
        <span className={styles.icon} role="img" aria-label="Teléfono">📞</span>
        <p>Teléfono: {COMPANY_INFO.phone}</p>
      </div>
      <div className={styles.info_item}>
        <span className={styles.icon} role="img" aria-label="Email">✉️</span>
        <p>Email: {COMPANY_INFO.email}</p>
      </div>
    </>
  );

  const renderAddressInfo = () => (
    <>
      <div className={styles.info_item}>
        <span className={styles.icon} role="img" aria-label="Dirección">📍</span>
        <p>Dirección: {COMPANY_INFO.address}</p>
      </div>
      <div className={styles.info_item}>
        <span className={styles.icon} role="img" aria-label="Servicios">🎧</span>
        <p>Servicios: {COMPANY_INFO.services}</p>
      </div>
    </>
  );

  const renderFooter = () => (
    <footer className={styles.modern_footer}>
      <div className={styles.footer_content}>
        <div className={styles.footer_section}>
          {renderContactInfo()}
          <button 
            onClick={goToLogin} 
            className={styles.admin_button}
            aria-label="Acceder al área de administrador"
          >
            Área de Administrador
          </button>
        </div>
        <div className={styles.footer_section}>
          {renderAddressInfo()}
        </div>
      </div>
      <div className={styles.copyright}>
        <p>© {new Date().getFullYear()} Tu Empresa. Todos los derechos reservados.</p>
      </div>
    </footer>
  );

  return (
    <div className={styles.principal_container}>
      <header className={styles.modern_header}>
        {renderLogo()}
        {renderHamburgerMenu()}
        {renderNavigation()}
      </header>
      
      {renderMainContent()}
      {renderFooter()}
    </div>
  );
};

export default Principal;