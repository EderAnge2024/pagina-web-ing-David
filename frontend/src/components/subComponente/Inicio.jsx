import { useState, useEffect, useMemo, useCallback } from "react";
import useImagenStore from "../../store/ImagenStore";
import useProductoStore from "../../store/ProductoStore";
import styles from './inicio.module.css';

const Inicio = ({ searchQuery = "" }) => {
    const { 
        imagens, 
        fetchImagen, 
        loading: loadingImagen, 
        error: errorImagen 
    } = useImagenStore();
    
    const { 
        productos, 
        fetchProducto, 
        loading: loadingProductos, 
        error: errorProductos 
    } = useProductoStore();
    
    const [mensaje, setMensaje] = useState("");

    // Memoizar la imagen del banner
    const bannerImg = useMemo(() => 
        imagens?.find(img => img.Tipo_Imagen === "Banner"), 
        [imagens]
    );

    // Memoizar productos filtrados
    const productosFiltrados = useMemo(() => {
        if (!productos || !Array.isArray(productos)) return [];
        
        return productos.filter(producto => {
            if (!producto?.Nombre_Producto) return false;
            
            const matchesSearch = producto.Nombre_Producto
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
            
            const isHighlighted = producto.cantidad_Disponible < 99;
            
            return matchesSearch && isHighlighted;
        });
    }, [productos, searchQuery]);

    // Función para formatear precio
    const formatearPrecio = useCallback((precio) => {
        const precioNumerico = parseFloat(precio);
        return isNaN(precioNumerico) ? "0.00" : precioNumerico.toFixed(2);
    }, []);

    // Función para mostrar mensaje temporal
    const mostrarMensaje = useCallback((texto, tipo = 'success') => {
        setMensaje({ texto, tipo });
        const timer = setTimeout(() => setMensaje(""), 2000);
        return () => clearTimeout(timer);
    }, []);

    // Función para manejar compras optimizada
    const manejarCompra = useCallback((producto) => {
        if (!producto?.ID_Producto) {
            console.error('Producto inválido');
            mostrarMensaje("❌ Producto inválido", 'error');
            return;
        }

        if (!producto.cantidad_Disponible || producto.cantidad_Disponible <= 0) {
            mostrarMensaje("❌ Producto sin stock", 'error');
            return;
        }

        try {
            const carritoActual = JSON.parse(localStorage.getItem("carrito") || "[]");
            const productoExistente = carritoActual.find(p => p.ID_Producto === producto.ID_Producto);

            if (productoExistente) {
                productoExistente.cantidad += 1;
            } else {
                carritoActual.push({ ...producto, cantidad: 1 });
            }

            localStorage.setItem("carrito", JSON.stringify(carritoActual));
            mostrarMensaje("✅ Producto agregado al carrito", 'success');
            
        } catch (error) {
            console.error('Error al agregar al carrito:', error);
            mostrarMensaje("❌ Error al agregar producto", 'error');
        }
    }, [mostrarMensaje]);

    // Función para manejar errores de imagen
    const manejarErrorImagen = useCallback((e) => {
        e.target.src = '/api/placeholder/250/200';
        e.target.alt = 'Imagen no disponible';
    }, []);

    // Efecto para cargar datos iniciales
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                await Promise.all([fetchImagen(), fetchProducto()]);
            } catch (error) {
                console.error('Error al cargar datos:', error);
                mostrarMensaje("❌ Error al cargar datos", 'error');
            }
        };

        cargarDatos();
    }, [fetchImagen, fetchProducto, mostrarMensaje]);

    // Efecto para actualizar productos periódicamente
    useEffect(() => {
        const interval = setInterval(() => {
            fetchProducto().catch(error => 
                console.error('Error en actualización periódica:', error)
            );
        }, 30000); // Aumentado a 30 segundos para reducir carga

        return () => clearInterval(interval);
    }, [fetchProducto]);

    // Estados de carga y error
    const isLoading = loadingImagen || loadingProductos;
    const hasError = errorImagen || errorProductos;

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.loadingContainer}>
                    <div className={styles.loadingSpinner}></div>
                    <div className={styles.loadingText}>Cargando productos...</div>
                </div>
            </div>
        );
    }

    if (hasError) {
        return (
            <div className={styles.container}>
                <div className={styles.errorContainer}>
                    <div className={styles.errorIcon}>⚠️</div>
                    <div className={styles.errorText}>
                        Error al cargar datos. Por favor, intenta de nuevo.
                    </div>
                    <button 
                        className={styles.retryButton}
                        onClick={() => {
                            fetchImagen();
                            fetchProducto();
                        }}
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Mensaje flotante */}
            {mensaje && (
                <div 
                    className={`${styles.toast} ${styles[`toast${mensaje.tipo === 'error' ? 'Error' : 'Success'}`]}`}
                    role="alert" 
                    aria-live="polite"
                >
                    {mensaje.texto || mensaje}
                </div>
            )}

            {/* Banner */}
            <div className={styles.bannerContainer}>
                {bannerImg?.URL ? (
                    <div 
                        className={styles.banner}
                        style={{
                            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${bannerImg.URL})`
                        }}
                        role="banner"
                    >
                        <div className={styles.bannerContent}>
                            <div className={styles.bannerTitle}>Compra los mejores productos</div>
                            <div className={styles.bannerSubtitle}>
                                Descubre la calidad de nuestros productos y los mejores servicios
                            </div>
                            <div className={styles.bannerCta}>¡Compra ya!</div>
                        </div>
                    </div>
                ) : (
                    <div className={styles.bannerPlaceholder}>
                        <div className={styles.bannerContent}>
                            <div className={styles.bannerTitle}>Compra los mejores productos</div>
                            <div className={styles.bannerSubtitle}>
                                Descubre la calidad de nuestros productos y los mejores servicios
                            </div>
                            <div className={styles.bannerCta}>¡Compra ya!</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Sección de productos */}
            <section className={styles.productSection}>
                <div className={styles.sectionTitle}>
                    {searchQuery ? `Resultados para "${searchQuery}"` : "Productos destacados ✨"}
                </div>
                
                {productosFiltrados.length === 0 ? (
                    <div className={styles.noResults}>
                        <div className={styles.noResultsIcon}>🔍</div>
                        <div className={styles.noResultsText}>
                            {searchQuery 
                                ? "No se encontraron productos que coincidan con tu búsqueda." 
                                : "No hay productos disponibles en este momento."
                            }
                        </div>
                    </div>
                ) : (
                    <div className={styles.productGrid}>
                        {productosFiltrados.map((producto) => (
                            <article key={producto.ID_Producto} className={styles.productCard}>
                                <div className={styles.imageContainer}>
                                    <img 
                                        src={producto.Url || '/api/placeholder/250/200'} 
                                        alt={producto.Nombre_Producto || 'Producto sin nombre'} 
                                        className={styles.productImage}
                                        loading="lazy"
                                        onError={manejarErrorImagen}
                                    />
                                    {producto.cantidad_Disponible < 10 && producto.cantidad_Disponible > 0 && (
                                        <div className={styles.stockBadge}>
                                            ¡Últimas {producto.cantidad_Disponible}!
                                        </div>
                                    )}
                                </div>
                                <div className={styles.productInfo}>
                                    <div className={styles.productName}>
                                        {producto.Nombre_Producto || 'Producto sin nombre'}
                                    </div>
                                    <div className={styles.price}>
                                        S/ {formatearPrecio(producto.Precio_Final)}
                                    </div>
                                    <div className={styles.stock}>
                                        {producto.cantidad_Disponible > 0 
                                            ? `Disponibles: ${producto.cantidad_Disponible}` 
                                            : "Sin stock"
                                        }
                                    </div>
                                    <button 
                                        className={`${styles.addButton} ${
                                            (!producto.cantidad_Disponible || producto.cantidad_Disponible <= 0) 
                                                ? styles.addButtonDisabled 
                                                : ''
                                        }`}
                                        onClick={() => manejarCompra(producto)}
                                        disabled={!producto.cantidad_Disponible || producto.cantidad_Disponible <= 0}
                                        aria-label={`Agregar ${producto.Nombre_Producto} al carrito`}
                                    >
                                        {producto.cantidad_Disponible > 0 
                                            ? "Agregar al Carrito" 
                                            : "Sin stock"
                                        }
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Inicio;