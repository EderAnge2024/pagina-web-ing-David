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
    const { clientes, fetchCliente } = useClienteStore()
    
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

    // Cargar todos los datos necesarios al inicio
    useEffect(() => {
        fetchHistorialEstado()
        fetchEstadoPedido()
        fetchPedido()
        fetchCliente()
    }, [])

    // Función optimizada para obtener el nombre del cliente
    const getNombreCliente = (ID_Pedido) => {
        if (!ID_Pedido) return "No asignado"
        
        const pedido = pedidos.find(p => p.ID_Pedido === ID_Pedido)
        if (!pedido) return "Pedido no encontrado"
        
        const cliente = clientes.find(c => c.ID_Cliente === pedido.ID_Cliente)
        return cliente ?`${cliente.Nombre} ${cliente.Apellido}`: "Cliente desconocido"
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target 
        setHistorialEstadoData({
            ...historialEstadoData,
            [name]: value
        })
    }

    const handelSubmit = async(e) => {
        e.preventDefault()
        await addHistorialEstado(historialEstadoData)
        setHistorialEstadoData({
            ID_EstadoPedido: "",
            ID_Pedido: "",
            Fecha: ""
        })
        alert("Se agregó un nuevo historial de pedidos")
        fetchHistorialEstado()
    }

    const handleDelete = async(ID_Historial) => {
        if(window.confirm("¿Estás seguro de eliminar este historial?")) {
            await deleteHistorialEstado(ID_Historial)
            fetchHistorialEstado()
        }
    }

    const handleEditClick = (historial) => {
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
        await updateHistorialEstado(editingHistorialEstado.ID_Historial, formData)
        fetchHistorialEstado()
        setEditingHistorialEstado(null)
    }

    const handleCancelEdit = () => {
        setEditingHistorialEstado(null)
    }

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <h1 className={styles.formTitle}>Agregar Historial de Estados</h1>
                <form onSubmit={handelSubmit} className={styles.form}>
                    <select
                        name="ID_EstadoPedido"
                        value={historialEstadoData.ID_EstadoPedido}
                        onChange={handleInputChange}
                        required
                        className={styles.selecthistorial}
                    >
                        <option value="">-- Seleccionar estado --</option>
                        {estadoPedidos.map((cat) => (
                            <option key={cat.ID_EstadoPedido} value={cat.ID_EstadoPedido}>
                                {cat.Estado}
                            </option>
                        ))}
                    </select>
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="ID Pedido"
                        required
                        name="ID_Pedido"
                        value={historialEstadoData.ID_Pedido}
                        onChange={handleInputChange}
                    />
                    <input
                        className={styles.input}
                        type="date"  // Cambiado a type="date" para mejor usabilidad
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
                    {historialEstados.map((historial) => {
                        const estado = estadoPedidos.find(e => e.ID_EstadoPedido === historial.ID_EstadoPedido)
                        return (
                            <div key={historial.ID_Historial} className={styles.historialCard}>
                                <p className={styles.historialInfo}>
                                    <span className={`${styles.statusIndicator} ${styles['status-active']}`}></span>
                                    Estado: {estado?.Estado || "Desconocido"}
                                </p>
                                <p className={styles.historialInfo}>Pedido: {historial.ID_Pedido}</p>
                                <p className={styles.historialInfo}>Cliente: {getNombreCliente(historial.ID_Pedido)}</p>
                                <p className={styles.historialInfo}>Fecha: {new Date(historial.Fecha).toLocaleDateString()}</p>
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
                                    {estadoPedidos.map((cat) => (
                                        <option key={cat.ID_EstadoPedido} value={cat.ID_EstadoPedido}>
                                            {cat.Estado}
                                        </option>
                                    ))}
                                </select>
                                
                                {/* Mostrar nombre del cliente (solo lectura) */}

                                <input 
                                  className={styles.input}
                                  type="text"
                                  name="ID_Pedido"
                                  value={getNombreCliente(formData.ID_Pedido)}  // Muestra el nombre del cliente
                                  readOnly              // Hace el input no editable
                                  placeholder={getNombreCliente}
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