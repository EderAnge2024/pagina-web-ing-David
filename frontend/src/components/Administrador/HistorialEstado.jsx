import { useEffect, useState, useMemo } from 'react'
import useHistorialEstadoStore from '../../store/HistorialEstadoStore'
import useEstadoPedidoStore from '../../store/EstadoPedidoStore'
import useClienteStore from '../../store/ClienteStore'
import usePedidoStore from '../../store/PedidoStore'
import styles from './HistorialEstado.module.css'

const HistorialEstado = () => {
    const {
        addHistorialEstado,
        fetchHistorialEstado,
        historialEstados,
        deleteHistorialEstado,
        updateHistorialEstado
    } = useHistorialEstadoStore() 
    
    const [editingHistorialEstado, setEditingHistorialEstado] = useState(null)
    const { estadoPedidos, fetchEstadoPedido } = useEstadoPedidoStore()
    const { pedidos, fetchPedido } = usePedidoStore()
    const { clientes, clienteActual, isAuthenticated, initializeFromStorage } = useClienteStore()
    
    const [historialEstadoData, setHistorialEstadoData] = useState({
        ID_EstadoPedido: "",
        ID_Pedido: "",
        Fecha: ""
    })
    
    const [formData, setFormData] = useState({
        ID_EstadoPedido: "",
        ID_Pedido: "",
        Fecha: ""
    })

    // Cargar datos necesarios al inicio
    useEffect(() => {
        const loadData = async () => {
            // Inicializar desde localStorage si hay datos guardados
            initializeFromStorage()
            
            // Cargar datos principales
            fetchHistorialEstado()
            fetchEstadoPedido()
            fetchPedido()
        }
        
        loadData()
    }, [])

    // Función optimizada para obtener el nombre del cliente
    const getNombreCliente = (ID_Pedido) => {
        if (!ID_Pedido) return "No asignado"
        
        const pedido = pedidos.find(p => p.ID_Pedido === ID_Pedido)
        if (!pedido) return "Pedido no encontrado"
        
        // Si hay un cliente actual autenticado, verificar si coincide
        if (clienteActual && clienteActual.ID_Cliente === pedido.ID_Cliente) {
            return `${clienteActual.Nombre} ${clienteActual.Apellido}`
        }
        
        // Si hay lista de clientes disponible (para casos administrativos)
        if (clientes && clientes.length > 0) {
            const cliente = clientes.find(c => c.ID_Cliente === pedido.ID_Cliente)
            return cliente ? `${cliente.Nombre} ${cliente.Apellido}` : "Cliente desconocido"
        }
        
        return "Cliente no disponible"
    }

    // Función para verificar si el usuario puede ver/editar este historial
    const canAccessHistorial = (historial) => {
        if (!isAuthenticated || !clienteActual) return false
        
        const pedido = pedidos.find(p => p.ID_Pedido === historial.ID_Pedido)
        return pedido && pedido.ID_Cliente === clienteActual.ID_Cliente
    }

    // Filtrar historiales según permisos del usuario
    const historialesFiltrados = useMemo(() => {
        if (!isAuthenticated || !clienteActual) {
            return historialEstados // Mostrar todos si no hay autenticación (modo admin)
        }
        
        // Filtrar solo los historiales de pedidos del cliente actual
        return historialEstados.filter(historial => {
            const pedido = pedidos.find(p => p.ID_Pedido === historial.ID_Pedido)
            return pedido && pedido.ID_Cliente === clienteActual.ID_Cliente
        })
    }, [historialEstados, pedidos, clienteActual, isAuthenticated])

    const handleInputChange = (e) => {
        const { name, value } = e.target 
        setHistorialEstadoData({
            ...historialEstadoData,
            [name]: value
        })
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        
        // Verificar autenticación si es necesario
        if (isAuthenticated && clienteActual) {
            // Verificar que el pedido pertenece al cliente actual
            const pedido = pedidos.find(p => p.ID_Pedido === historialEstadoData.ID_Pedido)
            if (pedido && pedido.ID_Cliente !== clienteActual.ID_Cliente) {
                alert("No tienes permisos para agregar historial a este pedido")
                return
            }
        }
        
        try {
            await addHistorialEstado(historialEstadoData)
            setHistorialEstadoData({
                ID_EstadoPedido: "",
                ID_Pedido: "",
                Fecha: ""
            })
            alert("Se agregó un nuevo historial de pedidos")
            fetchHistorialEstado()
        } catch (error) {
            console.error("Error al agregar historial:", error)
            alert("Error al agregar el historial")
        }
    }

    const handleDelete = async(ID_Historial) => {
        const historial = historialEstados.find(h => h.ID_Historial === ID_Historial)
        
        // Verificar permisos
        if (isAuthenticated && clienteActual && !canAccessHistorial(historial)) {
            alert("No tienes permisos para eliminar este historial")
            return
        }
        
        if(window.confirm("¿Estás seguro de eliminar este historial?")) {
            try {
                await deleteHistorialEstado(ID_Historial)
                fetchHistorialEstado()
            } catch (error) {
                console.error("Error al eliminar historial:", error)
                alert("Error al eliminar el historial")
            }
        }
    }

    const handleEditClick = (historial) => {
        // Verificar permisos
        if (isAuthenticated && clienteActual && !canAccessHistorial(historial)) {
            alert("No tienes permisos para editar este historial")
            return
        }
        
        setEditingHistorialEstado(historial)
        setFormData({
            ID_EstadoPedido: historial.ID_EstadoPedido, 
            ID_Pedido: historial.ID_Pedido, 
            Fecha: historial.Fecha
        })
    }

    const handleInputChangeUpdate = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleUpdate = async() => {
        try {
            await updateHistorialEstado(editingHistorialEstado.ID_Historial, formData)
            fetchHistorialEstado()
            setEditingHistorialEstado(null)
        } catch (error) {
            console.error("Error al actualizar historial:", error)
            alert("Error al actualizar el historial")
        }
    }

    const handleCancelEdit = () => {
        setEditingHistorialEstado(null)
    }

    // Filtrar pedidos disponibles según el usuario
    const pedidosDisponibles = useMemo(() => {
        if (!isAuthenticated || !clienteActual) {
            return pedidos // Mostrar todos si no hay autenticación (modo admin)
        }
        
        // Filtrar solo pedidos del cliente actual
        return pedidos.filter(pedido => pedido.ID_Cliente === clienteActual.ID_Cliente)
    }, [pedidos, clienteActual, isAuthenticated])

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <h1 className={styles.formTitle}>Agregar Historial de Estados</h1>
                {isAuthenticated && clienteActual && (
                    <p className={styles.userInfo}>
                        Conectado como: {clienteActual.Nombre} {clienteActual.Apellido}
                    </p>
                )}
                
                <form onSubmit={handleSubmit} className={styles.form}>
                    <select
                        name="ID_EstadoPedido"
                        value={historialEstadoData.ID_EstadoPedido}
                        onChange={handleInputChange}
                        required
                        className={styles.selecthistorial}
                    >
                        <option value="">-- Seleccionar estado --</option>
                        {estadoPedidos.map((estado) => (
                            <option key={estado.ID_EstadoPedido} value={estado.ID_EstadoPedido}>
                                {estado.Estado}
                            </option>
                        ))}
                    </select>

                    <select
                        name="ID_Pedido"
                        value={historialEstadoData.ID_Pedido}
                        onChange={handleInputChange}
                        required
                        className={styles.selecthistorial}
                    >
                        <option value="">-- Seleccionar pedido --</option>
                        {pedidosDisponibles.map((pedido) => (
                            <option key={pedido.ID_Pedido} value={pedido.ID_Pedido}>
                                Pedido #{pedido.ID_Pedido} - {getNombreCliente(pedido.ID_Pedido)}
                            </option>
                        ))}
                    </select>

                    <input
                        className={styles.input}
                        type="date"
                        placeholder="Fecha"
                        required
                        name="Fecha"
                        value={historialEstadoData.Fecha}
                        onChange={handleInputChange}
                    />
                    <button type="submit" className={styles.button}>Guardar Datos</button>
                </form>
            </div>
            
            <div className={styles.listContainer}>
                <h1 className={styles.listTitle}>Lista de Historiales</h1>
                <div>
                    {historialesFiltrados.map((historial) => {
                        const estado = estadoPedidos.find(e => e.ID_EstadoPedido === historial.ID_EstadoPedido)
                        const puedeAcceder = canAccessHistorial(historial)
                        
                        return (
                            <div key={historial.ID_Historial} className={styles.historialCard}>
                                <p className={styles.historialInfo}>
                                    <span className={`${styles.statusIndicator} ${styles['status-active']}`}></span>
                                    Estado: {estado?.Estado || "Desconocido"}
                                </p>
                                <p className={styles.historialInfo}>Pedido: #{historial.ID_Pedido}</p>
                                <p className={styles.historialInfo}>Cliente: {getNombreCliente(historial.ID_Pedido)}</p>
                                <p className={styles.historialInfo}>Fecha: {new Date(historial.Fecha).toLocaleDateString()}</p>
                                
                                {(!isAuthenticated || !clienteActual || puedeAcceder) && (
                                    <div className={styles.actions}>
                                        <button 
                                            onClick={() => handleDelete(historial.ID_Historial)}
                                            className={`${styles.button} ${styles.deleteButton}`}
                                        >
                                            Eliminar
                                        </button>
                                        <button 
                                            onClick={() => handleEditClick(historial)}
                                            className={`${styles.button} ${styles.editButton}`}
                                        >
                                            Editar
                                        </button>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
                
                {editingHistorialEstado && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalWindow}>
                            <span className={styles.modalClose} onClick={handleCancelEdit}>&times;</span>
                            <h3 className={styles.modalTitle}>Editar Historial</h3>
                            <div className={styles.modalForm}>
                                <select
                                    name="ID_EstadoPedido"
                                    value={formData.ID_EstadoPedido}
                                    onChange={handleInputChangeUpdate}
                                    required
                                    className={styles.selecthistorial}
                                >
                                    <option value="">-- Seleccionar estado --</option>
                                    {estadoPedidos.map((estado) => (
                                        <option key={estado.ID_EstadoPedido} value={estado.ID_EstadoPedido}>
                                            {estado.Estado}
                                        </option>
                                    ))}
                                </select>
                                
                                <input 
                                    className={styles.input}
                                    type="text"
                                    name="cliente_readonly"
                                    value={`Pedido #${formData.ID_Pedido} - ${getNombreCliente(formData.ID_Pedido)}`}
                                    readOnly
                                    placeholder="Información del pedido"
                                />
                                
                                <input 
                                    className={styles.input}
                                    type="date"
                                    name="Fecha"
                                    value={formData.Fecha}
                                    onChange={handleInputChangeUpdate}
                                    required
                                />
                                <div className={styles.botones}>
                                    <button 
                                        type="button" 
                                        onClick={handleUpdate} 
                                        className={styles.button}
                                    >
                                        Guardar
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={handleCancelEdit} 
                                        className={styles.button}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default HistorialEstado