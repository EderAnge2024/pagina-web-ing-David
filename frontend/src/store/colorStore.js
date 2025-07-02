import { create } from 'zustand';

// Colores por defecto del proyecto
const DEFAULT_COLORS = {
  'primary-color': '#ff6b6b',
  'secondary-color': '#4ecdc4',
  'dark-color': '#2c3e50',
  'light-color': '#ffffff',
  'accent-color': '#ff6b6b',
  'gray-color': '#6c757d',
  'light-gray': '#f8f9fa',
  'medium-gray': '#e9ecef',
  'text-dark': '#212529',
  'text-light': '#6c757d',
  'text-white': '#ffffff',
  'border-color': '#dee2e6'
};

// Función mejorada para calcular luminancia y contraste
const getLuminance = (hex) => {
  if (!hex || hex === '') return 1; // Valor por defecto para transparente
  
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substr(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substr(2, 2), 16) / 255;
  const b = parseInt(cleanHex.substr(4, 2), 16) / 255;

  // Convertir a luminancia relativa
  const toLinear = (c) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
};

// Función para obtener colores de contraste optimizados
const getContrastColors = (bgColor) => {
  if (!bgColor || bgColor === '') {
    return {
      textColor: 'inherit',
      iconFilter: 'none',
      linkColor: 'inherit',
      borderColor: 'rgba(0,0,0,0.1)',
      hoverColor: 'rgba(0,0,0,0.1)'
    };
  }

  const luminance = getLuminance(bgColor);
  const isDark = luminance < 0.5;

  if (isDark) {
    // Fondo oscuro - usar colores claros
    return {
      textColor: '#ffffff',
      iconFilter: 'brightness(0) invert(1)', // Convierte iconos a blanco
      linkColor: '#e3f2fd',
      borderColor: 'rgba(255,255,255,0.2)',
      hoverColor: 'rgba(255,255,255,0.1)',
      buttonTextColor: '#ffffff',
      secondaryTextColor: '#e0e0e0'
    };
  } else {
    // Fondo claro - usar colores oscuros
    return {
      textColor: '#212529',
      iconFilter: 'brightness(0)', // Convierte iconos a negro
      linkColor: '#1976d2',
      borderColor: 'rgba(0,0,0,0.2)',
      hoverColor: 'rgba(0,0,0,0.1)',
      buttonTextColor: '#212529',
      secondaryTextColor: '#6c757d'
    };
  }
};

// Función para aplicar estilos CSS globales
const applyGlobalStyles = (headerColor, footerColor, headerContrast, footerContrast) => {
  // Remover estilos anteriores si existen
  const existingStyle = document.getElementById('dynamic-color-styles');
  if (existingStyle) {
    existingStyle.remove();
  }

  // Crear nuevo elemento de estilos
  const style = document.createElement('style');
  style.id = 'dynamic-color-styles';
  
  let css = '';

  // Estilos para el header
  if (headerColor && headerColor !== '') {
    css += `
      /* Header Styles */
      .modern_header * {
        color: ${headerContrast.textColor} !important;
      }
      
      .modern_header img {
        filter: ${headerContrast.iconFilter};
      }
      
      .modern_header button {
        color: ${headerContrast.buttonTextColor} !important;
        border-color: ${headerContrast.borderColor} !important;
      }
      
      .modern_header button:hover {
        background-color: ${headerContrast.hoverColor} !important;
      }
      
      .modern_header .main_nav button.active {
        background-color: ${headerContrast.hoverColor} !important;
        border-color: ${headerContrast.textColor} !important;
      }
      
      .modern_header .hamburger_menu span {
        background-color: ${headerContrast.textColor} !important;
      }
      
      .modern_header a {
        color: ${headerContrast.linkColor} !important;
      }
    `;
  }

  // Estilos para el footer
  if (footerColor && footerColor !== '') {
    css += `
      /* Footer Styles */
      .modern_footer * {
        color: ${footerContrast.textColor} !important;
      }
      
      .modern_footer .info_item {
        color: ${footerContrast.textColor} !important;
      }
      
      .modern_footer .icon {
        color: ${footerContrast.textColor} !important;
      }
      
      .modern_footer button {
        color: ${footerContrast.buttonTextColor} !important;
        border-color: ${footerContrast.borderColor} !important;
        background-color: ${footerContrast.hoverColor} !important;
      }
      
      .modern_footer button:hover {
        background-color: ${footerContrast.textColor} !important;
        color: ${footerColor} !important;
      }
      
      .modern_footer a {
        color: ${footerContrast.linkColor} !important;
      }
      
      .modern_footer p {
        color: ${footerContrast.secondaryTextColor} !important;
      }
    `;
  }

  style.textContent = css;
  document.head.appendChild(style);
};

