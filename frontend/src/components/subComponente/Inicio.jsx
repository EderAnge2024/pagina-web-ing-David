import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import useImagenStore from "../../store/ImagenStore";
import useProductoStore from "../../store/ProductoStore";
import useClienteStore from "../../store/ClienteStore";
import styles from './inicio.module.css';

const Inicio = ({ searchQuery = "", onNavigateToProfile }) => {
    const navigate = useNavigate();
    const { imagenes, fetchImagen } = useImagenStore();
    const { productos, fetchProducto } = useProductoStore();
    const { isAuthenticated, verificarToken, initializeFromStorage } = useClienteStore();
    const [mensaje, setMensaje] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [mostrarPrecios, setMostrarPrecios] = useState(false);
    const [clienteAutenticado, setClienteAutenticado] = useState(false);
    
    // Estados para el carrusel
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    
    // Obtener todas las imágenes de banner
    const bannerImages = imagenes && Array.isArray(imagenes) 
        ? imagenes.filter(img => img.Tipo_Imagen === "Banner") 
        : [];

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);
        
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setIsLoading(true);
                await Promise.all([fetchImagen(), fetchProducto()]);
            } catch (error) {
                console.error("Error cargando datos:", error);
            } finally {
                setIsLoading(false);
            }
        };

        cargarDatos();
        
        const interval = setInterval(fetchProducto, 10000);
        return () => clearInterval(interval);
    }, [fetchImagen, fetchProducto]);

    // Verificar autenticación del cliente - LÓGICA ACTUALIZADA
    useEffect(() => {
        const verificarAutenticacion = async () => {
            try {
                // Primero inicializar desde localStorage
                const tokenEnStorage = initializeFromStorage();
                
                if (tokenEnStorage) {
                    // Si hay token en storage, verificar con el servidor
                    const esValido = await verificarToken();
                    console.log("¿Cliente autenticado?", esValido);
                    setMostrarPrecios(esValido);
                    setClienteAutenticado(esValido);
                } else {
                    // No hay token, cliente no autenticado
                    console.log("No hay token en storage");
                    setMostrarPrecios(false);
                    setClienteAutenticado(false);
                }
            } catch (error) {
                console.error("Error verificando autenticación:", error);
                setMostrarPrecios(false);
                setClienteAutenticado(false);
            }
        };

        verificarAutenticacion();
    }, [initializeFromStorage, verificarToken]);

    // También escuchar cambios en el estado de autenticación
    useEffect(() => {
        setClienteAutenticado(isAuthenticated);
        setMostrarPrecios(isAuthenticated);
    }, [isAuthenticated]);

    // Auto-play del carrusel
    useEffect(() => {
        if (!isAutoPlaying || bannerImages.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % bannerImages.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlaying, bannerImages.length]);

    const manejarCompra = (producto) => {
        if (producto.cantidad_Disponible <= 0) {
            setMensaje("❌ Producto sin stock disponible");
            setTimeout(() => setMensaje(""), 1500);
            return;
        }

        try {
            const carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];
            const productoExistente = carritoActual.find(p => p.ID_Producto === producto.ID_Producto);

            if (productoExistente) {
                if (productoExistente.cantidad >= producto.cantidad_Disponible) {
                    setMensaje("❌ No hay más stock disponible");
                    setTimeout(() => setMensaje(""), 1500);
                    return;
                }
                productoExistente.cantidad += 1;
            } else {
                carritoActual.push({ 
                    ...producto, 
                    cantidad: 1,
                    fechaAgregado: new Date().toISOString()
                });
            }

            localStorage.setItem("carrito", JSON.stringify(carritoActual));
            setMensaje("✅ Producto agregado al carrito");
            setTimeout(() => setMensaje(""), 1500);
        } catch (error) {
            console.error("Error al agregar producto:", error);
            setMensaje("❌ Error al agregar producto");
            setTimeout(() => setMensaje(""), 1500);
        }
    };

    // Manejar clic en producto cuando no está autenticado
    const manejarClickProducto = (producto) => {
        if (!clienteAutenticado) {
            // Llamar al callback para navegar al perfil
            if (onNavigateToProfile) {
                onNavigateToProfile();
            }
            setMensaje("🔒 Inicia sesión para ver detalles y comprar");
            setTimeout(() => setMensaje(""), 2000);
        }
    };

    // Funciones del carrusel
    const nextSlide = () => {
        setCurrentSlide(prev => (prev + 1) % bannerImages.length);
    };

    const prevSlide = () => {
        setCurrentSlide(prev => (prev - 1 + bannerImages.length) % bannerImages.length);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    const handleMouseEnter = () => {
        setIsAutoPlaying(false);
    };

    const handleMouseLeave = () => {
        setIsAutoPlaying(true);
    };

    const obtenerProductosDestacados = () => {
        if (!productos || !Array.isArray(productos)) return [];
        
        const productosDisponibles = productos.filter(producto => 
            producto && 
            producto.Nombre_Producto && 
            producto.cantidad_Disponible > 0
        );

        const productosFiltradosPorBusqueda = searchQuery && searchQuery.trim() !== ''
            ? productosDisponibles.filter(producto =>
                producto.Nombre_Producto.toLowerCase().includes(searchQuery.toLowerCase())
            )
            : productosDisponibles;

        const productosDestacados = productosFiltradosPorBusqueda
            .sort((a, b) => {
                const aStockLimitado = a.cantidad_Disponible < 10;
                const bStockLimitado = b.cantidad_Disponible < 10;
                
                if (aStockLimitado && !bStockLimitado) return -1;
                if (!aStockLimitado && bStockLimitado) return 1;
                
                const precioA = parseFloat(a.Precio_Final) || 0;
                const precioB = parseFloat(b.Precio_Final) || 0;
                
                if (precioA !== precioB) return precioB - precioA;
                
                return b.cantidad_Disponible - a.cantidad_Disponible;
            })
            .slice(0, 8);

        return productosDestacados;
    };

    const productosDestacados = obtenerProductosDestacados();

    const renderProductCard = (producto) => {
        const precioFormateado = new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN'
        }).format(producto.Precio_Final);

        const isStockLimitado = producto.cantidad_Disponible < 10;
        const isOutOfStock = producto.cantidad_Disponible <= 0;

        return (
            <div 
                key={producto.ID_Producto} 
                className={`${styles.productCard} ${!clienteAutenticado ? styles.clickableCard : ''}`}
                onClick={() => manejarClickProducto(producto)}
            >
                <div className={styles.productImageContainer}>
                    <img 
                        src={producto.Url || '/placeholder-image.png'} 
                        alt={producto.Nombre_Producto || 'Producto'}
                        className={styles.productImage}
                        onError={(e) => {
                            e.target.src = '/placeholder-image.png';
                        }}
                    />
                    {isStockLimitado && !isOutOfStock && (
                        <div className={styles.stockBadge}>
                            ¡Últimas {producto.cantidad_Disponible} unidades!
                        </div>
                    )}
                    {isOutOfStock && (
                        <div className={styles.outOfStockBadge}>
                            Sin Stock
                        </div>
                    )}
                </div>
                
                <div className={styles.productInfo}>
                    <h3 className={styles.productName}>
                        {producto.Nombre_Producto || 'Sin nombre'}
                    </h3>
                    {/* LÓGICA DE PRECIOS PROTEGIDOS */}
                    {mostrarPrecios ? (
                        <p className={styles.productPrice}>
                            {precioFormateado}
                        </p>
                    ) : (
                        <p className={styles.productPrice}>
                            🔒 Inicia sesión para ver precios
                        </p>
                    )}
                    <p className={styles.productStock}>
                        Stock: {producto.cantidad_Disponible || 0} unidades
                    </p>
                    
                    {/* Mostrar botón solo si está autenticado */}
                    {clienteAutenticado ? (
                        <button 
                            onClick={(e) => {
                                e.stopPropagation(); // Evitar que se ejecute el click del card
                                manejarCompra(producto);
                            }}
                            disabled={isOutOfStock}
                            className={`${styles.addToCartBtn} ${isOutOfStock ? styles.disabled : ''}`}
                        >
                            {isOutOfStock ? "Sin Stock" : "Agregar al Carrito"}
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

    // Render del carrusel de banners
    const renderCarousel = () => {
        if (bannerImages.length === 0) {
            return (
                <div className={styles.heroBanner} style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/placeholder-banner.jpg')`,
                }}>
                    <div className={styles.bannerContent}>
                        <h1 className={styles.bannerTitle}>Compra los mejores productos</h1>
                        <p className={styles.bannerSubtitle}>Descubre la calidad de nuestros productos y los mejores servicios</p>
                        <button className={styles.bannerCta}>¡Compre ya!</button>
                    </div>
                </div>
            );
        }

        if (bannerImages.length === 1) {
            return (
                <div className={styles.heroBanner} style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${bannerImages[0].URL})`,
                }}>
                    <div className={styles.bannerContent}>
                        <h1 className={styles.bannerTitle}>Compra los mejores productos</h1>
                        <p className={styles.bannerSubtitle}>Descubre la calidad de nuestros productos y los mejores servicios</p>
                        <button className={styles.bannerCta}>¡Compre ya!</button>
                    </div>
                </div>
            );
        }

        return (
            <div 
                className={styles.carouselContainer}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div className={styles.carouselWrapper}>
                    {bannerImages.map((banner, index) => (
                        <div 
                            key={banner.ID_Imagen} 
                            className={`${styles.carouselSlide} ${index === currentSlide ? styles.active : ''}`}
                            style={{
                                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${banner.URL})`,
                            }}
                        >
                            <div className={styles.bannerContent}>
                                <h1 className={styles.bannerTitle}>
                                    {banner.Titulo || "Compra los mejores productos"}
                                </h1>
                                <p className={styles.bannerSubtitle}>
                                    {banner.Descripcion || "Descubre la calidad de nuestros productos y los mejores servicios"}
                                </p>
                                <button className={styles.bannerCta}>¡Compre ya!</button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Botones de navegación */}
                <button 
                    className={`${styles.carouselBtn} ${styles.prevBtn}`}
                    onClick={prevSlide}
                    aria-label="Imagen anterior"
                >
                    &#8249;
                </button>
                <button 
                    className={`${styles.carouselBtn} ${styles.nextBtn}`}
                    onClick={nextSlide}
                    aria-label="Siguiente imagen"
                >
                    &#8250;
                </button>

                {/* Indicadores de puntos */}
                <div className={styles.carouselDots}>
                    {bannerImages.map((_, index) => (
                        <button
                            key={index}
                            className={`${styles.dot} ${index === currentSlide ? styles.activeDot : ''}`}
                            onClick={() => goToSlide(index)}
                            aria-label={`Ir a imagen ${index + 1}`}
                        />
                    ))}
                </div>

                {/* Indicador de progreso */}
                <div className={styles.progressBar}>
                    <div 
                        className={styles.progressFill}
                        style={{
                            width: `${((currentSlide + 1) / bannerImages.length) * 100}%`
                        }}
                    />
                </div>
            </div>
        );
    };

    return (
        <div className={styles.container}>
            {mensaje && (
                <div className={`${styles.toast} ${
                    mensaje.includes('✅') ? styles.success : styles.error
                }`}>
                    {mensaje}
                </div>
            )}
    
            {renderCarousel()}
    
            <div className={styles.featuredProducts}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Productos destacados <span className={styles.highlight}>✨</span></h2>
                    {searchQuery && (
                        <p className={styles.searchInfo}>
                            Mostrando resultados para: <strong>{searchQuery}</strong>
                        </p>
                    )}
                </div>

                <div className={styles.productsGrid}>
                    {isLoading ? (
                        <div className={styles.loadingContainer}>
                            <div className={styles.loadingSpinner}></div>
                            <p className={styles.loadingText}>Cargando productos destacados...</p>
                        </div>
                    ) : productosDestacados.length === 0 ? (
                        <div className={styles.emptyState}>
                            {searchQuery ? (
                                <p className={styles.emptyText}>No se encontraron productos para <strong>{searchQuery}</strong></p>
                            ) : (
                                <p className={styles.emptyText}>No hay productos destacados disponibles en este momento</p>
                            )}
                            <button 
                                className={styles.refreshButton}
                                onClick={() => window.location.reload()}
                            >
                                Recargar productos
                            </button>
                        </div>
                    ) : (
                        <div className={styles.productsContainer}>
                            {productosDestacados.map(renderProductCard)}
                        </div>
                    )}
                </div>

                {!searchQuery && !isLoading && productosDestacados.length > 0 && (
                    <div className={styles.featuredInfo}>
                        <p className={styles.infoText}>
                            💡 Los productos destacados incluyen artículos premium, 
                            con stock limitado y los más populares de nuestra tienda.
                            {!clienteAutenticado && " Inicia sesión para ver precios y comprar."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

Inicio.propTypes = {
    searchQuery: PropTypes.string,
    onNavigateToProfile: PropTypes.func
};
 
export default Inicio;