import { useEffect, useState, useCallback, useMemo } from "react";
import { 
  ShoppingCart, User, Calendar, Phone, Trash2, Plus, Minus, 
  UserCheck, AlertTriangle, FileText, Lock
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
  // ESTADOS DE AUTENTICACIÓN
  // ========================
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authData, setAuthData] = useState({
    Usuario: "",
    Contrasena: ""
  });
  const [authError, setAuthError] = useState("");

  // ========================
  // ESTADOS PRINCIPALES
  // ========================
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginData, setLoginData] = useState({
    Usuario: "",
    Contrasena: ""
  });
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
  
  const [clienteData, setClienteData] = useState({
    Nombre: "",
    Apellido: "",
    NumCelular: ""
  });
  
  const [pedidoData, setPedidoData] = useState({
    ID_Cliente: "",
    Fecha_Pedido: "",
    Fecha_Entrega: "",
    Observaciones: ""
  });

  // ========================
  // HOOKS DE STORES
  // ========================
  const { 
    addCliente, 
    clientes, 
    fetchCliente, 
    clienteActual,
    verificarClienteAutenticado,
    logoutCliente
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
  // mostar mensaje
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
      
      await Promise.all([
        fetchEstadoPedido(),
        fetchAdministrador(),
        fetchProducto(),
        fetchCliente(),
        verificarClienteAutenticado()
      ]);

      if (clienteActual) {
        setPedidoData(prev => ({ 
          ...prev, 
          ID_Cliente: clienteActual.ID_Cliente 
        }));
      }
    } catch (error) {
      setError("Error al inicializar el componente");
      console.error("Error:", error);
    }
  }, [fetchEstadoPedido, fetchAdministrador, fetchProducto, fetchCliente, verificarClienteAutenticado, clienteActual]);

  // ========================
  // FUNCIONES DE AUTENTICACIÓN
  // ========================
  const validarCredenciales = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3001/clientes/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        return true;
      } else {
        setAuthError(data.mensaje || "Credenciales incorrectas");
        return false;
      }
    } catch (error) {
      setAuthError("Error al verificar credenciales");
      console.error("Error:", error);
      return false;
    }
  }, [authData]);

  const handleAuthChange = useCallback((e) => {
    const { name, value } = e.target;
    setAuthData(prev => ({ ...prev, [name]: value }));
    setAuthError("");
  }, []);

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
    setClienteData({ Nombre: "", Apellido: "", NumCelular: "" });
    setPedidoData({ 
      ID_Cliente: "", 
      Fecha_Pedido: new Date().toISOString().slice(0, 10), 
      Fecha_Entrega: "", 
      Observaciones: "" 
    });
    setModalActivo(null);
  }, []);

  const cerrarModal = useCallback(() => {
    setModalActivo(null);
    limpiarMensajes();
  }, [limpiarMensajes]);

  const handleInputChangeCliente = useCallback((e) => {
    const { name, value } = e.target;
    setClienteData(prev => ({ ...prev, [name]: value }));
    limpiarMensajes();
  }, [limpiarMensajes]);

  const handleInputChangePedido = useCallback((e) => {
    const { name, value } = e.target;
    setPedidoData(prev => ({ ...prev, [name]: value }));
    limpiarMensajes();
  }, [limpiarMensajes]);

  const handleLoginChange = useCallback((e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  }, []);

  // ========================
  // FUNCIONES DE CLIENTES
  // ========================
  const seleccionarCliente = useCallback((cliente) => {
    setPedidoData(prev => ({
      ...prev,
      ID_Cliente: cliente.ID_Cliente
    }));
    setModalActivo('pedido');
    limpiarMensajes();
  }, [limpiarMensajes]);

  const abrirFormularioCliente = useCallback(() => {
    setClienteData({
      Nombre: "",
      Apellido: "",
      NumCelular: ""
    });
    setModalActivo('cliente');
  }, []);

  // ========================
  // VALIDACIONES
  // ========================
  const validarFormularioCliente = useCallback(() => {
    const { Nombre, Apellido, NumCelular } = clienteData;
    
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

    const clienteExistente = clientes.find(c => c.NumCelular === Number(NumCelular));
    if (clienteExistente) {
      mostrarMensaje("Ya existe un cliente con este número de celular", 'error');
      return false;
    }
    
    return true;
  }, [clienteData, clientes, mostrarMensaje]);

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
  const handleLogin = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:3001/clientes/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        mostrarMensaje("Inicio de sesión exitoso");
        setShowLoginModal(false);
        verificarClienteAutenticado();
      } else {
        mostrarMensaje(data.mensaje || "Error al iniciar sesión", 'error');
      }
    } catch (error) {
      mostrarMensaje("Error del servidor", 'error');
      console.error("Error en login:", error);
    } finally {
      setLoading(false);
    }
  }, [loginData, verificarClienteAutenticado, mostrarMensaje]);

  const handleSubmitCliente = useCallback(async (e) => {
    e.preventDefault();

    if (!validarFormularioCliente()) return;

    setLoading(true);

    try {
      const clienteParaGuardar = {
        Nombre: clienteData.Nombre.trim(),
        Apellido: clienteData.Apellido.trim(),
        NumCelular: Number(clienteData.NumCelular),
        createdAt: new Date().toISOString()
      };

      const clienteCreado = await addCliente(clienteParaGuardar);

      setClienteData({ Nombre: "", Apellido: "", NumCelular: "" });
      seleccionarCliente(clienteCreado);
      mostrarMensaje("Cliente creado exitosamente");

    } catch (error) {
      mostrarMensaje("Error al crear cliente. Intente nuevamente.", 'error');
      console.error("Error al agregar cliente:", error);
    } finally {
      setLoading(false);
    }
  }, [clienteData, validarFormularioCliente, addCliente, seleccionarCliente, mostrarMensaje]);

  const handleSubmitPedido = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validarFormularioPedido()) return;
    if (!clienteActual) {
      mostrarMensaje("No hay cliente seleccionado.", 'error');
      return;
    }
    
    // Mostrar modal de autenticación primero
    setShowAuthModal(true);
  }, [validarFormularioPedido, clienteActual, mostrarMensaje]);

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
        
        const numeroCliente = `51${cliente.NumCelular}`;
        console.log('el numero: ', numeroCliente)
        const mensajeCodificadoCliente = encodeURIComponent(mensajeCliente);
        const urlWhatsAppCliente = `https://wa.me/${numeroCliente}?text=${mensajeCodificadoCliente}`;
        
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

  const confirmarPedidoConAutenticacion = useCallback(async () => {
    setLoading(true);
    setAuthError("");
    
    try {
      // Validar credenciales primero
      const credencialesValidas = await validarCredenciales();
      
      if (!credencialesValidas) {
        return;
      }
      
      // Si las credenciales son válidas, proceder con el pedido
      setShowAuthModal(false);
      
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
    } finally {
      setLoading(false);
    }
  }, [
    validarCredenciales, carrito, pedidoData, clienteActual, 
    checkStock, addPedido, addDetallePedido, decreaseStock, 
    addFactura, estadoPedidos, addHistorialEstado, 
    resetearFormularios, limpiarCarrito, enviarNotificacionesAutomaticas, 
    mostrarMensaje
  ]);



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
      {clienteActual && (
        <div className={style.clienteActivo}>
          <UserCheck size={16} />
          <span>Cliente: {clienteActual.Nombre} {clienteActual.Apellido}</span>
          <button 
            onClick={() => {
              {/*logoutCliente(); */}
              mostrarMensaje("Sesión cerrada correctamente");
            }}
            className={style.btnCerrarSesion}
          >
            Cerrar Sesión
          </button>
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
            onClick={clienteActual ? () => setModalActivo('pedido') : abrirFormularioCliente}
            className={style.btnPrimario}
            disabled={loading || tieneProblemasStock}
          >
            <User className={style.icon} />
            {clienteActual ? 'Continuar al Pago' : 'Registrarse y Pagar'}
          </button>
        </div>
      )}
      
      {/* Modal de login */}
      {showLoginModal && (
        <div className={style.modalOverlayy} onClick={() => setShowLoginModal(false)}>
          <div className={style.modal} onClick={(e) => e.stopPropagation()}>
            <div className={style.modalHeader}>
              <h3>
                <User className={style.icon} />
                Iniciar Sesión
              </h3>
              <button 
                onClick={() => setShowLoginModal(false)} 
                className={style.btnCerrar}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleLogin} className={style.modalContent}>
              <div className={style.formGroup}>
                <label>Usuario *</label>
                <input
                  type="text"
                  name="Usuario"
                  value={loginData.Usuario}
                  onChange={handleLoginChange}
                  className={style.input}
                  required
                  autoFocus
                />
              </div>
              
              <div className={style.formGroup}>
                <label>Contraseña *</label>
                <input
                  type="password"
                  name="Contrasena"
                  value={loginData.Contrasena}
                  onChange={handleLoginChange}
                  className={style.input}
                  required
                />
              </div>
      
              <div className={style.modalAcciones}>
                <button 
                  type="button" 
                  onClick={() => setShowLoginModal(false)}
                  className={style.btnSecundario}
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className={style.btnPrimario}
                  disabled={loading}
                >
                  {loading ? 'Iniciando...' : 'Iniciar Sesión'}
                </button>
              </div>
              
              <div className={style.loginFooter}>
                <p>¿No tienes cuenta? <button 
                  type="button" 
                  className={style.linkBtn}
                  onClick={() => {
                    setShowLoginModal(false);
                    mostrarMensaje("Por favor regístrate primero");
                  }}
                >
                  Regístrate
                </button></p>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de autenticación para confirmar pedido */}
      {showAuthModal && (
        <div className={style.modalOverlay} onClick={() => setShowAuthModal(false)}>
          <div className={style.modal} onClick={(e) => e.stopPropagation()}>
            <div className={style.modalHeader}>
              <h3>
                <Lock className={style.icon} />
                Confirmar Identidad
              </h3>
              <p>Por favor ingresa tus credenciales para confirmar el pedido</p>
            </div>
            
            <div className={style.modalContent}>
              <div className={style.formGroup}>
                <label>Usuario *</label>
                <input
                  type="text"
                  name="Usuario"
                  value={authData.Usuario}
                  onChange={handleAuthChange}
                  className={style.input}
                  required
                  autoFocus
                />
              </div>
              
              <div className={style.formGroup}>
                <label>Contraseña *</label>
                <input
                  type="password"
                  name="Contrasena"
                  value={authData.Contrasena}
                  onChange={handleAuthChange}
                  className={style.input}
                  required
                />
              </div>
              
              {authError && (
                <div className={style.mensaje + " " + style.error}>
                  <AlertTriangle className={style.icon} />
                  {authError}
                </div>
              )}
              
              <div className={style.modalAcciones}>
                <button 
                  type="button" 
                  onClick={() => setShowAuthModal(false)}
                  className={style.btnSecundario}
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button 
                  type="button"
                  onClick={confirmarPedidoConAutenticacion}
                  className={style.btnPrimario}
                  disabled={loading}
                >
                  {loading ? 'Verificando...' : 'Confirmar Pedido'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de nuevo cliente */}
      {modalActivo === 'cliente' && (
        <div className={style.modalOverlay} onClick={cerrarModal}>
          <div className={style.modal} onClick={(e) => e.stopPropagation()}>
            <div className={style.modalHeader}>
              <h3>
                <User className={style.icon} />
                Nuevo Cliente
              </h3>
              <button onClick={cerrarModal} className={style.btnCerrar}>×</button>
            </div>
            
            <form onSubmit={handleSubmitCliente} className={style.modalContent}>
              <div className={style.formGroup}>
                <label>Nombre *</label>
                <input
                  type="text"
                  name="Nombre"
                  value={clienteData.Nombre}
                  onChange={handleInputChangeCliente}
                  className={style.input}
                  required
                  autoFocus
                />
              </div>
              
              <div className={style.formGroup}>
                <label>Apellido *</label>
                <input
                  type="text"
                  name="Apellido"
                  value={clienteData.Apellido}
                  onChange={handleInputChangeCliente}
                  className={style.input}
                  required
                />
              </div>
              
              <div className={style.formGroup}>
                <label>Teléfono *</label>
                <input
                  type="tel"
                  name="NumCelular"
                  value={clienteData.NumCelular}
                  onChange={handleInputChangeCliente}
                  className={style.input}
                  placeholder="987654321"
                  required
                />
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
                  disabled={loading}
                >
                  {loading ? 'Creando...' : 'Crear Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de pedido */}
      {modalActivo === 'pedido' && clienteActual && (
        <div className={style.modalOverlay} onClick={cerrarModal}>
          <div className={style.modal} onClick={(e) => e.stopPropagation()}>
            <div className={style.modalHeader}>
              <h3>
                <FileText className={style.icon} />
                Finalizar Pedido
              </h3>
              <button onClick={cerrarModal} className={style.btnCerrar}>×</button>
            </div>
            
            <div className={style.modalContent}>
              {/* Información del cliente */}
              <div className={style.clienteSeleccionado}>
                <h4>Cliente Seleccionado:</h4>
                <div className={style.clienteInfo}>
                  <p><strong>{clienteActual.Nombre} {clienteActual.Apellido}</strong></p>
                  <p><Phone className={style.iconSmall} /> {clienteActual.NumCelular}</p>
                </div>
              </div>

              {/* Resumen del pedido */}
              <div className={style.resumenPedido}>
                <h4>Resumen del Pedido:</h4>
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

              {/* Formulario del pedido */}
              <form onSubmit={handleSubmitPedido}>
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
                    rows="3"
                    placeholder="Observaciones adicionales del pedido..."
                  />
                </div>
                
                <div className={style.modalAcciones}>
                  <button 
                    type="button" 
                    onClick={cerrarModal}
                    className={style.btnSecundario}
                    disabled={loading}
                  >
                    <Calendar className={style.icon} />
                    Volver
                  </button>
                  <button 
                    type="submit"
                    className={style.btnPrimario}
                    disabled={loading || tieneProblemasStock}
                  >
                    <User className={style.icon} />
                    Confirmar Pedido
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