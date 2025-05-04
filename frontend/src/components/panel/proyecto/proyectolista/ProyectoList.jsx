import React, { useEffect, useState } from 'react';
import './lista.css';
import axios from 'axios';
import { RiDeleteBin5Fill } from "react-icons/ri";

const ProyectoList = () => {
    const [proyectos, setProyectos] = useState([]);
    const [deleteModal, setDeleteModal] = useState(false);
    const [proyectoToDelete, setProyectoToDelete] = useState(null); 
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProyectos();
    }, []);

    const fetchProyectos = async () => {
        try {
            const response = await axios.get('http://localhost:3001/proyecto');
            setProyectos(response.data);
        } catch (error) {
            console.error('Error al obtener proyectos:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/proyecto/${id}`);
            setProyectos(proyectos.filter(pro => pro.ID_Proyectos !== id));
            setDeleteModal(false);
        } catch (error) {
            console.error('Error al eliminar:', error);
        }
    };

    const handleDeleteModal = (id) => {
        setProyectoToDelete(id);
        setDeleteModal(true);
    };

    const filteredProyectos = proyectos.filter(pro =>
        pro.Empleado?.Nombre_Empleado?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='lista'>
            <h1>LISTA DE PROYECTOS</h1>

            <input 
                type="text"
                placeholder="Buscar por empleado..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
            />

            <div className='cards-container'>
                {filteredProyectos.map((pro) => (
                    <div className='card' key={pro.ID_Proyectos}>
                        <img src={pro.URL} alt="Proyecto" className="imagen-empleado" />
                        <p><strong>Lugar:</strong> {pro.Lugar}</p>
                        <p><strong>Empleado:</strong> {pro.Empleado?.Nombre_Empleado}</p>
                        <p><strong>📞</strong> {pro.Empleado?.NumCelular}</p>
                        <RiDeleteBin5Fill className='delete-ico' onClick={() => handleDeleteModal(pro.ID_Proyectos)} />
                    </div>
                ))}
            </div>

            {deleteModal && (
                <div className='modal-delete'>
                    <div className="contend">
                        <p>¿Eliminar este proyecto?</p>
                        <div className="btns">
                            <button className='btn-SI' onClick={() => handleDelete(proyectoToDelete)}>SI</button>
                            <button className='btn-NO' onClick={() => setDeleteModal(false)}>NO</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProyectoList;
