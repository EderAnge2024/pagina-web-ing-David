import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import useProductoStore from "../../store/ProductoStore";
import useCategoriaStore from "../../store/CategoriaStore";
import styles from './Menu.module.css';

// Imágenes
import lupa from '../../img/lupa.png';

// Constantes
const POLLING_INTERVAL = 10000; // 10 segundos
const MESSAGE_DURATION = 1500; // 1.5 segundos

const Menu = () => {
    // Hooks de estado local
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
    const [mensaje, setMensaje] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Estados del buscador
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [searchHistory, setSearchHistory] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    
    // Referencias
    const searchInputRef = useRef(null);
    const searchContainerRef = useRef(null);
    const debounceRef = useRef(null);

    // Hooks de stores
    const { productos, fetchProducto } = useProductoStore();
    const { categorias, fetchCategoria } = useCategoriaStore();

    // Efectos
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

    const renderSearchBar = () => (
        <div className={styles.search_menu} ref={searchContainerRef}>
            <form className={styles.search__container_menu} onSubmit={handleSearchSubmit}>
                <div className={`${styles.search__inputWrapper} ${
                    isSearchFocused ? styles['search__inputWrapper--focused'] : ''
                }`}>
                    <input 
                        ref={searchInputRef}
                        type="text" 
                        placeholder="Buscar en el menú..." 
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

    const renderCategoriasFilter = () => {
        if (!categorias || categorias.length === 0) return null;

        return (
            <div className={styles.filters}>
                <button
                    onClick={() => manejarSeleccionCategoria(null)}
                    className={`${styles.filters__category} ${
                        categoriaSeleccionada === null ? styles['filters__category--active'] : ''
                    }`}
                    aria-pressed={categoriaSeleccionada === null}
                >
                    Todas las categorías
                </button>
                {categorias.map((categoria) => (
                    <div key={categoria.ID_Categoria} className={styles.filters__categoryWrapper}>
                        <button
                            onClick={() => manejarSeleccionCategoria(categoria.ID_Categoria)}
                            className={`${styles.filters__category} ${
                                categoriaSeleccionada === categoria.ID_Categoria ? 
                                styles['filters__category--active'] : ''
                            }`}
                            aria-pressed={categoriaSeleccionada === categoria.ID_Categoria}
                        >
                            {categoria.Tipo_Producto}
                        </button>
                    </div>
                ))}
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
                }`}
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
                    <p className={styles.product__price}>
                        {precioFormateado}
                    </p>
                    <p className={styles.product__stock}>
                        Stock: {producto.cantidad_Disponible} unidades
                    </p>
                    
                    <button 
                        onClick={() => manejarCompra(producto)}
                        disabled={isOutOfStock}
                        className={`${styles.product__addButton} ${
                            isOutOfStock ? styles['product__addButton--disabled'] : ''
                        }`}
                        aria-label={`Agregar ${producto.Nombre_Producto} al carrito`}
                    >
                        {isOutOfStock ? 'Sin stock' : 'Agregar al carrito'}
                    </button>
                </div>
            </div>
        );
    };

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
            <>
                {renderSearchBar()}
                {renderResultsInfo()}
                {renderCategoriasFilter()}
                {renderProductos()}
            </>
        );
    };

    return (
        <div className={styles.menu}>
            {renderMensaje()}
            
            <div className={styles.menu__content}>
                <header className={styles.menu__header}>
                    <h2 className={styles.menu__title}>Nuestro Menú</h2>
                </header>
                
                {renderContent()}
            </div>
        </div>
    );
};

export default Menu;