import { useEffect, useState, useCallback, useMemo } from "react";
import { ShoppingCart, User, Calendar, Phone, Trash2, Plus, Minus, Send, MessageCircle, AlertTriangle } from "lucide-react";
import style from './Carrito.module.css';
import useProductoStore from '../../store/ProductoStore'; // Importar el store de productos

// Simulación de stores usando React state en lugar de localStorage
const useClienteStore = () => {
  const [clientes, setClientes] = useState([]);
  
  const addCliente = async (cliente) => {
    const nuevoCliente = { ...cliente, ID_Cliente: Date.now() };
    setClientes(prev => [...prev, nuevoCliente]);
    return nuevoCliente;
  };
  
  return { addCliente, clientes };
};

const usePedidoStore = () => {
  const [pedidos, setPedidos] = useState([]);
  
  const addPedido = async (pedido) => {
    const nuevoPedido = { ...pedido, ID_Pedido: Date.now() };
    setPedidos(prev => [...prev, nuevoPedido]);
    return nuevoPedido;
  };
  
  return { addPedido, pedidos };
};

const useDetallePedidoStore = () => {
  const [detalles, setDetalles] = useState([]);
  
  const addDetallePedido = async (detalle) => {
    const nuevoDetalle = { ...detalle, ID_DetallePedido: Date.now() + Math.random() };
    setDetalles(prev => [...prev, nuevoDetalle]);
    return nuevoDetalle;
  };
  
  return { addDetallePedido, detalles };
};

const useFacturaStore = () => {
  const [facturas, setFacturas] = useState([]);
  
  const addFactura = async (factura) => {
    const nuevaFactura = { ...factura, ID_Factura: Date.now() };
    setFacturas(prev => [...prev, nuevaFactura]);
    return nuevaFactura;
  };
  
  return { addFactura, facturas };
};

const useHistorialEstadoStore = () => {
  const [historiales, setHistoriales] = useState([]);
  
  const addHistorialEstado = async (historial) => {
    const nuevoHistorial = { ...historial, ID_Historial: Date.now() };
    setHistoriales(prev => [...prev, nuevoHistorial]);
    return nuevoHistorial;
  };
  
  return { addHistorialEstado, historiales };
};

const useEstadoPedidoStore = () => ({
  estadoPedidos: [
    { ID_EstadoPedido: 1, Estado: 'Recibido' },
    { ID_EstadoPedido: 2, Estado: 'En Proceso' },
    { ID_EstadoPedido: 3, Estado: 'Enviado' },
    { ID_EstadoPedido: 4, Estado: 'Entregado' }
  ],
  fetchEstadoPedido: async () => {}
});

