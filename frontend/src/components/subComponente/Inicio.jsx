import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './inicio.css';

const Inicio = () => {
    const [productos, setProductos] = useState([]);
    const [imagenes, setImagenes] = useState([]);
    const [mensaje, setMensaje] = useState("");
    const [indiceImagen, setIndiceImagen] = useState(0); // Estado para controlar qué imagen mostrar
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await fetch("http://localhost:3001/productos");
                const data = await response.json();
                setProductos(data);
            } catch (error) {
                console.error("Error al obtener productos:", error);
            }
        };

        const fetchImagenes = async () => {
            try {
                const response = await fetch("http://localhost:3001/imagen");
                const data = await response.json();
                setImagenes(data);
            } catch (error) {
                console.error("Error al obtener imágenes:", error);
            }
        };

        fetchProductos();
        fetchImagenes();
    }, []);

    // Cambiar imagen cada minuto
    useEffect(() => {
        if (imagenes.length > 0) {
            const interval = setInterval(() => {
                setIndiceImagen((prev) => (prev + 1) % imagenes.length);
            }, 60000); // 60,000 ms = 1 minuto

            return () => clearInterval(interval); // limpiar cuando el componente se desmonte
        }
    }, [imagenes]);

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

        setTimeout(() => {
            setMensaje("");
            navigate(""); // Puedes cambiar esto a "/carrito" si deseas redirigir ahí
        }, 1500);
    };

    return (
        <div className="home">
            {mensaje && <div className="toast">{mensaje}</div>}

            <section className="hero">
                <div className="imagenes-hero">
                    {imagenes.length > 0 && (
                        <img
                            key={imagenes[indiceImagen].ID_Imagen}
                            src={imagenes[indiceImagen].URL}
                            alt={`Imagen promocional ${imagenes[indiceImagen].ID_Imagen}`}
                            className="imagen-hero"
                        />
                    )}
                </div>
            </section>

            <section>
                <h2>Productos destacados</h2>
                <div className="productos">
                    {productos.map((producto) => (
                        <div className="producto" key={producto.ID_Producto}>
                            <img src={producto.Url} alt={producto.Nombre_Producto} />
                            <h3>{producto.Nombre_Producto}</h3>
                            <p>{producto.Descripcion}</p>
                            <p><strong>S/ {parseFloat(producto.Precio_Final).toFixed(2)}</strong></p>
                            <button onClick={() => manejarCompra(producto)}>Agregar al Carrito</button>
                        </div>
                    ))}
                </div>
            </section>

        <footer>
            <div className="gg">
                <p>Teléfonos : 973836976</p>
                <p>Email : bradatecsrlgmail.com</p>
            </div>
            <div className="hh">
                <p>Dirección : JR. ZAVALA 501</p>
                <p>Servicios : 57525-8625</p>
            </div>
            
            
        </footer>

        </div>
        


    );
};

export default Inicio;
