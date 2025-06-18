import { useEffect, useState, useCallback, useMemo } from "react";
import { 
  ShoppingCart, Phone, Trash2, Plus, Minus, 
  AlertTriangle, FileText, MapPin, Mail, User
} from "lucide-react";
import style from './Carrito.module.css';
import { generateFacturaPDF } from "../../store/generadorFacturasPdf";
import useProductoStore from '../../store/ProductoStore';
import useClienteStore from "../../store/ClienteStore";
import usePedidoStore from "../../store/PedidoStore";
import useDetallePedidoStore from '../../store/DetallePedidoStore';
import useFacturaStore from "../../store/FacturaStore"; 
import useHistorialEstadoStore from "../../store/HistorialEstadoStore";
import useEstadoPedidoStore from "../../store/EstadoPedidoStore";
import useAdministradorStore from "../../store/AdministradorStore";

const Carrito = () => {
  // ========================
  // ESTADOS PRINCIPALES
  // ========================
  const [carrito, setCarrito] = useState(() => {
    const carritoGuardado = typeof window !== 'undefined' ? 
      JSON.parse(localStorage.getItem("carrito")) || [] : [];
    return carritoGuardado;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [stockWarnings, setStockWarnings] = useState([]);
  
  // Estados de UI
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  
  // Estados de formulario del cliente (usuario final)
  const [datosCliente, setDatosCliente] = useState({
    Nombre: "",
    Apellido: "",
    NumCelular: "",
    Direccion: "",
    Email: "",
    Fecha_Entrega: "",
    Observaciones: ""
  });

  // ========================
  // HOOKS DE STORES
  // ========================
  const { addCliente } = useClienteStore();
  const { addPedido } = usePedidoStore();
  const { addDetallePedido } = useDetallePedidoStore();
  const { addFactura } = useFacturaStore();
  const { addHistorialEstado } = useHistorialEstadoStore();
  const { estadoPedidos, fetchEstadoPedido } = useEstadoPedidoStore();
  const { administradors, fetchAdministrador } = useAdministradorStore();
  const { decreaseStock, checkStock, productos, fetchProducto } = useProductoStore();

  // ========================
  // EFECTOS
  // ========================
  useEffect(() => {
    initializeComponent();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("carrito", JSON.stringify(carrito));
    }
  }, [carrito]);

  useEffect(() => {
    verificarStockCarrito();
  }, [carrito, productos]);

  // ========================
  // INICIALIZACIÓN
  // ========================
  const initializeComponent = useCallback(async () => {
    try {
      const hoy = new Date().toISOString().slice(0, 10);
      setDatosCliente(prev => ({ ...prev, Fecha_Entrega: hoy }));
      
      await Promise.all([
        fetchEstadoPedido(),
        fetchAdministrador(),
        fetchProducto()
      ]);
    } catch (error) {
      setError("Error al inicializar el componente");
      console.error("Error:", error);
    }
  }, [fetchEstadoPedido, fetchAdministrador, fetchProducto]);

  // ========================
  // VERIFICACIÓN DE STOCK
  // ========================
  const verificarStockCarrito = useCallback(() => {
    const warnings = [];
    
    carrito.forEach((productoCarrito, index) => {
      const stockCheck = checkStock(productoCarrito.ID_Producto, productoCarrito.cantidad);
      
      if (!stockCheck.available) {
        warnings.push({
          index,
          producto: productoCarrito.Nombre_Producto,
          solicitado: productoCarrito.cantidad,
          disponible: stockCheck.cantidadDisponible || 0,
          error: stockCheck.error
        });
      }
    });
    
    setStockWarnings(warnings);
  }, [carrito, checkStock]);

  // ========================
  // CÁLCULOS MEMOIZADOS
  // ========================
  const totalCarrito = useMemo(() => {
    return carrito.reduce((total, producto) => total + (producto.Precio_Final * producto.cantidad), 0);
  }, [carrito]);

  const cantidadTotalProductos = useMemo(() => {
    return carrito.reduce((total, producto) => total + producto.cantidad, 0);
  }, [carrito]);

  const tieneProblemasStock = useMemo(() => {
    return stockWarnings.length > 0;
  }, [stockWarnings]);

  // ========================
  // UTILIDADES
  // ========================
  const mostrarMensaje = useCallback((mensaje, tipo = 'success') => {
    if (tipo === 'success') {
      setSuccess(mensaje);
      setError("");
      setTimeout(() => setSuccess(""), 5000);
    } else {
      setError(mensaje);
      setSuccess("");
    }
  }, []);

  const limpiarMensajes = useCallback(() => {
    setError("");
    setSuccess("");
  }, []);

  const resetearFormulario = useCallback(() => {
    setDatosCliente({ 
      Nombre: "", 
      Apellido: "", 
      NumCelular: "", 
      Direccion: "", 
      Email: "",
      Fecha_Entrega: new Date().toISOString().slice(0, 10), 
      Observaciones: "" 
    });
    setMostrarFormulario(false);
  }, []);

  // ========================
  // GESTIÓN DEL CARRITO
  // ========================
  const actualizarCantidadProducto = useCallback((index, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      eliminarProducto(index);
      return;
    }

    const nuevoCarrito = [...carrito];
    nuevoCarrito[index].cantidad = nuevaCantidad;
    setCarrito(nuevoCarrito);
  }, [carrito]);

  const eliminarProducto = useCallback((index) => {
    const nuevoCarrito = carrito.filter((_, i) => i !== index);
    setCarrito(nuevoCarrito);
  }, [carrito]);

  const limpiarCarrito = useCallback(() => {
    setCarrito([]);
    setStockWarnings([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem("carrito");
    }
    mostrarMensaje("Carrito limpiado correctamente");
  }, [mostrarMensaje]);

  // ========================
  // VALIDACIONES
  // ========================
  const validarFormulario = useCallback(() => {
    const { Nombre, Apellido, NumCelular, Fecha_Entrega } = datosCliente;
    
    if (!Nombre.trim()) {
      mostrarMensaje("El nombre es obligatorio", 'error');
      return false;
    }
    
    if (!Apellido.trim()) {
      mostrarMensaje("El apellido es obligatorio", 'error');
      return false;
    }
    
    if (!NumCelular.trim()) {
      mostrarMensaje("El número de celular es obligatorio", 'error');
      return false;
    }
    
    if (!/^\d{9,15}$/.test(NumCelular)) {
      mostrarMensaje("El número de celular debe tener entre 9 y 15 dígitos", 'error');
      return false;
    }

    if (!Fecha_Entrega) {
      mostrarMensaje("La fecha de entrega es obligatoria", 'error');
      return false;
    }
    
    const fechaEntrega = new Date(Fecha_Entrega);
    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0);
    
    if (fechaEntrega < fechaActual) {
      mostrarMensaje("La fecha de entrega no puede ser anterior a hoy", 'error');
      return false;
    }

    if (tieneProblemasStock) {
      mostrarMensaje("Hay problemas de stock que deben resolverse antes de procesar el pedido", 'error');
      return false;
    }
    
    return true;
  }, [datosCliente, tieneProblemasStock, mostrarMensaje]);

  // ========================
  // MANEJO DE FORMULARIOS
  // ========================
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setDatosCliente(prev => ({ ...prev, [name]: value }));
    limpiarMensajes();
  }, [limpiarMensajes]);

  // ========================
  // FUNCIONES DE NOTIFICACIÓN AUTOMÁTICA
  // ========================
  const enviarNotificacionesAutomaticas = useCallback(async (datosFactura) => {
    try {
      // Generar PDF automáticamente
      const resultadoPDF = generateFacturaPDF(datosFactura);
      
      if (resultadoPDF.success) {
        console.log(`PDF generado: ${resultadoPDF.filename}`);
        
        // Enviar automáticamente a WhatsApp del cliente
        const cliente = datosFactura.cliente;
        const productos = datosFactura.detalles.map(detalle => 
          `• ${detalle.Nombre_Producto} x${detalle.Cantidad} - $${detalle.Subtotal.toFixed(2)}`
        ).join('\n');
        
        const fechaEntrega = new Date(datosFactura.pedido.Fecha_Entrega).toLocaleDateString('es-ES');
        
        const mensajeCliente = `🎉 ¡Hola ${cliente.Nombre}!

✅ Tu pedido #${datosFactura.pedido.ID_Pedido} ha sido confirmado.

📋 DETALLES:
${productos}

💰 Total: $${datosFactura.total.toFixed(2)}
📅 Entrega: ${fechaEntrega}
${datosFactura.pedido.Observaciones ? `📝 ${datosFactura.pedido.Observaciones}` : ''}

¡Gracias por tu preferencia! 😊`;

        // Enviar al cliente
        const numeroCliente = `51${cliente.NumCelular}`;
        const mensajeCodificadoCliente = encodeURIComponent(mensajeCliente);
        const urlWhatsAppCliente = `https://wa.me/${numeroCliente}?text=${mensajeCodificadoCliente}`;
        
        setTimeout(() => {
          window.open(urlWhatsAppCliente, '_blank');
        }, 1000);

        // Enviar al administrador
        const mensajeAdmin = `📋 NUEVO PEDIDO #${datosFactura.pedido.ID_Pedido}

👤 Cliente: ${cliente.Nombre} ${cliente.Apellido}
📱 Teléfono: ${cliente.NumCelular}

🛍️ Productos:
${productos}

💰 Total: $${datosFactura.total.toFixed(2)}
📅 Entrega: ${fechaEntrega}
${datosFactura.pedido.Observaciones ? `📝 ${datosFactura.pedido.Observaciones}` : ''}`;

        const numeroAdmin = administradors.length > 0 ? administradors[0].NumAdministrador : '51987654321';
        const mensajeCodificadoAdmin = encodeURIComponent(mensajeAdmin);
        const urlWhatsAppAdmin = `https://wa.me/${numeroAdmin}?text=${mensajeCodificadoAdmin}`;
        
        setTimeout(() => {
          window.open(urlWhatsAppAdmin, '_blank');
        }, 2000);
        
        mostrarMensaje("¡Pedido realizado exitosamente! Te contactaremos pronto.");
      }
    } catch (error) {
      console.error("Error en notificaciones automáticas:", error);
      mostrarMensaje("Pedido procesado, pero hubo un error en las notificaciones.", 'error');
    }
  }, [administradors, mostrarMensaje]);

  // ========================
  // PROCESAMIENTO DEL PEDIDO
  // ========================
  const handleSubmitPedido = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;
    
    setLoading(true);
    
    try {
      // Verificar stock final
      const stockErrors = [];
      for (const producto of carrito) {
        const stockCheck = checkStock(producto.ID_Producto, producto.cantidad);
        if (!stockCheck.available) {
          stockErrors.push(`${producto.Nombre_Producto}: solicitado ${producto.cantidad}, disponible ${stockCheck.cantidadDisponible}`);
        }
      }
      
      if (stockErrors.length > 0) {
        mostrarMensaje(`Problemas de stock:\n${stockErrors.join('\n')}`, 'error');
        return;
      }

      // Crear cliente
      const clienteParaGuardar = {
        Nombre: datosCliente.Nombre.trim(),
        Apellido: datosCliente.Apellido.trim(),
        NumCelular: Number(datosCliente.NumCelular),
        Direccion: datosCliente.Direccion.trim(),
        Email: datosCliente.Email.trim(),
        createdAt: new Date().toISOString()
      };
      
      const clienteCreado = await addCliente(clienteParaGuardar);
      const idCliente = clienteCreado.ID_Cliente || clienteCreado.id || clienteCreado;

      // Crear pedido
      const nuevoPedido = {
        ID_Cliente: idCliente,
        Fecha_Pedido: new Date().toISOString().slice(0, 10),
        Fecha_Entrega: datosCliente.Fecha_Entrega,
        Observaciones: datosCliente.Observaciones
      };
      
      const pedidoCreado = await addPedido(nuevoPedido);
      const idPedido = pedidoCreado.ID_Pedido || pedidoCreado.id || pedidoCreado;
      
      // Procesar detalles del pedido
      let subtotalTotal = 0;
      const detallesPedido = [];
      
      for (const producto of carrito) {
        const detalle = {
          ID_Pedido: idPedido,
          ID_Producto: producto.ID_Producto,
          Cantidad: producto.cantidad,
          Precio_Unitario: producto.Precio_Final,
          Descuento: 0,
          Subtotal: producto.cantidad * producto.Precio_Final * (1 - producto.Descuento / 100)
        };
        subtotalTotal += detalle.Subtotal;
        detallesPedido.push({
          ...detalle,
          Nombre_Producto: producto.Nombre_Producto
        });
        
        await addDetallePedido(detalle);
        await decreaseStock(producto.ID_Producto, producto.cantidad);
      }
      
      // Crear factura
      const nuevaFactura = {
        ID_Pedido: idPedido,
        ID_Cliente: idCliente,
        Fecha: new Date().toISOString().slice(0, 10),
        Monto_Total: subtotalTotal
      };
      
      const facturaCreada = await addFactura(nuevaFactura);
      const idFactura = facturaCreada?.ID_Factura || facturaCreada?.id || facturaCreada;
      
      // Crear historial de estado
      const estadoEnProceso = estadoPedidos.find(estado => estado.Estado === 'En Proceso');
      const idEstadoEnProceso = estadoEnProceso ? estadoEnProceso.ID_EstadoPedido : 1;
      
      const historialData = {
        ID_EstadoPedido: idEstadoEnProceso,
        ID_Pedido: idPedido,
        Fecha: new Date().toISOString()
      };
      
      await addHistorialEstado(historialData);

      // Preparar datos para notificaciones
      const datosFactura = {
        pedido: {
          ID_Pedido: idPedido,
          Fecha_Pedido: nuevoPedido.Fecha_Pedido,
          Fecha_Entrega: nuevoPedido.Fecha_Entrega,
          Observaciones: nuevoPedido.Observaciones
        },
        cliente: {
          ...clienteParaGuardar,
          ID_Cliente: idCliente
        },
        detalles: detallesPedido.map(detalle => ({
          ...detalle,
          Cantidad: Number(detalle.Cantidad) || 0,
          Precio_Unitario: Number(detalle.Precio_Unitario) || 0,
          Subtotal: Number(detalle.Subtotal) || 0,
          Descuento: Number(detalle.Descuento) || 0
        })),
        factura: {
          ...nuevaFactura,
          ID_Factura: idFactura,
          Monto_Total: Number(subtotalTotal) || 0
        },
        total: Number(subtotalTotal) || 0
      };
      
      // Limpiar estado
      resetearFormulario();
      limpiarCarrito();
      
      // Enviar notificaciones automáticamente
      await enviarNotificacionesAutomaticas(datosFactura);
      
    } catch (error) {
      mostrarMensaje("Error al procesar el pedido. Por favor intenta nuevamente.", 'error');
      console.error("Error al guardar pedido:", error);
    } finally {
      setLoading(false);
    }
  }, [datosCliente, carrito, validarFormulario, addCliente, addPedido, addDetallePedido, addFactura, addHistorialEstado, estadoPedidos, checkStock, decreaseStock, resetearFormulario, limpiarCarrito, enviarNotificacionesAutomaticas, mostrarMensaje]);

  // ========================
  // RENDER
  // ========================
  return (
    <div className={style.carritoContainer}>
      {/* Header */}
      <div className={style.carritoHeader}>
        <h2>
          <ShoppingCart className={style.icon} />
          Mi Carrito
        </h2>
        <div className={style.carritoInfo}>
          <span className={style.cantidadTotal}>
            {cantidadTotalProductos} productos
          </span>
          <span className={style.totalCarrito}>
            Total: ${totalCarrito.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Mensajes */}
      {error && (
        <div className={style.mensaje + " " + style.error}>
          <AlertTriangle className={style.icon} />
          {error}
        </div>
      )}
      
      {success && (
        <div className={style.mensaje + " " + style.success}>
          ✅ {success}
        </div>
      )}

      {/* Advertencias de stock */}
      {stockWarnings.length > 0 && (
        <div className={style.stockWarnings}>
          <h4>⚠️ Productos con stock limitado:</h4>
          {stockWarnings.map((warning, index) => (
            <div key={index} className={style.stockWarning}>
              <strong>{warning.producto}:</strong> 
              Solo quedan {warning.disponible} unidades disponibles
            </div>
          ))}
        </div>
      )}

      {/* Lista de productos en el carrito */}
      <div className={style.carritoLista}>
        {carrito.length === 0 ? (
          <div className={style.carritoVacio}>
            <ShoppingCart className={style.iconGrande} />
            <p>Tu carrito está vacío</p>
            <p>¡Agrega algunos productos para comenzar!</p>
          </div>
        ) : (
          carrito.map((producto, index) => (
            <div key={index} className={style.productoCarrito}>
              <div className={style.productoInfo}>
                <h4>{producto.Nombre_Producto}</h4>
                <p className={style.precioUnitario}>
                  ${producto.Precio_Final} c/u
                </p>
              </div>
              
              <div className={style.cantidadControles}>
                <button 
                  onClick={() => actualizarCantidadProducto(index, producto.cantidad - 1)}
                  className={style.btnCantidad}
                  disabled={loading}
                >
                  <Minus className={style.iconSmall} />
                </button>
                
                <span className={style.cantidad}>{producto.cantidad}</span>
                
                <button 
                  onClick={() => actualizarCantidadProducto(index, producto.cantidad + 1)}
                  className={style.btnCantidad}
                  disabled={loading}
                >
                  <Plus className={style.iconSmall} />
                </button>
              </div>
              
              <div className={style.subtotal}>
                ${(producto.Precio_Final * producto.cantidad).toFixed(2)}
              </div>
              
              <button 
                onClick={() => eliminarProducto(index)}
                className={style.btnEliminar}
                disabled={loading}
              >
                <Trash2 className={style.iconSmall} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Acciones del carrito */}
      {carrito.length > 0 && (
        <div className={style.carritoAcciones}>
          <button 
            onClick={limpiarCarrito}
            className={style.btnSecundario}
            disabled={loading}
          >
            <Trash2 className={style.icon} />
            Limpiar Carrito
          </button>
          
          <button 
            onClick={() => setMostrarFormulario(true)}
            className={style.btnPrimario}
            disabled={loading || tieneProblemasStock}
          >
            <FileText className={style.icon} />
            Realizar Pedido
          </button>
        </div>
      )}

      {/* Formulario de pedido */}
      {mostrarFormulario && (
        <div className={style.modalOverlay} onClick={() => setMostrarFormulario(false)}>
          <div className={style.modal} onClick={(e) => e.stopPropagation()}>
            <div className={style.modalHeader}>
              <h3>
                <FileText className={style.icon} />
                Completar Pedido
              </h3>
              <button onClick={() => setMostrarFormulario(false)} className={style.btnCerrar}>×</button>
            </div>
            
            <div className={style.modalContent}>
              {/* Resumen del pedido */}
              <div className={style.resumenPedido}>
                <h4>Resumen de tu pedido:</h4>
                {carrito.map((producto, index) => (
                  <div key={index} className={style.resumenItem}>
                    <span>{producto.Nombre_Producto}</span>
                    <span>x{producto.cantidad}</span>
                    <span>${(producto.Precio_Final * producto.cantidad).toFixed(2)}</span>
                  </div>
                ))}
                <div className={style.resumenTotal}>
                  <strong>Total: ${totalCarrito.toFixed(2)}</strong>
                </div>
              </div>

              {/* Formulario de datos del cliente */}
              <form onSubmit={handleSubmitPedido}>
                <h4>Tus datos de contacto:</h4>
                
                <div className={style.formRow}>
                  <div className={style.formGroup}>
                    <label>
                      <User className={style.iconSmall} />
                      Nombre *
                    </label>
                    <input
                      type="text"
                      name="Nombre"
                      value={datosCliente.Nombre}
                      onChange={handleInputChange}
                      className={style.input}
                      required
                      autoFocus
                    />
                  </div>
                  
                  <div className={style.formGroup}>
                    <label>
                      <User className={style.iconSmall} />
                      Apellido *
                    </label>
                    <input
                      type="text"
                      name="Apellido"
                      value={datosCliente.Apellido}
                      onChange={handleInputChange}
                      className={style.input}
                      required
                    />
                  </div>
                </div>
                
                <div className={style.formGroup}>
                  <label>
                    <Phone className={style.iconSmall} />
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    name="NumCelular"
                    value={datosCliente.NumCelular}
                    onChange={handleInputChange}
                    className={style.input}
                    placeholder="987654321"
                    required
                  />
                </div>

                <div className={style.formGroup}>
                  <label>
                    <Mail className={style.iconSmall} />
                    Email (opcional)
                  </label>
                  <input
                    type="email"
                    name="Email"
                    value={datosCliente.Email}
                    onChange={handleInputChange}
                    className={style.input}
                    placeholder="tu@email.com"
                  />
                </div>
                
                <div className={style.formGroup}>
                  <label>
                    <MapPin className={style.iconSmall} />
                    Dirección de entrega (opcional)
                  </label>
                  <input
                    type="text"
                    name="Direccion"
                    value={datosCliente.Direccion}
                    onChange={handleInputChange}
                    className={style.input}
                    placeholder="Calle, número, distrito"
                  />
                </div>
                
                <div className={style.formGroup}>
                  <label>Fecha de entrega deseada *</label>
                  <input
                    type="date"
                    name="Fecha_Entrega"
                    value={datosCliente.Fecha_Entrega}
                    onChange={handleInputChange}
                    className={style.input}
                    min={new Date().toISOString().slice(0, 10)}
                    required
                  />
                </div>
                
                <div className={style.formGroup}>
                  <label>Observaciones adicionales</label>
                  <textarea
                    name="Observaciones"
                    value={datosCliente.Observaciones}
                    onChange={handleInputChange}
                    className={style.textarea}
                    rows="3"
                    placeholder="Alguna indicación especial para tu pedido..."
                  />
                </div>
                
                <div className={style.modalAcciones}>
                  <button 
                    type="button" 
                    onClick={() => setMostrarFormulario(false)}
                    className={style.btnSecundario}
                    disabled={loading}
                  >
                    Volver
                  </button>
                  <button 
                    type="submit"
                    className={style.btnPrimario}
                    disabled={loading || tieneProblemasStock}
                  >
                    {loading ? 'Procesando...' : 'Confirmar Pedido'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carrito;