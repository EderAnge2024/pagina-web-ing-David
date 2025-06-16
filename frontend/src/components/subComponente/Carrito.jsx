import { useEffect, useState, useCallback, useMemo } from "react";
import { 
  ShoppingCart, User, Calendar, Phone, Trash2, Plus, Minus, 
  Send, MessageCircle, AlertTriangle, FileText, Search, 
  UserCheck, Download, History
} from "lucide-react";
import style from './Carrito.module.css';
// CAMBIO: Importar la nueva función de PDF
import { generateFacturaPDF } from "../../store/generadorFacturasPdf"; // Ajusta la ruta según tu estructura
import useProductoStore from '../../store/ProductoStore';
import useClienteStore from "../../store/ClienteStore";
import usePedidoStore from "../../store/PedidoStore";
import useDetallePedidoStore from '../../store/DetallePedidoStore';
import useFacturaStore from "../../store/FacturaStore"; 
import useHistorialEstadoStore from "../../store/HistorialEstadoStore";
import useEstadoPedidoStore from "../../store/EstadoPedidoStore";
import useAdministradorStore from "../../store/AdministradorStore";

const Carrito = () => {
  // Estados principales
  const [carrito, setCarrito] = useState(() => {
    const carritoGuardado = typeof window !== 'undefined' ? 
      JSON.parse(localStorage.getItem("carrito")) || [] : [];
    return carritoGuardado;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [stockWarnings, setStockWarnings] = useState([]);
  
  // Estados de UI mejorados
  const [modalActivo, setModalActivo] = useState(null); // 'cliente', 'pedido', 'buscar'
  const [clientesRecientes, setClientesRecientes] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [busquedaCliente, setBusquedaCliente] = useState("");
  
  // Estados de datos
  const [clienteData, setClienteData] = useState({
    Nombre: "",
    Apellido: "",
    NumCelular: "",
    Direccion: "",
    Email: ""
  });
  
  const [pedidoData, setPedidoData] = useState({
    ID_Cliente: "",
    Fecha_Pedido: "",
    Fecha_Entrega: "",
    Observaciones: ""
  });
  
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [ultimoPedidoCreado, setUltimoPedidoCreado] = useState(null);

  // Hooks de stores
  const { addCliente, clientes, fetchCliente } = useClienteStore();
  const { addPedido } = usePedidoStore();
  const { addDetallePedido } = useDetallePedidoStore();
  const { addFactura } = useFacturaStore();
  const { addHistorialEstado } = useHistorialEstadoStore();
  const { estadoPedidos, fetchEstadoPedido } = useEstadoPedidoStore();
  const { administradors, fetchAdministrador } = useAdministradorStore();
  const { decreaseStock, checkStock, productos, fetchProducto } = useProductoStore();

  // Efectos
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

  useEffect(() => {
    cargarClientesRecientes();
  }, [clientes]);

  useEffect(() => {
    filtrarClientes();
  }, [busquedaCliente, clientes]);

  // Funciones de inicialización
  const initializeComponent = useCallback(async () => {
    try {
      const hoy = new Date().toISOString().slice(0, 10);
      setPedidoData(prev => ({ ...prev, Fecha_Pedido: hoy }));
      
      await Promise.all([
        fetchEstadoPedido(),
        fetchAdministrador(),
        fetchProducto(),
        fetchCliente()
      ]);
    } catch (error) {
      setError("Error al inicializar el componente");
      console.error("Error:", error);
    }
  }, [fetchEstadoPedido, fetchAdministrador, fetchProducto, fetchCliente]);

  // Gestión mejorada de clientes
  const cargarClientesRecientes = useCallback(() => {
    if (clientes && clientes.length > 0) {
      // Obtener los últimos 5 clientes más recientes
      const recientes = [...clientes]
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 5);
      setClientesRecientes(recientes);
    }
  }, [clientes]);

  const filtrarClientes = useCallback(() => {
    if (!busquedaCliente.trim()) {
      setClientesFiltrados([]);
      return;
    }

    const filtrados = clientes.filter(cliente => 
      cliente.Nombre.toLowerCase().includes(busquedaCliente.toLowerCase()) ||
      cliente.Apellido.toLowerCase().includes(busquedaCliente.toLowerCase()) ||
      cliente.NumCelular.toString().includes(busquedaCliente) ||
      (cliente.Email && cliente.Email.toLowerCase().includes(busquedaCliente.toLowerCase()))
    ).slice(0, 10); // Limitar a 10 resultados

    setClientesFiltrados(filtrados);
  }, [busquedaCliente, clientes]);

  // Función para verificar stock
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

  const tieneProblemasStock = useMemo(() => {
    return stockWarnings.length > 0;
  }, [stockWarnings]);

  // Funciones de utilidad
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

  // Gestión del carrito
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

  // Gestión de clientes mejorada
  const seleccionarCliente = useCallback((cliente) => {
    setClienteSeleccionado(cliente);
    setPedidoData(prev => ({
      ...prev,
      ID_Cliente: cliente.ID_Cliente
    }));
    setModalActivo('pedido');
    setBusquedaCliente("");
    limpiarMensajes();
  }, [limpiarMensajes]);

  const crearNuevoCliente = useCallback(() => {
    setClienteData({
      Nombre: busquedaCliente.includes(' ') ? busquedaCliente.split(' ')[0] : busquedaCliente,
      Apellido: busquedaCliente.includes(' ') ? busquedaCliente.split(' ').slice(1).join(' ') : "",
      NumCelular: "",
      Direccion: "",
      Email: ""
    });
    setModalActivo('cliente');
  }, [busquedaCliente]);

  // Validaciones mejoradas
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

    // Verificar si el cliente ya existe
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

  // Manejo de formularios
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

  const handleSubmitCliente = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validarFormularioCliente()) return;
    
    setLoading(true);
    
    try {
      const clienteParaGuardar = {
        Nombre: clienteData.Nombre.trim(),
        Apellido: clienteData.Apellido.trim(),
        NumCelular: Number(clienteData.NumCelular),
        Direccion: clienteData.Direccion.trim(),
        Email: clienteData.Email.trim(),
        createdAt: new Date().toISOString()
      };
      
      const clienteCreado = await addCliente(clienteParaGuardar);
      
      setClienteData({ Nombre: "", Apellido: "", NumCelular: "", Direccion: "", Email: "" });
      seleccionarCliente(clienteCreado);
      mostrarMensaje("Cliente creado exitosamente");
      
    } catch (error) {
      mostrarMensaje("Error al crear cliente. Intente nuevamente.", 'error');
      console.error("Error al agregar cliente:", error);
    } finally {
      setLoading(false);
    }
  }, [clienteData, validarFormularioCliente, addCliente, seleccionarCliente, mostrarMensaje]);

  // Función principal para procesar pedido con PDF - ACTUALIZADA
  const handleSubmitPedido = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validarFormularioPedido()) return;
    if (!clienteSeleccionado) {
      mostrarMensaje("No hay cliente seleccionado.", 'error');
      return;
    }
    
    setLoading(true);
    
    try {
      // Verificar stock una vez más
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

      const nuevoPedido = {
        ...pedidoData,
        ID_Cliente: clienteSeleccionado.ID_Cliente
      };
      
      // Guardar pedido
      const pedidoCreado = await addPedido(nuevoPedido);
      const idPedido = pedidoCreado.ID_Pedido || pedidoCreado;
      
      // Guardar detalles y actualizar stock
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
      
      // Generar factura
      const nuevaFactura = {
        ID_Pedido: idPedido,
        ID_Cliente: clienteSeleccionado.ID_Cliente,
        Fecha: new Date().toISOString().slice(0, 10),
        Monto_Total: subtotalTotal
      };
      
      const facturaCreada = await addFactura(nuevaFactura);
      const idFactura = facturaCreada?.ID_Factura || facturaCreada?.id || facturaCreada;
      
      // Crear historial de estado
      const estadoEnProceso = estadoPedidos.find(estado => estado.Estado === 'En Proceso');
      const idEstadoEnProceso = estadoEnProceso ? estadoEnProceso.ID_EstadoPedido : 1;
      
      const fechaActual = new Date();
      const historialData = {
        ID_EstadoPedido: idEstadoEnProceso,
        ID_Pedido: idPedido,
        Fecha: fechaActual.toISOString()
      };
      
      await addHistorialEstado(historialData);

      // CAMBIO: Preparar datos para PDF en el formato correcto
      const datosFactura = {
      pedido: {
        ID_Pedido: idPedido,
        Fecha_Pedido: pedidoData.Fecha_Pedido,
        Fecha_Entrega: pedidoData.Fecha_Entrega,
        Observaciones: pedidoData.Observaciones
      },
      cliente: clienteSeleccionado,
      detalles: detallesPedido.map(detalle => ({
        ...detalle,
        // Asegurar que los valores numéricos sean números
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

      setUltimoPedidoCreado(datosFactura);
      
      // Limpiar estado
      resetearFormularios();
      limpiarCarrito();
      
      mostrarMensaje("Pedido procesado exitosamente");
      
      // Preguntar si desea generar PDF
      setTimeout(() => {
        const generarPDF = confirm("¿Desea generar y descargar la boleta en PDF?");
        if (generarPDF) {
          generarBoletaPDF(datosFactura);
        }
        
        // NUEVO: Preguntar si desea enviar PDF al cliente
        const enviarPDFCliente = confirm("¿Desea enviar la boleta PDF al cliente por WhatsApp?");
        if (enviarPDFCliente) {
          enviarPDFWhatsAppCliente(datosFactura);
        }
        
        const enviarWhatsApp = confirm("¿Desea enviar el pedido por WhatsApp al administrador?");
        if (enviarWhatsApp) {
          enviarWhatsAppAdmin(datosFactura);
        }
      }, 1000);
      
    } catch (error) {
      mostrarMensaje("Error al procesar el pedido.", 'error');
      console.error("Error al guardar pedido:", error);
    } finally {
      setLoading(false);
    }
  }, [pedidoData, clienteSeleccionado, carrito, validarFormularioPedido, addPedido, addDetallePedido, addFactura, addHistorialEstado, estadoPedidos, checkStock, decreaseStock, mostrarMensaje]);

  
  // CAMBIO: Función para generar PDF actualizada
  const generarBoletaPDF = useCallback(async (datosFactura = ultimoPedidoCreado) => {
    if (!datosFactura) {
      mostrarMensaje("No hay datos de factura para generar PDF", 'error');
      return;
    }

    try {
      setLoading(true);
      
      // Usar la nueva función de PDF con los datos en el formato correcto
      const resultado = generateFacturaPDF(datosFactura);
      
      if (resultado.success) {
        mostrarMensaje(`Boleta PDF generada: ${resultado.filename}`);
        return resultado; // Devolver el resultado para uso posterior
      } else {
        throw new Error('Error al generar PDF');
      }
      
    } catch (error) {
      mostrarMensaje("Error al generar la boleta PDF", 'error');
      console.error("Error al generar PDF:", error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [ultimoPedidoCreado, mostrarMensaje]);

  // NUEVA FUNCIÓN: Enviar PDF al cliente por WhatsApp
  const enviarPDFWhatsAppCliente = useCallback(async (datosFactura = ultimoPedidoCreado) => {
    if (!datosFactura || !datosFactura.cliente) {
      mostrarMensaje("No hay datos del cliente para enviar PDF", 'error');
      return;
    }

    try {
      setLoading(true);
      
      // Primero generar el PDF si no existe
      const resultadoPDF = await generarBoletaPDF(datosFactura);
      
      if (!resultadoPDF || !resultadoPDF.success) {
        mostrarMensaje("Error al generar PDF para envío", 'error');
        return;
      }

      const cliente = datosFactura.cliente;
      const numeroCliente = cliente.NumCelular.toString();
      
      // Crear mensaje personalizado para el cliente
      const productos = datosFactura.detalles.map(detalle => 
        `• ${detalle.Nombre_Producto} x${detalle.Cantidad} - $${detalle.Subtotal.toFixed(2)}`
      ).join('\n');
      
      const fechaEntrega = new Date(datosFactura.pedido.Fecha_Entrega).toLocaleDateString('es-ES');
      
      const mensajeCliente = `🎉 ¡Hola ${cliente.Nombre}!

  ✅ Tu pedido #${datosFactura.pedido.ID_Pedido} ha sido confirmado exitosamente.
  
  📋 DETALLES DEL PEDIDO:
  ${productos}
  
  💰 Total: $${datosFactura.total.toFixed(2)}
  📅 Fecha de entrega: ${fechaEntrega}
  ${datosFactura.pedido.Observaciones ? `📝 Observaciones: ${datosFactura.pedido.Observaciones}` : ''}
  
  📄 Adjunto encontrarás tu boleta de compra en PDF.
  
  ¡Gracias por tu preferencia! 😊
  
  Para cualquier consulta, no dudes en contactarnos.`;
  
        // Nota: En un entorno real, aquí podrías usar una API de WhatsApp Business
        // para enviar el PDF como archivo adjunto. Por ahora, enviamos el mensaje
        // con instrucciones para descargar el PDF
        
    const mensajeFinal = `${mensajeCliente}
  
  📎 IMPORTANTE: Para descargar tu boleta PDF, solicítala al administrador o descárgala desde nuestro sistema.
  
  PDF generado: ${resultadoPDF.filename}`;
      
      const numeroClienteEnvio = `51${numeroCliente}` ;
      console.log("este es el numero: "+numeroClienteEnvio)
      const mensajeCodificado = encodeURIComponent(mensajeFinal);
      const urlWhatsAppCliente = `https://wa.me/${numeroClienteEnvio}?text=${mensajeCodificado}`;
      
      window.open(urlWhatsAppCliente, '_blank');
      mostrarMensaje(`Mensaje enviado al cliente: ${cliente.Nombre} ${cliente.Apellido}`);
      
    } catch (error) {
      mostrarMensaje("Error al enviar PDF al cliente", 'error');
      console.error("Error al enviar PDF al cliente:", error);
    } finally {
      setLoading(false);
    }
  }, [ultimoPedidoCreado, generarBoletaPDF, mostrarMensaje]);

  // WhatsApp mejorado para administrador
  const enviarWhatsAppAdmin = useCallback((datosFactura = null) => {
    if (carrito.length === 0 && !datosFactura) {
      mostrarMensaje("El carrito está vacío", 'error');
      return;
    }
    
    const datos = datosFactura || {
      pedido: { Fecha_Entrega: pedidoData.Fecha_Entrega },
      cliente: clienteSeleccionado,
      detalles: carrito.map(p => ({
        Nombre_Producto: p.Nombre_Producto,
        Cantidad: Number(p.cantidad) || 0,
        Precio_Unitario: Number(p.Precio_Final) || 0,
        Subtotal: (Number(p.cantidad) || 0) * (Number(p.Precio_Final) || 0) * (1 - (Number(p.Descuento) || 0) / 100)
      })),
      total: Number(totalCarrito) || 0
    };
    
    const productos = datos.detalles.map(detalle => 
      `- ${detalle.Nombre_Producto} (Cant: ${detalle.Cantidad}, Precio: $${detalle.Precio_Unitario})`
    ).join('\n');
    
    const cliente = datos.cliente ? 
      `${datos.cliente.Nombre} ${datos.cliente.Apellido}` : 
      'Cliente no identificado';
    const telefono = datos.cliente ? datos.cliente.NumCelular : 'No disponible';
    const observaciones = datos.pedido.Observaciones ? 
      `\n📝 Observaciones: ${datos.pedido.Observaciones}` : '';
    
    const mensaje = `📋 NUEVO PEDIDO ${datos.pedido.ID_Pedido ? `#${datos.pedido.ID_Pedido}` : ''}\n\n👤 Cliente: ${cliente}\n📱 Teléfono: ${telefono}\n\n🛍️ Productos:\n${productos}\n\n💰 Total: $${datos.total.toFixed(2)}\n📅 Fecha de entrega: ${datos.pedido.Fecha_Entrega || 'Por definir'}${observaciones}`;

    const numeroAdmin = administradors.length > 0 ? administradors[0].NumAdministrador : '51987654321';
    const mensajeCodificado = encodeURIComponent(mensaje);
    const urlWhatsApp = `https://wa.me/${numeroAdmin}?text=${mensajeCodificado}`;
    
    window.open(urlWhatsApp, '_blank');
    mostrarMensaje("Redirigiendo a WhatsApp del administrador...");
  }, [carrito, pedidoData, clienteSeleccionado, totalCarrito, administradors, mostrarMensaje]);

  // Funciones de utilidad
  const resetearFormularios = useCallback(() => {
    setClienteData({ Nombre: "", Apellido: "", NumCelular: "", Direccion: "", Email: "" });
    setPedidoData({ 
      ID_Cliente: "", 
      Fecha_Pedido: new Date().toISOString().slice(0, 10), 
      Fecha_Entrega: "", 
      Observaciones: "" 
    });
    setClienteSeleccionado(null);
    setModalActivo(null);
    setBusquedaCliente("");
  }, []);

  const cerrarModal = useCallback(() => {
    setModalActivo(null);
    limpiarMensajes();
  }, [limpiarMensajes]);

  // Render del componente
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
            onClick={() => setModalActivo('buscar')}
            className={style.btnPrimario}
            disabled={loading || tieneProblemasStock}
          >
            <User className={style.icon} />
            Procesar Pedido
          </button>
        </div>
      )}

      {/* Acciones rápidas para último pedido */}
      {ultimoPedidoCreado && (
        <div className={style.accionesUltimoPedido}>
          <h3>Último Pedido Procesado</h3>
          <div className={style.botonesAccion}>
            <button 
              onClick={() => generarBoletaPDF()}
              className={style.btnSecundario}
              disabled={loading}
            >
              <Download className={style.icon} />
              Descargar PDF
            </button>
            
            <button 
              onClick={() => enviarPDFWhatsAppCliente()}
              className={style.btnSecundario}
              disabled={loading}
            >
              <Send className={style.icon} />
              Enviar PDF al Cliente
            </button>
            
            <button 
              onClick={() => enviarWhatsAppAdmin(ultimoPedidoCreado)}
              className={style.btnSecundario}
              disabled={loading}
            >
              <MessageCircle className={style.icon} />
              Enviar a Admin
            </button>
          </div>
        </div>
      )}

      {/* Modal de búsqueda de cliente */}
      {modalActivo === 'buscar' && (
        <div className={style.modalOverlay} onClick={cerrarModal}>
          <div className={style.modal} onClick={(e) => e.stopPropagation()}>
            <div className={style.modalHeader}>
              <h3>
                <Search className={style.icon} />
                Buscar Cliente
              </h3>
              <button onClick={cerrarModal} className={style.btnCerrar}>×</button>
            </div>
            
            <div className={style.modalContent}>
              <div className={style.busquedaContainer}>
                <input
                  type="text"
                  placeholder="Buscar por nombre, apellido, teléfono o email..."
                  value={busquedaCliente}
                  onChange={(e) => setBusquedaCliente(e.target.value)}
                  className={style.inputBusqueda}
                  autoFocus
                />
                
                {busquedaCliente && clientesFiltrados.length === 0 && (
                  <button 
                    onClick={crearNuevoCliente}
                    className={style.btnNuevoCliente}
                  >
                    <Plus className={style.icon} />
                    Crear nuevo cliente: "{busquedaCliente}"
                  </button>
                )}
              </div>

              {/* Clientes recientes */}
              {!busquedaCliente && clientesRecientes.length > 0 && (
                <div className={style.clientesSection}>
                  <h4>
                    <History className={style.icon} />
                    Clientes Recientes
                  </h4>
                  <div className={style.clientesLista}>
                    {clientesRecientes.map(cliente => (
                      <div 
                        key={cliente.ID_Cliente}
                        className={style.clienteItem}
                        onClick={() => seleccionarCliente(cliente)}
                      >
                        <div className={style.clienteInfo}>
                          <strong>{cliente.Nombre} {cliente.Apellido}</strong>
                          <span>{cliente.NumCelular}</span>
                          {cliente.Email && <span>{cliente.Email}</span>}
                        </div>
                        <UserCheck className={style.iconSmall} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Resultados de búsqueda */}
              {busquedaCliente && clientesFiltrados.length > 0 && (
                <div className={style.clientesSection}>
                  <h4>Resultados de búsqueda</h4>
                  <div className={style.clientesLista}>
                    {clientesFiltrados.map(cliente => (
                      <div 
                        key={cliente.ID_Cliente}
                        className={style.clienteItem}
                        onClick={() => seleccionarCliente(cliente)}
                      >
                        <div className={style.clienteInfo}>
                          <strong>{cliente.Nombre} {cliente.Apellido}</strong>
                          <span>{cliente.NumCelular}</span>
                          {cliente.Email && <span>{cliente.Email}</span>}
                        </div>
                        <UserCheck className={style.iconSmall} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                <label>Número de Celular *</label>
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
              
              <div className={style.modalFooter}>
                <button 
                  type="button" 
                  onClick={cerrarModal}
                  className={style.btnSecundario}
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className={style.btnPrimario}
                  disabled={loading}
                >
                  {loading ? "Guardando..." : "Crear Cliente"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de pedido */}
      {modalActivo === 'pedido' && clienteSeleccionado && (
        <div className={style.modalOverlay} onClick={cerrarModal}>
          <div className={style.modal} onClick={(e) => e.stopPropagation()}>
            <div className={style.modalHeader}>
              <h3>
                <FileText className={style.icon} />
                Confirmar Pedido
              </h3>
              <button onClick={cerrarModal} className={style.btnCerrar}>×</button>
            </div>
            
            <div className={style.modalContent}>
              {/* Información del cliente */}
              <div className={style.clienteSeleccionado}>
                <h4>Cliente Seleccionado:</h4>
                <div className={style.clienteInfo}>
                  <p><strong>{clienteSeleccionado.Nombre} {clienteSeleccionado.Apellido}</strong></p>
                  <p><Phone className={style.iconSmall} /> {clienteSeleccionado.NumCelular}</p>
                  {clienteSeleccionado.Email && (
                    <p>📧 {clienteSeleccionado.Email}</p>
                  )}
                  {clienteSeleccionado.Direccion && (
                    <p>📍 {clienteSeleccionado.Direccion}</p>
                  )}
                </div>
                <button 
                  onClick={() => setModalActivo('buscar')}
                  className={style.btnCambiarCliente}
                >
                  Cambiar Cliente
                </button>
              </div>

              {/* Resumen del pedido */}
              <div className={style.resumenPedido}>
                <h4>Resumen del Pedido:</h4>
                {carrito.map((producto, index) => (
                  <div key={index} className={style.productoResumen}>
                    <span>{producto.Nombre_Producto}</span>
                    <span>x{producto.cantidad}</span>
                    <span>${(producto.Precio_Final * producto.cantidad).toFixed(2)}</span>
                  </div>
                ))}
                <div className={style.totalResumen}>
                  <strong>Total: ${totalCarrito.toFixed(2)}</strong>
                </div>
              </div>

              {/* Formulario de pedido */}
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
                    placeholder="Instrucciones especiales, comentarios, etc."
                  />
                </div>
                
                <div className={style.modalFooter}>
                  <button 
                    type="button" 
                    onClick={cerrarModal}
                    className={style.btnSecundario}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className={style.btnPrimario}
                    disabled={loading || tieneProblemasStock}
                  >
                    {loading ? "Procesando..." : "Confirmar Pedido"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {loading && (
        <div className={style.loadingOverlay}>
          <div className={style.spinner}></div>
          <p>Procesando...</p>
        </div>
      )}
    </div>
  );
};

export default Carrito;