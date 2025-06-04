import { useEffect, useState } from 'react'
import useFacturaStore from '../../store/FacturaStore'
import styles from './Factura.module.css'

const Factura = () => {
    const {addFactura, fetchFactura, facturas, deleteFactura, updateFactura} = useFacturaStore() 
    const [editingFactura, setEditingFactura] = useState(null)
    const [facturaData, setFacturaData] = useState({
        ID_Pedido: "",
        ID_Cliente: "",
        Fecha: "",
        Monto_Total: ""
    })
    const [formData, setFormData] = useState({
        ID_Pedido: "",
        ID_Cliente: "",
        Fecha: "",
        Monto_Total: ""
    })

    useEffect(() => {
        fetchFactura()
    }, [])

    const handleInputChange = (e) => {
       const {name, value} = e.target 
       setFacturaData({
        ...facturaData,
        [name]: value
       })
    }

    const handelSubmit = async(e) => {
        e.preventDefault()
        addFactura(facturaData)
        setFacturaData({
            ID_Pedido: "",
            ID_Cliente: "",
            Fecha: "",
            Monto_Total: ""
        })
        alert("Se agregó nueva factura")
    }

    const handleDelete = (ID_Factura) => {
        if(window.confirm("¿Estás seguro de eliminar esta factura?")){
            deleteFactura(ID_Factura)
            fetchFactura()
        }
    }

    const handleEditClick = (factura) => {
        setEditingFactura(factura)
        setFormData({
            ID_Pedido: factura.ID_Pedido, 
            ID_Cliente: factura.ID_Cliente, 
            Fecha: factura.Fecha,
            Monto_Total: factura.Monto_Total
        })
    }

    const handleInputChangeUpdate = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleUpdate = async() => {
        updateFactura(editingFactura.ID_Factura, formData)
        fetchFactura()
        setEditingFactura(null)
    }

    const handleCancelEdit = () => {
        setEditingFactura(null)
    }

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <h1 className={styles.formTitle}>Agregar facturas</h1>
                <form onSubmit={handelSubmit} className={styles.form}>
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
                        type="text"
                        placeholder="Fecha"
                        required
                        name="Fecha"
                        value={facturaData.Fecha}
                        onChange={handleInputChange}
                    />
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="Monto Total"
                        required
                        name="Monto_Total"
                        value={facturaData.Monto_Total}
                        onChange={handleInputChange}
                    />
                    <button type="submit" className={styles.button}>Guardar Datos</button>
                </form>
            </div>
            
            <div className={styles.listContainer}>
                <h1 className={styles.listTitle}>Lista de facturas</h1>
                <div>
                    {facturas.map((factura) => (
                        <div key={factura.ID_Factura} className={styles.facturaCard}>
                            <p className={styles.facturaInfo}>ID Pedido: {factura.ID_Pedido}</p>
                            <p className={styles.facturaInfo}>ID Cliente: {factura.ID_Cliente}</p>
                            <p className={styles.facturaInfo}>Fecha: {factura.Fecha}</p>
                            <p className={styles.facturaInfo}>Monto Total: {factura.Monto_Total}</p>
                            <div className={styles.actions}>
                                <button 
                                    onClick={() => handleDelete(factura.ID_Factura)}
                                    className={`${styles.button} ${styles.deleteButton}`}
                                >
                                    Eliminar
                                </button>
                                <button 
                                    onClick={() => handleEditClick(factura)}
                                    className={`${styles.button} ${styles.editButton}`}
                                >
                                    Editar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                
                {editingFactura && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalWindow}>
                            <span className={styles.modalClose} onClick={handleCancelEdit}>&times;</span>
                            <h3 className={styles.modalTitle}>Editar factura</h3>
                            <div className={styles.modalForm}>
                                <input 
                                    className={styles.input}
                                    type="text"
                                    name="ID_Pedido"
                                    value={formData.ID_Pedido}
                                    onChange={handleInputChangeUpdate}
                                    placeholder="ID del Pedido"
                                />
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
                                    type="text"
                                    name="Fecha"
                                    value={formData.Fecha}
                                    onChange={handleInputChangeUpdate}
                                    placeholder="Fecha"
                                />
                                <input 
                                    className={styles.input}
                                    type="text"
                                    name="Monto_Total"
                                    value={formData.Monto_Total}
                                    onChange={handleInputChangeUpdate}
                                    placeholder="Monto Total"
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

export default Factura