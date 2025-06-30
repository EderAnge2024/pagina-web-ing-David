import { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';

// Subcomponentes
import Carrito from "./subComponente/Carrito";
import Inicio from "./subComponente/Inicio";
import Menu from "./subComponente/Menu";
import Servicio from "./subComponente/Servicio";
import PrefilFrom from "./subComponente/Perfil";

// Imágenes
import carrito from '../img/carrito.png';
import casa from '../img/casa.png';
import menu from '../img/menu.png';
import servicio from '../img/servicio.png';
import perfil from '../img/perfil.png'

// Estilos y stores
import styles from './principal.module.css';
import useImagenStore from "../store/ImagenStore";
import {useColorStore} from "../store/colorStore";
import PerfilFrom from "./subComponente/Perfil";

// Constantes
const NAVIGATION_ITEMS = [
  { key: 'inicio', icon: casa, label: 'Inicio', alt: 'Inicio' },
  { key: 'menu', icon: menu, label: 'Menú', alt: 'Menú' },
  { key: 'servicio', icon: servicio, label: 'Servicios', alt: 'Servicio' },
  { key: 'carrito', icon: carrito, label: 'Carrito', alt: 'Carrito' },
  { key: 'perfil', icon: perfil, label: 'Perfil', alt: 'Perfil' }
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
  // 🔥 Estado para controlar re-renders del logo
  const [logoUpdateTrigger, setLogoUpdateTrigger] = useState(0);
  
  // Hooks de navegación y stores
  const navigate = useNavigate();
  const { fetchImagen, imagenes, getLogoPrincipal } = useImagenStore();

  // 🔥 Función para forzar actualización del logo
  const forceLogoUpdate = useCallback(() => {
    setLogoUpdateTrigger(prev => prev + 1);
    console.log('🔄 Forzando actualización del logo');
  }, []);

  // 🔥 Efecto para cargar datos iniciales
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

  // 🔥 Efecto mejorado para detectar cambios en imágenes
  useEffect(() => {
    console.log('🔍 Cambio detectado en imágenes, total:', imagenes.length);
    
    const logos = imagenes.filter(img => img.Tipo_Imagen === "Logo");
    const logoPrincipal = logos.find(logo => logo.es_principal === true);
    
    console.log('📊 Logos disponibles:', logos.length);
    console.log('⭐ Logo principal actual:', logoPrincipal ? logoPrincipal.ID_Imagen : 'ninguno');
    
    // Forzar actualización del logo cuando cambien las imágenes
    forceLogoUpdate();
    
  }, [imagenes, forceLogoUpdate]); // Dependencia directa de imagenes

  // 🔥 Escuchar evento personalizado de cambio de logo (mejorado)
  useEffect(() => {
    const handleLogoChange = async (event) => {
      console.log('🎯 Evento logoChanged recibido:', event.detail);
      
      try {
        // Esperar un momento para asegurar la actualización en el servidor
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Refrescar datos desde el servidor
        await fetchImagen();
        
        // Forzar actualización del logo
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

  // 🔥 Polling inteligente para actualizaciones automáticas
  useEffect(() => {
    let intervalId;
    
    const setupPolling = () => {
      intervalId = setInterval(async () => {
        try {
          const currentLogoPrincipal = getLogoPrincipal();
          const currentLogoId = currentLogoPrincipal?.ID_Imagen;
          
          // Hacer fetch de las imágenes
          await fetchImagen();
          
          // Verificar si cambió el logo principal
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
      }, 2000); // Cada 2 segundos
    };
    
    setupPolling();
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [fetchImagen, getLogoPrincipal, forceLogoUpdate]);

  // Handlers
  const handleNavClick = useCallback((component) => {
    setActivateComponent(component);
    setIsMenuOpen(false);
  }, []);

  const handleNavigateToProfile = useCallback(() => {
        console.log('🔄 Navegando a perfil desde componente Inicio');
        setActivateComponent('perfil');
        setIsMenuOpen(false);
    }, []);
    
  const goToLogin = useCallback(() => {
    navigate('/loginFrom');
  }, [navigate]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  // Función para calcular color de texto contrastante
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

  // 🔥 Componente de logo completamente refactorizado y optimizado
  const renderLogo = useCallback(() => {
    console.log('🖼️ Renderizando logo - Trigger:', logoUpdateTrigger);
    console.log('🖼️ Total imágenes disponibles:', imagenes.length);
    
    // Obtener logo principal desde el store (siempre fresco)
    const logoPrincipal = getLogoPrincipal();
    
    if (logoPrincipal && logoPrincipal.URL) {
      console.log('✅ Renderizando logo principal:', {
        id: logoPrincipal.ID_Imagen,
        url: logoPrincipal.URL,
        trigger: logoUpdateTrigger
      });
      
      return (
        <div className={styles.logo_container}>
          <div className={styles.logo} onClick={() => window.location.href = "/"}>
            <img 
              src={logoPrincipal.URL} 
              alt="Logo Principal de la empresa"
              key={`logo-principal-${logoPrincipal.ID_Imagen}-${logoUpdateTrigger}`}
              onLoad={() => console.log('✅ Logo principal cargado exitosamente')}
              onError={(e) => {
                console.error('❌ Error cargando logo principal:', logoPrincipal.URL);
                e.target.style.display = 'none';
              }}
              style={{ 
                maxHeight: '50px', 
                maxWidth: '200px', 
                objectFit: 'contain',
                display: 'block'
              }}
            />
          </div>
        </div>
      );
    }

    // Fallback: buscar cualquier logo disponible
    const primerLogo = imagenes.find(img => img.Tipo_Imagen === "Logo" && img.URL);
    
    if (primerLogo) {
      console.log('⚠️ Usando logo fallback:', {
        id: primerLogo.ID_Imagen,
        url: primerLogo.URL
      });
      
      return (
        <div className={styles.logo_container}>
          <div className={styles.logo} onClick={() => window.location.href = "/"}>
            <img 
              src={primerLogo.URL} 
              alt="Logo de la empresa"
              key={`logo-fallback-${primerLogo.ID_Imagen}-${logoUpdateTrigger}`}
              onLoad={() => console.log('✅ Logo fallback cargado exitosamente')}
              onError={(e) => {
                console.error('❌ Error cargando logo fallback:', primerLogo.URL);
                e.target.style.display = 'none';
              }}
              style={{ 
                maxHeight: '50px', 
                maxWidth: '200px', 
                objectFit: 'contain',
                display: 'block'
              }}
            />
          </div>
        </div>
      );
    }

    // Último recurso: mostrar texto
    console.log('⚠️ No hay logos disponibles, mostrando texto por defecto');
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
      inicio: <Inicio onNavigateToProfile={handleNavigateToProfile}/>,
      menu: <Menu onNavigateToProfile={handleNavigateToProfile}/>,
      servicio: <Servicio />,
      carrito: <Carrito />,
      perfil: <PerfilFrom />
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
    <footer className={styles.modern_footer}
    style={{
      backgroundColor: footerColor || undefined,
      color: getTextColor(footerColor),
    }}>
      <div className={styles.footer_content}>
        <div className={styles.footer_section}>
          {renderContactInfo()}
          <a className={styles.terminosCondiciones} href="/terminos_condiciones">Términos y condiciones</a>
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
      <header className={styles.modern_header}
      style={{
        backgroundColor: headerColor || undefined,
        color: getTextColor(headerColor),
      }}>
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