import { useEffect, useState } from 'react';
import useProductoStore from '../../store/ProductoStore';
import useCategoriaStore from '../../store/CategoriaStore';
import styles from './productoStilo.module.css';

const ProductosForm = () => {
    const { addProducto, fetchProducto, productos, deleteProducto, updateProducto } = useProductoStore();
    const { categorias, fetchCategoria } = useCategoriaStore();
    const [editingProducto, setEditingProducto] = useState(null);
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

    useEffect(() => {
        fetchProducto();
        fetchCategoria();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductoData({
            ...productoData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addProducto(productoData);
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
            alert("Se agregó el producto nuevo");
        } catch (error) {
            console.error('Error al agregar producto:', error);
            alert("Error al agregar el producto");
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
    };

    const handleInputChangeUpdate = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleUpdate = async () => {
        try {
            await updateProducto(editingProducto.ID_Producto, formData);
            setEditingProducto(null);
            fetchProducto();
            alert("Producto actualizado exitosamente");
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            alert("Error al actualizar el producto");
        }
    };

    const handleCancelEdit = () => {
        setEditingProducto(null);
    };

    return (
        <div className={styles.container}>
            {/* Formulario de agregar producto */}
            <div className={styles.formSection}>
                <h1 className={styles.title}>Agregar Producto</h1>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <select
                        name="ID_Categoria"
                        value={productoData.ID_Categoria}
                        onChange={handleInputChange}
                        required
                        className={styles.select}
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
                    />

                    <input
                        type="text"
                        placeholder="Nombre del producto"
                        required
                        name="Nombre_Producto"
                        value={productoData.Nombre_Producto}
                        onChange={handleInputChange}
                        className={styles.input}
                    />

                    <input
                        type="text"
                        placeholder="Descripción"
                        required
                        name="Descripcion"
                        value={productoData.Descripcion}
                        onChange={handleInputChange}
                        className={styles.input}
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
                    />

                    <input
                        type="text"
                        placeholder="Marca"
                        required
                        name="Marca"
                        value={productoData.Marca}
                        onChange={handleInputChange}
                        className={styles.input}
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
                    />

                    <input
                        type="url"
                        placeholder="URL de la imagen"
                        required
                        name="Url"
                        value={productoData.Url}
                        onChange={handleInputChange}
                        className={styles.input}
                    />

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
                    />

                    <button type="submit" className={styles.submitButton}>
                        Guardar Producto
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
                                >
                                    🗑️ Eliminar
                                </button>
                                <button 
                                    onClick={() => handleEditClick(producto)}
                                    className={styles.editButton}
                                >
                                    ✏️ Editar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal de edición */}
            {editingProducto && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalWindow}>
                        <span className={styles.modalClose} onClick={handleCancelEdit}>
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
                            />

                            <input 
                                type="text"
                                name="Nombre_Producto"
                                value={formData.Nombre_Producto}
                                onChange={handleInputChangeUpdate}
                                placeholder="Nombre del producto"
                                className={styles.input}
                            />

                            <input 
                                type="text"
                                name="Descripcion"
                                value={formData.Descripcion}
                                onChange={handleInputChangeUpdate}
                                placeholder="Descripción"
                                className={styles.input}
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
                            />

                            <input 
                                type="text"
                                name="Marca"
                                value={formData.Marca}
                                onChange={handleInputChangeUpdate}
                                placeholder="Marca"
                                className={styles.input}
                            />

                            <input 
                                type="number"
                                name="Cantidad"
                                value={formData.Cantidad}
                                onChange={handleInputChangeUpdate}
                                placeholder="Cantidad total"
                                className={styles.input}
                                min="0"
                            />

                            <input 
                                type="number"
                                name="cantidad_Disponible"
                                value={formData.cantidad_Disponible}
                                onChange={handleInputChangeUpdate}
                                placeholder="Cantidad disponible"
                                className={styles.input}
                                min="0"
                            />

                            <input 
                                type="url"
                                name="Url"
                                value={formData.Url}
                                onChange={handleInputChangeUpdate}
                                placeholder="URL de la imagen"
                                className={styles.input}
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
                            />

                            <div className={styles.modalButtons}>
                                <button onClick={handleUpdate} className={styles.saveButton}>
                                    Guardar Cambios
                                </button>
                                <button onClick={handleCancelEdit} className={styles.cancelButton}>
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