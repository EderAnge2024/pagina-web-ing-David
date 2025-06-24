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
import { useColorStore } from "../store/colorStore";

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
  const [activateComponent, setActivateComponent] = useState('inicio');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoUpdateTrigger, setLogoUpdateTrigger] = useState(0);

  const navigate = useNavigate();
  const { fetchImagen, imagenes, getLogoPrincipal } = useImagenStore();

  const forceLogoUpdate = useCallback(() => {
    setLogoUpdateTrigger(prev => prev + 1);
    console.log('🔄 Forzando actualización del logo');
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        console.log('📥 Cargando datos iniciales...');
        await fetchImagen();
        forceLogoUpdate();
        console.log('✅ Datos iniciales cargados correctamente');
      } catch (error) {
        console.error('❌ Error cargando datos iniciales:', error);
      }
    };
    loadInitialData();
  }, [fetchImagen, forceLogoUpdate]);

  useEffect(() => {
    console.log('🔍 Cambio detectado en imágenes, total:', imagenes.length);
    const logos = imagenes.filter(img => img.Tipo_Imagen === "Logo");
    const logoPrincipal = logos.find(logo => logo.es_principal === true);
    console.log('📊 Logos disponibles:', logos.length);
    console.log('⭐ Logo principal actual:', logoPrincipal ? logoPrincipal.ID_Imagen : 'ninguno');
    forceLogoUpdate();
  }, [imagenes, forceLogoUpdate]);

  useEffect(() => {
    const handleLogoChange = async (event) => {
      console.log('🎯 Evento logoChanged recibido:', event.detail);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        await fetchImagen();
        forceLogoUpdate();
        console.log('✅ Logo actualizado después del evento personalizado');
      } catch (error) {
        console.error('❌ Error actualizando logo después del evento:', error);
      }
    };
    window.addEventListener('logoChanged', handleLogoChange);
    return () => {
      window.removeEventListener('logoChanged', handleLogoChange);
    };
  }, [fetchImagen, forceLogoUpdate]);

  useEffect(() => {
    let intervalId;
    const setupPolling = () => {
      intervalId = setInterval(async () => {
        try {
          const currentLogoPrincipal = getLogoPrincipal();
          const currentLogoId = currentLogoPrincipal?.ID_Imagen;

          await fetchImagen();

          const newLogoPrincipal = getLogoPrincipal();
          const newLogoId = newLogoPrincipal?.ID_Imagen;

          if (currentLogoId !== newLogoId) {
            console.log('🔄 Cambio de logo detectado en polling:', {
              anterior: currentLogoId,
              nuevo: newLogoId
            });
            forceLogoUpdate();
          }
        } catch (error) {
          console.error('❌ Error en polling:', error);
        }
      }, 2000);
    };
    setupPolling();
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [fetchImagen, getLogoPrincipal, forceLogoUpdate]);

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

  const getTextColor = (bgColor) => {
    if (!bgColor) return 'inherit';
    const hex = bgColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 125 ? 'black' : 'white';
  };
  
  const headerColor = useColorStore(state => state.headerColor);
  const footerColor = useColorStore(state => state.footerColor);
  const buttonColor = useColorStore(state => state.buttonColor);

  const renderLogo = useCallback(() => {
    const logoPrincipal = getLogoPrincipal();
    if (logoPrincipal && logoPrincipal.URL) {
      return (
        <div className={styles.logo_container}>
          <div className={styles.logo} onClick={() => window.location.href = "/"}>
            <img 
              src={logoPrincipal.URL}
              alt="Logo Principal de la empresa"
              key={`logo-principal-${logoPrincipal.ID_Imagen}-${logoUpdateTrigger}`}
              style={{ maxHeight: '50px', maxWidth: '200px', objectFit: 'contain', display: 'block' }}
            />
          </div>
        </div>
      );
    }
    const primerLogo = imagenes.find(img => img.Tipo_Imagen === "Logo" && img.URL);
    if (primerLogo) {
      return (
        <div className={styles.logo_container}>
          <div className={styles.logo} onClick={() => window.location.href = "/"}>
            <img 
              src={primerLogo.URL}
              alt="Logo de la empresa"
              key={`logo-fallback-${primerLogo.ID_Imagen}-${logoUpdateTrigger}`}
              style={{ maxHeight: '50px', maxWidth: '200px', objectFit: 'contain', display: 'block' }}
            />
          </div>
        </div>
      );
    }
    return (
      <div className={styles.logo_container}>
        <div className={styles.logo}>
          <span style={{ color: 'inherit', fontWeight: 'bold', fontSize: '1.2rem' }}>
            Tu Empresa
          </span>
        </div>
      </div>
    );
  }, [logoUpdateTrigger, imagenes, getLogoPrincipal]);

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
    <nav className={`${styles.main_nav} ${isMenuOpen ? styles.open : ''}`} >
      {NAVIGATION_ITEMS.map(({ key, icon, label, alt }) => (
        <button
          key={key}
          onClick={() => handleNavClick(key)}
          className={activateComponent === key ? styles.active : ''}
          aria-label={`Navegar a ${label}`}
          style={{ color: getTextColor(headerColor) }}
        >
          <img 
            src={icon}
            alt={alt}
            style={{
              filter: getTextColor(headerColor) === 'white' ? 'invert(100%)' : 'none'
            }}
          />
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
    <footer
      className={styles.modern_footer}
      style={{
        backgroundColor: footerColor || undefined,
        color: getTextColor(footerColor),
      }}
    >
      <div className={styles.footer_content}>
        <div className={styles.footer_section}>
          {renderContactInfo()}
          <button 
            onClick={goToLogin}
            className={styles.admin_button}
            style={{
              backgroundColor: buttonColor || undefined,
              color: getTextColor(buttonColor),
            }}
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
      <header
        className={styles.modern_header}
        style={{
          backgroundColor: headerColor || undefined,
          color: getTextColor(headerColor),
        }}
      >
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

