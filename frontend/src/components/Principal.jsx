import { useState, useEffect, useCallback, useMemo, useRef } from "react";
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
import lupa from '../img/lupa.png';
import servicio from '../img/servicio.png';
// Estilos y stores
import styles from './principal.module.css';
import useImagenStore from "../store/ImagenStore";
import useBusquedaStore from "../store/BusquedaStore";

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

// Datos de ejemplo para el buscador (deberías reemplazar esto con tus datos reales)
const SAMPLE_PRODUCTS = [
  { id: 1, name: 'Pizza Margarita', category: 'Comida', price: 25.99 },
  { id: 2, name: 'Hamburguesa Clásica', category: 'Comida', price: 18.50 },
  { id: 3, name: 'Ensalada César', category: 'Comida', price: 12.00 },
  { id: 4, name: 'Coca Cola', category: 'Bebida', price: 3.50 },
  { id: 5, name: 'Agua Mineral', category: 'Bebida', price: 2.00 },
  { id: 6, name: 'Café Americano', category: 'Bebida', price: 4.00 },
  { id: 7, name: 'Delivery Express', category: 'Servicio', price: 5.00 },
  { id: 8, name: 'Catering Eventos', category: 'Servicio', price: 150.00 }
];

const SEARCH_CATEGORIES = ['Todos', 'Comida', 'Bebida', 'Servicio'];

