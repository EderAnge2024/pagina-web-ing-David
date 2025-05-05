import { useState, useEffect } from "react";
import useImagenStore from "../../store/ImagenStore";
import useProductoStore from "../../store/ProductoStore";
import sitloInicio from './inicio.module.css';

const Inicio = () => {
    const { imagens, fetchImagen } = useImagenStore();
    const { productos, fetchProducto } = useProductoStore();
    const [mensaje, setMensaje] = useState("");  // Para mostrar mensajes como "Producto agregado"
    
    // Encuentra la imagen tipo "Banner"
    const bannerImg = imagens.find(img => img.Tipo_Imagen === "Banner");

    useEffect(() => {
        fetchImagen();
        fetchProducto(); // Cargar productos al iniciar
        const interval = setInterval(fetchProducto, 10000); // cada 10 segundos
        return () => clearInterval(interval);
    }, [fetchImagen, fetchProducto]);

    const manejarCompra = (producto) => {
        // Obtener el carrito actual del localStorage
        const carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];

        // Verificar si el producto ya está en el carrito
        const productoExistente = carritoActual.find(p => p.ID_Producto === producto.ID_Producto);

        if (productoExistente) {
            // Si ya existe, incrementar la cantidad
            productoExistente.cantidad += 1;
        } else {
            // Si no, agregarlo al carrito con cantidad 1
            carritoActual.push({ ...producto, cantidad: 1 });
        }

        // Guardar el carrito actualizado en localStorage
        localStorage.setItem("carrito", JSON.stringify(carritoActual));

        // Mostrar mensaje de éxito
        setMensaje("✅ Producto agregado al carrito");

        // Limpiar el mensaje después de un tiempo
        setTimeout(() => {
            setMensaje("");
        }, 1500);
    };

    return (
        <div className={sitloInicio.cuerpoBanner}>
            {mensaje && <div className="toast">{mensaje}</div>} {/* Mostrar el mensaje de éxito */}

            <div
                className={sitloInicio.inicio}
                style={{
                    backgroundImage: 
                    `linear-gradient(rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.3)),
                    url(${bannerImg?.URL})`,
                }}
            >
                <div className={sitloInicio.baner}>
                    <h1>Compra los mejores</h1>
                    <h1>productos</h1>
                    <h5>Descubra la calidad de nuestros productos y los mejores servicios</h5>
                    <h4>"¡Compre ya!"</h4>
                </div>
            </div>  

            <div className={sitloInicio.contenidoPro}>
                <h5>Productos destacados ✨</h5>
                <div className={sitloInicio.productosDes}>
                    <div className={sitloInicio.datosProd}>
                        {productos
                            .filter(producto => producto.cantidad_Disponible < 99) // Filtra productos con menos de 99 disponibles
                            .map((producto) => (
                                <div key={producto.ID_Producto}>
                                    <img src={producto.Url} alt={producto.Nombre_Producto} width="150" height="150" />
                                    <p>Producto: {producto.Nombre_Producto}</p>
                                    <p>Precio: {producto.Precio_Final}</p>
                                    <p>Cantidad disponible: {producto.cantidad_Disponible}</p>
                                    <button onClick={() => manejarCompra(producto)}>Agregar a Carrito</button>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>  
    );
};

export default Inicio;
