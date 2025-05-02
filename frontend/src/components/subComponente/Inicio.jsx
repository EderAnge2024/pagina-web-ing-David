import React, { useEffect, useState } from "react";
import './inicio.css';

const Inicio = ({ setActivateComponent }) => {
    const [productos, setProductos] = useState([]);
    const [mensaje, setMensaje] = useState("");

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

        fetchProductos();
    }, []);

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
            setActivateComponent("carrito"); // redirige al carrito
        }, 1500);
    };

    return (
        <div className="inicio">
            {mensaje && <div className="toast">{mensaje}</div>}
            <header>
                <h1>Bienvenido a TuTienda</h1>
                <p>Los mejores productos, al mejor precio</p>
            </header>

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
        </div>
    );
};

export default Inicio;
