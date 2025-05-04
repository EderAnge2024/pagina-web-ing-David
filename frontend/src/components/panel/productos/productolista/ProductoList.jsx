import React, { useEffect, useState } from 'react';
import './lista.css';
import axios from 'axios';
import ModalProducto from './ModalProducto';
import { RiDeleteBin5Fill } from "react-icons/ri";
import { AiOutlineEye } from 'react-icons/ai';

const ProductoList = () => {
    const [productos, setProductos] = useState([]);
    const [deleteModal, setDeleteModal] = useState(false);
    const [productoToDelete, setProductoToDelete] = useState(null); 
    const [editModal, setEditModal] = useState(false);
    const [productoToEdit, setProductoToEdit] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProductos();
    }, []);

    const fetchProductos = async () => {
        try {
            const response = await axios.get('http://localhost:3001/productos');
            setProductos(response.data);
        } catch (error) {
            console.error('Error al obtener productos:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/productos/${id}`);
            setProductos(productos.filter(prod => prod.ID_Producto !== id));
            setDeleteModal(false);
        } catch (error) {
            console.error('Error al eliminar:', error);
        }
    };

    const handleDeleteModal = (id) => {
        setProductoToDelete(id);
        setDeleteModal(true);
    };

    const handleEditModal = (producto) => {
        setProductoToEdit(producto);
        setEditModal(true);
    };

    const handleCloseEditModal = () => {
        setEditModal(false);
        setProductoToEdit(null);
        fetchProductos(); // Actualizar lista tras editar
    };

    const filteredProductos = productos.filter(prod =>
        prod.Nombre_Producto.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='lista'>
            <h1>LISTA DE PRODUCTOS</h1>

            <input 
                type="text"
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
            />

            <div className='cards-container'>
                {filteredProductos.map((prod) => (
                    <div className='card' key={prod.ID_Producto}>
                        <img src={prod.Url} alt={prod.Nombre_Producto} className="imagen-empleado" />
                        <p>{prod.Nombre_Producto}</p>
                        <p>💵 S/ {prod.Precio_Final}</p>
                        <AiOutlineEye className='edit-ico' onClick={() => handleEditModal(prod)} />
                        <RiDeleteBin5Fill className='delete-ico' onClick={() => handleDeleteModal(prod.ID_Producto)} />
                    </div>
                ))}
            </div>

            {deleteModal && (
                <div className='modal-delete'>
                    <div className="contend">
                        <p>¿Eliminar este producto?</p>
                        <div className="btns">
                            <button className='btn-SI' onClick={() => handleDelete(productoToDelete)}>SI</button>
                            <button className='btn-NO' onClick={() => setDeleteModal(false)}>NO</button>
                        </div>
                    </div>
                </div>
            )}

            {editModal && productoToEdit && (
                <ModalProducto producto={productoToEdit} onClose={handleCloseEditModal} />
            )}
        </div>
    );
};

export default ProductoList;
