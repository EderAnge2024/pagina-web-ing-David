import { useEffect, useState } from 'react'
import useInformacionStore from '../../../store/InformacionStore'
import styles from './Informacion.module.css'

const Informacion = () => {
    const {addInformacion, fetchInformacion, informacions, deleteInformacion, updateInformacion} = useInformacionStore() 
    const [editingInformacion, setEditingInformacion] = useState(null)
    const [informacionData, setInformacionData] = useState({Tipo_Informacion:"", Dato:""})
    const [formData, setFormData] = useState({Tipo_Informacion:"", Dato:""})
    const [creating, setCreating] = useState(false); 
    const [updating, setUpdating] = useState(false)

    useEffect(()=>{
        fetchInformacion()
    },[])

    const handleInputChange = (e)=>{
       const {name, value} = e.target 
       setInformacionData({
        ...informacionData,
        [name]:value
       })
    }

    const handleSubmit = async(e)=>{
        setCreating(true)
        setUpdating(true)
        e.preventDefault()
        try {
            await addInformacion(informacionData)
            setInformacionData({Tipo_Informacion:"", Dato:""})
            alert("Se agregó la información")
        } catch (error) {
            console.error("Error al agregar información:", error)
            alert("Error al agregar la información")
        } finally{
            setCreating(false)
            setUpdating(false)
        }
    }

    const handleDelete = async (ID_Informacion)=>{
        if(window.confirm("¿Estás seguro de eliminar esta información?")){
            try {
                await deleteInformacion(ID_Informacion)
            } catch (error) {
                console.error("Error al eliminar información:", error)
                alert("Error al eliminar la información")
            }
        }
    }

    const handleEditClick = (informacion) => {
        setEditingInformacion(informacion)
        setFormData({
            Tipo_Informacion: informacion.Tipo_Informacion, 
            Dato: informacion.Dato
        })
    }

    const handleInputChangeUpdate = (e)=>{
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleUpdate = async()=>{
        setUpdating(true)
        try {
            await updateInformacion(editingInformacion.ID_Informacion, formData)
            setEditingInformacion(null)
            alert("Información actualizada correctamente")
        } catch (error) {
            console.error("Error al actualizar información:", error)
            alert("Error al actualizar la información")
        }
    }

    const handleCancelEdit = () => {
        setEditingInformacion(null)
        setFormData({Tipo_Informacion:"", Dato:""})
    }

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <h1 className={styles.formTitle}>Agregar información</h1>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <select
                            required
                            name="Tipo_Informacion"
                            value={informacionData.Tipo_Informacion}
                            onChange={handleInputChange}
                            className={styles.formInput}
                            disabled={creating}
                    >
                            <option value="">Seleccione tipo de Informacion</option>
                            <option value="Telefono">Telefono</option>
                            <option value="Direccion">Direccion</option>
                            <option value="Servicios">Servicios</option>
                            <option value="Correo">Correo electronico</option>

                    </select>
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="Dato"
                        required
                        name="Dato"
                        value={informacionData.Dato}
                        onChange={handleInputChange}
                    />
                    <button type="submit" className={styles.button}>Guardar Datos</button>
                </form>
            </div>
            
            <div className={styles.listContainer}>
                <h1 className={styles.listTitle}>Lista de información</h1>
                <div>
                    {informacions && informacions.length > 0 ? (
                        informacions.map((informacion) => (
                            <div key={informacion.ID_Informacion} className={styles.informacionCard}>
                                <p className={styles.informacionInfo}>ID: {informacion.ID_Informacion}</p>
                                <p className={styles.informacionInfo}>Tipo: {informacion.Tipo_Informacion}</p>
                                <p className={styles.informacionInfo}>Dato: {informacion.Dato}</p>
                                <div>
                                    <button 
                                        onClick={() => handleDelete(informacion.ID_Informacion)}
                                        className={`${styles.button} ${styles.deleteButton}`}
                                    >
                                        Eliminar
                                    </button>
                                    <button 
                                        onClick={() => handleEditClick(informacion)}
                                        className={`${styles.button} ${styles.editButton}`}
                                    >
                                        Editar
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No hay información disponible</p>
                    )}
                </div>
                
                {editingInformacion && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalWindow}>
                            <span className={styles.modalClose} onClick={handleCancelEdit}>&times;</span>
                            <h3 className={styles.modalTitle}>Editar información</h3>
                            <select
                                required
                                name="Tipo_Informacion"
                                value={formData.Tipo_Informacion}
                                onChange={handleInputChangeUpdate}
                                className={styles.formInput}
                                disabled={updating}
                            >
                                <option value="">Seleccione tipo de Informacion</option>
                                <option value="Telefono">Telefono</option>
                                <option value="Direccion">Direccion</option>
                                <option value="Servicios">Servicios</option>
                                <option value="Correo">Correo electronico</option>
                            </select>
                            <input 
                                className={styles.input}
                                type="text"
                                name="Dato"
                                value={formData.Dato}
                                onChange={handleInputChangeUpdate}
                                placeholder="Dato"
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

export default Informacion