const Principal = () => {
  // Hooks de estado
  const [activateComponent, setActivateComponent] = useState('inicio');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Estados del buscador mejorado
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Referencias
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);
  const debounceRef = useRef(null);
  
  // Hooks de navegación y stores
  const navigate = useNavigate();
  const { fetchImagen, imagenes } = useImagenStore();
  const { searchQuery, setSearchQuery } = useBusquedaStore();

  // Efectos
  useEffect(() => {
    fetchImagen();
  }, [fetchImagen]);

  // Cargar historial de búsqueda desde localStorage (simulado en memoria)
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    setSearchHistory(savedHistory.slice(0, 5)); // Mantener solo los últimos 5
  }, []);

  // Manejar clicks fuera del buscador
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Función de búsqueda optimizada con debounce
  const performSearch = useCallback((query, category = 'Todos') => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    
    // Simular delay de API
    setTimeout(() => {
      const filtered = SAMPLE_PRODUCTS.filter(product => {
        const matchesQuery = product.name.toLowerCase().includes(query.toLowerCase()) ||
                           product.category.toLowerCase().includes(query.toLowerCase());
        const matchesCategory = category === 'Todos' || product.category === category;
        return matchesQuery && matchesCategory;
      });

      setSearchResults(filtered);
      setIsSearching(false);
    }, 300);
  }, []);

  // Búsqueda en tiempo real con debounce
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (searchQuery) {
        performSearch(searchQuery, selectedCategory);
        setShowSuggestions(true);
      } else {
        setSearchResults([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery, selectedCategory, performSearch]);

  // Sugerencias basadas en historial y productos populares
  const suggestions = useMemo(() => {
    if (!isSearchFocused || searchQuery) return [];
    
    const historySuggestions = searchHistory.map(item => ({ ...item, type: 'history' }));
    const popularProducts = SAMPLE_PRODUCTS.slice(0, 3).map(product => ({
      id: product.id,
      text: product.name,
      type: 'popular'
    }));
    
    return [...historySuggestions, ...popularProducts];
  }, [isSearchFocused, searchQuery, searchHistory]);

  // Handlers
  const handleNavClick = useCallback((component) => {
    setActivateComponent(component);
    setIsMenuOpen(false);
  }, []);

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim()) {
      setShowSuggestions(true);
    }
  }, [setSearchQuery]);

  const handleSearchFocus = useCallback(() => {
    setIsSearchFocused(true);
    if (!searchQuery && (searchHistory.length > 0 || suggestions.length > 0)) {
      setShowSuggestions(true);
    }
  }, [searchQuery, searchHistory.length, suggestions.length]);

  const handleSearchSubmit = useCallback((e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Agregar al historial
    const newHistoryItem = {
      id: Date.now(),
      text: searchQuery.trim(),
      timestamp: new Date().toISOString()
    };

    const updatedHistory = [
      newHistoryItem,
      ...searchHistory.filter(item => item.text !== searchQuery.trim())
    ].slice(0, 5);

    setSearchHistory(updatedHistory);
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    
    // Realizar búsqueda
    performSearch(searchQuery, selectedCategory);
    setShowSuggestions(false);
    
    // Cambiar a la sección de menú para mostrar resultados
    if (searchResults.length > 0) {
      setActivateComponent('menu');
    }
    
    console.log('Búsqueda realizada:', { query: searchQuery, category: selectedCategory });
  }, [searchQuery, searchHistory, selectedCategory, performSearch, searchResults.length]);

  const handleSuggestionClick = useCallback((suggestion) => {
    setSearchQuery(suggestion.text);
    setShowSuggestions(false);
    searchInputRef.current?.blur();
    
    // Realizar búsqueda inmediata
    performSearch(suggestion.text, selectedCategory);
  }, [selectedCategory, performSearch, setSearchQuery]);

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
    if (searchQuery) {
      performSearch(searchQuery, category);
    }
  }, [searchQuery, performSearch]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSuggestions(false);
    searchInputRef.current?.focus();
  }, [setSearchQuery]);

  const goToLogin = useCallback(() => {
    navigate('/loginFrom');
  }, [navigate]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  // Componentes auxiliares
  const renderLogo = () => (
  <div className={styles.logo_container}>
    {imagenes
      .filter((img) => img.Tipo_Imagen === "Logo")
      .map((img) => (
        <div 
          key={img.ID_Imagen} 
          className={styles.logo}
          onClick={() => window.location.href = "/"} // Recarga la página
        >
          <img src={img.URL} alt="Logo de la empresa" />
        </div>
      ))
    }
  </div>
)

  const renderSearchBar = () => (
    <div className={styles.enhanced_search_wrapper} ref={searchContainerRef}>
      <form className={styles.search_container} onSubmit={handleSearchSubmit}>
        <div className={styles.search_input_wrapper}>
          <input 
            ref={searchInputRef}
            type="text" 
            placeholder="Buscar productos, servicios..." 
            className={`${styles.search_input} ${isSearchFocused ? styles.focused : ''}`}
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            aria-label="Buscar productos"
            autoComplete="off"
          />
          
          {searchQuery && (
            <button 
              type="button" 
              className={styles.clear_search}
              onClick={clearSearch}
              aria-label="Limpiar búsqueda"
            >
              ×
            </button>
          )}
          
          <button 
            type="submit" 
            className={styles.search_button} 
            aria-label="Buscar"
            disabled={isSearching}
          >
            {isSearching ? (
              <div className={styles.loading_spinner}></div>
            ) : (
              <img src={lupa} alt="Buscar" />
            )}
          </button>
        </div>

        {/* Filtros de categoría */}
        <div className={styles.category_filters}>
          {SEARCH_CATEGORIES.map(category => (
            <button
              key={category}
              type="button"
              className={`${styles.category_btn} ${selectedCategory === category ? styles.active : ''}`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </form>

      {/* Sugerencias y resultados */}
      {showSuggestions && (
        <div className={styles.search_dropdown}>
          {/* Sugerencias cuando no hay query */}
          {!searchQuery && suggestions.length > 0 && (
            <div className={styles.suggestions_section}>
              <div className={styles.section_header}>
                <span>Sugerencias</span>
              </div>
              {suggestions.map(suggestion => (
                <button
                  key={`${suggestion.type}-${suggestion.id}`}
                  className={styles.suggestion_item}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <span className={styles.suggestion_icon}>
                    {suggestion.type === 'history' ? '🕐' : '🔥'}
                  </span>
                  <span>{suggestion.text}</span>
                  {suggestion.type === 'history' && (
                    <span className={styles.suggestion_label}>Reciente</span>
                  )}
                  {suggestion.type === 'popular' && (
                    <span className={styles.suggestion_label}>Popular</span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Resultados de búsqueda */}
          {searchQuery && (
            <div className={styles.results_section}>
              <div className={styles.section_header}>
                <span>
                  {isSearching ? 'Buscando...' : `${searchResults.length} resultado${searchResults.length !== 1 ? 's' : ''}`}
                </span>
              </div>
              
              {!isSearching && searchResults.length === 0 && (
                <div className={styles.no_results}>
                  <span>No se encontraron resultados para {searchQuery}</span>
                </div>
              )}

              {searchResults.map(result => (
                <div key={result.id} className={styles.result_item}>
                  <div className={styles.result_info}>
                    <span className={styles.result_name}>{result.name}</span>
                    <span className={styles.result_category}>{result.category}</span>
                  </div>
                  <span className={styles.result_price}>S/ {result.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

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
      menu: <Menu searchResults={searchResults} searchQuery={searchQuery} />,
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
        <p>© {new Date().getFullYear()} Tu Empresa. Todos los derechos reservados por AFACEA.</p>
      </div>
    </footer>
  );

  return (
    <div className={styles.principal_container}>
      <header className={styles.modern_header}>
        {renderLogo()}
        {/* {renderSearchBar()} */}
        {renderHamburgerMenu()}
        {renderNavigation()}
      </header>
      
      {renderMainContent()}
      {renderFooter()}
    </div>
  );
};

export default Principal;