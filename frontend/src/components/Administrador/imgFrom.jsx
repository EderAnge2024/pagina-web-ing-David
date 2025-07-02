import { useEffect, useState } from 'react'
import useImagenStore from '../../store/ImagenStore'
import styles from './imgFrom.module.css'

const ImagenForm = () => {
    const { 
        addImagen, 
        fetchImagen, 
        imagenes,  
        deleteImagen, 
        updateImagen,
        setLogoPrincipal,
        getLogoPrincipal,
        getLogos
    } = useImagenStore()
    const [editingImagen, setEditingImagen] = useState(null)
    const [imagenData, setImagenData] = useState({ Tipo_Imagen: "", URL: "", es_principal: false })
    const [formData, setFormData] = useState({ Tipo_Imagen: "", URL: "", es_principal: false })
    const [selectedFile, setSelectedFile] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [previewUrl, setPreviewUrl] = useState("")
    const [editingFile, setEditingFile] = useState(null)
    const [editingPreview, setEditingPreview] = useState("")
    const [activeTab, setActiveTab] = useState("logos")

    // Configuración de Cloudinary
    const CLOUDINARY_UPLOAD_PRESET = 'bradatec'
    const CLOUDINARY_CLOUD_NAME = 'davbpytad'

    useEffect(() => {
        fetchImagen()
    }, [fetchImagen])

    // Filtrar imágenes por tipo
    const logos = getLogos()
    const logoPrincipal = getLogoPrincipal()
    const banners = imagenes.filter(img => img.Tipo_Imagen === "Banner")

    // Manejar selección de archivo
    const handleFileSelect = (e) => {
        const file = e.target.files[0]
        if (file) {
            setSelectedFile(file)
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
        const { name, value, type, checked } = e.target  
        setImagenData({
            ...imagenData,
            [name]: type === 'checkbox' ? checked : value
        })
    }

    // 🔥 FUNCIÓN MEJORADA PARA MANEJAR EL SUBMIT
    const handleSubmit = async (e) => {
        e.preventDefault()
        setUploading(true)
        setUploadProgress(0)
        
        try {
            let finalImagenData = { ...imagenData }
            
            // Subir archivo si existe
            if (selectedFile) {
                const uploadedUrl = await uploadToCloudinary(selectedFile)
                finalImagenData.URL = uploadedUrl
            }
            
            console.log('📋 Datos a enviar:', finalImagenData)
            
            // 🔥 VERIFICAR SI ES LOGO Y ES_PRINCIPAL
            if (finalImagenData.Tipo_Imagen === "Logo" && finalImagenData.es_principal) {
                // Primero agregar la imagen SIN establecerla como principal
                const tempData = { ...finalImagenData, es_principal: false }
                
                console.log('🎯 Agregando logo primero sin marcar como principal...')
                const newImagenId = await addImagen(tempData)
                
                // Actualizar lista de imágenes
                await fetchImagen()
                
                // Luego establecer como principal usando el ID de la nueva imagen
                if (newImagenId) {
                    console.log('🎯 Estableciendo como principal el ID:', newImagenId)
                    await setLogoPrincipal(newImagenId)
                } else {
                    // Si no tenemos el ID, buscar la imagen recién creada
                    await new Promise(resolve => setTimeout(resolve, 300))
                    await fetchImagen()
                    
                    const newLogos = getLogos()
                    const lastLogo = newLogos[newLogos.length - 1]
                    
                    if (lastLogo) {
                        console.log('🎯 Estableciendo como principal (backup):', lastLogo.ID_Imagen)
                        await setLogoPrincipal(lastLogo.ID_Imagen)
                    }
                }
            } else {
                // Para banners o logos no principales, agregar normalmente
                await addImagen(finalImagenData)
            }
            
            // Limpiar formulario
            setImagenData({ Tipo_Imagen: "", URL: "", es_principal: false })
            setSelectedFile(null)
            setPreviewUrl("")
            
            const fileInput = document.querySelector('input[type="file"]')
            if (fileInput) fileInput.value = ""
            
            // Forzar actualización completa
            await fetchImagen()
            
            console.log('✅ Imagen agregada exitosamente')
            
        } catch (error) {
            console.error('❌ Error al agregar imagen:', error)
            alert('Error al subir la imagen: ' + error.message)
        } finally {
            setUploading(false)
            setUploadProgress(0)
        }
    }

    const handleDelete = async (ID_Imagen) => {
        if(window.confirm("¿Estás seguro de eliminar esta imagen?")) {
            try {
                await deleteImagen(ID_Imagen)
                await fetchImagen() // 🔥 FORZAR ACTUALIZACIÓN
            } catch (error) {
                console.error('Error al eliminar imagen:', error)
            }
        }
    }

    const handleEditClick = (imagen) => {
        setEditingImagen(imagen)
        setFormData({ 
            Tipo_Imagen: imagen.Tipo_Imagen, 
            URL: imagen.URL,
            es_principal: imagen.es_principal || false
        })
        setEditingFile(null)
        setEditingPreview("")
    }

    const handleInputChangeUpdate = (e) => {
        const { name, value, type, checked } = e.target
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        })
    }

    // 🔥 FUNCIÓN MEJORADA PARA MANEJAR LA ACTUALIZACIÓN
    const handleUpdate = async () => {
        setUploading(true)
        
        try {
            let finalFormData = { ...formData }
            
            if (editingFile) {
                const uploadedUrl = await uploadToCloudinary(editingFile)
                finalFormData.URL = uploadedUrl
            }
            
            console.log('📋 Datos de actualización:', finalFormData)
            
            // 🔥 SI SE ESTÁ MARCANDO COMO PRINCIPAL
            if (finalFormData.Tipo_Imagen === "Logo" && finalFormData.es_principal && !editingImagen.es_principal) {
                // Primero actualizar sin marcar como principal
                const tempData = { ...finalFormData, es_principal: false }
                await updateImagen(editingImagen.ID_Imagen, tempData)
                await fetchImagen()
                
                // Luego establecer como principal
                await setLogoPrincipal(editingImagen.ID_Imagen)
            } else {
                // Actualización normal
                await updateImagen(editingImagen.ID_Imagen, finalFormData)
            }
            
            await fetchImagen() // 🔥 FORZAR ACTUALIZACIÓN
            setEditingImagen(null)
            setEditingFile(null)
            setEditingPreview("")
            
            console.log('✅ Imagen actualizada exitosamente')
            
        } catch (error) {
            console.error('❌ Error al actualizar imagen:', error)
            alert('Error al actualizar la imagen: ' + error.message)
        } finally {
            setUploading(false)
        }
    }

    const handleCancelEdit = () => {
        setEditingImagen(null)
        setFormData({ Tipo_Imagen: "", URL: "", es_principal: false })
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

    // 🔥 FUNCIÓN MEJORADA PARA CAMBIAR LOGO PRINCIPAL
    const handleSetLogoPrincipal = async (logoId) => {
        if (!window.confirm('¿Deseas cambiar el logo principal?')) {
            return;
        }
        
        try {
            setUploading(true)
            
            console.log('🎯 Iniciando cambio de logo principal desde ImagenForm:', logoId)
            
            // 1. Llamar a la función del store
            await setLogoPrincipal(logoId)
            
            // 2. Esperar un momento para que se complete la actualización en el servidor
            await new Promise(resolve => setTimeout(resolve, 500))
            
            // 3. Forzar actualización inmediata
            await fetchImagen()
            
            // 4. Disparar evento personalizado para notificar a otros componentes
            const event = new CustomEvent('logoChanged', { 
                detail: { 
                    logoId,
                    timestamp: Date.now(),
                    source: 'ImagenForm'
                } 
            })
            
            window.dispatchEvent(event)
            console.log('📢 Evento logoChanged disparado:', event.detail)
            
            // 5. Forzar re-render adicional con un pequeño delay
            setTimeout(async () => {
                await fetchImagen()
                console.log('🔄 Segunda actualización completada')
            }, 1000)
            
            // 6. Notificar al usuario con un mensaje más claro
            alert('✅ Logo principal actualizado correctamente. El cambio se reflejará en toda la aplicación.')
            
        } catch (error) {
            console.error('❌ Error al cambiar logo principal:', error)
            alert('❌ Error al cambiar logo principal: ' + error.message)
        } finally {
            setUploading(false)
        }
    }

    const renderImageCard = (imagen, showPrincipalOption = false) => (
        <div key={imagen.ID_Imagen} className={`${styles.imageCard} ${imagen.es_principal ? styles.principalCard : ''}`}>
            {imagen.es_principal && (
                <div className={styles.principalBadge}>
                    ⭐ Logo Principal
                </div>
            )}
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
                {showPrincipalOption && !imagen.es_principal && (
                    <button 
                        onClick={() => handleSetLogoPrincipal(imagen.ID_Imagen)}
                        className={styles.principalButton}
                        disabled={uploading}
                    >
                        Hacer Principal
                    </button>
                )}
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
    )

    return (
        <div className={styles.ImagenFrom}>
            <div className={styles.container}>
                <div className={styles.formSection}>
                    <h1 className={styles.sectionTitle}>Gestión de Imágenes</h1>
                    
                    {/* Indicador si no hay logo principal */}
                    {!logoPrincipal && (
                        <div className={styles.noLogoSection}>
                            <h2 className={styles.subTitle}>⚠️ Sin Logo Principal</h2>
                            <p className={styles.warningText}>
                                No hay un logo principal configurado. 
                                Selecciona un logo y márcalo como principal para que aparezca en la aplicación.
                            </p>
                        </div>
                    )}
                    
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

                        {/* Checkbox para marcar como principal (solo para logos) */}
                        {imagenData.Tipo_Imagen === "Logo" && (
                            <div className={styles.formGroup}>
                                <label className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        name="es_principal"
                                        checked={imagenData.es_principal}
                                        onChange={handleInputChange}
                                        disabled={uploading}
                                    />
                                    Establecer como logo principal
                                </label>
                                <p className={styles.hint}>
                                    Solo puede haber un logo principal a la vez
                                </p>
                            </div>
                        )}
                        
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

                {/* Lista de imágenes con tabs */}
                <div className={styles.listSection}>
                    <h2 className={styles.sectionTitle}>Imágenes Registradas</h2>
                    
                    {/* Tabs para separar logos y banners */}
                    <div className={styles.tabContainer}>
                        <button 
                            className={`${styles.tab} ${activeTab === 'logos' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('logos')}
                        >
                            Logos ({logos.length})
                        </button>
                        <button 
                            className={`${styles.tab} ${activeTab === 'banners' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('banners')}
                        >
                            Banners ({banners.length})
                        </button>
                    </div>

                    {/* Contenido de los tabs */}
                    <div className={styles.tabContent}>
                        {activeTab === 'logos' && (
                            <div className={styles.imageGrid}>
                                {logos.length > 0 ? (
                                    logos.map(logo => renderImageCard(logo, true))
                                ) : (
                                    <div className={styles.emptyState}>
                                        <p>No hay logos registrados</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'banners' && (
                            <div className={styles.imageGrid}>
                                {banners.length > 0 ? (
                                    banners.map(banner => renderImageCard(banner, false))
                                ) : (
                                    <div className={styles.emptyState}>
                                        <p>No hay banners registrados</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Modal de edición */}
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

                            {/* Checkbox para marcar como principal (solo para logos) */}
                            {formData.Tipo_Imagen === "Logo" && (
                                <div className={styles.formGroup}>
                                    <label className={styles.checkboxLabel}>
                                        <input
                                            type="checkbox"
                                            name="es_principal"
                                            checked={formData.es_principal}
                                            onChange={handleInputChangeUpdate}
                                            disabled={uploading}
                                        />
                                        Establecer como logo principal
                                    </label>
                                </div>
                            )}

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