const Carrito = () => {
  // Estados principales - ahora cargamos desde localStorage
  const [carrito, setCarrito] = useState(() => {
    const carritoGuardado = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("carrito")) || [] : [];
    return carritoGuardado;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stockWarnings, setStockWarnings] = useState([]); // Nuevo estado para advertencias de stock
  
  // Estados de formularios
  const [mostrarFormularioCliente, setMostrarFormularioCliente] = useState(false);
  const [mostrarFormularioPedido, setMostrarFormularioPedido] = useState(false);
  
  // Estados de datos
  const [clienteData, setClienteData] = useState({
    Nombre: "",
    Apellido: "",
    NumCelular: ""
  });
  
  const [pedidoData, setPedidoData] = useState({
    ID_Cliente: "",
    Fecha_Pedido: "",
    Fecha_Entrega: ""
  });
  
  const [clienteGuardado, setClienteGuardado] = useState(null);
  const [numCelularBusqueda, setNumCelularBusqueda] = useState("");

  // Hooks de stores
  const { addCliente, clientes } = useClienteStore();
  const { addPedido, pedidos } = usePedidoStore();
  const { addDetallePedido, detalles } = useDetallePedidoStore();
  const { addFactura, facturas } = useFacturaStore();
  const { addHistorialEstado, historiales } = useHistorialEstadoStore();
  const { estadoPedidos, fetchEstadoPedido } = useEstadoPedidoStore();
  
  // Hook del store de productos - NUEVO
  const { decreaseStock, checkStock, productos, fetchProducto } = useProductoStore();

  // Efectos
  useEffect(() => {
    initializeComponent();
  }, []);

  // Actualizar localStorage cuando cambia el carrito
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("carrito", JSON.stringify(carrito));
    }
  }, [carrito]);

  // Verificar stock cuando cambia el carrito - NUEVO
  useEffect(() => {
    verificarStockCarrito();
  }, [carrito, productos]);

  // Funciones de inicialización
  const initializeComponent = useCallback(async () => {
    try {
      const hoy = new Date().toISOString().slice(0, 10);
      setPedidoData(prev => ({ ...prev, Fecha_Pedido: hoy }));
      
      await fetchEstadoPedido();
      await fetchProducto(); // Cargar productos para verificar stock
    } catch (error) {
      setError("Error al inicializar el componente");
      console.error("Error:", error);
    }
  }, [fetchEstadoPedido, fetchProducto]);

  // Nueva función para verificar stock del carrito
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

  // Cálculos memoizados
  const totalCarrito = useMemo(() => {
    return carrito.reduce((total, producto) => total + (producto.Precio_Final * producto.cantidad), 0);
  }, [carrito]);

  const cantidadTotalProductos = useMemo(() => {
    return carrito.reduce((total, producto) => total + producto.cantidad, 0);
  }, [carrito]);

  // Verificar si hay problemas de stock antes de procesar el pedido
  const tieneProblemasStock = useMemo(() => {
    return stockWarnings.length > 0;
  }, [stockWarnings]);

  // Funciones de manejo del carrito
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
  }, []);

  // Funciones de validación
  const validarFormularioCliente = useCallback(() => {
    const { Nombre, Apellido, NumCelular } = clienteData;
    
    if (!Nombre.trim() || !Apellido.trim() || !NumCelular.trim()) {
      setError("Todos los campos del cliente son obligatorios");
      return false;
    }
    
    if (!/^\d{9,15}$/.test(NumCelular)) {
      setError("El número de celular debe tener entre 9 y 15 dígitos");
      return false;
    }
    
    return true;
  }, [clienteData]);

  const validarFormularioPedido = useCallback(() => {
    if (!pedidoData.Fecha_Entrega) {
      setError("La fecha de entrega es obligatoria");
      return false;
    }
    
    const fechaEntrega = new Date(pedidoData.Fecha_Entrega);
    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0);
    
    if (fechaEntrega < fechaActual) {
      setError("La fecha de entrega no puede ser anterior a hoy");
      return false;
    }

    // Validar stock antes de procesar el pedido - NUEVO
    if (tieneProblemasStock) {
      setError("Hay problemas de stock que deben resolverse antes de procesar el pedido");
      return false;
    }
    
    return true;
  }, [pedidoData, tieneProblemasStock]);

  // Funciones de búsqueda y verificación
  const verificarClienteExiste = useCallback(async (numCelular) => {
    try {
      return clientes.find(cliente => cliente.NumCelular === Number(numCelular));
    } catch (error) {
      console.error("Error al verificar cliente:", error);
      return null;
    }
  }, [clientes]);

  // Funciones de manejo de formularios
  const handleInputChangeCliente = useCallback((e) => {
    const { name, value } = e.target;
    setClienteData(prev => ({ ...prev, [name]: value }));
    setError("");
  }, []);

  const handleInputChangePedido = useCallback((e) => {
    const { name, value } = e.target;
    setPedidoData(prev => ({ ...prev, [name]: value }));
    setError("");
  }, []);

  const handleSubmitCliente = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validarFormularioCliente()) return;
    
    setLoading(true);
    setError("");
    
    try {
      const clienteParaGuardar = {
        Nombre: clienteData.Nombre.trim(),
        Apellido: clienteData.Apellido.trim(),
        NumCelular: Number(clienteData.NumCelular),
      };
      
      const clienteCreado = await addCliente(clienteParaGuardar);
      
      setClienteData({ Nombre: "", Apellido: "", NumCelular: "" });
      setClienteGuardado(clienteCreado);
      setMostrarFormularioCliente(false);
      setMostrarFormularioPedido(true);
      
    } catch (error) {
      setError("Error al agregar cliente. Intente nuevamente.");
      console.error("Error al agregar cliente:", error);
    } finally {
      setLoading(false);
    }
  }, [clienteData, validarFormularioCliente, addCliente]);

  // Función principal modificada para disminuir stock - MODIFICADA
  const handleSubmitPedido = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validarFormularioPedido()) return;
    if (!clienteGuardado) {
      setError("No hay cliente registrado.");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      // 1. Verificar stock una vez más antes de procesar
      const stockErrors = [];
      for (const producto of carrito) {
        const stockCheck = checkStock(producto.ID_Producto, producto.cantidad);
        if (!stockCheck.available) {
          stockErrors.push(`${producto.Nombre_Producto}: solicitado ${producto.cantidad}, disponible ${stockCheck.cantidadDisponible}`);
        }
      }
      
      if (stockErrors.length > 0) {
        setError(`Problemas de stock:\n${stockErrors.join('\n')}`);
        return;
      }

      const nuevoPedido = {
        ...pedidoData,
        ID_Cliente: clienteGuardado.ID_Cliente
      };
      
      // 2. Guardar pedido
      const pedidoCreado = await addPedido(nuevoPedido);
      const idPedido = pedidoCreado.ID_Pedido || pedidoCreado;
      
      // 3. Guardar detalles del pedido Y disminuir stock
      let subtotalTotal = 0;
      const stockUpdateResults = [];
      
      for (const producto of carrito) {
        // Guardar detalle del pedido
        const detalle = {
          ID_Pedido: idPedido,
          ID_Producto: producto.ID_Producto,
          Cantidad: producto.cantidad,
          Precio_Unitario: producto.Precio_Final,
          Descuento: 0,
          Subtotal: producto.cantidad * producto.Precio_Final
        };
        subtotalTotal += detalle.Subtotal;
        await addDetallePedido(detalle);
        
        // NUEVO: Disminuir stock del producto
        const stockResult = await decreaseStock(producto.ID_Producto, producto.cantidad);
        stockUpdateResults.push({
          producto: producto.Nombre_Producto,
          cantidad: producto.cantidad,
          success: stockResult.success,
          error: stockResult.error,
          nuevoStock: stockResult.nuevaCantidad
        });
        
        if (!stockResult.success) {
          console.error(`Error al actualizar stock de ${producto.Nombre_Producto}:`, stockResult.error);
        }
      }
      
      // 4. Generar factura automáticamente
      const nuevaFactura = {
        ID_Pedido: idPedido,
        ID_Cliente: clienteGuardado.ID_Cliente,
        Fecha: new Date().toISOString().slice(0, 10),
        Monto_Total: subtotalTotal
      };
      await addFactura(nuevaFactura);
      
      // 5. Crear registro en historial de estados
      const estadoEnProceso = estadoPedidos.find(estado => estado.Estado === 'En Proceso');
      const idEstadoEnProceso = estadoEnProceso ? estadoEnProceso.ID_EstadoPedido : 1;
      
      const nuevoHistorialEstado = {
        ID_EstadoPedido: idEstadoEnProceso,
        ID_Pedido: idPedido,
        Fecha: new Date().toISOString().slice(0, 10)
      };
      await addHistorialEstado(nuevoHistorialEstado);
      
      // 6. Mostrar resumen de actualización de stock
      const stockExitosos = stockUpdateResults.filter(r => r.success);
      const stockFallidos = stockUpdateResults.filter(r => !r.success);
      
      let mensajeStock = '';
      if (stockExitosos.length > 0) {
        mensajeStock += 'Stock actualizado:\n';
        stockExitosos.forEach(r => {
          mensajeStock += `- ${r.producto}: -${r.cantidad} (nuevo stock: ${r.nuevoStock})\n`;
        });
      }
      
      if (stockFallidos.length > 0) {
        mensajeStock += '\nAdvertencias de stock:\n';
        stockFallidos.forEach(r => {
          mensajeStock += `- ${r.producto}: ${r.error}\n`;
        });
      }
      
      // 7. Limpiar estado
      resetearFormularios();
      limpiarCarrito();
      
      // 8. Mostrar mensaje de éxito con información de stock
      const mensajeCompleto = `Pedido y factura guardados correctamente.\n\n${mensajeStock}\n¿Desea enviar el comprobante por WhatsApp?`;
      const enviarWhatsApp = window.confirm(mensajeCompleto);
      
      if (enviarWhatsApp && clienteGuardado.NumCelular) {
        enviarWhatsAppCliente(clienteGuardado.NumCelular);
      }
      
    } catch (error) {
      setError("Error al guardar el pedido.");
      console.error("Error al guardar pedido:", error);
    } finally {
      setLoading(false);
    }
  }, [pedidoData, clienteGuardado, carrito, validarFormularioPedido, addPedido, addDetallePedido, addFactura, addHistorialEstado, estadoPedidos, limpiarCarrito, checkStock, decreaseStock]);

  // Funciones de utilidades
  const resetearFormularios = useCallback(() => {
    setPedidoData({
      ID_Cliente: "",
      Fecha_Pedido: new Date().toISOString().slice(0, 10),
      Fecha_Entrega: ""
    });
    setMostrarFormularioPedido(false);
    setMostrarFormularioCliente(false);
    setClienteGuardado(null);
    setNumCelularBusqueda("");
    setStockWarnings([]);
  }, []);

  const generarMensajeWhatsApp = useCallback(() => {
    const productos = carrito.map(producto => 
      `- ${producto.Nombre_Producto} (Cantidad: ${producto.cantidad}, Precio: $${producto.Precio_Final})`
    ).join('\n');
    
    const fechaEntrega = pedidoData.Fecha_Entrega || 'Por definir';
    
    return `¡Hola! Quiero realizar este pedido:\n\n${productos}\n\nTotal: $${totalCarrito.toFixed(2)}\n\nFecha de entrega: ${fechaEntrega}`;
  }, [carrito, totalCarrito, pedidoData.Fecha_Entrega]);

  const enviarWhatsAppCliente = useCallback((telefono) => {
    const mensaje = generarMensajeWhatsApp();
    window.open(`https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`, '_blank');
  }, [generarMensajeWhatsApp]);

  const enviarWhatsAppNegocio = useCallback(() => {
    if (carrito.length === 0) {
      setError("El carrito está vacío");
      return;
    }
    
    const mensaje = generarMensajeWhatsApp();
    const telefono = '51987654321'; // Número del negocio
    window.open(`https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`, '_blank');
  }, [carrito, generarMensajeWhatsApp]);

  const manejarBusquedaCliente = useCallback(async () => {
    if (!numCelularBusqueda.trim()) {
      setError("Por favor, ingrese número de celular para verificar cliente.");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const clienteExistente = await verificarClienteExiste(numCelularBusqueda);
      
      if (!clienteExistente) {
        setClienteData(prev => ({ ...prev, NumCelular: numCelularBusqueda }));
        setMostrarFormularioCliente(true);
        setMostrarFormularioPedido(false);
        setClienteGuardado(null);
      } else {
        setClienteGuardado(clienteExistente);
        setPedidoData(prev => ({
          ...prev,
          ID_Cliente: clienteExistente.ID_Cliente
        }));
        setMostrarFormularioPedido(true);
        setMostrarFormularioCliente(false);
      }
    } catch (error) {
      setError("Error al buscar cliente");
    } finally {
      setLoading(false);
    }
  }, [numCelularBusqueda, verificarClienteExiste]);

  // Render del componente
  return (
    <div className={style.container}>
      {/* Header */}
      <div className={style.header}>
        <ShoppingCart className={style.headerIcon} />
        <h2 className={style.headerTitle}>Carrito de Compras</h2>
        {carrito.length > 0 && (
          <span className={style.productCount}>
            {cantidadTotalProductos} productos
          </span>
        )}
      </div>

      {/* Mensajes de error */}
      {error && (
        <div className={style.errorMessage}>
          {error}
        </div>
      )}

      {/* Advertencias de stock - NUEVO */}
      {stockWarnings.length > 0 && (
        <div className={style.stockWarnings}>
          <div className={style.warningHeader}>
            <AlertTriangle className={style.warningIcon} />
            <span>Problemas de Stock Detectados</span>
          </div>
          {stockWarnings.map((warning, index) => (
            <div key={index} className={style.warningItem}>
              <strong>{warning.producto}:</strong> 
              Solicitado: {warning.solicitado}, Disponible: {warning.disponible}
              <button 
                onClick={() => actualizarCantidadProducto(warning.index, warning.disponible)}
                className={style.fixStockButton}
              >
                Ajustar a {warning.disponible}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Carrito vacío */}
      {carrito.length === 0 ? (
        <div className={style.emptyCart}>
          <ShoppingCart className={style.emptyCartIcon} />
          <p className={style.emptyCartText}>El carrito está vacío</p>
        </div>
      ) : (
        <div>
          {/* Lista de productos */}
          <div className={style.productList}>
            {carrito.map((producto, index) => {
              const hasStockIssue = stockWarnings.some(w => w.index === index);
              
              return (
                <div 
                  key={index} 
                  className={`${style.productItem} ${hasStockIssue ? style.stockIssueItem : ''}`}
                >
                  <div className={style.imageContainer}>
                    <img 
                      src={producto.Url || 'https://via.placeholder.com/150'} 
                      alt={producto.Nombre_Producto}
                      className={style.productImage}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150';
                      }}
                    />
                    {hasStockIssue && (
                      <div className={style.stockIssueOverlay}>
                        <AlertTriangle className={style.stockIssueIcon} />
                      </div>
                    )}
                  </div>
                  <div className={style.productInfo}>
                    <h3 className={style.productName}>{producto.Nombre_Producto}</h3>
                    <p className={style.productPrice}>${producto.Precio_Final}</p>
                    {hasStockIssue && (
                      <p className={style.stockIssueText}>Stock insuficiente</p>
                    )}
                  </div>
                  
                  {/* Controles de cantidad */}
                  <div className={style.quantityControls}>
                    <button
                      onClick={() => actualizarCantidadProducto(index, producto.cantidad - 1)}
                      className={style.quantityButton}
                      disabled={loading}
                    >
                      <Minus className={style.quantityIcon} />
                    </button>
                    <span className={style.quantityValue}>{producto.cantidad}</span>
                    <button
                      onClick={() => actualizarCantidadProducto(index, producto.cantidad + 1)}
                      className={style.quantityButton}
                      disabled={loading}
                    >
                      <Plus className={style.quantityIcon} />
                    </button>
                  </div>
                  
                  {/* Subtotal y eliminar */}
                  <div className={style.subtotalContainer}>
                    <p className={style.subtotal}>
                      ${(producto.Precio_Final * producto.cantidad).toFixed(2)}
                    </p>
                    <button
                      onClick={() => eliminarProducto(index)}
                      className={style.deleteButton}
                      disabled={loading}
                    >
                      <Trash2 className={style.deleteIcon} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total */}
          <div className={style.totalContainer}>
            <div className={style.totalRow}>
              <span>Total:</span>
              <span className={style.totalAmount}>${totalCarrito.toFixed(2)}</span>
            </div>
            {tieneProblemasStock && (
              <div className={style.stockWarningTotal}>
                ⚠️ Resuelve los problemas de stock antes de proceder
              </div>
            )}
          </div>

          {/* Búsqueda de cliente */}
          <div className={style.clientSearch}>
            <div className={style.searchHeader}>
              <Phone className={style.searchIcon} />
              <label className={style.searchLabel}>Buscar Cliente</label>
            </div>
            <div className={style.searchControls}>
              <input
                type="text"
                placeholder="Número de Celular"
                value={numCelularBusqueda}
                onChange={(e) => setNumCelularBusqueda(e.target.value)}
                className={style.searchInput}
                disabled={loading}
              />
              <button
                onClick={manejarBusquedaCliente}
                disabled={loading || !numCelularBusqueda.trim() || tieneProblemasStock}
                className={style.searchButton}
              >
                <User className={style.searchButtonIcon} />
                {loading ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
          </div>

          {/* Botones de acción */}
          <div className={style.actionButtons}>
            <button
              onClick={enviarWhatsAppNegocio}
              disabled={loading || tieneProblemasStock}
              className={style.whatsappButton}
            >
              <MessageCircle className={style.whatsappIcon} />
              Enviar por WhatsApp
            </button>
            <button
              onClick={limpiarCarrito}
              disabled={loading}
              className={style.clearButton}
            >
              <Trash2 className={style.clearIcon} />
              Limpiar Carrito
            </button>
          </div>
        </div>
      )}

      {/* Formulario de Cliente */}
      {mostrarFormularioCliente && (
        <div className={style.modalOverlay}>
          <div className={style.modalContent}>
            <div className={style.modalHeader}>
              <User className={style.modalIcon} />
              <h3 className={style.modalTitle}>Agregar Cliente</h3>
            </div>
            <form onSubmit={handleSubmitCliente} className={style.modalForm}>
              <input
                type="text"
                placeholder="Nombre"
                required
                name="Nombre"
                value={clienteData.Nombre}
                onChange={handleInputChangeCliente}
                className={style.formInput}
                disabled={loading}
              />
              <input
                type="text"
                placeholder="Apellido"
                required
                name="Apellido"
                value={clienteData.Apellido}
                onChange={handleInputChangeCliente}
                className={style.formInput}
                disabled={loading}
              />
              <input
                type="text"
                placeholder="Número de Celular"
                required
                name="NumCelular"
                value={clienteData.NumCelular}
                onChange={handleInputChangeCliente}
                className={style.formInput}
                disabled={loading}
              />
              <div className={style.formButtons}>
                <button
                  type="button"
                  onClick={() => {
                    setMostrarFormularioCliente(false);
                    setClienteData({ Nombre: "", Apellido: "", NumCelular: "" });
                  }}
                  disabled={loading}
                  className={style.cancelButton}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={style.submitButton}
                >
                  {loading ? 'Guardando...' : 'Guardar Datos'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Formulario de Pedido */}
      {mostrarFormularioPedido && (
        <div className={style.modalOverlay}>
          <div className={style.modalContent}>
            <div className={style.modalHeader}>
              <Calendar className={style.modalIcon} />
              <h3 className={style.modalTitle}>Completar Pedido</h3>
            </div>
            <form onSubmit={handleSubmitPedido} className={style.modalForm}>
              <div className={style.formGroup}>
                <label className={style.formLabel}>Cliente</label>
                <input
                  type="text"
                  value={`${clienteGuardado?.Nombre || ""} ${clienteGuardado?.Apellido || ""}`}
                  readOnly
                  className={style.formInputReadonly}
                />
              </div>
              <div className={style.formGroup}>
                <label className={style.formLabel}>Fecha de Entrega</label>
                <input
                  type="date"
                  name="Fecha_Entrega"
                  value={pedidoData.Fecha_Entrega}
                  onChange={handleInputChangePedido}
                  required
                  className={style.formInput}
                  disabled={loading}
                  min={new Date().toISOString().slice(0, 10)}
                />
              </div>
              <div className={style.formGroup}>
                <label className={style.formLabel}>Total del Pedido</label>
                <input
                  type="text"
                  value={`$${totalCarrito.toFixed(2)}`}
                  readOnly
                  className={style.formInputReadonly}
                />
              </div>
              <div className={style.formButtons}>
                <button
                  type="button"
                  onClick={() => {
                    setMostrarFormularioPedido(false);
                    resetearFormularios();
                  }}
                  disabled={loading}
                  className={style.cancelButton}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading || tieneProblemasStock}
                  className={style.submitButton}
                >
                  <Send className={style.submitIcon} />
                  {loading ? 'Procesando...' : 'Completar Pedido'}
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