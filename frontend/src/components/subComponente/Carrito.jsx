import { useEffect, useState } from "react";
import styloCar from './carrito.module.css';
import useClienteStore from "../../store/ClienteStore";
import usePedidoStore from "../../store/PedidoStore";
import useDetallePedidoStore from '../../store/DetallePedidoStore'
import useFacturaStore from "../../store/FacturaStore";
import useHistorialEstadoStore from "../../store/HistorialEstadoStore";
import useEstadoPedidoStore from "../../store/EstadoPedidoStore";

const Carrito = () => {
    const [carrito, setCarrito] = useState([]);
    const { addCliente } = useClienteStore();
    const { addPedido } = usePedidoStore();
    const { addDetallePedido } = useDetallePedidoStore();
    const { addFactura } = useFacturaStore();
    const { addHistorialEstado } = useHistorialEstadoStore();
    const { estadoPedidos, fetchEstadoPedido } = useEstadoPedidoStore();


    const [clienteData, setClienteData] = useState({ Nombre: "", Apellido: "", NumCelular: "" });
    const [pedidoData, setPedidoData] = useState({ ID_Cliente: "", Fecha_Pedido: "", Fecha_Entrega: "" });

    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [mostrarFormulario2, setMostrarFormulario2] = useState(false);
    const [clienteGuardado, setClienteGuardado] = useState(null);

    useEffect(() => {
        const carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];
        setCarrito(carritoGuardado);

        const hoy = new Date().toISOString().slice(0, 10);
        setPedidoData(prev => ({ ...prev, Fecha_Pedido: hoy }));
        fetchEstadoPedido();
    }, [fetchEstadoPedido]);

    const handleInputChangeCliente = (e) => {
        const { name, value } = e.target;
        setClienteData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleInputChangePedido = (e) => {
        const { name, value } = e.target;
        setPedidoData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const verificarClienteExiste = async (numCelular) => {
        const clientesGuardados = JSON.parse(localStorage.getItem("clientes")) || [];
        return clientesGuardados.find(cliente => cliente.NumCelular === Number(numCelular));
    };

    const generarMensajeWhatsApp = () => {
        const productos = carrito.map(producto => 
            `- ${producto.Nombre_Producto} (Cantidad: ${producto.cantidad}, Precio: $${producto.Precio_Final})`
        ).join('\n');
        
        const total = carrito.reduce((sum, producto) => sum + (producto.Precio_Final * producto.cantidad), 0);
        
        return `¡Hola! Quiero realizar este pedido:\n\n${productos}\n\nTotal: $${total.toFixed(2)}\n\nFecha de entrega: ${pedidoData.Fecha_Entrega || 'Por definir'}`;
    };

    const handleSubmitCliente = async (e) => {
        e.preventDefault();
    
        try {
            const clienteParaGuardar = {
                Nombre: clienteData.Nombre,
                Apellido: clienteData.Apellido,
                NumCelular: Number(clienteData.NumCelular),
            };
        
            const clienteCreado = await addCliente(clienteParaGuardar);
        
            setClienteData({ Nombre: "", Apellido: "", NumCelular: "" });
            alert("Se agregó el cliente");
        
            setClienteGuardado(clienteCreado);
            setMostrarFormulario(false);
            setMostrarFormulario2(true);
        
        } catch (error) {
            console.error("Error al agregar cliente:", error);
            alert("Error al agregar cliente. Intente nuevamente.");
        }
    };

    const estadoEnProceso = estadoPedidos.find(estado => estado.Estado === 'En Proceso');
    const idEstadoEnProceso = estadoEnProceso ? estadoEnProceso.ID_EstadoPedido : null;   

    // En Carrito.jsx
    const handleSubmitPedido = async (e) => {
    e.preventDefault();

        if (!clienteGuardado) {
            alert("No hay cliente registrado.");
            return;
        }
    
        const nuevoPedido = {
            ...pedidoData,
            ID_Cliente: clienteGuardado.ID_Cliente
        };
    
        try {
            // Guardar pedido
            const idPedidoCreado = await addPedido(nuevoPedido);
    
            // Guardar detalles del pedido
            const carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];
            let subtotalTotal = 0;
            
            for (const producto of carritoGuardado) {
                const detalle = {
                    ID_Pedido: idPedidoCreado.ID_Pedido || idPedidoCreado,
                    ID_Producto: producto.ID_Producto,
                    Cantidad: producto.cantidad,
                    Precio_Unitario: producto.Precio_Final,
                    Descuento: 0,
                    Subtotal: producto.cantidad * producto.Precio_Final
                };
                subtotalTotal += detalle.Subtotal;
                await addDetallePedido(detalle);
            }
    
            // Generar factura automáticamente
            const nuevaFactura = {
                ID_Pedido: idPedidoCreado.ID_Pedido || idPedidoCreado,
                ID_Cliente: clienteGuardado.ID_Cliente,
                Fecha: new Date().toISOString().slice(0, 10),
                Monto_Total: subtotalTotal
            };
            
            await addFactura(nuevaFactura);
    
            // Crear registro en historial de estados (estado inicial: 1 = "Recibido")
            const nuevoHistorialEstado = {
                ID_EstadoPedido: idEstadoEnProceso || 1, // si no encontró "En proceso", fallback a 1
                ID_Pedido: idPedidoCreado.ID_Pedido || idPedidoCreado,
                Fecha: new Date().toISOString().slice(0, 10)
            };
            console.log("Nuevo historial estado que enviaré:", nuevoHistorialEstado);

            await addHistorialEstado(nuevoHistorialEstado);
    
            // Limpiar estado
            setPedidoData({
                ID_Cliente: "",
                Fecha_Pedido: new Date().toISOString().slice(0, 10),
                Fecha_Entrega: ""
            });
            setMostrarFormulario2(false);
            setClienteGuardado(null);
            localStorage.removeItem("carrito");
            setCarrito([]);
    
            // Opción para enviar a WhatsApp
            if (window.confirm("Pedido y factura guardados correctamente. ¿Desea enviar el comprobante por WhatsApp?")) {
                const mensaje = generarMensajeWhatsApp();
                const telefono = clienteGuardado.NumCelular;
                window.open(`https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`, '_blank');
            }
    
        } catch (error) {
            console.error("Error al guardar pedido:", error);
            alert("Error al guardar el pedido.");
        }
    };    

    const manejarCompra = async () => {
        if (!clienteData.NumCelular) {
            alert("Por favor, ingrese número de celular para verificar cliente.");
            return;
        }

        const clienteExistente = await verificarClienteExiste(clienteData.NumCelular);

        if (!clienteExistente) {
            alert("El cliente no está registrado. Por favor, ingresa sus datos.");
            setMostrarFormulario(true);
            setMostrarFormulario2(false);
            setClienteGuardado(null);
            return;
        }

        setClienteGuardado(clienteExistente);
        setPedidoData(prev => ({
            ...prev,
            ID_Cliente: clienteExistente.ID_Cliente
        }));
        setMostrarFormulario2(true);
        setMostrarFormulario(false);
    };

    const enviarSoloWhatsApp = () => {
        if (carrito.length === 0) {
            alert("El carrito está vacío");
            return;
        }
        
        const mensaje = generarMensajeWhatsApp();
        const telefono = '51987654321'; // Reemplaza con tu número
        window.open(`https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`, '_blank');
    };

    return (
        <div>
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
                        <p className={styloCar.total}>
                            Total: ${carrito.reduce((total, producto) => total + producto.Precio_Final * producto.cantidad, 0).toFixed(2)}
                        </p>

                        <input
                            type="text"
                            placeholder="Número de Celular"
                            name="NumCelular"
                            value={clienteData.NumCelular}
                            onChange={handleInputChangeCliente}
                        />
                        <div className={styloCar.botonesContainer}>
                            <button className={styloCar.botonCompra} onClick={manejarCompra}>
                                Realizar Compra
                            </button>
                            <button 
                                className={styloCar.botonWhatsApp} 
                                onClick={enviarSoloWhatsApp}
                            >
                                Enviar por WhatsApp
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {mostrarFormulario && (
                <div className={styloCar.formulario}>
                    <h1>Agregar cliente</h1>
                    <form onSubmit={handleSubmitCliente}>
                        <input
                            type="text"
                            placeholder="Nombre"
                            required
                            name="Nombre"
                            value={clienteData.Nombre}
                            onChange={handleInputChangeCliente}
                        />
                        <input
                            type="text"
                            placeholder="Apellido"
                            required
                            name="Apellido"
                            value={clienteData.Apellido}
                            onChange={handleInputChangeCliente}
                        />
                        <input
                            type="text"
                            placeholder="Número de Celular"
                            required
                            name="NumCelular"
                            value={clienteData.NumCelular}
                            onChange={handleInputChangeCliente}
                        />
                        <button type="submit">Guardar Datos</button>
                    </form>
                </div>
            )}

            {mostrarFormulario2 && (
                <div className={styloCar.formulario}>
                    <h1>Agregar pedido</h1>
                    <form onSubmit={handleSubmitPedido}>
                        <input
                            type="text"
                            name="ID_Cliente"
                            value={`${clienteGuardado?.Nombre || ""} ${clienteGuardado?.Apellido || ""}`}
                            readOnly
                        />
                        <input
                            type="date"
                            name="Fecha_Pedido"
                            value={pedidoData.Fecha_Pedido}
                            readOnly
                        />
                        <label htmlFor="Fecha entrega">Fecha de Entrega: </label>
                        <input
                            type="date"
                            name="Fecha_Entrega"
                            value={pedidoData.Fecha_Entrega || ""}
                            onChange={handleInputChangePedido}
                            required
                        />
                        <button type="submit">Guardar Pedido</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Carrito;