import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";import "./Carrito.css";
import "./Carrito.css";

const Carrito = () => {
    const [carrito, setCarrito] = useState([]);
    const [cliente, setCliente] = useState({ Nombre: '', Apellido: '', NumCelular: '' });
    const [errores, setErrores] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const productosGuardados = JSON.parse(localStorage.getItem("carrito")) || [];
        setCarrito(productosGuardados);
    }, []);

    const guardarEnLocalStorage = (nuevoCarrito) => {
        setCarrito(nuevoCarrito);
        localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    };

    const eliminarProducto = (index) => {
        const nuevoCarrito = [...carrito];
        nuevoCarrito.splice(index, 1);
        guardarEnLocalStorage(nuevoCarrito);
    };

    const vaciarCarrito = () => {
        setCarrito([]);
        localStorage.removeItem("carrito");
        navigate("/"); // Redirige a /inicio después de vaciar
    };

    const cambiarCantidad = (index, nuevaCantidad) => {
        const nuevoCarrito = [...carrito];
        nuevoCarrito[index].cantidad = parseInt(nuevaCantidad) || 1;
        guardarEnLocalStorage(nuevoCarrito);
    };

    const validarFormulario = () => {
        const nuevosErrores = {};
        if (!cliente.Nombre.trim()) nuevosErrores.Nombre = 'Nombre requerido';
        if (!cliente.Apellido.trim()) nuevosErrores.Apellido = 'Apellido requerido';
        if (!cliente.NumCelular || isNaN(cliente.NumCelular)) nuevosErrores.NumCelular = 'Número inválido';
        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    const handleInputChange = (e) => {
        setCliente({ ...cliente, [e.target.name]: e.target.value });
    };

    const total = carrito.reduce((sum, producto) =>
        sum + parseFloat(producto.Precio_Final) * producto.cantidad, 0
    );

    const finalizarCompra = async () => {
        if (!validarFormulario()) return;

        try {
            await axios.post("http://localhost:3001/clientes", cliente);

            const mensajeCliente = `🛒 *Nueva Compra Realizada* %0A
👤 *Cliente:* ${cliente.Nombre} ${cliente.Apellido}%0A
📱 *Celular:* ${cliente.NumCelular}%0A%0A
📦 *Productos:*%0A${carrito.map((p, i) =>
                `${i + 1}. ${p.Nombre_Producto} - Cant: ${p.cantidad} - S/ ${parseFloat(p.Precio_Final).toFixed(2)}`
            ).join('%0A')}%0A%0A
💵 *Total a pagar:* S/ ${total.toFixed(2)}`;

            const numeroDestino = "51931201521";
            const urlWhatsapp = `https://wa.me/${numeroDestino}?text=${mensajeCliente}`;
            const ventanaWhatsapp = window.open(urlWhatsapp, "_blank");
            if (ventanaWhatsapp) setTimeout(() => ventanaWhatsapp.focus(), 1000);

            vaciarCarrito();
            navigate("/inicio"); // Redirige a la ruta /inicio
        } catch (error) {
            console.error("Error al guardar cliente:", error);
            alert("Error al guardar datos del cliente.");
        }
    };

    return (
        <div>
            <h1>Carrito de compras</h1>
            {carrito.length === 0 ? (
                <p>Tu carrito está vacío</p>
            ) : (
                <>
                    <button onClick={vaciarCarrito} style={{ background: 'red', color: 'white' }}>
                        Vaciar carrito
                    </button>

                    <div className="productos">
                        {carrito.map((producto, index) => (
                            <div className="producto" key={index}>
                                <img src={producto.Url} alt={producto.Nombre_Producto} />
                                <h3>{producto.Nombre_Producto}</h3>
                                <p>{producto.Descripcion}</p>
                                <p>Precio: S/ {parseFloat(producto.Precio_Final).toFixed(2)}</p>
                                <label>
                                    Cantidad:
                                    <input
                                        type="number"
                                        min="1"
                                        value={producto.cantidad}
                                        onChange={(e) => cambiarCantidad(index, e.target.value)}
                                    />
                                </label>
                                <p>Subtotal: S/ {(producto.cantidad * parseFloat(producto.Precio_Final)).toFixed(2)}</p>
                                <button onClick={() => eliminarProducto(index)}>Eliminar</button>
                            </div>
                        ))}
                    </div>

                    <h2>Total a pagar: <span style={{ color: 'green' }}>S/ {total.toFixed(2)}</span></h2>

                    <h3>Datos del Cliente</h3>
                    <form style={{ display: 'flex', flexDirection: 'column', maxWidth: '400px' }}>
                        <input
                            type="text"
                            name="Nombre"
                            placeholder="Nombre"
                            value={cliente.Nombre}
                            onChange={handleInputChange}
                        />
                        {errores.Nombre && <span style={{ color: 'red' }}>{errores.Nombre}</span>}

                        <input
                            type="text"
                            name="Apellido"
                            placeholder="Apellido"
                            value={cliente.Apellido}
                            onChange={handleInputChange}
                        />
                        {errores.Apellido && <span style={{ color: 'red' }}>{errores.Apellido}</span>}

                        <input
                            type="text"
                            name="NumCelular"
                            placeholder="Número de celular"
                            value={cliente.NumCelular}
                            onChange={handleInputChange}
                        />
                        {errores.NumCelular && <span style={{ color: 'red' }}>{errores.NumCelular}</span>}
                    </form>

                    <button onClick={finalizarCompra} style={{ marginTop: '20px', background: 'green', color: 'white' }}>
                        Finalizar compra
                    </button>
                </>
            )}
        </div>
    );
};

export default Carrito;
