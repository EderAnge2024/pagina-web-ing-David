import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from 'react-router-dom';

// Subcomponentes
import Carrito from "./subComponente/Carrito";
import Inicio from "./subComponente/Inicio";
import Menu from "./subComponente/Menu";
import Servicio from "./subComponente/Servicio";
import PrefilFrom from "./subComponente/Perfil";
import useInformacionStore from "../store/InformacionStore";

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
import { useTerminosStore } from "../store/TerminosStore";

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
  const [logoUpdateTrigger, setLogoUpdateTrigger] = useState(0);
  
  // Hooks de navegación y stores
  const navigate = useNavigate();
  const { fetchImagen, imagenes, getLogoPrincipal } = useImagenStore();
  const { ultimo, fetchUltimo } = useTerminosStore();

  const {fetchInformacion} = useInformacionStore()
  const [companyInfo, setCompanyInfo] = useState({});



  // 🔥 CORREGIDO: Usar useMemo para evitar re-renders infinitos del color store
  const colorStore = useColorStore();
  const headerColor = useMemo(() => colorStore.headerColor, [colorStore.headerColor]);
  const footerColor = useMemo(() => colorStore.footerColor, [colorStore.footerColor]);
  const getTextColor = useMemo(() => colorStore.getTextColor, [colorStore.getTextColor]);
  const getHeaderContrastColors = useMemo(() => colorStore.getHeaderContrastColors, [colorStore.getHeaderContrastColors]);
  const getFooterContrastColors = useMemo(() => colorStore.getFooterContrastColors, [colorStore.getFooterContrastColors]);

  // 🔥 Memoizar los colores de contraste para evitar recálculos
  const headerContrastColors = useMemo(() => getHeaderContrastColors(), [headerColor, getHeaderContrastColors]);
  const footerContrastColors = useMemo(() => getFooterContrastColors(), [footerColor, getFooterContrastColors]);

  // Función para forzar actualización del logo
  const forceLogoUpdate = useCallback(() => {
    setLogoUpdateTrigger(prev => prev + 1);
    console.log('🔄 Forzando actualización del logo');
  }, []);

  // 🔥 Efecto para aplicar estilos de color al montar el componente
  useEffect(() => {
    const applyStyles = colorStore.applyStyles;
    if (applyStyles) {
      applyStyles();
    }
  }, [colorStore.applyStyles]);

  // Efecto para cargar datos iniciales
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

  // Efecto mejorado para detectar cambios en imágenes
  useEffect(() => {
    console.log('🔍 Cambio detectado en imágenes, total:', imagenes.length)
    
    const logos = imagenes.filter(img => img.Tipo_Imagen === "Logo")
    const logoPrincipal = logos.find(logo => logo.es_principal === true)
    
    console.log('📊 Logos disponibles:', logos.length)
    console.log('⭐ Logo principal actual:', logoPrincipal ? logoPrincipal.ID_Imagen : 'ninguno')
    
    forceLogoUpdate()
    
  }, [imagenes, forceLogoUpdate]);

  // Escuchar evento personalizado de cambio de logo (mejorado)
  useEffect(() => {
    const handleLogoChange = async (event) => {
      console.log('🎯 Evento logoChanged recibido:', event.detail)
      
      try {
        await new Promise(resolve => setTimeout(resolve, 300))
        await fetchImagen()
        forceLogoUpdate()
        console.log('✅ Logo actualizado después del evento personalizado')
      } catch (error) {
        console.error('❌ Error actualizando logo después del evento:', error)
      }
    }

    window.addEventListener('logoChanged', handleLogoChange)
    
    return () => {
      window.removeEventListener('logoChanged', handleLogoChange)
    }
  }, [fetchImagen, forceLogoUpdate])

  // Polling inteligente para actualizaciones automáticas (reducido)
  useEffect(() => {
    let intervalId
    
    const setupPolling = () => {
      intervalId = setInterval(async () => {
        try {
          const currentLogoPrincipal = getLogoPrincipal()
          const currentLogoId = currentLogoPrincipal?.ID_Imagen
          
          await fetchImagen()
          
          const newLogoPrincipal = getLogoPrincipal()
          const newLogoId = newLogoPrincipal?.ID_Imagen
          
          if (currentLogoId !== newLogoId) {
            console.log('🔄 Cambio de logo detectado en polling:', {
              anterior: currentLogoId,
              nuevo: newLogoId
            })
            forceLogoUpdate()
          }
          
        } catch (error) {
          console.error('❌ Error en polling:', error)
        }
      }, 50000)
    }
    
    setupPolling()
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [fetchImagen, getLogoPrincipal, forceLogoUpdate])

  // para el footer
  useEffect(() => {
     const cargarInformacion = async () => {
       const data = await fetchInformacion();
   
       // Agrupar por tipo
       const agrupado = {};
       data.forEach(item => {
         agrupado[item.Tipo_Informacion] = item.Dato;
       });
   
       setCompanyInfo(agrupado); // Ahora tienes un objeto tipo { Telefono: ..., Correo: ..., etc. }
     };
   
     cargarInformacion();
   }, [fetchInformacion]);
   
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

  // Componente de logo completamente refactorizado y optimizado
  const renderLogo = useCallback(() => {
    console.log('🖼️ Renderizando logo - Trigger:', logoUpdateTrigger)
    console.log('🖼️ Total imágenes disponibles:', imagenes.length)
    
    const logoPrincipal = imagenes.find(img => img.Tipo_Imagen === "Logo" && img.es_principal)
    
    if (logoPrincipal && logoPrincipal.URL) {
      console.log('✅ Renderizando logo principal:', {
        id: logoPrincipal.ID_Imagen,
        url: logoPrincipal.URL,
        trigger: logoUpdateTrigger
      })
      
      return (
        <div className={styles.logo_container}>
          <div className={styles.logo} onClick={() => window.location.href = "/"}>
            <img 
              src={`${logoPrincipal.URL}?v=${Date.now()}`}
              alt="Logo Principal de la empresa"
              key={`logo-principal-${logoPrincipal.ID_Imagen}-${logoUpdateTrigger}`}
              onLoad={() => console.log('✅ Logo principal cargado exitosamente')}
              onError={(e) => {
                console.error('❌ Error cargando logo principal:', logoPrincipal.URL)
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
      )
    }

    const primerLogo = imagenes.find(img => img.Tipo_Imagen === "Logo" && img.URL)
    
    if (primerLogo) {
      console.log('⚠️ Usando logo fallback:', {
        id: primerLogo.ID_Imagen,
        url: primerLogo.URL
      })
      
      return (
        <div className={styles.logo_container}>
          <div className={styles.logo} onClick={() => window.location.href = "/"}>
            <img 
              src={`${primerLogo.URL}?v=${Date.now()}`}
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
      )
    }

    console.log('⚠️ No hay logos disponibles, mostrando texto por defecto')
    return (
      <div className={styles.logo_container}>
        <div className={styles.logo}>
          <span style={{ color: 'inherit', fontWeight: 'bold', fontSize: '1.2rem' }}>
            Tu Empresa
          </span>
        </div>
      </div>
    )
  }, [logoUpdateTrigger, imagenes])

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

  const renderContactInfo = () => {
    if (!companyInfo) return <p>Cargando contacto...</p>;
  
    return (
      <>
        <div className={styles.info_item}>
          <span className={styles.icon} role="img" aria-label="Teléfono">📞</span>
          <p>Teléfono: {companyInfo['Telefono'] || 'No disponible'}</p>
        </div>
        <div className={styles.info_item}>
          <span className={styles.icon} role="img" aria-label="Email">✉️</span>
          <p>Email: {companyInfo['Correo'] || 'No disponible'}</p>
        </div>
      </>
    );
  };
  
  const renderAddressInfo = () => {
    if (!companyInfo) return <p>Cargando dirección...</p>;
  
    return (
      <>
        <div className={styles.info_item}>
          <span className={styles.icon} role="img" aria-label="Dirección">📍</span>
          <p>Dirección: {companyInfo['Direccion'] || 'No disponible'}</p>
        </div>
        <div className={styles.info_item}>
          <span className={styles.icon} role="img" aria-label="Servicios">🎧</span>
          <p>Servicios: {companyInfo['Servicios'] || 'No disponible'}</p>
        </div>
      </>
    );
  };
  
  // 🔥 CORREGIDO: Footer con colores de contraste memoizados
  const renderFooter = () => (
    <footer 
      className={styles.modern_footer}
      style={{
        backgroundColor: footerColor || undefined,
        color: footerContrastColors.textColor,
      }}
    >
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
        <p>
          © {new Date().getFullYear()} Tu Empresa. Todos los derechos reservados. |
          <a 
            href="/terminos-condiciones" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ 
              color: footerContrastColors.linkColor, 
              textDecoration: 'underline', 
              marginLeft: 8 
            }}
          >
            Términos y Condiciones
          </a>
        </p>
        {ultimo && (
          <div style={{ 
            marginTop: 10, 
            fontSize: 13, 
            color: footerContrastColors.secondaryTextColor, 
            textAlign: 'center' 
          }}>
            <div dangerouslySetInnerHTML={{ __html: ultimo.contenido }} />
          </div>
        )}
      </div>
    </footer>
  );

  return (
    <div className={styles.principal_container}>
      <header 
        className={styles.modern_header}
        style={{
          backgroundColor: headerColor || undefined,
          color: headerContrastColors.textColor,
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