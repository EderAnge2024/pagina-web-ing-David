import { useEffect, useState } from 'react'
import usePedidoStore from '../../store/PedidoStore'
import styles from './Pedido.module.css'

const Pedido = () => {
    const {addPedido, fetchPedido, pedidos, deletePedido, updatePedido} = usePedidoStore() 
    const [editingPedido, setEditingPedido] = useState(null)
    const [pedidoData, setPedidoData] = useState({ID_Cliente:"", Fecha_Pedido:"", Fecha_Entrega:""})
    const [fromData, setFormData] = useState({ID_Cliente:"", Fecha_Pedido:"", Fecha_Entrega:""})

    useEffect(()=>{
        fetchPedido()
    },[])

    const handleInputChange = (e)=>{
       const {name, value} = e.target 
       setPedidoData({
        ...pedidoData,
        [name]:value
       })
    }

    const handelSubmit = async(e)=>{
        e.preventDefault()
        addPedido(pedidoData)
        setPedidoData({ID_Cliente:"", Fecha_Pedido:"", Fecha_Entrega:""})
        alert("Se agregó el pedido")
    }

    const handleDelete = (ID_Pedido)=>{
        if(window.confirm("¿Estás seguro de eliminar este pedido?")){
            deletePedido(ID_Pedido)
            fetchPedido()
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
            ...fromData,
            [e.target.name]: e.target.value
        })
    }

    const handleUpdate = async()=>{
        updatePedido(editingPedido.ID_Pedido, fromData)
        fetchPedido()
        setEditingPedido(null)
    }

    const handleCancelEdit = () => {
        setEditingPedido(null)
    }

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <h1 className={styles.formTitle}>Agregar pedidos</h1>
                <form onSubmit={handelSubmit} className={styles.form}>
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
                        type="text"
                        placeholder="Fecha del Pedido"
                        required
                        name="Fecha_Pedido"
                        value={pedidoData.Fecha_Pedido}
                        onChange={handleInputChange}
                    />
                    <input
                        className={styles.input}
                        type="text"
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
                    {pedidos.map((user) => (
                        <div key={user.ID_Pedido} className={styles.pedidoCard}>
                            <p className={styles.pedidoInfo}>ID: {user.ID_Pedido}</p>
                            <p className={styles.pedidoInfo}>ID Cliente: {user.ID_Cliente}</p>
                            <p className={styles.pedidoInfo}>Fecha Pedido: {user.Fecha_Pedido}</p>
                            <p className={styles.pedidoInfo}>Fecha Entrega: {user.Fecha_Entrega}</p>
                            <div>
                                <button 
                                    onClick={() => handleDelete(user.ID_Pedido)}
                                    className={`${styles.button} ${styles.deleteButton}`}
                                >
                                    Eliminar
                                </button>
                                <button 
                                    onClick={() => handleEditClick(user)}
                                    className={`${styles.button} ${styles.editButton}`}
                                >
                                    Editar
                                </button>
                            </div>
                        </div>
                    ))}
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
                                value={fromData.ID_Cliente}
                                onChange={handleInputChangeUpdate}
                                placeholder="ID del Cliente"
                            />
                            <input 
                                className={styles.input}
                                type="text"
                                name="Fecha_Pedido"
                                value={fromData.Fecha_Pedido}
                                onChange={handleInputChangeUpdate}
                                placeholder="Fecha del Pedido"
                            />
                            <input 
                                className={styles.input}
                                type="text"
                                name="Fecha_Entrega"
                                value={fromData.Fecha_Entrega}
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