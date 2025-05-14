import { useState, useEffect } from "react";
import useImagenStore from "../../store/ImagenStore";
import useProductoStore from "../../store/ProductoStore";
import styles from './inicio.module.css';

const Inicio = () => {
    const { imagens, fetchImagen } = useImagenStore();
    const { productos, fetchProducto } = useProductoStore();
    const [mensaje, setMensaje] = useState("");
    
    const bannerImg = imagens.find(img => img.Tipo_Imagen === "Banner");
 
    useEffect(() => {
        fetchImagen();
        fetchProducto();
        const interval = setInterval(fetchProducto, 10000);
        return () => clearInterval(interval);
    }, [fetchImagen, fetchProducto]);

    const manejarCompra = (producto) => {
        const carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];
        const productoExistente = carritoActual.find(p => p.ID_Producto === producto.ID_Producto);

        if (productoExistente) {
            productoExistente.cantidad += 1;
        } else {
            carritoActual.push({ ...producto, cantidad: 1 });
        }

        localStorage.setItem("carrito", JSON.stringify(carritoActual));
        setMensaje("✅ Producto agregado al carrito");
        setTimeout(() => setMensaje(""), 1500);
    };

    return (
        <div className={styles.container}>
            {/* Mensaje flotante */}
            {mensaje && <div className={styles.toast}>{mensaje}</div>}

            {/* Banner con solución al desbordamiento */}
            <div className={styles.bannerContainer}>
                {bannerImg && (
                    <div 
                        className={styles.banner}
                        style={{
                            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.3)), url(${bannerImg.URL})`
                        }}
                    >
                        <div className={styles.bannerContent}>
                            <h1>Compra los mejores productos</h1>
                            <h2>Descubra la calidad de nuestros productos y los mejores servicios</h2>
                            <h3>"¡Compre ya!</h3>
                        </div>
                    </div>
                )}
            </div>

            {/* Sección de productos */}
            <div className={styles.productSection}>
                <h2 className={styles.sectionTitle}>Productos destacados ✨</h2>
                <div className={styles.productGrid}>
                    {productos
                        .filter(producto => producto.cantidad_Disponible < 99)
                        .map((producto) => (
                            <div key={producto.ID_Producto} className={styles.productCard}>
                                <div className={styles.imageContainer}>
                                    <img 
                                        src={producto.Url} 
                                        alt={producto.Nombre_Producto} 
                                        className={styles.productImage}
                                    />
                                </div>
                                <div className={styles.productInfo}>
                                    <h3>{producto.Nombre_Producto}</h3>
                                    <p className={styles.price}>S/ {parseFloat(producto.Precio_Final || 0).toFixed(2)}</p>
                                    <p className={styles.stock}>
                                        Disponibles: {producto.cantidad_Disponible}
                                    </p>
                                    <button 
                                        className={styles.addButton}
                                        onClick={() => manejarCompra(producto)}
                                    >
                                        Agregar al Carrito
                                    </button>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
};

export default Inicio;