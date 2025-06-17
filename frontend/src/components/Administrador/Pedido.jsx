import { useEffect, useState } from 'react'
import usePedidoStore from '../../store/PedidoStore'
import styles from './Pedido.module.css'

const Pedido = () => {
    const {addPedido, fetchPedido, pedidos, deletePedido, updatePedido} = usePedidoStore() 
    const [editingPedido, setEditingPedido] = useState(null)
    const [pedidoData, setPedidoData] = useState({ID_Cliente:"", Fecha_Pedido:"", Fecha_Entrega:""})
    const [formData, setFormData] = useState({ID_Cliente:"", Fecha_Pedido:"", Fecha_Entrega:""})

    useEffect(()=>{
        fetchPedido()
        // Removido fetchCliente() ya que no está definido
    },[])

    const handleInputChange = (e)=>{
       const {name, value} = e.target 
       setPedidoData({
        ...pedidoData,
        [name]:value
       })
    }

    const handleSubmit = async(e)=>{
        e.preventDefault()
        try {
            await addPedido(pedidoData)
            setPedidoData({ID_Cliente:"", Fecha_Pedido:"", Fecha_Entrega:""})
            alert("Se agregó el pedido")
        } catch (error) {
            console.error("Error al agregar pedido:", error)
            alert("Error al agregar el pedido")
        }
    }

    const handleDelete = async (ID_Pedido)=>{
        if(window.confirm("¿Estás seguro de eliminar este pedido?")){
            try {
                await deletePedido(ID_Pedido)
                // Removido fetchPedido() duplicado, el store debería actualizarse automáticamente
            } catch (error) {
                console.error("Error al eliminar pedido:", error)
                alert("Error al eliminar el pedido")
            }
        }
    }

    const handleEditClick = (pedido) => {
        setEditingPedido(pedido)
        setFormData({
            ID_Cliente: pedido.ID_Cliente, 
            Fecha_Pedido: pedido.Fecha_Pedido, 
            Fecha_Entrega: pedido.Fecha_Entrega
        })
    }

    const handleInputChangeUpdate = (e)=>{
        setFormData({
            ...formData, // Corregido: era fromData
            [e.target.name]: e.target.value
        })
    }

    const handleUpdate = async()=>{
        try {
            await updatePedido(editingPedido.ID_Pedido, formData)
            // Removido fetchPedido() duplicado, el store debería actualizarse automáticamente
            setEditingPedido(null)
            alert("Pedido actualizado correctamente")
        } catch (error) {
            console.error("Error al actualizar pedido:", error)
            alert("Error al actualizar el pedido")
        }
    }

    const handleCancelEdit = () => {
        setEditingPedido(null)
        setFormData({ID_Cliente:"", Fecha_Pedido:"", Fecha_Entrega:""})
    }

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <h1 className={styles.formTitle}>Agregar pedidos</h1>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="ID del Cliente"
                        required
                        name="ID_Cliente"
                        value={pedidoData.ID_Cliente}
                        onChange={handleInputChange}
                    />
                    <input
                        className={styles.input}
                        type="date"
                        placeholder="Fecha del Pedido"
                        required
                        name="Fecha_Pedido"
                        value={pedidoData.Fecha_Pedido}
                        onChange={handleInputChange}
                    />
                    <input
                        className={styles.input}
                        type="date"
                        placeholder="Fecha de Entrega"
                        required
                        name="Fecha_Entrega"
                        value={pedidoData.Fecha_Entrega}
                        onChange={handleInputChange}
                    />
                    <button type="submit" className={styles.button}>Guardar Datos</button>
                </form>
            </div>
            
            <div className={styles.listContainer}>
                <h1 className={styles.listTitle}>Lista de pedidos</h1>
                <div>
                    {pedidos && pedidos.length > 0 ? (
                        pedidos.map((pedido) => (
                            <div key={pedido.ID_Pedido} className={styles.pedidoCard}>
                                <p className={styles.pedidoInfo}>ID: {pedido.ID_Pedido}</p>
                                <p className={styles.pedidoInfo}>ID Cliente: {pedido.ID_Cliente}</p>
                                <p className={styles.pedidoInfo}>Fecha Pedido: {pedido.Fecha_Pedido}</p>
                                <p className={styles.pedidoInfo}>Fecha Entrega: {pedido.Fecha_Entrega}</p>
                                <div>
                                    <button 
                                        onClick={() => handleDelete(pedido.ID_Pedido)}
                                        className={`${styles.button} ${styles.deleteButton}`}
                                    >
                                        Eliminar
                                    </button>
                                    <button 
                                        onClick={() => handleEditClick(pedido)}
                                        className={`${styles.button} ${styles.editButton}`}
                                    >
                                        Editar
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No hay pedidos disponibles</p>
                    )}
                </div>
                
                {editingPedido && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalWindow}>
                            <span className={styles.modalClose} onClick={handleCancelEdit}>&times;</span>
                            <h3 className={styles.modalTitle}>Editar pedido</h3>
                            <input 
                                className={styles.input}
                                type="text"
                                name="ID_Cliente"
                                value={formData.ID_Cliente}
                                onChange={handleInputChangeUpdate}
                                placeholder="ID del Cliente"
                            />
                            <input 
                                className={styles.input}
                                type="date"
                                name="Fecha_Pedido"
                                value={formData.Fecha_Pedido}
                                onChange={handleInputChangeUpdate}
                                placeholder="Fecha del Pedido"
                            />
                            <input 
                                className={styles.input}
                                type="date"
                                name="Fecha_Entrega"
                                value={formData.Fecha_Entrega}
                                onChange={handleInputChangeUpdate}
                                placeholder="Fecha de Entrega"
                            />
                            <div className={styles.botones}>
                                <button onClick={handleUpdate} className={styles.button}>Guardar</button>
                                <button onClick={handleCancelEdit} className={styles.button}>Cancelar</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Pedido