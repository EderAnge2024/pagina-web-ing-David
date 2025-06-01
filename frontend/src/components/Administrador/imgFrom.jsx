import { useEffect, useState } from 'react'
import useImagenStore from '../../store/ImagenStore'
import styles from './imgFrom.module.css'

const ImagenForm = () => {
    const { addImagen, fetchImagen, imagenes, deleteImagen, updateImagen } = useImagenStore() 
    const [editingImagen, setEditingImagen] = useState(null)
    const [imagenData, setImagenData] = useState({ Tipo_Imagen: "", URL: "" })
    const [formData, setFormData] = useState({ Tipo_Imagen: "", URL: "" })
    const [selectedFile, setSelectedFile] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [previewUrl, setPreviewUrl] = useState("")
    const [editingFile, setEditingFile] = useState(null)
    const [editingPreview, setEditingPreview] = useState("")

    // Configuración de Cloudinary - Reemplaza con tus credenciales
    const CLOUDINARY_UPLOAD_PRESET = 'bradatec' // Reemplaza con tu upload preset
    const CLOUDINARY_CLOUD_NAME = 'davbpytad' // Reemplaza con tu cloud name

    useEffect(() => {
        fetchImagen()
    }, [fetchImagen])

    // Manejar selección de archivo
    const handleFileSelect = (e) => {
        const file = e.target.files[0]
        if (file) {
            setSelectedFile(file)
            // Crear preview local
            const reader = new FileReader()
            reader.onload = (e) => setPreviewUrl(e.target.result)
            reader.readAsDataURL(file)
        }
    }

    // Manejar selección de archivo para edición
    const handleEditFileSelect = (e) => {
        const file = e.target.files[0]
        if (file) {
            setEditingFile(file)
            // Crear preview local
            const reader = new FileReader()
            reader.onload = (e) => setEditingPreview(e.target.result)
            reader.readAsDataURL(file)
        }
    }

    // Subir imagen a Cloudinary
    const uploadToCloudinary = async (file) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
        
        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            )
            
            if (!response.ok) {
                throw new Error('Error al subir imagen a Cloudinary')
            }
            
            const data = await response.json()
            return data.secure_url
        } catch (error) {
            console.error('Error en upload:', error)
            throw error
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target  
        setImagenData({
            ...imagenData,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setUploading(true)
        setUploadProgress(0)
        
        try {
            let finalImagenData = { ...imagenData }
            
            // Si hay un archivo seleccionado, subirlo a Cloudinary
            if (selectedFile) {
                const uploadedUrl = await uploadToCloudinary(selectedFile)
                finalImagenData.URL = uploadedUrl
            }
            
            await addImagen(finalImagenData)
            
            // Limpiar formulario
            setImagenData({ Tipo_Imagen: "", URL: "" })
            setSelectedFile(null)
            setPreviewUrl("")
            
            // Limpiar input file
            const fileInput = document.querySelector('input[type="file"]')
            if (fileInput) fileInput.value = ""
            
            fetchImagen()
        } catch (error) {
            console.error('Error al agregar imagen:', error)
            alert('Error al subir la imagen. Por favor, verifica tu configuración de Cloudinary.')
        } finally {
            setUploading(false)
            setUploadProgress(0)
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
        setEditingFile(null)
        setEditingPreview("")
    }

    const handleInputChangeUpdate = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleUpdate = async () => {
        setUploading(true)
        
        try {
            let finalFormData = { ...formData }
            
            // Si hay un nuevo archivo, subirlo a Cloudinary
            if (editingFile) {
                const uploadedUrl = await uploadToCloudinary(editingFile)
                finalFormData.URL = uploadedUrl
            }
            
            await updateImagen(editingImagen.ID_Imagen, finalFormData)
            fetchImagen()
            setEditingImagen(null)
            setEditingFile(null)
            setEditingPreview("")
        } catch (error) {
            console.error('Error al actualizar imagen:', error)
            alert('Error al actualizar la imagen.')
        } finally {
            setUploading(false)
        }
    }

    const handleCancelEdit = () => {
        setEditingImagen(null)
        setFormData({ Tipo_Imagen: "", URL: "" })
        setEditingFile(null)
        setEditingPreview("")
    }

    const removeSelectedFile = () => {
        setSelectedFile(null)
        setPreviewUrl("")
        const fileInput = document.querySelector('input[type="file"]')
        if (fileInput) fileInput.value = ""
    }

    const removeEditingFile = () => {
        setEditingFile(null)
        setEditingPreview("")
    }

    return (
        <div className={styles.ImagenFrom}>
            {/* Sección principal mejorada */}
            <div className={styles.container}>
                <div className={styles.formSection}>
                    <h1 className={styles.sectionTitle}>Gestión de Imágenes</h1>
                    
                    {/* Mensaje de configuración */}
                    <div className={styles.configAlert}>
                        <p><strong>⚠️ Configuración necesaria:</strong></p>
                        <p>Asegúrate de configurar tu CLOUDINARY_CLOUD_NAME y CLOUDINARY_UPLOAD_PRESET en el componente.</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label>Tipo de Imagen</label>
                            <select
                                required
                                name="Tipo_Imagen"
                                value={imagenData.Tipo_Imagen}
                                onChange={handleInputChange}
                                className={styles.formInput}
                                disabled={uploading}
                            >
                                <option value="">Seleccione tipo de imagen</option>
                                <option value="Logo">Logo</option>
                                <option value="Banner">Banner</option>
                            </select>
                        </div>
                        
                        {/* Opción de subir archivo */}
                        <div className={styles.formGroup}>
                            <label>Subir Imagen</label>
                            <div className={styles.fileUploadContainer}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className={styles.fileInput}
                                    disabled={uploading}
                                />
                                <p className={styles.fileHint}>
                                    Selecciona una imagen (JPG, PNG, GIF, etc.)
                                </p>
                            </div>
                        </div>

                        {/* Preview de imagen seleccionada */}
                        {previewUrl && (
                            <div className={styles.previewContainer}>
                                <label>Vista previa:</label>
                                <div className={styles.imagePreviewWrapper}>
                                    <img 
                                        src={previewUrl} 
                                        alt="Preview" 
                                        className={styles.imagePreview}
                                    />
                                    <button 
                                        type="button"
                                        onClick={removeSelectedFile}
                                        className={styles.removePreviewBtn}
                                        disabled={uploading}
                                    >
                                        ❌
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Separador O */}
                        <div className={styles.separator}>
                            <span>O</span>
                        </div>
                        
                        {/* Opción de URL manual */}
                        <div className={styles.formGroup}>
                            <label>URL de la Imagen (opcional)</label>
                            <input
                                type="url"
                                placeholder="https://ejemplo.com/imagen.jpg"
                                name="URL"
                                value={imagenData.URL}
                                onChange={handleInputChange}
                                className={styles.formInput}
                                disabled={uploading || selectedFile !== null}
                            />
                            <p className={styles.urlHint}>
                                Solo se usará si no has seleccionado un archivo
                            </p>
                        </div>
                        
                        {/* Progress bar durante upload */}
                        {uploading && (
                            <div className={styles.uploadProgress}>
                                <p>Subiendo imagen...</p>
                                <div className={styles.progressBar}>
                                    <div className={styles.progressFill}></div>
                                </div>
                            </div>
                        )}
                        
                        <button 
                            type="submit" 
                            className={styles.primaryButton}
                            disabled={uploading || (!selectedFile && !imagenData.URL)}
                        >
                            {uploading ? 'Subiendo...' : 'Guardar Imagen'}
                        </button>
                    </form>
                </div>

                {/* Lista de imágenes */}
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
                                                className={styles.cardImage}
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
                                        disabled={uploading}
                                    >
                                        Editar
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(imagen.ID_Imagen)}
                                        className={styles.deleteButton}
                                        disabled={uploading}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Modal de edición mejorado */}
                {editingImagen && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalContent}>
                            <button 
                                onClick={handleCancelEdit}
                                className={styles.closeButton}
                                disabled={uploading}
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
                                    disabled={uploading}
                                >
                                    <option value="">Seleccione tipo de imagen</option>
                                    <option value="Logo">Logo</option>
                                    <option value="Banner">Banner</option>
                                </select>
                            </div>

                            {/* Imagen actual */}
                            {formData.URL && !editingPreview && (
                                <div className={styles.currentImageContainer}>
                                    <label>Imagen actual:</label>
                                    <img 
                                        src={formData.URL} 
                                        alt="Imagen actual" 
                                        className={styles.currentImage}
                                    />
                                </div>
                            )}

                            {/* Subir nueva imagen */}
                            <div className={styles.formGroup}>
                                <label>Cambiar Imagen</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleEditFileSelect}
                                    className={styles.fileInput}
                                    disabled={uploading}
                                />
                            </div>

                            {/* Preview de nueva imagen */}
                            {editingPreview && (
                                <div className={styles.previewContainer}>
                                    <label>Nueva imagen:</label>
                                    <div className={styles.imagePreviewWrapper}>
                                        <img 
                                            src={editingPreview} 
                                            alt="Preview" 
                                            className={styles.imagePreview}
                                        />
                                        <button 
                                            type="button"
                                            onClick={removeEditingFile}
                                            className={styles.removePreviewBtn}
                                            disabled={uploading}
                                        >
                                            ❌
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Separador O */}
                            <div className={styles.separator}>
                                <span>O</span>
                            </div>
                            
                            {/* URL manual */}
                            <div className={styles.formGroup}>
                                <label>URL</label>
                                <input 
                                    type="url"
                                    name="URL"
                                    value={formData.URL}
                                    onChange={handleInputChangeUpdate}
                                    placeholder="https://ejemplo.com/imagen.jpg"
                                    className={styles.formInput}
                                    disabled={uploading || editingFile !== null}
                                />
                            </div>
                            
                            {uploading && (
                                <div className={styles.uploadProgress}>
                                    <p>Actualizando imagen...</p>
                                    <div className={styles.progressBar}>
                                        <div className={styles.progressFill}></div>
                                    </div>
                                </div>
                            )}
                            
                            <div className={styles.modalActions}>
                                <button 
                                    onClick={handleUpdate}
                                    className={styles.primaryButton}
                                    disabled={uploading}
                                >
                                    {uploading ? 'Subiendo...' : 'Guardar Cambios'}
                                </button>
                                <button 
                                    onClick={handleCancelEdit}
                                    className={styles.secondaryButton}
                                    disabled={uploading}
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