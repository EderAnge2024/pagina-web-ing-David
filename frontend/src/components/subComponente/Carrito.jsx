import { useEffect, useState } from "react";
import styloCar from './carrito.module.css';
import useClienteStore from "../../store/ClienteStore";
import usePedidoStore from "../../store/PedidoStore";
import useDetallePedidoStore from '../../store/DetallePedidoStore'

const Carrito = () => {
    const [carrito, setCarrito] = useState([]);
    const { addCliente } = useClienteStore();
    const { addPedido } = usePedidoStore();
    const { addDetallePedido } = useDetallePedidoStore();


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
    }, []);

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
        // Este método usa localStorage para buscar cliente por celular
        // Mejor ideal sería consultarlo a backend o usar estado global
        const clientesGuardados = JSON.parse(localStorage.getItem("clientes")) || [];
        return clientesGuardados.find(cliente => cliente.NumCelular === Number(numCelular));
    };

    // Corrección: handleSubmit (no "handel")
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
    
        setClienteGuardado(clienteCreado); // <-- Aquí actualizas el cliente guardado
        setMostrarFormulario(false);
        setMostrarFormulario2(true);
    
      } catch (error) {
        console.error("Error al agregar cliente:", error);
        alert("Error al agregar cliente. Intente nuevamente.");
      }
    };
    
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
        const idPedidoCreado = await addPedido(nuevoPedido); // Asegúrate que esta función retorne el ID del pedido creado
    
        // Obtener productos del carrito
        const carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];
    
        // Guardar cada producto como detalle
        for (const producto of carritoGuardado) {
          const detalle = {
            ID_Pedido: idPedidoCreado.ID_Pedido || idPedidoCreado,
            ID_Producto: producto.ID_Producto,
            Cantidad: producto.cantidad,
            Precio_Unitario: producto.Precio_Final,
            Descuento: 0,
            Subtotal: producto.cantidad * producto.Precio_Final
          };
          console.log("Detalle pedido a enviar:", detalle);
          await addDetallePedido(detalle);
        }
    
        // Limpiar estado y carrito
        setPedidoData({
          ID_Cliente: "",
          Fecha_Pedido: new Date().toISOString().slice(0, 10),
          Fecha_Entrega: ""
        });
        setMostrarFormulario2(false);
        setClienteGuardado(null);
        localStorage.removeItem("carrito");
        setCarrito([]);
    
        alert("Pedido y productos agregados correctamente");
    
      } catch (error) {
        console.error("Error al guardar pedido o productos:", error);
        alert("Ocurrió un error al guardar el pedido o los detalles.");
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

        // Cliente existe
        setClienteGuardado(clienteExistente);
        setPedidoData(prev => ({
            ...prev,
            ID_Cliente: clienteExistente.ID_Cliente
        }));
        setMostrarFormulario2(true);
        setMostrarFormulario(false);
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
                        <button className={styloCar.botonCompra} onClick={manejarCompra}>Realizar Compra</button>
                    </div>
                )}
            </div>

            {mostrarFormulario && (
                <div>
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
                <div>
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
                        <input
                          type="date"
                          name="Fecha_Entrega"
                          value={pedidoData.Fecha_Entrega || ""}
                          onChange={(e) => {
                            console.log("Nueva fecha:", e.target.value);
                            handleInputChangePedido(e);
                          }}
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
