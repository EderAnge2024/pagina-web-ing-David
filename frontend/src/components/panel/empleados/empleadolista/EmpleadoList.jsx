import React, { useEffect, useState } from 'react';
import './lista.css';
import axios from 'axios';
import ModalEmpleado from './ModalEmpleado';
import { RiDeleteBin5Fill } from "react-icons/ri";
import { AiOutlineEye } from 'react-icons/ai';

const EmpleadoList = () => {
    const [empleados, setEmpleados] = useState([]);
    const [deleteModal, setDeleteModal] = useState(false);
    const [empleadoToDelete, setEmpleadoToDelete] = useState(null); 
    const [editModal, setEditModal] = useState(false);
    const [empleadoToEdit, setEmpleadoToEdit] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchEmpleados();
    }, []);

    const fetchEmpleados = async () => {
        try {
            const response = await axios.get('http://localhost:3001/empleado');
            setEmpleados(response.data);
        } catch (error) {
            console.error('Error al obtener empleados:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/empleado/${id}`);
            setEmpleados(empleados.filter(emp => emp.ID_Empleado !== id));
            setDeleteModal(false);
        } catch (error) {
            console.error('Error al eliminar:', error);
        }
    };

    const handleDeleteModal = (id) => {
        setEmpleadoToDelete(id);
        setDeleteModal(true);
    };

    const handleEditModal = (empleado) => {
        setEmpleadoToEdit(empleado);
        setEditModal(true);
    };

    const handleCloseEditModal = () => {
        setEditModal(false);
        setEmpleadoToEdit(null);
        fetchEmpleados(); // Actualizar lista tras editar
    };

    const filteredEmpleados = empleados.filter(emp =>
        emp.Nombre_Empleado.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='lista'>
            <h1>LISTA DE EMPLEADOS</h1>

            <input 
                type="text"
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
            />

            <div className='cards-container'>
                {filteredEmpleados.map((emp) => (
                    <div className='card' key={emp.ID_Empleado}>
                        <img src={emp.URL} alt={emp.Nombre_Empleado} className="imagen-empleado" />
                        <p>{emp.Nombre_Empleado}</p>
                        <p>📞 {emp.NumCelular}</p>
                        <AiOutlineEye className='edit-ico' onClick={() => handleEditModal(emp)} />
                        <RiDeleteBin5Fill className='delete-ico' onClick={() => handleDeleteModal(emp.ID_Empleado)} />
                    </div>
                ))}
            </div>

            {deleteModal && (
                <div className='modal-delete'>
                    <div className="contend">
                        <p>¿Eliminar este empleado?</p>
                        <div className="btns">
                            <button className='btn-SI' onClick={() => handleDelete(empleadoToDelete)}>SI</button>
                            <button className='btn-NO' onClick={() => setDeleteModal(false)}>NO</button>
                        </div>
                    </div>
                </div>
            )}

            {editModal && empleadoToEdit && (
                <ModalEmpleado empleado={empleadoToEdit} onClose={handleCloseEditModal} />
            )}
        </div>
    );
};

export default EmpleadoList;
