import { useEffect, useState } from 'react'
import useImagenStore from '../../store/ImagenStore'
import styles from './imgFrom.module.css'

const ImagenFrom = () => {
    const { addImagen, fetchImagen, imagens, deleteImagen, updateImagen } = useImagenStore() 
    const [editingImagen, setEditingImagen] = useState(null)
    const [imagenData, setImagenData] = useState({ Tipo_Imagen: "", URL: "" })
    const [formData, setFormData] = useState({ Tipo_Imagen: "", URL: "" })

    useEffect(() => {
        fetchImagen()
    }, [])

    const handleInputChange = (e) => {
        const { name, value } = e.target  
        setImagenData({
            ...imagenData,
            [name]: value
        })
    }

    const handelSubmit = async (e) => {
        e.preventDefault()
        await addImagen(imagenData)
        setImagenData({ Tipo_Imagen: "", URL: "" })
        fetchImagen()
    }

    const handleDelete = (ID_Imagen) => {
        if(window.confirm("¿Estás seguro de eliminar esta imagen?")) {
            deleteImagen(ID_Imagen)
            fetchImagen()
        }
    }

    const handleEditClick = (imagen) => {
        setEditingImagen(imagen)
        setFormData({ Tipo_Imagen: imagen.Tipo_Imagen, URL: imagen.URL })
    }

    const handleInputChangeUpdate = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleUpdate = async () => {
        await updateImagen(editingImagen.ID_Imagen, formData)
        fetchImagen()
        setEditingImagen(null)
    }

    const handleCancelEdit = () => {
        setEditingImagen(null)
    }

    return (
        <div className={styles.container}>
            <div className={styles.formSection}>
                <h1 className={styles.sectionTitle}>Gestión de Imágenes</h1>
                <form onSubmit={handelSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label>Tipo de Imagen</label>
                        <input
                            type="text"
                            placeholder="Ej: Logo, Banner, etc."
                            required
                            name="Tipo_Imagen"
                            value={imagenData.Tipo_Imagen}
                            onChange={handleInputChange}
                            className={styles.formInput}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>URL de la Imagen</label>
                        <input
                            type="text"
                            placeholder="Ingrese la URL"
                            required
                            name="URL"
                            value={imagenData.URL}
                            onChange={handleInputChange}
                            className={styles.formInput}
                        />
                    </div>
                    <button type="submit" className={styles.primaryButton}>Guardar Imagen</button>
                </form>
            </div>

            <div className={styles.listSection}>
                <h2 className={styles.sectionTitle}>Imágenes Registradas</h2>
                <div className={styles.imageGrid}>
                    {imagens.map((imagen) => (
                        <div key={imagen.ID_Imagen} className={styles.imageCard}>
                            <div className={styles.imageInfo}>
                                <h3>{imagen.Tipo_Imagen}</h3>
                                <p className={styles.urlText}>{imagen.URL}</p>
                                {imagen.URL && (
                                    <div className={styles.imagePreview}>
                                        <img 
                                            src={imagen.URL} 
                                            alt={imagen.Tipo_Imagen} 
                                            onError={(e) => e.target.style.display = 'none'}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className={styles.actions}>
                                <button 
                                    onClick={() => handleEditClick(imagen)}
                                    className={styles.editButton}
                                >
                                    Editar
                                </button>
                                <button 
                                    onClick={() => handleDelete(imagen.ID_Imagen)}
                                    className={styles.deleteButton}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {editingImagen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <button 
                            onClick={handleCancelEdit}
                            className={styles.closeButton}
                        >
                            &times;
                        </button>
                        <h3>Editar Imagen</h3>
                        <div className={styles.formGroup}>
                            <label>Tipo de Imagen</label>
                            <input 
                                type="text"
                                name="Tipo_Imagen"
                                value={formData.Tipo_Imagen}
                                onChange={handleInputChangeUpdate}
                                placeholder="Tipo de imagen"
                                className={styles.formInput}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>URL</label>
                            <input 
                                type="text"
                                name="URL"
                                value={formData.URL}
                                onChange={handleInputChangeUpdate}
                                placeholder="URL o ruta"
                                className={styles.formInput}
                            />
                        </div>
                        <div className={styles.modalActions}>
                            <button 
                                onClick={handleUpdate}
                                className={styles.primaryButton}
                            >
                                Guardar Cambios
                            </button>
                            <button 
                                onClick={handleCancelEdit}
                                className={styles.secondaryButton}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ImagenFrom