import { useEffect, useState } from 'react'
import useImagenStore from '../../store/ImagenStore'
import styles from './imgFrom.module.css'

const ImagenForm = () => {
    const { addImagen, fetchImagen, imagenes, deleteImagen, updateImagen } = useImagenStore() 
    const [editingImagen, setEditingImagen] = useState(null)
    const [imagenData, setImagenData] = useState({ Tipo_Imagen: "", URL: "" })
    const [formData, setFormData] = useState({ Tipo_Imagen: "", URL: "" })

    useEffect(() => {
        fetchImagen()
    }, [fetchImagen])

    const handleInputChange = (e) => {
        const { name, value } = e.target  
        setImagenData({
            ...imagenData,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await addImagen(imagenData)
            setImagenData({ Tipo_Imagen: "", URL: "" })
            fetchImagen()
        } catch (error) {
            console.error('Error al agregar imagen:', error)
        }
    }

    const handleDelete = async (ID_Imagen) => {
        if(window.confirm("¿Estás seguro de eliminar esta imagen?")) {
            try {
                await deleteImagen(ID_Imagen)
                fetchImagen()
            } catch (error) {
                console.error('Error al eliminar imagen:', error)
            }
        }
    }

    const handleEditClick = (imagen) => {
        setEditingImagen(imagen)
        setFormData({ Tipo_Imagen: imagen.Tipo_Imagen, URL: imagen.URL })
    }

    const handleInputChangeUpdate = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleUpdate = async () => {
        try {
            await updateImagen(editingImagen.ID_Imagen, formData)
            fetchImagen()
            setEditingImagen(null)
        } catch (error) {
            console.error('Error al actualizar imagen:', error)
        }
    }

    const handleCancelEdit = () => {
        setEditingImagen(null)
        setFormData({ Tipo_Imagen: "", URL: "" })
    }

    return (
        <div className={styles.ImagenFrom}>
            {/* Sección de agregar imagen */}
            <div className={styles.AgregarImg}>
                <h1>Agregar Imágenes para el logo y banner</h1>
                <form onSubmit={handleSubmit}>
                    <select
                        required
                        name="Tipo_Imagen"
                        value={imagenData.Tipo_Imagen}
                        onChange={handleInputChange}
                    >
                        <option value="">Seleccione tipo de imagen</option>
                        <option value="Logo">Logo</option>
                        <option value="Banner">Banner</option>
                    </select>
                    
                    <input
                        type="text"
                        placeholder="Enter URL"
                        required
                        name="URL"
                        value={imagenData.URL}
                        onChange={handleInputChange}
                    />
                    
                    <button type="submit">Guardar Datos</button>
                </form>
            </div>

            {/* Sección de lista de imágenes */}
            <div className={styles.lista}>
                <div className={styles.tabla}>
                    <div className={styles.tablita}>
                        <h1>Lista de las imágenes</h1>
                        {imagenes.map((imagen) => (
                            <div key={imagen.ID_Imagen} className={styles.imagenItem}>
                                <p>Tipo de imagen: {imagen.Tipo_Imagen}</p>
                                <p>Ruta de la imagen: {imagen.URL}</p>
                                <div className={styles.imageActions}>
                                    <button 
                                        onClick={() => handleDelete(imagen.ID_Imagen)}
                                        className={styles.deleteBtn}
                                        title="Eliminar"
                                    >
                                        ❌
                                    </button>
                                    <button 
                                        onClick={() => handleEditClick(imagen)}
                                        className={styles.editBtn}
                                        title="Editar"
                                    >
                                        ✏️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal de edición */}
            {editingImagen && (
                <div className={styles.modal_overlay}>
                    <div className={styles.modal_window}>
                        <span 
                            className={styles.modal_close} 
                            onClick={handleCancelEdit}
                        >
                            &times;
                        </span>
                        
                        <h3>Editar imagen</h3>
                        
                        <div className={styles.modalForm}>
                            <select
                                name="Tipo_Imagen"
                                value={formData.Tipo_Imagen}
                                onChange={handleInputChangeUpdate}
                            >
                                <option value="">Seleccione tipo de imagen</option>
                                <option value="Logo">Logo</option>
                                <option value="Banner">Banner</option>
                            </select>
                            
                            <input 
                                type="text"
                                name="URL"
                                value={formData.URL}
                                onChange={handleInputChangeUpdate}
                                placeholder="URL o ruta"
                            />
                        </div>
                        
                        <div className={styles.botones}>
                            <button onClick={handleUpdate}>Guardar</button>
                            <button onClick={handleCancelEdit}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Sección mejorada de gestión */}
            <div className={styles.container}>
                <div className={styles.formSection}>
                    <h1 className={styles.sectionTitle}>Gestión de Imágenes</h1>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label>Tipo de Imagen</label>
                            <select
                                required
                                name="Tipo_Imagen"
                                value={imagenData.Tipo_Imagen}
                                onChange={handleInputChange}
                                className={styles.formInput}
                            >
                                <option value="">Seleccione tipo de imagen</option>
                                <option value="Logo">Logo</option>
                                <option value="Banner">Banner</option>
                            </select>
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
                        
                        <button type="submit" className={styles.primaryButton}>
                            Guardar Imagen
                        </button>
                    </form>
                </div>

                <div className={styles.listSection}>
                    <h2 className={styles.sectionTitle}>Imágenes Registradas</h2>
                    <div className={styles.imageGrid}>
                        {imagenes.map((imagen) => (
                            <div key={imagen.ID_Imagen} className={styles.imageCard}>
                                <div className={styles.imageInfo}>
                                    <h3>{imagen.Tipo_Imagen}</h3>
                                    <p className={styles.urlText}>{imagen.URL}</p>
                                    {imagen.URL && (
                                        <div className={styles.imagePreview}>
                                            <img 
                                                src={imagen.URL} 
                                                alt={imagen.Tipo_Imagen} 
                                                onError={(e) => {
                                                    e.target.style.display = 'none'
                                                }}
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

                {/* Modal mejorado */}
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
                                <select
                                    name="Tipo_Imagen"
                                    value={formData.Tipo_Imagen}
                                    onChange={handleInputChangeUpdate}
                                    className={styles.formInput}
                                >
                                    <option value="">Seleccione tipo de imagen</option>
                                    <option value="Logo">Logo</option>
                                    <option value="Banner">Banner</option>
                                </select>
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
        </div>
    )
}

export default ImagenForm