// Función para verificar si localStorage está disponible
const isLocalStorageAvailable = () => {
  try {
    const test = 'test';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

// Funciones de localStorage con fallback
const getItem = (key) => {
  if (isLocalStorageAvailable()) {
    return localStorage.getItem(key);
  }
  return null;
};

const setItem = (key, value) => {
  if (isLocalStorageAvailable()) {
    localStorage.setItem(key, value);
  }
};

const removeItem = (key) => {
  if (isLocalStorageAvailable()) {
    localStorage.removeItem(key);
  }
};

// Función para obtener el ID único del usuario (simulado)
const getUserId = () => {
  let userId = getItem('currentUserId');
  if (!userId) {
    userId = 'guest_' + Date.now();
    setItem('currentUserId', userId);
  }
  return userId;
};

// Función para limpiar datos del usuario anterior
const clearPreviousUserData = (currentUserId) => {
  const lastUserId = getItem('lastUserId');
  if (lastUserId && lastUserId !== currentUserId) {
    removeItem(`headerColor_${lastUserId}`);
    removeItem(`footerColor_${lastUserId}`);
  }
  setItem('lastUserId', currentUserId);
};

export const useColorStore = create((set, get) => {
  const userId = getUserId();
  clearPreviousUserData(userId);
  
  const savedHeader = getItem(`headerColor_${userId}`);
  const savedFooter = getItem(`footerColor_${userId}`);

  // Función interna para actualizar estilos
  const updateStyles = () => {
    const state = get();
    const headerContrast = getContrastColors(state.headerColor);
    const footerContrast = getContrastColors(state.footerColor);
    
    // Aplicar estilos globales después de un pequeño delay para asegurar que el DOM esté listo
    setTimeout(() => {
      applyGlobalStyles(state.headerColor, state.footerColor, headerContrast, footerContrast);
    }, 100);
  };

  // Estado inicial
  const initialState = {
    headerColor: savedHeader || '',
    footerColor: savedFooter || '',
    defaultColors: DEFAULT_COLORS,
    userId: userId,

    // Getters para colores de contraste
    getHeaderContrastColors: () => getContrastColors(get().headerColor),
    getFooterContrastColors: () => getContrastColors(get().footerColor),

    // Función para obtener color de texto (backward compatibility)
    getTextColor: (bgColor) => {
      const contrast = getContrastColors(bgColor);
      return contrast.textColor;
    },
 
    setHeaderColor: (color) => {
      const currentUserId = get().userId;
      setItem(`headerColor_${currentUserId}`, color);
      set({ headerColor: color });
      updateStyles();
    },

    setFooterColor: (color) => {
      const currentUserId = get().userId;
      setItem(`footerColor_${currentUserId}`, color);
      set({ footerColor: color });
      updateStyles();
    },

    resetToDefaults: () => {
      const currentUserId = get().userId;
      removeItem(`headerColor_${currentUserId}`);
      removeItem(`footerColor_${currentUserId}`);
      
      set({ 
        headerColor: '', 
        footerColor: '' 
      });
      
      // Limpiar estilos dinámicos
      const existingStyle = document.getElementById('dynamic-color-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
    },

    switchUser: (newUserId) => {
      clearPreviousUserData(newUserId);
      setItem('currentUserId', newUserId);
      
      const savedHeader = getItem(`headerColor_${newUserId}`);
      const savedFooter = getItem(`footerColor_${newUserId}`);
      
      set({
        userId: newUserId,
        headerColor: savedHeader || '',
        footerColor: savedFooter || ''
      });
      
      updateStyles();
    },

    clearUserData: () => {
      const currentUserId = get().userId;
      removeItem(`headerColor_${currentUserId}`);
      removeItem(`footerColor_${currentUserId}`);
      set({ 
        headerColor: '', 
        footerColor: '' 
      });
      
      // Limpiar estilos dinámicos
      const existingStyle = document.getElementById('dynamic-color-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
    },

    // Nueva función para aplicar estilos manualmente
    applyStyles: () => {
      updateStyles();
    }
  };

  // Aplicar estilos iniciales
  setTimeout(() => {
    updateStyles();
  }, 100);

  return initialState;
});