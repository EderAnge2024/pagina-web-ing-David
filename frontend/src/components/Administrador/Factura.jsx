import { useEffect, useState, useCallback } from 'react'
import { Download, Send, Eye, Phone, FileText, X } from 'lucide-react'
import useFacturaStore from '../../store/FacturaStore'
import useClienteStore from '../../store/ClienteStore'
import usePedidoStore from '../../store/PedidoStore'
import useDetallePedidoStore from '../../store/DetallePedidoStore'
import useProductoStore from '../../store/ProductoStore'
import { generateFacturaPDF } from '../../store/generadorFacturasPdf'
import styles from './Factura.module.css'

const INITIAL_FACTURA_DATA = {
    ID_Pedido: "",
    ID_Cliente: "",
    Fecha: "",
    Monto_Total: ""
}

const Factura = () => {
    // Store hooks - actualizados con los nuevos campos del store
    const { addFactura, fetchFactura, facturas, deleteFactura, updateFactura } = useFacturaStore()
    const { 
        clientes, 
        fetchCliente,
        isAuthenticated,
        clienteActual,
        loading: clienteLoading 
    } = useClienteStore()
    const { pedidos, fetchPedido } = usePedidoStore()
    const { detallePedidos, fetchDetallePedido } = useDetallePedidoStore()
    const { productos, fetchProducto } = useProductoStore()
    
    // State management
    const [facturaData, setFacturaData] = useState(INITIAL_FACTURA_DATA)
    const [editingFactura, setEditingFactura] = useState(null)
    const [viewingFactura, setViewingFactura] = useState(null)
    const [loading, setLoading] = useState(false)
    const [dataLoaded, setDataLoaded] = useState(false)
    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' })

    // Initialize data on component mount
    useEffect(() => {
        const initializeData = async () => {
            try {
                setLoading(true)
                
                // Verificar si hay funciones de fetch disponibles antes de llamarlas
                const promises = []
                
                if (fetchFactura) promises.push(fetchFactura())
                if (fetchCliente) promises.push(fetchCliente())
                if (fetchPedido) promises.push(fetchPedido())
                if (fetchDetallePedido) promises.push(fetchDetallePedido())
                if (fetchProducto) promises.push(fetchProducto())
                
                await Promise.all(promises)
                setDataLoaded(true)
            } catch (error) {
                console.error('Error al cargar datos:', error)
                mostrarMensaje('Error al cargar datos', 'error')
            } finally {
                setLoading(false)
            }
        }
        
        // Solo inicializar si no estamos en proceso de carga de cliente
        if (!clienteLoading) {
            initializeData()
        }
    }, [clienteLoading, fetchFactura, fetchCliente, fetchPedido, fetchDetallePedido, fetchProducto])

    // Auto-completar ID_Cliente si hay un cliente autenticado
    useEffect(() => {
        if (isAuthenticated && clienteActual?.ID_Cliente) {
            setFacturaData(prev => ({
                ...prev,
                ID_Cliente: clienteActual.ID_Cliente.toString()
            }))
        }
    }, [isAuthenticated, clienteActual])

    const mostrarMensaje = useCallback((texto, tipo = 'success') => {
        setMensaje({ texto, tipo })
        setTimeout(() => setMensaje({ texto: '', tipo: '' }), 5000)
    }, [])

    const validarDatosDisponibles = () => 
        dataLoaded && 
        clientes?.length > 0 && 
        pedidos?.length > 0 && 
        productos?.length > 0

    // Form handlers
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFacturaData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        // Validar autenticación si es necesario
        if (!isAuthenticated && !facturaData.ID_Cliente) {
            mostrarMensaje("Debe especificar un ID de cliente o iniciar sesión", 'error')
            return
        }
        
        try {
            setLoading(true)
            
            // Usar el ID del cliente autenticado si no se especifica otro
            const datosFactura = {
                ...facturaData,
                ID_Cliente: facturaData.ID_Cliente || clienteActual?.ID_Cliente?.toString()
            }
            
            await addFactura(datosFactura)
            setFacturaData({
                ...INITIAL_FACTURA_DATA,
                ID_Cliente: isAuthenticated ? clienteActual.ID_Cliente.toString() : ""
            })
            mostrarMensaje("Factura agregada exitosamente")
            
            if (fetchFactura) {
                await fetchFactura()
            }
        } catch (error) {
            console.error('Error al agregar factura:', error)
            mostrarMensaje("Error al agregar factura", 'error')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (ID_Factura) => {
        if (!window.confirm("¿Estás seguro de eliminar esta factura?")) return
        
        try {
            setLoading(true)
            await deleteFactura(ID_Factura)
            
            if (fetchFactura) {
                await fetchFactura()
            }
            mostrarMensaje("Factura eliminada correctamente")
        } catch (error) {
            console.error('Error al eliminar factura:', error)
            mostrarMensaje("Error al eliminar factura", 'error')
        } finally {
            setLoading(false)
        }
    }

    // Edit functionality
    const handleEditClick = (factura) => {
        setEditingFactura({
            ...factura,
            formData: { ...factura }
        })
    }

    const handleEditInputChange = (e) => {
        const { name, value } = e.target
        setEditingFactura(prev => ({
            ...prev,
            formData: { ...prev.formData, [name]: value }
        }))
    }

    const handleUpdate = async () => {
        try {
            setLoading(true)
            await updateFactura(editingFactura.ID_Factura, editingFactura.formData)
            
            if (fetchFactura) {
                await fetchFactura()
            }
            
            setEditingFactura(null)
            mostrarMensaje("Factura actualizada correctamente")
        } catch (error) {
            console.error('Error al actualizar factura:', error)
            mostrarMensaje("Error al actualizar factura", 'error')
        } finally {
            setLoading(false)
        }
    }

    // Funciones auxiliares
    const obtenerCliente = (ID_Cliente) => {
        // Si es el cliente autenticado, usar sus datos
        if (isAuthenticated && clienteActual && 
            String(clienteActual.ID_Cliente).trim() === String(ID_Cliente).trim()) {
            return clienteActual
        }
        
        // Buscar en la lista de clientes
        const cliente = clientes?.find(c => String(c.ID_Cliente).trim() === String(ID_Cliente).trim())
        return cliente || { 
            ID_Cliente, 
            Nombre: 'Cliente no encontrado', 
            Apellido: `(ID: ${ID_Cliente})`, 
            NumCelular: '' 
        }
    }

    const obtenerPedido = (ID_Pedido) => {
        const pedido = pedidos?.find(p => String(p.ID_Pedido).trim() === String(ID_Pedido).trim())
        return pedido || { 
            ID_Pedido, 
            Fecha_Pedido: new Date().toISOString(), 
            Fecha_Entrega: '', 
            Observaciones: 'Pedido no encontrado' 
        }
    }

    const obtenerDetalles = (ID_Pedido) => {
        const detalles = detallePedidos?.filter(d => String(d.ID_Pedido).trim() === String(ID_Pedido).trim())
        
        if (!detalles || detalles.length === 0) {
            return [{
                ID_Detalle: 'GENERICO',
                ID_Pedido,
                ID_Producto: 'SERVICIO',
                Nombre_Producto: 'Producto/Servicio',
                Cantidad: 1,
                Precio_Unitario: parseFloat(facturaData?.Monto_Total) || 0,
                Subtotal: parseFloat(facturaData?.Monto_Total) || 0
            }]
        }

        return detalles.map(detalle => {
            const producto = productos?.find(p => String(p.ID_Producto).trim() === String(detalle.ID_Producto).trim())
            return {
                ...detalle,
                Nombre_Producto: producto?.Nombre_Producto || `Producto ${detalle.ID_Producto}`,
                Precio_Unitario: parseFloat(detalle.Precio_Unitario) || 0,
                Cantidad: parseInt(detalle.Cantidad) || 0,
                Subtotal: parseFloat(detalle.Subtotal) || 0
            }
        })
    }

    const formatDate = (dateString) => {
        if (!dateString) return ''
        try {
            return new Date(dateString).toLocaleDateString('es-ES')
        } catch {
            return ''
        }
    }

    const obtenerDatosCompletosFactura = (factura) => {
        if (!factura?.ID_Cliente || !factura?.ID_Pedido || !validarDatosDisponibles()) {
            return null
        }

        const cliente = obtenerCliente(factura.ID_Cliente)
        const pedido = obtenerPedido(factura.ID_Pedido)
        const detalles = obtenerDetalles(factura.ID_Pedido)

        return {
            factura: {
                ID_Factura: factura.ID_Factura || 'N/A',
                Fecha: formatDate(factura.Fecha),
                Monto_Total: parseFloat(factura.Monto_Total) || 0
            },
            cliente,
            pedido: {
                ...pedido,
                Fecha_Pedido: formatDate(pedido.Fecha_Pedido),
                Fecha_Entrega: formatDate(pedido.Fecha_Entrega)
            },
            detalles,
            total: parseFloat(factura.Monto_Total) || 0
        }
    }

    const generarYDescargarPDF = async (factura) => {
        if (!validarDatosDisponibles()) {
            mostrarMensaje("Los datos aún se están cargando", 'error')
            return
        }

        try {
            setLoading(true)
            const datosCompletos = obtenerDatosCompletosFactura(factura)
            
            if (!datosCompletos) {
                throw new Error('No se pudieron obtener los datos completos de la factura')
            }

            const resultado = generateFacturaPDF(datosCompletos)
            
            if (resultado?.success) {
                mostrarMensaje('PDF generado y descargado exitosamente')
            } else {
                mostrarMensaje(`Error al generar PDF: ${resultado?.message || 'Error desconocido'}`, 'error')
            }
        } catch (error) {
            console.error('Error al generar PDF:', error)
            mostrarMensaje(`Error al generar PDF: ${error.message}`, 'error')
        } finally {
            setLoading(false)
        }
    }

    const enviarPorWhatsApp = (factura) => {
        if (!validarDatosDisponibles()) {
            mostrarMensaje("Los datos aún se están cargando", 'error')
            return
        }

        const datosCompletos = obtenerDatosCompletosFactura(factura)
        if (!datosCompletos) {
            mostrarMensaje("No se pudieron obtener los datos completos", 'error')
            return
        }

        const { cliente, pedido, detalles, total } = datosCompletos
        
        if (!cliente.NumCelular) {
            mostrarMensaje("Cliente no tiene número de teléfono registrado", 'error')
            return
        }

        const productos = detalles.map(d => 
            `• ${d.Nombre_Producto} x${d.Cantidad} - $${d.Subtotal.toFixed(2)}`
        ).join('\n')

        const mensaje = `🎉 ¡Hola ${cliente.Nombre}!

✅ Tu factura #${factura.ID_Factura} del pedido #${factura.ID_Pedido} está lista.

📋 DETALLES:
${productos}

💰 Total: $${total.toFixed(2)}
📅 Fecha de entrega: ${pedido.Fecha_Entrega || 'Por definir'}
${pedido.Observaciones ? `📝 Observaciones: ${pedido.Observaciones}` : ''}

¡Gracias por tu preferencia! 😊`

        const url = `https://wa.me/51${cliente.NumCelular}?text=${encodeURIComponent(mensaje)}`
        window.open(url, '_blank')
        mostrarMensaje(`Mensaje enviado al cliente: ${cliente.Nombre} ${cliente.Apellido}`)
    }

    const verDetallesFactura = (factura) => {
        if (!validarDatosDisponibles()) {
            mostrarMensaje("Los datos aún se están cargando", 'error')
            return
        }
        
        const datosCompletos = obtenerDatosCompletosFactura(factura)
        if (datosCompletos) {
            setViewingFactura(datosCompletos)
        }
    }

    // Render components
    const FacturaCard = ({ factura }) => {
        const cliente = obtenerCliente(factura.ID_Cliente)
        
        return (
            <div key={factura.ID_Factura} className={styles.facturaCard}>
                <div className={styles.facturaInfo}>
                    <div className={styles.facturaHeader}>
                        <h3>Factura #{factura.ID_Factura}</h3>
                        <span className={styles.monto}>${factura.Monto_Total}</span>
                    </div>
                    <p>ID Pedido: {factura.ID_Pedido}</p>
                    <p>Cliente: {cliente.Nombre} {cliente.Apellido}</p>
                    <p>Fecha: {formatDate(factura.Fecha)}</p>
                    {cliente.NumCelular && (
                        <p className={styles.telefono}>
                            <Phone size={16} />
                            {cliente.NumCelular}
                        </p>
                    )}
                </div>
                
                <div className={styles.actions}>
                    <button 
                        onClick={() => verDetallesFactura(factura)}
                        className={`${styles.button} ${styles.viewButton}`}
                        title="Ver detalles"
                        disabled={!dataLoaded}
                    >
                        <Eye size={16} /> Ver
                    </button>
                    
                    <button 
                        onClick={() => generarYDescargarPDF(factura)}
                        className={`${styles.button} ${styles.pdfButton}`}
                        disabled={loading || !dataLoaded}
                        title="Descargar PDF"
                    >
                        <Download size={16} /> PDF
                    </button>
                    
                    <button 
                        onClick={() => enviarPorWhatsApp(factura)}
                        className={`${styles.button} ${styles.whatsappButton}`}
                        disabled={loading || !dataLoaded}
                        title="Enviar por WhatsApp"
                    >
                        <Send size={16} /> WhatsApp
                    </button>
                    
                    <button 
                        onClick={() => handleEditClick(factura)}
                        className={`${styles.button} ${styles.editButton}`}
                    >
                        Editar
                    </button>
                    
                    <button 
                        onClick={() => handleDelete(factura.ID_Factura)}
                        className={`${styles.button} ${styles.deleteButton}`}
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        )
    }

    const ViewModal = () => {
        if (!viewingFactura) return null

        return (
            <div className={styles.modalOverlay}>
                <div className={styles.modalWindow}>
                    <button 
                        className={styles.modalClose} 
                        onClick={() => setViewingFactura(null)}
                    >
                        <X size={20} />
                    </button>
                    
                    <h3 className={styles.modalTitle}>
                        <FileText size={20} />
                        Detalles de Factura #{viewingFactura.factura.ID_Factura}
                    </h3>
                    
                    <div className={styles.facturaDetalles}>
                        {/* Cliente */}
                        <div className={styles.seccion}>
                            <h4>Cliente</h4>
                            <p><strong>{viewingFactura.cliente.Nombre} {viewingFactura.cliente.Apellido}</strong></p>
                            {viewingFactura.cliente.NumCelular && (
                                <p><Phone size={14} /> {viewingFactura.cliente.NumCelular}</p>
                            )}
                        </div>

                        {/* Pedido */}
                        <div className={styles.seccion}>
                            <h4>Pedido #{viewingFactura.pedido.ID_Pedido}</h4>
                            <p>Fecha del pedido: {viewingFactura.pedido.Fecha_Pedido}</p>
                            {viewingFactura.pedido.Fecha_Entrega && (
                                <p>Fecha de entrega: {viewingFactura.pedido.Fecha_Entrega}</p>
                            )}
                            {viewingFactura.pedido.Observaciones && (
                                <p>Observaciones: {viewingFactura.pedido.Observaciones}</p>
                            )}
                        </div>

                        {/* Productos */}
                        <div className={styles.seccion}>
                            <h4>Productos</h4>
                            <div className={styles.productosLista}>
                                {viewingFactura.detalles.map((detalle, index) => (
                                    <div key={index} className={styles.productoDetalle}>
                                        <span className={styles.nombreProducto}>{detalle.Nombre_Producto}</span>
                                        <span>Cantidad: {detalle.Cantidad}</span>
                                        <span>Precio: ${detalle.Precio_Unitario.toFixed(2)}</span>
                                        <span>Subtotal: ${detalle.Subtotal.toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.totalFactura}>
                            <strong>Total: ${viewingFactura.total.toFixed(2)}</strong>
                        </div>

                        <div className={styles.accionesModal}>
                            {viewingFactura.cliente.NumCelular && (
                                <button 
                                    onClick={() => enviarPorWhatsApp(viewingFactura.factura)}
                                    className={`${styles.button} ${styles.whatsappButton}`}
                                    disabled={loading}
                                >
                                    <Send size={16} /> Enviar WhatsApp
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const EditModal = () => {
        if (!editingFactura) return null

        return (
            <div className={styles.modalOverlay}>
                <div className={styles.modalWindow}>
                    <button 
                        className={styles.modalClose} 
                        onClick={() => setEditingFactura(null)}
                    >
                        <X size={20} />
                    </button>
                    
                    <h3 className={styles.modalTitle}>Editar factura</h3>
                    
                    <div className={styles.modalForm}>
                        {['ID_Pedido', 'ID_Cliente', 'Fecha', 'Monto_Total'].map(field => (
                            <input 
                                key={field}
                                className={styles.input}
                                type={field === 'Fecha' ? 'date' : field === 'Monto_Total' ? 'number' : 'text'}
                                step={field === 'Monto_Total' ? '0.01' : undefined}
                                name={field}
                                value={editingFactura.formData[field]}
                                onChange={handleEditInputChange}
                                placeholder={field.replace('_', ' ')}
                            />
                        ))}
                        
                        <div className={styles.botones}>
                            <button 
                                onClick={handleUpdate} 
                                className={styles.button} 
                                disabled={loading}
                            >
                                Guardar
                            </button>
                            <button 
                                onClick={() => setEditingFactura(null)} 
                                className={styles.button}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            {/* Mensajes */}
            {mensaje.texto && (
                <div className={`${styles.mensaje} ${styles[mensaje.tipo]}`}>
                    {mensaje.texto}
                </div>
            )}

            {/* Loading overlay */}
            {(loading || clienteLoading) && (
                <div className={styles.loadingOverlay}>
                    <div className={styles.spinner}></div>
                    <p>Procesando...</p>
                </div>
            )}

            {/* Información del cliente autenticado */}
            {isAuthenticated && clienteActual && (
                <div className={styles.clienteInfo}>
                    <p>Cliente actual: <strong>{clienteActual.Nombre} {clienteActual.Apellido}</strong></p>
                </div>
            )}

            {/* Formulario */}
            <div className={styles.formContainer}>
                <h1 className={styles.formTitle}>Agregar facturas</h1>
                <form onSubmit={handleSubmit} className={styles.form}>
                    {Object.keys(INITIAL_FACTURA_DATA).map(field => (
                        <input
                            key={field}
                            className={styles.input}
                            type={field === 'Fecha' ? 'date' : field === 'Monto_Total' ? 'number' : 'text'}
                            step={field === 'Monto_Total' ? '0.01' : undefined}
                            placeholder={field === 'ID_Cliente' && isAuthenticated ? 
                                'ID Cliente (autocompletado)' : 
                                field.replace('_', ' del ')
                            }
                            required={field !== 'ID_Cliente' || !isAuthenticated}
                            name={field}
                            value={facturaData[field]}
                            onChange={handleInputChange}
                            disabled={field === 'ID_Cliente' && isAuthenticated}
                        />
                    ))}
                    <button type="submit" className={styles.button} disabled={loading || clienteLoading}>
                        Guardar Datos
                    </button>
                </form>
            </div>
            
            {/* Lista de facturas */}
            <div className={styles.listContainer}>
                <h1 className={styles.listTitle}>Lista de facturas</h1>
                
                {!dataLoaded ? (
                    <div className={styles.loadingMessage}>
                        <p>Cargando datos...</p>
                    </div>
                ) : (
                    <div>
                        {facturas?.length > 0 ? (
                            facturas.map(factura => <FacturaCard key={factura.ID_Factura} factura={factura} />)
                        ) : (
                            <p>No se encontraron facturas</p>
                        )}
                    </div>
                )}
            </div>

            {/* Modales */}
            <ViewModal />
            <EditModal />
        </div>
    )
}

export default Factura