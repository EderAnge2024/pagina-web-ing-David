import { useEffect, useState } from "react";
import styloCar from './carrito.module.css'

const Carrito = () => {
    const [carrito, setCarrito] = useState([]);

    // Cargar los productos del carrito desde localStorage
    useEffect(() => {
        const carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];
        setCarrito(carritoGuardado);
    }, []);

    const manejarCompra = () => {
        // Aquí iría la lógica para procesar la compra
        alert("¡Compra realizada exitosamente!");
        // Vaciar el carrito tras realizar la compra
        localStorage.removeItem("carrito");
        setCarrito([]);
    };

    return (
        <div className={styloCar.container}>
            <h2>Carrito de Compras</h2>

            {carrito.length === 0 ? (
                <p className={styloCar.empty}>El carrito está vacío</p>
            ) : (
                <div>
                    {carrito.map((producto, index) => (
                        <div key={index} className={styloCar.producto}>
                            <img src={producto.Url} alt={producto.Nombre_Producto} width="100" />
                            <p>{producto.Nombre_Producto}</p>
                            <p>Precio: {producto.Precio_Final}</p>
                            <p>Cantidad: {producto.cantidad}</p>
                        </div>
                    ))}
                    <p className={styloCar.total}>Total: ${carrito.reduce((total, producto) => total + producto.Precio_Final * producto.cantidad, 0).toFixed(2)}</p>
                    <button className={styloCar.botonCompra} onClick={manejarCompra}>Realizar Compra</button>
                </div>
            )}
        </div>
    );
};

export default Carrito;
