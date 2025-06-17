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
    // Store hooks
    const { addFactura, fetchFactura, facturas, deleteFactura, updateFactura } = useFacturaStore()
    const { clientes, fetchCliente } = useClienteStore()
    const { pedidos, fetchPedido } = usePedidoStore()
    const { detallesPedido, fetchDetallePedido } = useDetallePedidoStore()
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
        initializeData()
    }, [])

    const initializeData = async () => {
        try {
            setLoading(true)
            console.log('Iniciando carga de datos...')
            await Promise.all([
                fetchFactura(),
                fetchCliente(),
                fetchPedido(),
                fetchDetallePedido(),
                fetchProducto()
            ])
            setDataLoaded(true)
            console.log('Datos cargados exitosamente')
        } catch (error) {
            console.error('Error al cargar datos:', error)
            mostrarMensaje('Error al cargar datos', 'error')
        } finally {
            setLoading(false)
        }
    }

    const mostrarMensaje = useCallback((texto, tipo = 'success') => {
        setMensaje({ texto, tipo })
        setTimeout(() => setMensaje({ texto: '', tipo: '' }), 5000)
    }, [])

    // Validación corregida - maneja el caso donde detallesPedido no es array
    const validarDatosDisponibles = useCallback(() => {
        const detallesValidos = Array.isArray(detallesPedido) || detallesPedido === null || detallesPedido === undefined
        
        console.log('Validando datos:', {
            dataLoaded,
            clientes: Array.isArray(clientes) ? clientes.length : 'No es array',
            pedidos: Array.isArray(pedidos) ? pedidos.length : 'No es array',
            detallesPedido: Array.isArray(detallesPedido) ? detallesPedido.length : typeof detallesPedido,
            productos: Array.isArray(productos) ? productos.length : 'No es array'
        })
        
        return dataLoaded && 
               Array.isArray(clientes) && 
               Array.isArray(pedidos) && 
               detallesValidos &&
               Array.isArray(productos)
    }, [dataLoaded, clientes, pedidos, detallesPedido, productos])

    // Form handlers
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFacturaData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            await addFactura(facturaData)
            setFacturaData(INITIAL_FACTURA_DATA)
            mostrarMensaje("Factura agregada exitosamente")
            await fetchFactura()
        } catch (error) {
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
            await fetchFactura()
            mostrarMensaje("Factura eliminada correctamente")
        } catch (error) {
            mostrarMensaje("Error al eliminar factura", 'error')
        } finally {
            setLoading(false)
        }
    }

    // Edit functionality
    const handleEditClick = (factura) => {
        setEditingFactura({
            ...factura,
            formData: {
                ID_Pedido: factura.ID_Pedido,
                ID_Cliente: factura.ID_Cliente,
                Fecha: factura.Fecha,
                Monto_Total: factura.Monto_Total
            }
        })
    }

    const handleEditInputChange = (e) => {
        const { name, value } = e.target
        setEditingFactura(prev => ({
            ...prev,
            formData: {
                ...prev.formData,
                [name]: value
            }
        }))
    }

    const handleUpdate = async () => {
        try {
            setLoading(true)
            await updateFactura(editingFactura.ID_Factura, editingFactura.formData)
            await fetchFactura()
            setEditingFactura(null)
            mostrarMensaje("Factura actualizada correctamente")
        } catch (error) {
            mostrarMensaje("Error al actualizar factura", 'error')
        } finally {
            setLoading(false)
        }
    }

    // Función simplificada para obtener datos de factura
    const obtenerDatosCompletosFactura = useCallback((factura) => {
        if (!validarDatosDisponibles()) {
            console.log('Datos no disponibles para obtener datos completos')
            return null
        }

        const cliente = clientes.find(c => c.ID_Cliente === factura.ID_Cliente)
        const pedido = pedidos.find(p => p.ID_Pedido === factura.ID_Pedido)
        
        // Manejo seguro de detallesPedido
        const detallesArray = Array.isArray(detallesPedido) ? detallesPedido : []
        const detalles = detallesArray.filter(d => d.ID_Pedido === factura.ID_Pedido)
        
        console.log('Buscando datos para factura:', factura.ID_Factura, {
            cliente: !!cliente,
            pedido: !!pedido,
            detallesCount: detalles.length,
            detallesPedidoType: typeof detallesPedido
        })
        
        const detallesConProductos = detalles.map(detalle => {
            const producto = productos.find(p => p.ID_Producto === detalle.ID_Producto)
            return {
                ...detalle,
                Nombre_Producto: producto?.Nombre_Producto || `Producto ${detalle.ID_Producto}`,
                Precio_Unitario: parseFloat(detalle.Precio_Unitario) || 0,
                Cantidad: parseInt(detalle.Cantidad) || 0,
                Subtotal: parseFloat(detalle.Subtotal) || (detalle.Cantidad * detalle.Precio_Unitario) || 0
            }
        })

        return {
            factura: {
                ID_Factura: factura.ID_Factura,
                Fecha: factura.Fecha,
                Monto_Total: parseFloat(factura.Monto_Total) || 0
            },
            cliente: cliente ? {
                Nombre: cliente.Nombre || '',
                Apellido: cliente.Apellido || '',
                NumCelular: cliente.NumCelular || '',
                Email: cliente.Email || '',
                Direccion: cliente.Direccion || ''
            } : null,
            pedido: pedido ? {
                ID_Pedido: pedido.ID_Pedido,
                Fecha_Pedido: pedido.Fecha_Pedido ? new Date(pedido.Fecha_Pedido).toLocaleDateString('es-ES') : '',
                Fecha_Entrega: pedido.Fecha_Entrega ? new Date(pedido.Fecha_Entrega).toLocaleDateString('es-ES') : '',
                Observaciones: pedido.Observaciones || ''
            } : null,
            detalles: detallesConProductos,
            total: parseFloat(factura.Monto_Total) || 0
        }
    }, [validarDatosDisponibles, clientes, pedidos, detallesPedido, productos])

    const obtenerNombreCliente = useCallback((ID_Cliente) => {
        if (!Array.isArray(clientes)) return 'Cargando...'
        const cliente = clientes.find(c => c.ID_Cliente === ID_Cliente)
        return cliente ? `${cliente.Nombre} ${cliente.Apellido}` : 'Cliente no encontrado'
    }, [clientes])

    const obtenerTelefonoCliente = useCallback((ID_Cliente) => {
        if (!Array.isArray(clientes)) return null
        const cliente = clientes.find(c => c.ID_Cliente === ID_Cliente)
        return cliente?.NumCelular || null
    }, [clientes])

    // Función mejorada para generar y descargar PDF directamente
    const generarYDescargarPDF = async (factura) => {
        console.log('Intentando generar PDF para factura:', factura)
        
        if (!validarDatosDisponibles()) {
            console.log('Datos no disponibles aún')
            mostrarMensaje("Los datos aún se están cargando", 'error')
            return
        }

        try {
            setLoading(true)
            mostrarMensaje("Generando PDF...", 'info')
            
            const datosCompletos = obtenerDatosCompletosFactura(factura)
            console.log('Datos completos obtenidos:', datosCompletos)
            
            if (!datosCompletos) {
                throw new Error('No se pudieron obtener los datos completos de la factura')
            }
            
            // Generar PDF incluso sin detalles completos
            if (!datosCompletos.cliente) {
                console.warn('Cliente no encontrado, usando datos básicos')
                datosCompletos.cliente = {
                    Nombre: 'Cliente',
                    Apellido: `#${factura.ID_Cliente}`,
                    NumCelular: '',
                    Email: '',
                    Direccion: ''
                }
            }

            if (!datosCompletos.pedido) {
                console.warn('Pedido no encontrado, usando datos básicos')
                datosCompletos.pedido = {
                    ID_Pedido: factura.ID_Pedido,
                    Fecha_Pedido: new Date(factura.Fecha).toLocaleDateString('es-ES'),
                    Fecha_Entrega: '',
                    Observaciones: ''
                }
            }

            if (!datosCompletos.detalles?.length) {
                console.warn('Detalles no encontrados, usando datos básicos')
                datosCompletos.detalles = [{
                    Nombre_Producto: 'Producto/Servicio',
                    Cantidad: 1,
                    Precio_Unitario: datosCompletos.total,
                    Subtotal: datosCompletos.total
                }]
            }

            // Llamar al generador de PDF
            const resultado = generateFacturaPDF(datosCompletos)
            
            console.log('Resultado PDF:', resultado)
            
            if (resultado?.success) {
                mostrarMensaje(`PDF generado y descargado exitosamente`)
                
                // Si el generador devuelve un blob o URL, forzar descarga
                if (resultado.blob) {
                    const url = URL.createObjectURL(resultado.blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `factura_${factura.ID_Factura}.pdf`
                    document.body.appendChild(a)
                    a.click()
                    document.body.removeChild(a)
                    URL.revokeObjectURL(url)
                } else if (resultado.url) {
                    const a = document.createElement('a')
                    a.href = resultado.url
                    a.download = `factura_${factura.ID_Factura}.pdf`
                    a.click()
                }
            } else {
                mostrarMensaje(`Error al generar PDF: ${resultado?.message || 'Error desconocido'}`, 'error')
            }
            
        } catch (error) {
            console.error("Error al generar PDF:", error)
            mostrarMensaje(`Error al generar PDF: ${error.message}`, 'error')
        } finally {
            setLoading(false)
        }
    }

    // Función simplificada para enviar por WhatsApp
    const enviarPorWhatsApp = async (factura) => {
        if (!validarDatosDisponibles()) {
            mostrarMensaje("Los datos aún se están cargando", 'error')
            return
        }

        try {
            const datosCompletos = obtenerDatosCompletosFactura(factura)
            
            if (!datosCompletos?.cliente) {
                mostrarMensaje("No se encontraron datos del cliente", 'error')
                return
            }

            const { cliente, pedido, detalles, total } = datosCompletos
            const numeroCliente = cliente.NumCelular?.toString()
            
            if (!numeroCliente) {
                mostrarMensaje("Cliente no tiene número de teléfono registrado", 'error')
                return
            }
            
            const productos = detalles.length > 0 
                ? detalles.map(detalle => 
                    `• ${detalle.Nombre_Producto} x${detalle.Cantidad} - $${(detalle.Subtotal || 0).toFixed(2)}`
                  ).join('\n')
                : '• Producto/Servicio'
            
            const fechaEntrega = pedido?.Fecha_Entrega || 'Por definir'
            
            const mensajeCliente = `🎉 ¡Hola ${cliente.Nombre}!

✅ Tu factura #${factura.ID_Factura} del pedido #${factura.ID_Pedido} está lista.

📋 DETALLES:
${productos}

💰 Total: $${total.toFixed(2)}
📅 Fecha de entrega: ${fechaEntrega}
${pedido?.Observaciones ? `📝 Observaciones: ${pedido.Observaciones}` : ''}

¡Gracias por tu preferencia! 😊`
            
            const numeroClienteEnvio = `51${numeroCliente}`
            const mensajeCodificado = encodeURIComponent(mensajeCliente)
            const urlWhatsAppCliente = `https://wa.me/${numeroClienteEnvio}?text=${mensajeCodificado}`
            
            window.open(urlWhatsAppCliente, '_blank')
            mostrarMensaje(`Mensaje enviado al cliente: ${cliente.Nombre} ${cliente.Apellido}`)
            
        } catch (error) {
            mostrarMensaje("Error al enviar mensaje al cliente", 'error')
            console.error("Error:", error)
        }
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

    // Render functions
    const renderFacturaCard = (factura) => (
        <div key={factura.ID_Factura} className={styles.facturaCard}>
            <div className={styles.facturaInfo}>
                <div className={styles.facturaHeader}>
                    <h3>Factura #{factura.ID_Factura}</h3>
                    <span className={styles.monto}>${factura.Monto_Total}</span>
                </div>
                <p>ID Pedido: {factura.ID_Pedido}</p>
                <p>Cliente: {obtenerNombreCliente(factura.ID_Cliente)}</p>
                <p>Fecha: {new Date(factura.Fecha).toLocaleDateString('es-ES')}</p>
                {obtenerTelefonoCliente(factura.ID_Cliente) && (
                    <p className={styles.telefono}>
                        <Phone size={16} />
                        {obtenerTelefonoCliente(factura.ID_Cliente)}
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
                    <Eye size={16} />
                    Ver
                </button>
                
                <button 
                    onClick={() => generarYDescargarPDF(factura)}
                    className={`${styles.button} ${styles.pdfButton}`}
                    disabled={loading || !dataLoaded}
                    title="Descargar PDF"
                >
                    <Download size={16} />
                    PDF
                </button>
                
                <button 
                    onClick={() => enviarPorWhatsApp(factura)}
                    className={`${styles.button} ${styles.whatsappButton}`}
                    disabled={loading || !dataLoaded}
                    title="Enviar por WhatsApp"
                >
                    <Send size={16} />
                    WhatsApp
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

    const renderViewModal = () => {
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
                            {viewingFactura.cliente ? (
                                <div>
                                    <p><strong>{viewingFactura.cliente.Nombre} {viewingFactura.cliente.Apellido}</strong></p>
                                    <p><Phone size={14} /> {viewingFactura.cliente.NumCelular}</p>
                                    {viewingFactura.cliente.Email && <p>📧 {viewingFactura.cliente.Email}</p>}
                                    {viewingFactura.cliente.Direccion && <p>📍 {viewingFactura.cliente.Direccion}</p>}
                                </div>
                            ) : (
                                <p>Cliente no encontrado</p>
                            )}
                        </div>

                        {/* Pedido */}
                        <div className={styles.seccion}>
                            <h4>Pedido #{viewingFactura.pedido?.ID_Pedido}</h4>
                            {viewingFactura.pedido ? (
                                <div>
                                    <p>Fecha del pedido: {viewingFactura.pedido.Fecha_Pedido}</p>
                                    {viewingFactura.pedido.Fecha_Entrega && (
                                        <p>Fecha de entrega: {viewingFactura.pedido.Fecha_Entrega}</p>
                                    )}
                                    {viewingFactura.pedido.Observaciones && (
                                        <p>Observaciones: {viewingFactura.pedido.Observaciones}</p>
                                    )}
                                </div>
                            ) : (
                                <p>Información del pedido no encontrada</p>
                            )}
                        </div>

                        {/* Productos */}
                        <div className={styles.seccion}>
                            <h4>Productos</h4>
                            {viewingFactura.detalles.length > 0 ? (
                                <div className={styles.productosLista}>
                                    {viewingFactura.detalles.map((detalle, index) => (
                                        <div key={index} className={styles.productoDetalle}>
                                            <span className={styles.nombreProducto}>{detalle.Nombre_Producto}</span>
                                            <span>Cantidad: {detalle.Cantidad}</span>
                                            <span>Precio: ${detalle.Precio_Unitario}</span>
                                            <span>Subtotal: ${detalle.Subtotal}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>No se encontraron productos</p>
                            )}
                        </div>

                        <div className={styles.totalFactura}>
                            <strong>Total: ${viewingFactura.total.toFixed(2)}</strong>
                        </div>

                        {/* Acciones del modal */}
                        <div className={styles.accionesModal}>
                            <button 
                                onClick={() => generarYDescargarPDF(viewingFactura.factura)}
                                className={`${styles.button} ${styles.pdfButton}`}
                                disabled={loading}
                            >
                                <Download size={16} />
                                Descargar PDF
                            </button>
                            
                            <button 
                                onClick={() => enviarPorWhatsApp(viewingFactura.factura)}
                                className={`${styles.button} ${styles.whatsappButton}`}
                                disabled={loading}
                            >
                                <Send size={16} />
                                Enviar WhatsApp
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const renderEditModal = () => {
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
                        <input 
                            className={styles.input}
                            type="text"
                            name="ID_Pedido"
                            value={editingFactura.formData.ID_Pedido}
                            onChange={handleEditInputChange}
                            placeholder="ID del Pedido"
                        />
                        <input 
                            className={styles.input}
                            type="text"
                            name="ID_Cliente"
                            value={editingFactura.formData.ID_Cliente}
                            onChange={handleEditInputChange}
                            placeholder="ID del Cliente"
                        />
                        <input 
                            className={styles.input}
                            type="date"
                            name="Fecha"
                            value={editingFactura.formData.Fecha}
                            onChange={handleEditInputChange}
                        />
                        <input 
                            className={styles.input}
                            type="number"
                            step="0.01"
                            name="Monto_Total"
                            value={editingFactura.formData.Monto_Total}
                            onChange={handleEditInputChange}
                            placeholder="Monto Total"
                        />
                        
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
            {loading && (
                <div className={styles.loadingOverlay}>
                    <div className={styles.spinner}></div>
                    <p>Procesando...</p>
                </div>
            )}

            {/* Formulario */}
            <div className={styles.formContainer}>
                <h1 className={styles.formTitle}>Agregar facturas</h1>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="ID del Pedido"
                        required
                        name="ID_Pedido"
                        value={facturaData.ID_Pedido}
                        onChange={handleInputChange}
                    />
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="ID del Cliente"
                        required
                        name="ID_Cliente"
                        value={facturaData.ID_Cliente}
                        onChange={handleInputChange}
                    />
                    <input
                        className={styles.input}
                        type="date"
                        required
                        name="Fecha"
                        value={facturaData.Fecha}
                        onChange={handleInputChange}
                    />
                    <input
                        className={styles.input}
                        type="number"
                        step="0.01"
                        placeholder="Monto Total"
                        required
                        name="Monto_Total"
                        value={facturaData.Monto_Total}
                        onChange={handleInputChange}
                    />
                    <button type="submit" className={styles.button} disabled={loading}>
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
                        {facturas?.map(renderFacturaCard)}
                    </div>
                )}
            </div>

            {/* Modales */}
            {renderViewModal()}
            {renderEditModal()}
        </div>
    )
}

export default Factura