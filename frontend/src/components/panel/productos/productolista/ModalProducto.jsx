import React, { useState } from 'react';
import './modal.css';
import axios from 'axios';

const ModalProducto = ({ producto, onClose }) => {
    const [formData, setFormData] = useState({
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3001/productos/${producto.ID_Producto}`, formData);
            onClose(); // Cierra y refresca la lista
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Editar Producto</h2>
                <form onSubmit={handleSubmit} className="form-modal">
                    <label>Código:</label>
                    <input type="text" name="Codigo" value={formData.Codigo} onChange={handleChange} required />

                    <label>Nombre:</label>
                    <input type="text" name="Nombre_Producto" value={formData.Nombre_Producto} onChange={handleChange} required />

                    <label>Descripción:</label>
                    <textarea name="Descripcion" value={formData.Descripcion} onChange={handleChange} required />

                    <label>Descuento:</label>
                    <input type="number" name="Descuento" value={formData.Descuento} onChange={handleChange} step="0.01" required />

                    <label>Precio:</label>
                    <input type="number" name="Precio_Producto" value={formData.Precio_Producto} onChange={handleChange} step="0.01" required />

                    <label>Marca:</label>
                    <input type="text" name="Marca" value={formData.Marca} onChange={handleChange} required />

                    <label>Cantidad Total:</label>
                    <input type="number" name="Cantidad" value={formData.Cantidad} onChange={handleChange} required />

                    <label>Cantidad Disponible:</label>
                    <input type="number" name="cantidad_Disponible" value={formData.cantidad_Disponible} onChange={handleChange} required />

                    <label>URL de Imagen:</label>
                    <input type="text" name="Url" value={formData.Url} onChange={handleChange} required />

                    <label>Precio Final:</label>
                    <input type="number" name="Precio_Final" value={formData.Precio_Final} onChange={handleChange} step="0.01" required />

                    <div className="btns">
                        <button type="submit" className="btn-SI">Guardar</button>
                        <button type="button" className="btn-NO" onClick={onClose}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalProducto;
