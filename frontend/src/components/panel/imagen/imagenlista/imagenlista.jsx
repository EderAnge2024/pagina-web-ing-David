import React, { useEffect, useState } from 'react';
import './imagenlista.css';
import axios from 'axios';
import { RiDeleteBin5Fill, RiEdit2Fill } from "react-icons/ri";

const ImagenLista = () => {
    const [imagenes, setImagenes] = useState([]);
    const [deleteModal, setDeleteModal] = useState(false);
    const [imagenToDelete, setImagenToDelete] = useState(null); 
    const [searchTerm, setSearchTerm] = useState('');
    const [editModal, setEditModal] = useState(false);
    const [imagenToEdit, setImagenToEdit] = useState({
        ID_Imagen: '',
        Tipo_Imagen: '',
        URL: ''
    });

    useEffect(() => {
        fetchImagenes();
    }, []);

    const fetchImagenes = async () => {
        try {
            const response = await axios.get('http://localhost:3001/imagen');
            setImagenes(response.data);
        } catch (error) {
            console.error('Error al obtener imágenes:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/imagen/${id}`);
            setImagenes(imagenes.filter(img => img.ID_Imagen !== id));
            setDeleteModal(false);
        } catch (error) {
            console.error('Error al eliminar:', error);
        }
    };

    const handleDeleteModal = (id) => {
        setImagenToDelete(id);
        setDeleteModal(true);
    };

    const handleEditModal = (img) => {
        setImagenToEdit({ ...img });
        setEditModal(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setImagenToEdit(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3001/imagen/${imagenToEdit.ID_Imagen}`, imagenToEdit);
            setImagenes(imagenes.map(img => img.ID_Imagen === imagenToEdit.ID_Imagen ? imagenToEdit : img));
            setEditModal(false);
        } catch (error) {
            console.error('Error al editar:', error);
        }
    };

    const filteredImagenes = imagenes.filter(img => 
        img.Tipo_Imagen.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='lista'>
            <h1>LISTA DE IMÁGENES</h1>

            <input 
                type="text"
                placeholder="Buscar por tipo de imagen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
            />

            <div className='cards-container'>
                {filteredImagenes.map((img) => (
                    <div className='card' key={img.ID_Imagen}>
                        <img src={img.URL} alt="Imagen" className="imagen-empleado" />
                        <p><strong>Tipo:</strong> {img.Tipo_Imagen}</p>
                        <RiDeleteBin5Fill className='delete-ico' onClick={() => handleDeleteModal(img.ID_Imagen)} />
                        <RiEdit2Fill className='edit-ico' onClick={() => handleEditModal(img)} />
                    </div>
                ))}
            </div>

            {/* Modal para eliminar imagen */}
            {deleteModal && (
                <div className='modal-delete'>
                    <div className="contend">
                        <p>¿Eliminar imagen?</p>
                        <div className="btns">
                            <button className='btn-SI' onClick={() => handleDelete(imagenToDelete)}>SI</button>
                            <button className='btn-NO' onClick={() => setDeleteModal(false)}>NO</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para editar imagen */}
            {editModal && (
                <div className='modal-edit'>
                    <div className="contend">
                        <h2>Editar Imagen</h2>
                        <form onSubmit={handleEditSubmit}>
                            <div className="form-group">
                                <label htmlFor="Tipo_Imagen">Tipo de Imagen</label>
                                <input 
                                    type="text" 
                                    id="Tipo_Imagen" 
                                    name="Tipo_Imagen" 
                                    value={imagenToEdit.Tipo_Imagen}
                                    onChange={handleEditChange} 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="URL">URL de Imagen</label>
                                <input 
                                    type="text" 
                                    id="URL" 
                                    name="URL" 
                                    value={imagenToEdit.URL}
                                    onChange={handleEditChange} 
                                    required 
                                />
                            </div>
                            <div className="btns">
                                <button className='btn-SI' type="submit">Guardar</button>
                                <button className='btn-NO' onClick={() => setEditModal(false)}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImagenLista;
