import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import useProductoStore from "../../store/ProductoStore";
import useBusquedaStore from "../../store/BusquedaStore";
import useClienteStore from "../../store/ClienteStore";
import useCategoriaStore from "../../store/CategoriaStore";
import styles from './Menu.module.css';
import PropTypes from "prop-types";

// Imágenes
import lupa from '../../img/lupa.png'; 

// Constantes
const POLLING_INTERVAL = 10000; // 10 segundos
const MESSAGE_DURATION = 1500; // 1.5 segundos

const Menu = ({ onNavigateToProfile }) => {
    // Hooks de estado local
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
    const [mensaje, setMensaje] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Estados del sidebar estilo YouTube
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    // Estados del buscador
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [searchHistory, setSearchHistory] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    
    // Referencias
    const searchInputRef = useRef(null);
    const searchContainerRef = useRef(null);
    const sidebarRef = useRef(null);

    // Hooks de stores
    const { productos, fetchProducto } = useProductoStore();
    const { categorias, fetchCategoria } = useCategoriaStore();
    const { 
        isAuthenticated, 
        clienteActual, 
        verificarToken, 
        initializeFromStorage 
    } = useClienteStore();

    // ⭐ EFECTO DE INICIALIZACIÓN Y VERIFICACIÓN DE AUTENTICACIÓN
    useEffect(() => {
        const inicializarAuth = async () => {
            try {
                // Primero intentar inicializar desde localStorage
                const hasStoredAuth = initializeFromStorage();
                
                if (hasStoredAuth) {
                    // Si hay datos guardados, verificar que el token sigue siendo válido
                    await verificarToken();
                } else {
                    console.log("No hay autenticación guardada");
                }
            } catch (error) {
                console.error("Error inicializando autenticación:", error);
            }
        };

        inicializarAuth();
    }, [initializeFromStorage, verificarToken]);

    // Efectos de carga de datos
    useEffect(() => {
        const inicializarDatos = async () => {
            try {
                setIsLoading(true);
                setError(null);
                await Promise.all([fetchCategoria(), fetchProducto()]);
            } catch (err) {
                setError("Error al cargar los datos del menú");
                console.error("Error inicializando datos:", err);
            } finally {
                setIsLoading(false);
            }
        };

        inicializarDatos();

        // Polling para actualizar productos
        const interval = setInterval(async () => {
            try {
                await fetchProducto();
            } catch (err) {
                console.error("Error en polling de productos:", err);
            }
        }, POLLING_INTERVAL);

        return () => clearInterval(interval); 
    }, [fetchProducto, fetchCategoria]);

    // Cargar historial de búsqueda
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);
    
    useEffect(() => {
        const savedHistory = JSON.parse(localStorage.getItem('menuSearchHistory') || '[]');
        setSearchHistory(savedHistory.slice(0, 5));
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

    // Cerrar sidebar con Escape
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && sidebarOpen) {
                setSidebarOpen(false);
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [sidebarOpen]);

    // Memoización de productos filtrados
    const productosFiltrados = useMemo(() => {
        if (!productos || !Array.isArray(productos)) return [];

        return productos.filter(producto => {
            if (!producto) return false;
            
            const coincideCategoria = categoriaSeleccionada === null || 
                                    producto.ID_Categoria === categoriaSeleccionada;
            
            const coincideBusqueda = !searchQuery || 
                                   producto.Nombre_Producto?.toLowerCase()
                                           .includes(searchQuery.toLowerCase());
            
            return coincideCategoria && coincideBusqueda;
        });
    }, [productos, categoriaSeleccionada, searchQuery]);

    // Sugerencias de búsqueda basadas en productos
    const suggestions = useMemo(() => {
        if (!productos || productos.length === 0) return [];
        
        if (searchQuery) {
            // Mostrar productos que coincidan parcialmente
            return productos
                .filter(producto => 
                    producto.Nombre_Producto?.toLowerCase()
                        .includes(searchQuery.toLowerCase()) &&
                    producto.Nombre_Producto?.toLowerCase() !== searchQuery.toLowerCase()
                )
                .slice(0, 5)
                .map(producto => ({
                    id: producto.ID_Producto,
                    text: producto.Nombre_Producto,
                    type: 'product'
                }));
        } else if (isSearchFocused) {
            // Mostrar historial y productos populares
            const historySuggestions = searchHistory.map(item => ({ 
                ...item, 
                type: 'history' 
            }));
            
            const popularProducts = productos
                .slice(0, 3)
                .map(producto => ({
                    id: producto.ID_Producto,
                    text: producto.Nombre_Producto,
                    type: 'popular'
                }));
            
            return [...historySuggestions, ...popularProducts];
        }
        
        return [];
    }, [productos, searchQuery, isSearchFocused, searchHistory]);

    // Handlers
    const manejarSeleccionCategoria = useCallback((categoriaId) => {
        setCategoriaSeleccionada(prev => 
            prev === categoriaId ? null : categoriaId
        );
        // Cerrar sidebar en móviles después de seleccionar
        if (window.innerWidth <= 1024) {
            setSidebarOpen(false);
        }
    }, []);

    const mostrarMensaje = useCallback((texto) => {
        setMensaje(texto);
        setTimeout(() => setMensaje(""), MESSAGE_DURATION);
    }, []);

    const manejarCompra = useCallback((producto) => {
        if (!producto || producto.cantidad_Disponible <= 0) {
            mostrarMensaje("❌ Producto no disponible");
            return;
        }

        try {
            const carritoActual = JSON.parse(localStorage.getItem("carrito") || "[]");
            
            const productoIndex = carritoActual.findIndex(
                p => p.ID_Producto === producto.ID_Producto
            );

            if (productoIndex !== -1) {
                const cantidadEnCarrito = carritoActual[productoIndex].cantidad;
                if (cantidadEnCarrito >= producto.cantidad_Disponible) {
                    mostrarMensaje("❌ No hay más stock disponible");
                    return;
                }
                carritoActual[productoIndex].cantidad += 1;
            } else {
                carritoActual.push({ 
                    ...producto, 
                    cantidad: 1,
                    fechaAgregado: new Date().toISOString()
                });
            }

            localStorage.setItem("carrito", JSON.stringify(carritoActual));
            mostrarMensaje("✅ Producto agregado al carrito");

        } catch (error) {
            console.error("Error al agregar producto al carrito:", error);
            mostrarMensaje("❌ Error al agregar producto");
        }
    }, [mostrarMensaje]);

    // ⭐ FUNCIÓN ACTUALIZADA: Manejar clic en producto cuando no está autenticado
    const manejarClickProducto = useCallback((producto) => {
        if (!isAuthenticated) {
            // Llamar al callback para navegar al perfil
            if (onNavigateToProfile) {
                onNavigateToProfile();
            }
            mostrarMensaje("🔒 Inicia sesión para ver detalles y comprar");
        }
    }, [isAuthenticated, onNavigateToProfile, mostrarMensaje]);

    // Handlers del buscador
    const handleSearchChange = useCallback((e) => {
        const value = e.target.value;
        setSearchQuery(value);
        
        if (value.trim()) {
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    }, []);

    const handleSearchFocus = useCallback(() => {
        setIsSearchFocused(true);
        if (!searchQuery && suggestions.length > 0) {
            setShowSuggestions(true);
        }
    }, [searchQuery, suggestions.length]);

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
        localStorage.setItem('menuSearchHistory', JSON.stringify(updatedHistory));
        
        setShowSuggestions(false);
        searchInputRef.current?.blur();
    }, [searchQuery, searchHistory]);

    const handleSuggestionClick = useCallback((suggestion) => {
        setSearchQuery(suggestion.text);
        setShowSuggestions(false);
        searchInputRef.current?.blur();
    }, []);

    const clearSearch = useCallback(() => {
        setSearchQuery('');
        setShowSuggestions(false);
        searchInputRef.current?.focus();
    }, []);

    // Handlers del sidebar
    const toggleSidebar = useCallback(() => {
        setSidebarOpen(prev => !prev);
    }, []);

    const closeSidebar = useCallback(() => {
        setSidebarOpen(false);
    }, []);

    // Calcular conteo de productos por categoría
    const categoriasConConteo = useMemo(() => {
        if (!categorias || !productos) return [];
        
        return categorias.map(categoria => {
            const conteo = productos.filter(producto => 
                producto.ID_Categoria === categoria.ID_Categoria
            ).length;
            
            return {
                ...categoria,
                conteo
            };
        });
    }, [categorias, productos]);

    // Componentes auxiliares
    const renderMensaje = () => {
        if (!mensaje) return null;
        
        return (
            <div className={`${styles.toast} ${
                mensaje.includes('✅') ? styles['toast--success'] : styles['toast--error']
            }`}>
                {mensaje}
            </div>
        );
    };

    const renderSidebar = () => {
        if (!categorias || categorias.length === 0) return null;
        
        return (
            <>
                {/* Overlay */}
                <div 
                    className={`${styles.sidebar__overlay} ${
                        sidebarOpen ? styles['sidebar__overlay--visible'] : ''
                    }`}
                    onClick={closeSidebar}
                />
                
                {/* Botón toggle */}
                <button 
                    className={styles.menu__sidebarToggle}
                    onClick={toggleSidebar}
                    aria-label="Abrir menú de categorías"
                >
                    ☰
                </button>
                
                {/* Sidebar */}
                <aside 
                    ref={sidebarRef}
                    className={`${styles.sidebar} ${
                        sidebarOpen ? styles['sidebar--open'] : ''
                    }`}
                >
                    <header className={styles.sidebar__header}>
                        <h3 className={styles.sidebar__title}>Categorías</h3>
                        <button 
                            className={styles.sidebar__close}
                            onClick={closeSidebar}
                            aria-label="Cerrar menú"
                        >
                            ✕
                        </button>
                    </header>
                    
                    <div className={styles.sidebar__content}>
                        <div className={styles.sidebar__categories}>
                            {/* Categoría "Todas" */}
                            <button
                                onClick={() => manejarSeleccionCategoria(null)}
                                className={`${styles.sidebar__category} ${
                                    categoriaSeleccionada === null ? styles['sidebar__category--active'] : ''
                                }`}
                                aria-pressed={categoriaSeleccionada === null}
                            >
                                <span className={styles.sidebar__categoryIcon}>🏠</span>
                                <span className={styles.sidebar__categoryText}>Todas las categorías</span>
                                <span className={styles.sidebar__categoryCount}>
                                    {productos ? productos.length : 0}
                                </span>
                            </button>
                            
                            {/* Categorías individuales */}
                            {categoriasConConteo.map((categoria) => (
                                <button
                                    key={categoria.ID_Categoria}
                                    onClick={() => manejarSeleccionCategoria(categoria.ID_Categoria)}
                                    className={`${styles.sidebar__category} ${
                                        categoriaSeleccionada === categoria.ID_Categoria ? 
                                        styles['sidebar__category--active'] : ''
                                    }`}
                                    aria-pressed={categoriaSeleccionada === categoria.ID_Categoria}
                                >
                                    <span className={styles.sidebar__categoryIcon}>
                                        {categoria.Tipo_Producto === 'Bebidas' ? '🥤' :
                                         categoria.Tipo_Producto === 'Platos Principales' ? '🍽️' :
                                         categoria.Tipo_Producto === 'Postres' ? '🍰' :
                                         categoria.Tipo_Producto === 'Entradas' ? '🥗' :
                                         categoria.Tipo_Producto === 'Sopas' ? '🍲' : '🍴'}
                                    </span>
                                    <span className={styles.sidebar__categoryText}>
                                        {categoria.Tipo_Producto}
                                    </span>
                                    <span className={styles.sidebar__categoryCount}>
                                        {categoria.conteo}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>
            </>
        );
    };

    const renderSearchBar = () => (
        <div className={styles.search_menu} ref={searchContainerRef}>
            <form className={styles.search__container_menu} onSubmit={handleSearchSubmit}>
                <div className={`${styles.search__inputWrapper} ${
                    isSearchFocused ? styles['search__inputWrapper--focused'] : ''
                }`}>
                    <input 
                        ref={searchInputRef}
                        type="text" 
                        placeholder="Buscar en las categorias..." 
                        className={styles.search__input}
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onFocus={handleSearchFocus}
                        aria-label="Buscar productos en el menú"
                        autoComplete="off"
                    />
                    
                    {searchQuery && (
                        <button 
                            type="button" 
                            className={styles.search__clear}
                            onClick={clearSearch}
                            aria-label="Limpiar búsqueda"
                        >
                            ×
                        </button>
                    )}
                    
                    <button 
                        type="submit" 
                        className={styles.search__button} 
                        aria-label="Buscar"
                    >
                        <img src={lupa} alt="Buscar" className={styles.search__buttonIcon} />
                    </button>
                </div>
            </form>

            {/* Sugerencias */}
            {showSuggestions && suggestions.length > 0 && (
                <div className={styles.search__dropdown}>
                    <div className={styles.search__suggestions}>
                        <div className={styles.search__suggestionsHeader}>
                            <span>
                                {searchQuery ? 'Sugerencias' : 'Búsquedas recientes y populares'}
                            </span>
                        </div>
                        {suggestions.map(suggestion => (
                            <button
                                key={`${suggestion.type}-${suggestion.id}`}
                                className={styles.search__suggestion}
                                onClick={() => handleSuggestionClick(suggestion)}
                            >
                                <span className={styles.search__suggestionIcon}>
                                    {suggestion.type === 'history' ? '🕐' : 
                                     suggestion.type === 'popular' ? '🔥' : '🍽️'}
                                </span>
                                <span>{suggestion.text}</span>
                                {suggestion.type === 'history' && (
                                    <span className={styles.search__suggestionLabel}>Reciente</span>
                                )}
                                {suggestion.type === 'popular' && (
                                    <span className={styles.search__suggestionLabel}>Popular</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    const renderResultsInfo = () => {
        if (!searchQuery) return null;
        
        const totalResults = productosFiltrados.length;
        return (
            <div className={styles.resultsInfo}>
                <p>
                    {totalResults === 0 
                        ? `No se encontraron productos para "${searchQuery}"`
                        : `${totalResults} producto${totalResults !== 1 ? 's' : ''} encontrado${totalResults !== 1 ? 's' : ''} para "${searchQuery}"`
                    }
                </p>
                {searchQuery && (
                    <button 
                        onClick={clearSearch}
                        className={styles.resultsInfo__clear}
                    >
                        Limpiar búsqueda
                    </button>
                )}
            </div>
        );
    };

    const renderProductCard = (producto) => {
        const isOutOfStock = producto.cantidad_Disponible <= 0;
        const precioFormateado = new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN'
        }).format(producto.Precio_Final);

        return (
            <div 
                key={producto.ID_Producto} 
                className={`${styles.product} ${
                    isOutOfStock ? styles['product--out-of-stock'] : ''
                } ${!isAuthenticated ? styles.clickableCard : ''}`}
                onClick={() => manejarClickProducto(producto)}
            >
                <div className={styles.product__imageContainer}>
                    <img 
                        src={producto.Url} 
                        alt={producto.Nombre_Producto}
                        className={styles.product__image}
                        loading="lazy"
                        onError={(e) => {
                            e.target.src = '/placeholder-image.png';
                        }}
                    />
                    {isOutOfStock && (
                        <div className={styles.product__badge}>
                            Sin stock
                        </div>
                    )}
                </div>
                
                <div className={styles.product__info}>
                    <h3 className={styles.product__name}>
                        {producto.Nombre_Producto}
                    </h3>
                    {/* ⭐ LÓGICA DE PRECIOS ACTUALIZADA */}
                    {isAuthenticated ? (
                        <p className={styles.product__price}>
                            {precioFormateado}
                        </p>
                    ) : (
                        <p className={styles.product__price}>
                            🔒 Inicia sesión para ver precios
                        </p>
                    )}
                    <p className={styles.product__stock}>
                        Stock: {producto.cantidad_Disponible} unidades
                    </p>
                    
                    {/* ⭐ BOTONES ACTUALIZADOS */}
                    {isAuthenticated ? (
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                manejarCompra(producto);
                            }}
                            disabled={isOutOfStock}
                            className={`${styles.product__addButton} ${
                                isOutOfStock ? styles['product__addButton--disabled'] : ''
                            }`}
                            aria-label={`Agregar ${producto.Nombre_Producto} al carrito`}
                        >
                            {isOutOfStock ? 'Sin stock' : 'Agregar al carrito'}
                        </button>
                    ) : (
                        <div className={styles.loginPrompt}>
                            <p className={styles.loginText}>
                                🔒 Inicia sesión para comprar
                            </p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderProductos = () => {
        if (productosFiltrados.length === 0) {
            return (
                <div className={styles.empty}>
                    {searchQuery ? 
                        `No se encontraron productos que coincidan con "${searchQuery}"` :
                        'No hay productos disponibles en esta categoría'
                    }
                </div>
            );
        }

        return (
            <div className={styles.products}>
                {productosFiltrados.map(renderProductCard)}
            </div>
        );
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className={styles.loading}>
                    <div className={styles.loading__spinner}></div>
                    <p className={styles.loading__text}>Cargando menú...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className={styles.error}>
                    <p className={styles.error__message}>{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className={styles.error__retryButton}
                    >
                        Reintentar
                    </button>
                </div>
            );
        }

        return (
            <div className={styles.menu__main}>
                <div className={styles.menu__content}>
                    <header className={styles.menu__header}>
                        <h2 className={styles.menu__title}>Nuestros Productos</h2>
                        {/* ⭐ MENSAJE ACTUALIZADO */}
                        {!isAuthenticated && (
                            <p className={styles.menu__subtitle}>
                                🔒 Inicia sesión para ver precios y realizar compras
                            </p>
                        )}
                        {/* ⭐ INFORMACIÓN DE CLIENTE AUTENTICADO (OPCIONAL) */}
                        {isAuthenticated && clienteActual && (
                            <p className={styles.menu__welcome}>
                                ¡Bienvenido/a, {clienteActual.Nombre_Cliente}! 🎉
                            </p>
                        )}
                    </header>
                    
                    {renderSearchBar()}
                    {renderResultsInfo()}
                    {renderProductos()}
                </div>
            </div>
        );
    };

    return (
        <div className={styles.menu}>
            {renderMensaje()}
            {renderSidebar()}
            {renderContent()}
        </div> 
    );
}; 

Menu.propTypes = {
    onNavigateToProfile: PropTypes.func
};

export default Menu;