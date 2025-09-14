import { useEffect, useState } from 'react';
import useProductoStore from '../../store/ProductoStore';
import useCategoriaStore from '../../store/CategoriaStore';
import styles from './productoStilo.module.css';

const ProductosForm = () => {
    const { addProducto, fetchProducto, productos, deleteProducto, updateProducto } = useProductoStore();
    const { categorias, fetchCategoria } = useCategoriaStore();
    const [editingProducto, setEditingProducto] = useState(null);
    
    // Estados para el formulario de creación
    const [productoData, setProductoData] = useState({
        ID_Categoria: "",
        Codigo: "",
        Nombre_Producto: "",
        Descripcion: "",
        Descuento: "",
        Precio_Producto: "",
        Marca: "",
        Cantidad: "",
        cantidad_Disponible: "",
        Url: "",
        Precio_Final: ""
    });
    
    // Estados para el formulario de edición
    const [formData, setFormData] = useState({
        ID_Categoria: "",
        Codigo: "",
        Nombre_Producto: "",
        Descripcion: "",
        Descuento: "",
        Precio_Producto: "",
        Marca: "",
        Cantidad: "",
        cantidad_Disponible: "",
        Url: "",
        Precio_Final: ""
    });

    // Estados para manejo de archivos
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [editingFile, setEditingFile] = useState(null);
    const [editingPreview, setEditingPreview] = useState("");
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    // Configuración de Cloudinary - Reemplaza con tus credenciales
    const CLOUDINARY_UPLOAD_PRESET = 'bradatec'; // Reemplaza con tu upload preset
    const CLOUDINARY_CLOUD_NAME = 'davbpytad'; // Reemplaza con tu cloud name

    useEffect(() => {
        fetchProducto();
        fetchCategoria();
    }, []);

    // Función para subir imagen a Cloudinary
    const uploadToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        
        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );
            
            if (!response.ok) {
                throw new Error('Error al subir imagen a Cloudinary');
            }
            
            const data = await response.json();
            return data.secure_url;
        } catch (error) {
            console.error('Error en upload:', error);
            throw error;
        }
    };

    // Manejar selección de archivo para crear producto
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            // Crear preview local
            const reader = new FileReader();
            reader.onload = (e) => setPreviewUrl(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    // Manejar selección de archivo para editar producto
    const handleEditFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditingFile(file);
            // Crear preview local
            const reader = new FileReader();
            reader.onload = (e) => setEditingPreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    // Remover archivo seleccionado
    const removeSelectedFile = () => {
        setSelectedFile(null);
        setPreviewUrl("");
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = "";
    };

    // Remover archivo de edición
    const removeEditingFile = () => {
        setEditingFile(null);
        setEditingPreview("");
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductoData({
            ...productoData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
        setUploadProgress(0);
        
        try {
            let finalProductoData = { ...productoData };
            
            // Si hay un archivo seleccionado, subirlo a Cloudinary
            if (selectedFile) {
                const uploadedUrl = await uploadToCloudinary(selectedFile);
                finalProductoData.Url = uploadedUrl;
            }
            
            await addProducto(finalProductoData);
            
            // Limpiar formulario
            setProductoData({
                ID_Categoria: "",
                Codigo: "",
                Nombre_Producto: "",
                Descripcion: "",
                Descuento: "",
                Precio_Producto: "",
                Marca: "",
                Cantidad: "",
                cantidad_Disponible: "",
                Url: "",
                Precio_Final: ""
            });
            
            // Limpiar archivos
            setSelectedFile(null);
            setPreviewUrl("");
            
            // Limpiar input file
            const fileInput = document.querySelector('input[type="file"]');
            if (fileInput) fileInput.value = "";
            
            alert("Se agregó el producto nuevo");
        } catch (error) {
            console.error('Error al agregar producto:', error);
            alert("Error al agregar el producto. Por favor, verifica tu configuración de Cloudinary.");
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const handleDelete = (id) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
            deleteProducto(id);
            fetchProducto();
        }
    };

    const handleEditClick = (producto) => {
        setEditingProducto(producto);
        setFormData({
            ID_Categoria: producto.ID_Categoria,
            Codigo: producto.Codigo,
            Nombre_Producto: producto.Nombre_Producto,
            Descripcion: producto.Descripcion,
            Descuento: producto.Descuento,
            Precio_Producto: producto.Precio_Producto,
            Marca: producto.Marca,
            Cantidad: producto.Cantidad,
            cantidad_Disponible: producto.cantidad_Disponible,
            Url: producto.Url,
            Precio_Final: producto.Precio_Final
        });
        setEditingFile(null);
        setEditingPreview("");
    };

    const handleInputChangeUpdate = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleUpdate = async () => {
        setUploading(true);
        
        try {
            let finalFormData = { ...formData };
            
            // Si hay un nuevo archivo, subirlo a Cloudinary
            if (editingFile) {
                const uploadedUrl = await uploadToCloudinary(editingFile);
                finalFormData.Url = uploadedUrl;
            }
            
            await updateProducto(editingProducto.ID_Producto, finalFormData);
            setEditingProducto(null);
            setEditingFile(null);
            setEditingPreview(""); 
            fetchProducto();
            alert("Producto actualizado exitosamente");
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            alert("Error al actualizar el producto.");
        } finally {
            setUploading(false);
        }
    };

    const handleCancelEdit = () => {
        setEditingProducto(null);
        setEditingFile(null);
        setEditingPreview("");
    };

    return (
        <div className={styles.container}>
            {/* Formulario de agregar producto */}
            <div className={styles.formSection}>
                <h1 className={styles.title}>Agregar Producto</h1>
                
                {/* Mensaje de configuración */}
                <div className={styles.configAlert}>
                    <p><strong>⚠️ Configuración necesaria:</strong></p>
                    <p>Asegúrate de configurar tu CLOUDINARY_CLOUD_NAME y CLOUDINARY_UPLOAD_PRESET en el componente.</p>
                </div>
                
                <form onSubmit={handleSubmit} className={styles.form}>
                    <select
                        name="ID_Categoria"
                        value={productoData.ID_Categoria}
                        onChange={handleInputChange}
                        required
                        className={styles.select}
                        disabled={uploading}
                    >
                        <option value="">-- Seleccionar categoría --</option>
                        {categorias.map((cat) => (
                            <option key={cat.ID_Categoria} value={cat.ID_Categoria}>
                                {cat.Tipo_Producto}
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        placeholder="Código del producto"
                        required
                        name="Codigo"
                        value={productoData.Codigo}
                        onChange={handleInputChange}
                        className={styles.input}
                        disabled={uploading}
                    />

                    <input
                        type="text"
                        placeholder="Nombre del producto"
                        required
                        name="Nombre_Producto"
                        value={productoData.Nombre_Producto}
                        onChange={handleInputChange}
                        className={styles.input}
                        disabled={uploading}
                    />

                    <input
                        type="text"
                        placeholder="Descripción"
                        required
                        name="Descripcion"
                        value={productoData.Descripcion}
                        onChange={handleInputChange}
                        className={styles.input}
                        disabled={uploading}
                    />

                    <input
                        type="number"
                        placeholder="Descuento (%)"
                        required
                        name="Descuento"
                        value={productoData.Descuento}
                        onChange={handleInputChange}
                        className={styles.input}
                        min="0"
                        max="100"
                        disabled={uploading}
                    />

                    <input
                        type="number"
                        placeholder="Precio del producto"
                        required
                        name="Precio_Producto"
                        value={productoData.Precio_Producto}
                        onChange={handleInputChange}
                        className={styles.input}
                        min="0"
                        step="0.01"
                        disabled={uploading}
                    />

                    <input
                        type="text"
                        placeholder="Marca"
                        required
                        name="Marca"
                        value={productoData.Marca}
                        onChange={handleInputChange}
                        className={styles.input}
                        disabled={uploading}
                    />

                    <input
                        type="number"
                        placeholder="Cantidad total"
                        required
                        name="Cantidad"
                        value={productoData.Cantidad}
                        onChange={handleInputChange}
                        className={styles.input}
                        min="0"
                        disabled={uploading}
                    />

                    <input
                        type="number"
                        placeholder="Cantidad disponible"
                        required
                        name="cantidad_Disponible"
                        value={productoData.cantidad_Disponible}
                        onChange={handleInputChange}
                        className={styles.input}
                        min="0"
                        disabled={uploading}
                    />

                    {/* Sección de subida de imagen */}
                    <div className={styles.formGroup}>
                        <label>Imagen del Producto</label>
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

                    <input
                        type="url"
                        placeholder="URL de la imagen (opcional)"
                        name="Url"
                        value={productoData.Url}
                        onChange={handleInputChange}
                        className={styles.input}
                        disabled={uploading || selectedFile !== null}
                    />
                    <p className={styles.urlHint}>
                        Solo se usará si no has seleccionado un archivo
                    </p>

                    <input
                        type="number"
                        placeholder="Precio final"
                        required
                        name="Precio_Final"
                        value={productoData.Precio_Final}
                        onChange={handleInputChange}
                        className={styles.input}
                        min="0"
                        step="0.01"
                        disabled={uploading}
                    />

                    {/* Progress bar durante upload */}
                    {uploading && (
                        <div className={styles.uploadProgress}>
                            <p>Subiendo imagen y guardando producto...</p>
                            <div className={styles.progressBar}>
                                <div className={styles.progressFill}></div>
                            </div>
                        </div>
                    )}

                    <button 
                        type="submit" 
                        className={styles.submitButton}
                        disabled={uploading || (!selectedFile && !productoData.Url)}
                    >
                        {uploading ? 'Guardando...' : 'Guardar Producto'}
                    </button>
                </form>
            </div>

            {/* Lista de productos */}
            <div className={styles.listSection}>
                <h1 className={styles.title}>Lista de Productos</h1>
                <div className={styles.productList}>
                    {productos.map((producto) => (
                        <div key={producto.ID_Producto} className={styles.productCard}>
                            <div className={styles.productInfo}>
                                <p className={styles.productName}>
                                    <strong>{producto.Nombre_Producto}</strong>
                                </p>
                                <p><span className={styles.label}>Código:</span> {producto.Codigo}</p>
                                <p><span className={styles.label}>Descripción:</span> {producto.Descripcion}</p>
                                <p><span className={styles.label}>Marca:</span> {producto.Marca}</p>
                                <p><span className={styles.label}>Precio:</span> ${producto.Precio_Producto}</p>
                                <p><span className={styles.label}>Descuento:</span> {producto.Descuento}%</p>
                                <p><span className={styles.label}>Precio Final:</span> ${producto.Precio_Final}</p>
                                <p><span className={styles.label}>Cantidad Total:</span> {producto.Cantidad}</p>
                                <p><span className={styles.label}>Disponible:</span> {producto.cantidad_Disponible}</p>
                                {producto.Url && (
                                    <div className={styles.imageContainer}>
                                        <img 
                                            src={producto.Url} 
                                            alt={producto.Nombre_Producto}
                                            className={styles.productImage}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className={styles.actionButtons}>
                                <button 
                                    onClick={() => handleDelete(producto.ID_Producto)}
                                    className={styles.deleteButton}
                                    disabled={uploading}
                                >
                                    🗑️ Eliminar
                                </button>
                                <button 
                                    onClick={() => handleEditClick(producto)}
                                    className={styles.editButton}
                                    disabled={uploading}
                                >
                                    ✏️ Editar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal de edición mejorado */}
            {editingProducto && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalWindow}>
                        <span 
                            className={styles.modalClose} 
                            onClick={handleCancelEdit}
                            style={{ cursor: uploading ? 'not-allowed' : 'pointer' }}
                        >
                            &times;
                        </span>
                        <h3 className={styles.modalTitle}>Editar Producto</h3>
                        
                        <div className={styles.modalForm}>
                            <select
                                name="ID_Categoria"
                                value={formData.ID_Categoria}
                                onChange={handleInputChangeUpdate}
                                required
                                className={styles.select}
                                disabled={uploading}
                            >
                                <option value="">-- Seleccionar categoría --</option>
                                {categorias.map((cat) => (
                                    <option key={cat.ID_Categoria} value={cat.ID_Categoria}>
                                        {cat.Tipo_Producto}
                                    </option>
                                ))}
                            </select>

                            <input 
                                type="text"
                                name="Codigo"
                                value={formData.Codigo}
                                onChange={handleInputChangeUpdate}
                                placeholder="Código del producto"
                                className={styles.input}
                                disabled={uploading}
                            />

                            <input 
                                type="text"
                                name="Nombre_Producto"
                                value={formData.Nombre_Producto}
                                onChange={handleInputChangeUpdate}
                                placeholder="Nombre del producto"
                                className={styles.input}
                                disabled={uploading}
                            />

                            <input 
                                type="text"
                                name="Descripcion"
                                value={formData.Descripcion}
                                onChange={handleInputChangeUpdate}
                                placeholder="Descripción"
                                className={styles.input}
                                disabled={uploading}
                            />

                            <input 
                                type="number"
                                name="Descuento"
                                value={formData.Descuento}
                                onChange={handleInputChangeUpdate}
                                placeholder="Descuento (%)"
                                className={styles.input}
                                min="0"
                                max="100"
                                disabled={uploading}
                            />

                            <input 
                                type="number"
                                name="Precio_Producto"
                                value={formData.Precio_Producto}
                                onChange={handleInputChangeUpdate}
                                placeholder="Precio del producto"
                                className={styles.input}
                                min="0"
                                step="0.01"
                                disabled={uploading}
                            />

                            <input 
                                type="text"
                                name="Marca"
                                value={formData.Marca}
                                onChange={handleInputChangeUpdate}
                                placeholder="Marca"
                                className={styles.input}
                                disabled={uploading}
                            />

                            <input 
                                type="number"
                                name="Cantidad"
                                value={formData.Cantidad}
                                onChange={handleInputChangeUpdate}
                                placeholder="Cantidad total"
                                className={styles.input}
                                min="0"
                                disabled={uploading}
                            />

                            <input 
                                type="number"
                                name="cantidad_Disponible"
                                value={formData.cantidad_Disponible}
                                onChange={handleInputChangeUpdate}
                                placeholder="Cantidad disponible"
                                className={styles.input}
                                min="0"
                                disabled={uploading}
                            />

                            {/* Imagen actual */}
                            {formData.Url && !editingPreview && (
                                <div className={styles.currentImageContainer}>
                                    <label>Imagen actual:</label>
                                    <img 
                                        src={formData.Url} 
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

                            <input 
                                type="url"
                                name="Url"
                                value={formData.Url}
                                onChange={handleInputChangeUpdate}
                                placeholder="URL de la imagen"
                                className={styles.input}
                                disabled={uploading || editingFile !== null}
                            />

                            <input 
                                type="number"
                                name="Precio_Final"
                                value={formData.Precio_Final}
                                onChange={handleInputChangeUpdate}
                                placeholder="Precio final"
                                className={styles.input}
                                min="0"
                                step="0.01"
                                disabled={uploading}
                            />

                            {uploading && (
                                <div className={styles.uploadProgress}>
                                    <p>Actualizando producto...</p>
                                    <div className={styles.progressBar}>
                                        <div className={styles.progressFill}></div>
                                    </div>
                                </div>
                            )}

                            <div className={styles.modalButtons}>
                                <button 
                                    onClick={handleUpdate} 
                                    className={styles.saveButton}
                                    disabled={uploading}
                                >
                                    {uploading ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                                <button 
                                    onClick={handleCancelEdit} 
                                    className={styles.cancelButton}
                                    disabled={uploading}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductosForm;