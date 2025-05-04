import React, { useEffect, useState } from 'react';
import './logolista.css';
import axios from 'axios';
import { RiDeleteBin5Fill, RiEdit2Fill } from "react-icons/ri";

const LogoLista = () => {
    const [logos, setLogos] = useState([]);
    const [deleteModal, setDeleteModal] = useState(false);
    const [logoToDelete, setLogoToDelete] = useState(null); 
    const [searchTerm, setSearchTerm] = useState('');
    const [editModal, setEditModal] = useState(false);
    const [logoToEdit, setLogoToEdit] = useState({
        ID_Logo: '',
        Nombre_Logo: '',
        URL_Logo: ''
    });

    useEffect(() => {
        fetchLogos();
    }, []);

    const fetchLogos = async () => {
        try {
            const response = await axios.get('http://localhost:3001/logo');
            setLogos(response.data);
        } catch (error) {
            console.error('Error al obtener logos:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/logo/${id}`);
            setLogos(logos.filter(logo => logo.ID_Logo !== id));
            setDeleteModal(false);
        } catch (error) {
            console.error('Error al eliminar:', error);
        }
    };

    const handleDeleteModal = (id) => {
        setLogoToDelete(id);
        setDeleteModal(true);
    };

    const handleEditModal = (logo) => {
        setLogoToEdit({ ...logo });
        setEditModal(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setLogoToEdit(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3001/logo/${logoToEdit.ID_Logo}`, logoToEdit);
            setLogos(logos.map(logo => logo.ID_Logo === logoToEdit.ID_Logo ? logoToEdit : logo));
            setEditModal(false);
        } catch (error) {
            console.error('Error al editar:', error);
        }
    };

    const filteredLogos = logos.filter(logo => 
        logo.Nombre_Logo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='lista'>
            <h1>LISTA DE LOGOS</h1>

            <input 
                type="text"
                placeholder="Buscar por nombre de logo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
            />

            <div className='cards-container'>
                {filteredLogos.map((logo) => (
                    <div className='card' key={logo.ID_Logo}>
                        <img src={logo.URL_Logo} alt="Logo" className="logo-image" />
                        <p><strong>Nombre:</strong> {logo.Nombre_Logo}</p>
                        <RiDeleteBin5Fill className='delete-ico' onClick={() => handleDeleteModal(logo.ID_Logo)} />
                        <RiEdit2Fill className='edit-ico' onClick={() => handleEditModal(logo)} />
                    </div>
                ))}
            </div>

            {/* Modal para eliminar logo */}
            {deleteModal && (
                <div className='modal-delete'>
                    <div className="contend">
                        <p>¿Eliminar logo?</p>
                        <div className="btns">
                            <button className='btn-SI' onClick={() => handleDelete(logoToDelete)}>SI</button>
                            <button className='btn-NO' onClick={() => setDeleteModal(false)}>NO</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para editar logo */}
            {editModal && (
                <div className='modal-edit'>
                    <div className="contend">
                        <h2>Editar Logo</h2>
                        <form onSubmit={handleEditSubmit}>
                            <div className="form-group">
                                <label htmlFor="Nombre_Logo">Nombre del Logo</label>
                                <input 
                                    type="text" 
                                    id="Nombre_Logo" 
                                    name="Nombre_Logo" 
                                    value={logoToEdit.Nombre_Logo}
                                    onChange={handleEditChange} 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="URL_Logo">URL del Logo</label>
                                <input 
                                    type="text" 
                                    id="URL_Logo" 
                                    name="URL_Logo" 
                                    value={logoToEdit.URL_Logo}
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

export default LogoLista;
