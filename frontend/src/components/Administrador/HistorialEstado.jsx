import { useEffect, useState } from 'react'
import useHistorialEstadoStore from '../../store/HistorialEstadoStore'
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

    useEffect(() => {
        fetchHistorialEstado()
    }, [])

    const handleInputChange = (e) => {
       const {name, value} = e.target 
       setHistorialEstadoData({
        ...historialEstadoData,
        [name]: value
       })
    }

    const handelSubmit = async(e) => {
        e.preventDefault()
        addHistorialEstado(historialEstadoData)
        setHistorialEstadoData({
            ID_EstadoPedido: "",
            ID_Pedido: "",
            Fecha: ""
        })
        alert("Se agregó un nuevo historial de pedidos")
    }

    const handleDelete = (ID_Historial) => {
        if(window.confirm("¿Estás seguro de eliminar este historial?")) {
            deleteHistorialEstado(ID_Historial)
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
        updateHistorialEstado(editingHistorialEstado.ID_Historial, formData)
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
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="ID Estado Pedido"
                        required
                        name="ID_EstadoPedido"
                        value={historialEstadoData.ID_EstadoPedido}
                        onChange={handleInputChange}
                    />
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
                        type="text"
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
                    {historialEstados.map((historial) => (
                        <div key={historial.ID_Historial} className={styles.historialCard}>
                            <p className={styles.historialInfo}>
                                <span className={`${styles.statusIndicator} ${styles['status-active']}`}></span>
                                ID Estado Pedido: {historial.ID_EstadoPedido}
                            </p>
                            <p className={styles.historialInfo}>ID Pedido: {historial.ID_Pedido}</p>
                            <p className={styles.historialInfo}>Fecha: {historial.Fecha}</p>
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
                    ))}
                </div>
                
                {editingHistorialEstado && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalWindow}>
                            <span className={styles.modalClose} onClick={handleCancelEdit}>&times;</span>
                            <h3 className={styles.modalTitle}>Editar Historial</h3>
                            <div className={styles.modalForm}>
                                <input 
                                    className={styles.input}
                                    type="text"
                                    name="ID_EstadoPedido"
                                    value={formData.ID_EstadoPedido}
                                    onChange={handleInputChangeUpdate}
                                    placeholder="ID Estado Pedido"
                                />
                                <input 
                                    className={styles.input}
                                    type="text"
                                    name="ID_Pedido"
                                    value={formData.ID_Pedido}
                                    onChange={handleInputChangeUpdate}
                                    placeholder="ID Pedido"
                                />
                                <input 
                                    className={styles.input}
                                    type="text"
                                    name="Fecha"
                                    value={formData.Fecha}
                                    onChange={handleInputChangeUpdate}
                                    placeholder="Fecha"
                                />
                                <div className={styles.botones}>
                                    <button onClick={handleUpdate} className={styles.button}>Guardar</button>
                                    <button onClick={handleCancelEdit} className={styles.button}>Cancelar</button>
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