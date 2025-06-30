import { useEffect, useState, useCallback, useMemo } from "react";
import { 
  ShoppingCart, Calendar, Trash2, Plus, Minus, 
  UserCheck, AlertTriangle, FileText
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
  const [modalActivo, setModalActivo] = useState(null);
  
  const [pedidoData, setPedidoData] = useState({
    ID_Cliente: "",
    Fecha_Pedido: "",
    Fecha_Entrega: "",
    Observaciones: ""
  });

  const [aceptaTerminos, setAceptaTerminos] = useState(false);

  // ========================
  // HOOKS DE STORES
  // ========================
  const { 
    clienteActual,
    isAuthenticated,
    initializeFromStorage,
    verificarToken
  } = useClienteStore();
  
  const { addPedido } = usePedidoStore();
  const { addDetallePedido } = useDetallePedidoStore();
  const { addFactura } = useFacturaStore();
  const { addHistorialEstado } = useHistorialEstadoStore();
  const { estadoPedidos, fetchEstadoPedido } = useEstadoPedidoStore();
  const { administradors, fetchAdministrador } = useAdministradorStore();
  const { decreaseStock, checkStock, productos, fetchProducto } = useProductoStore();

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
  
  const tieneProblemasStock = useMemo(() => {
    return stockWarnings.length > 0;
  }, [stockWarnings]);

  // ========================
  // EFECTOS
  // ========================
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
      
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
  // FUNCIONES DE INICIALIZACIÓN
  // ========================
  const initializeComponent = useCallback(async () => {
    try {
      const hoy = new Date().toISOString().slice(0, 10);
      setPedidoData(prev => ({ ...prev, Fecha_Pedido: hoy }));
      
      // Inicializar desde localStorage primero
      const hasStoredAuth = initializeFromStorage();
      
      // Si no hay datos en localStorage, verificar token
      if (!hasStoredAuth) {
        await verificarToken();
      }
      
      await Promise.all([
        fetchEstadoPedido(),
        fetchAdministrador(),
        fetchProducto()
      ]);

    } catch (error) {
      setError("Error al inicializar el componente");
      console.error("Error:", error);
    }
  }, [fetchEstadoPedido, fetchAdministrador, fetchProducto, initializeFromStorage, verificarToken]);

  // Efecto separado para actualizar pedidoData cuando cambie clienteActual
  useEffect(() => {
    if (clienteActual?.ID_Cliente) {
      setPedidoData(prev => ({ 
        ...prev, 
        ID_Cliente: clienteActual.ID_Cliente 
      }));
    }
  }, [clienteActual]);

  // ========================
  // FUNCIONES DEL CARRITO
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
  // FUNCIONES DE MENSAJES
  // ========================
  const limpiarMensajes = useCallback(() => {
    setError("");
    setSuccess("");
  }, []);

  // ========================
  // FUNCIONES DE FORMULARIOS
  // ========================
  const resetearFormularios = useCallback(() => {
    setPedidoData({ 
      ID_Cliente: clienteActual?.ID_Cliente || "", 
      Fecha_Pedido: new Date().toISOString().slice(0, 10), 
      Fecha_Entrega: "", 
      Observaciones: "" 
    });
    setModalActivo(null);
  }, [clienteActual]);

  const cerrarModal = useCallback(() => {
    setModalActivo(null);
    limpiarMensajes();
  }, [limpiarMensajes]);

  const handleInputChangePedido = useCallback((e) => {
    const { name, value } = e.target;
    setPedidoData(prev => ({ ...prev, [name]: value }));
    limpiarMensajes();
  }, [limpiarMensajes]);

  // ========================
  // VALIDACIONES
  // ========================
  const validarFormularioPedido = useCallback(() => {
    if (!pedidoData.Fecha_Entrega) {
      mostrarMensaje("La fecha de entrega es obligatoria", 'error');
      return false;
    }
    
    const fechaEntrega = new Date(pedidoData.Fecha_Entrega);
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
  }, [pedidoData, tieneProblemasStock, mostrarMensaje]);

  // ========================
  // FUNCIONES DE PEDIDOS
  // ========================
  const enviarNotificacionesAutomaticas = useCallback(async (datosFactura) => {
    try {
      console.log('=== DEBUG NOTIFICACIONES ===');
      console.log('Cliente en datosFactura:', datosFactura.cliente);
      console.log('Nombre:', datosFactura.cliente.Nombre);
      console.log('Número que se usará:', datosFactura.cliente.NumCelular);
      console.log('clienteActual global:', clienteActual);
      console.log('=============================');
      
      const resultadoPDF = generateFacturaPDF(datosFactura);
      
      if (resultadoPDF.success) {
        console.log(`PDF generado: ${resultadoPDF.filename}`);
        
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

        const numeroCliente = `51${cliente.NumCelular}`;
        console.log('el numero: ', numeroCliente)
        const mensajeCodificadoCliente = encodeURIComponent(mensajeCliente);
        const urlWhatsAppCliente = `https://wa.me/${numeroCliente}?text=${mensajeCodificadoCliente}`;
        
        setTimeout(() => {
          window.open(urlWhatsAppCliente, '_blank');
        }, 1000);

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
        
        mostrarMensaje("Pedido procesado. Notificaciones enviadas automáticamente.");
      }
    } catch (error) {
      console.error("Error en notificaciones automáticas:", error);
      mostrarMensaje("Pedido procesado, pero hubo un error en las notificaciones.", 'error');
    }
  }, [administradors, mostrarMensaje]);

  const handleSubmitPedido = useCallback(async (e) => {
  e.preventDefault();
  
  if (!validarFormularioPedido()) return;
  
  // Verificar autenticación
  if (!isAuthenticated || !clienteActual) {
    mostrarMensaje("No hay cliente autenticado. Por favor, inicia sesión.", 'error');
    return;
  }
  
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

    // Crear pedido
    const nuevoPedido = {
      ...pedidoData,
      ID_Cliente: clienteActual.ID_Cliente
    };
    
    const pedidoCreado = await addPedido(nuevoPedido);
    const idPedido = pedidoCreado.ID_Pedido || pedidoCreado;
    
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
      ID_Cliente: clienteActual.ID_Cliente,
      Fecha: new Date().toISOString().slice(0, 10),
      Monto_Total: subtotalTotal
    };
    
    const facturaCreada = await addFactura(nuevaFactura);
    const idFactura = facturaCreada?.ID_Factura || facturaCreada?.id || facturaCreada;
    
    // CORRECCIÓN: Crear historial de estado con mejor manejo de errores
    console.log('Estados disponibles:', estadoPedidos); // Para debug
    
    // Buscar el estado correcto (prueba varios nombres posibles)
    let estadoInicial = estadoPedidos.find(estado => 
      estado.Estado === 'En Proceso' || 
      estado.Estado === 'Pendiente' || 
      estado.Estado === 'Nuevo' ||
      estado.Estado === 'Creado'
    );
    
    // Si no encuentra ningún estado específico, toma el primero disponible
    if (!estadoInicial && estadoPedidos.length > 0) {
      estadoInicial = estadoPedidos[0];
      console.warn('No se encontró un estado específico, usando el primero disponible:', estadoInicial);
    }
    
    // Validar que existe un estado válido antes de crear el historial
    if (!estadoInicial) {
      throw new Error('No se encontró ningún estado de pedido válido en la base de datos');
    }
    
    const historialData = {
      ID_EstadoPedido: estadoInicial.ID_EstadoPedido,
      ID_Pedido: idPedido,
      Fecha: new Date().toISOString()
    };
    
    console.log('Creando historial con estado:', estadoInicial); // Para debug
    console.log('Datos del historial:', historialData); // Para debug
    
    await addHistorialEstado(historialData);

    // Preparar datos para notificaciones
    const datosFactura = {
      pedido: {
        ID_Pedido: idPedido,
        Fecha_Pedido: pedidoData.Fecha_Pedido,
        Fecha_Entrega: pedidoData.Fecha_Entrega,
        Observaciones: pedidoData.Observaciones
      },
      cliente: clienteActual,
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
    resetearFormularios();
    limpiarCarrito();
    
    // Enviar notificaciones automáticamente
    await enviarNotificacionesAutomaticas(datosFactura);
    
  } catch (error) {
    mostrarMensaje("Error al procesar el pedido.", 'error');
    console.error("Error al guardar pedido:", error);
    
    // Información adicional para debug
    if (error.response?.data) {
      console.error("Detalles del error del servidor:", error.response.data);
    }
  } finally {
    setLoading(false);
  }
}, [
  validarFormularioPedido, carrito, pedidoData, clienteActual, isAuthenticated,
  checkStock, addPedido, addDetallePedido, decreaseStock, 
  addFactura, estadoPedidos, addHistorialEstado, 
  resetearFormularios, limpiarCarrito, enviarNotificacionesAutomaticas, 
  mostrarMensaje
]);

