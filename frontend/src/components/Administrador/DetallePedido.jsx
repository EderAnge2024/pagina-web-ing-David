import { useEffect, useState } from 'react'
import useDetallePedidoStore from '../../store/DetallePedidoStore'
import styles from './DetallePedido.module.css'

const DetallePedidoFrom = () => {
    const {
        addDetallePedido,
        fetchDetallePedido,
        detallePedidos,
        deleteDetallePedido,
        updateDetallePedido
    } = useDetallePedidoStore() 
    
    const [editingDetallePedido, setEditingDetallePedido] = useState(null)
    const [detallePedidoData, setDetallePedidoData] = useState({
        ID_Pedido: "",
        ID_Producto: "",
        Cantidad: "",
        Precio_Unitario: "",
        Descuento: "",
        Subtotal: ""
    })
    const [formData, setFormData] = useState({
        ID_Pedido: "",
        ID_Producto: "",
        Cantidad: "",
        Precio_Unitario: "",
        Descuento: "",
        Subtotal: ""
    })

    useEffect(() => {
        fetchDetallePedido()
    }, [])

    const handleInputChange = (e) => {
       const {name, value} = e.target 
       setDetallePedidoData({
        ...detallePedidoData,
        [name]: value
       })
    }

    const handelSubmit = async(e) => {
        e.preventDefault()
        addDetallePedido(detallePedidoData)
        setDetallePedidoData({
            ID_Pedido: "",
            ID_Producto: "",
            Cantidad: "",
            Precio_Unitario: "",
            Descuento: "",
            Subtotal: ""
        })
        alert("Se agregaron los detalles del pedido")
    }

    const handleDelete = (ID_Detalle) => {
        if(window.confirm("¿Estás seguro de eliminar este detalle?")) {
            deleteDetallePedido(ID_Detalle)
            fetchDetallePedido()
        }
    }

    const handleEditClick = (detallePedido) => {
        setEditingDetallePedido(detallePedido)
        setFormData({
            ID_Pedido: detallePedido.ID_Pedido, 
            ID_Producto: detallePedido.ID_Producto, 
            Cantidad: detallePedido.Cantidad,
            Precio_Unitario: detallePedido.Precio_Unitario,
            Descuento: detallePedido.Descuento,
            Subtotal: detallePedido.Subtotal
        })
    }

    const handleInputChangeUpdate = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleUpdate = async() => {
        updateDetallePedido(editingDetallePedido.ID_Detalle, formData)
        fetchDetallePedido()
        setEditingDetallePedido(null)
    }

    const handleCancelEdit = () => {
        setEditingDetallePedido(null)
    }

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <h1 className={styles.formTitle}>Agregar Detalles de Pedido</h1>
                <form onSubmit={handelSubmit} className={styles.form}>
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="ID Pedido"
                        required
                        name="ID_Pedido"
                        value={detallePedidoData.ID_Pedido}
                        onChange={handleInputChange}
                    />
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="ID Producto"
                        required
                        name="ID_Producto"
                        value={detallePedidoData.ID_Producto}
                        onChange={handleInputChange}
                    />
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="Cantidad"
                        required
                        name="Cantidad"
                        value={detallePedidoData.Cantidad}
                        onChange={handleInputChange}
                    />
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="Precio Unitario"
                        required
                        name="Precio_Unitario"
                        value={detallePedidoData.Precio_Unitario}
                        onChange={handleInputChange}
                    />
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="Descuento"
                        required
                        name="Descuento"
                        value={detallePedidoData.Descuento}
                        onChange={handleInputChange}
                    />
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="Subtotal"
                        required
                        name="Subtotal"
                        value={detallePedidoData.Subtotal}
                        onChange={handleInputChange}
                    />
                    <button type="submit" className={styles.button}>Guardar Detalles</button>
                </form>
            </div>
            
            <div className={styles.listContainer}>
                <h1 className={styles.listTitle}>Lista de Detalles de Pedido</h1>
                <div>
                    {detallePedidos.map((detalle) => (
                        <div key={detalle.ID_Detalle} className={styles.detalleCard}>
                            <div className={styles.detalleInfo}>
                                <p>ID Pedido: {detalle.ID_Pedido}</p>
                                <p>ID Producto: {detalle.ID_Producto}</p>
                                <p>Cantidad: {detalle.Cantidad}</p>
                                <p className={styles.monetaryValue}>Precio Unitario: ${detalle.Precio_Unitario}</p>
                                <p className={styles.monetaryValue}>Descuento: ${detalle.Descuento}</p>
                                <p className={styles.monetaryValue}>Subtotal: ${detalle.Subtotal}</p>
                            </div>
                            <div className={styles.actions}>
                                <button 
                                    onClick={() => handleDelete(detalle.ID_Detalle)}
                                    className={`${styles.button} ${styles.deleteButton}`}
                                >
                                    Eliminar
                                </button>
                                <button 
                                    onClick={() => handleEditClick(detalle)}
                                    className={`${styles.button} ${styles.editButton}`}
                                >
                                    Editar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                
                {editingDetallePedido && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalWindow}>
                            <span className={styles.modalClose} onClick={handleCancelEdit}>&times;</span>
                            <h3 className={styles.modalTitle}>Editar Detalle de Pedido</h3>
                            <div className={styles.modalForm}>
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
                                    name="ID_Producto"
                                    value={formData.ID_Producto}
                                    onChange={handleInputChangeUpdate}
                                    placeholder="ID Producto"
                                />
                                <input 
                                    className={styles.input}
                                    type="text"
                                    name="Cantidad"
                                    value={formData.Cantidad}
                                    onChange={handleInputChangeUpdate}
                                    placeholder="Cantidad"
                                />
                                <input 
                                    className={styles.input}
                                    type="text"
                                    name="Precio_Unitario"
                                    value={formData.Precio_Unitario}
                                    onChange={handleInputChangeUpdate}
                                    placeholder="Precio Unitario"
                                />
                                <input 
                                    className={styles.input}
                                    type="text"
                                    name="Descuento"
                                    value={formData.Descuento}
                                    onChange={handleInputChangeUpdate}
                                    placeholder="Descuento"
                                />
                                <input 
                                    className={styles.input}
                                    type="text"
                                    name="Subtotal"
                                    value={formData.Subtotal}
                                    onChange={handleInputChangeUpdate}
                                    placeholder="Subtotal"
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

export default DetallePedidoFrom