const verificarEstadosDisponibles = useCallback(() => {
  console.log('=== ESTADOS DISPONIBLES ===');
  estadoPedidos.forEach((estado, index) => {
    console.log(`${index + 1}. ID: ${estado.ID_EstadoPedido}, Estado: "${estado.Estado}"`);
  });
  console.log('===========================');
  
  if (estadoPedidos.length === 0) {
    console.warn('⚠️ No hay estados de pedido cargados. Verifica que fetchEstadoPedido() se ejecute correctamente.');
  }
}, [estadoPedidos]);

// Llamar esta función en useEffect para debug (opcional)
useEffect(() => {
  if (estadoPedidos.length > 0) {
    verificarEstadosDisponibles();
  }
}, [estadoPedidos, verificarEstadosDisponibles]);

  // ========================
  // CÁLCULOS MEMOIZADOS
  // ========================
  const totalCarrito = useMemo(() => {
    return carrito.reduce((total, producto) => total + (producto.Precio_Final * producto.cantidad), 0);
  }, [carrito]);

  const cantidadTotalProductos = useMemo(() => {
    return carrito.reduce((total, producto) => total + producto.cantidad, 0);
  }, [carrito]);

  // ========================
  // RENDER
  // ========================
  return (
    <div className={style.carritoContainer}>
      {/* Header */}
      <div className={style.carritoHeader}>
        <h2>
          <ShoppingCart className={style.icon} />
          Carrito de Compras
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

      {/* Indicador de cliente */}
      {clienteActual && isAuthenticated && (
        <div className={style.clienteActivo}>
          <UserCheck size={16} />
          <span>Cliente: {clienteActual.Nombre} {clienteActual.Apellido}</span>
        </div>
      )}

      {/* Advertencias de stock */}
      {stockWarnings.length > 0 && (
        <div className={style.stockWarnings}>
          <h4>⚠️ Problemas de Stock:</h4>
          {stockWarnings.map((warning, index) => (
            <div key={index} className={style.stockWarning}>
              <strong>{warning.producto}:</strong> 
              Solicitado: {warning.solicitado}, Disponible: {warning.disponible}
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
            onClick={() => setModalActivo('pedido')}
            className={style.btnPrimario}
            disabled={loading || tieneProblemasStock || !isAuthenticated || !clienteActual}
          >
            <FileText className={style.icon} />
            {!isAuthenticated || !clienteActual ? 'Inicia sesión para continuar' : 'Procesar Pedido'}
          </button>
        </div>
      )}

      {/* Modal de pedido */}
      {modalActivo === 'pedido' && (
        <div className={style.modalOverlay} onClick={cerrarModal}>
          <div className={style.modal} onClick={(e) => e.stopPropagation()}>
            <div className={style.modalHeader}>
              <h3>
                <FileText className={style.icon} />
                Datos del Pedido
              </h3>
              <button onClick={cerrarModal} className={style.btnCerrar}>×</button>
            </div>
            
            <form onSubmit={handleSubmitPedido} className={style.modalContent}>
              <div className={style.clienteSeleccionado}>
                <h4>Cliente:</h4>
                <p>
                  {clienteActual?.Nombre} {clienteActual?.Apellido}
                </p>
              </div>
              
              <div className={style.formGroup}>
                <label>Fecha de Entrega *</label>
                <input
                  type="date"
                  name="Fecha_Entrega"
                  value={pedidoData.Fecha_Entrega}
                  onChange={handleInputChangePedido}
                  className={style.input}
                  min={new Date().toISOString().slice(0, 10)}
                  required
                />
              </div>
              
              <div className={style.formGroup}>
                <label>Observaciones</label>
                <textarea
                  name="Observaciones"
                  value={pedidoData.Observaciones}
                  onChange={handleInputChangePedido}
                  className={style.textarea}
                  placeholder="Instrucciones especiales, comentarios..."
                  rows="3"
                />
              </div>
              
              <div className={style.resumenPedido}>
                <h4>Resumen del Pedido:</h4>
                <div className={style.resumenItems}>
                  {carrito.map((producto, index) => (
                    <div key={index} className={style.resumenItem}>
                      <span>{producto.Nombre_Producto} x{producto.cantidad}</span>
                      <span>${(producto.Precio_Final * producto.cantidad).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className={style.resumenTotal}>
                  <strong>Total: ${totalCarrito.toFixed(2)}</strong>
                </div>
              </div>
              {/* Checkbox de términos y condiciones */}
              <div className={style.formGroup} style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    checked={aceptaTerminos}
                    onChange={e => setAceptaTerminos(e.target.checked)}
                    style={{ marginRight: '0.5rem' }}
                  />
                  Acepto los <a href="/terminos_condiciones" target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'underline' }}>términos y condiciones</a>
                </label>
              </div>
              <div className={style.modalAcciones}>
                <button 
                  type="button" 
                  onClick={cerrarModal}
                  className={style.btnSecundario}
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className={style.btnPrimario}
                  disabled={loading || tieneProblemasStock || !aceptaTerminos}
                >
                  {loading ? 'Procesando...' : 'Procesar Pedido'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carrito;