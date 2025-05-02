import React, { useState, useEffect } from 'react';
import './edit.css';
import axios from 'axios';
import { IoSaveOutline, IoTrashOutline } from "react-icons/io5";

const ModalEmpleado = ({ empleado, onClose }) => {
    const [formData, setFormData] = useState({
        Nombre_Empleado: '',
        NumCelular: '',
        URL: ''
    });

    useEffect(() => {
        if (empleado) {
            setFormData({
                Nombre_Empleado: empleado.Nombre_Empleado,
                NumCelular: empleado.NumCelular,
                URL: empleado.URL || ''
            });
        }
    }, [empleado]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3001/empleado/${empleado.ID_Empleado}`, formData);
            alert('Empleado modificado correctamente.');
            onClose();
        } catch (error) {
            console.error('Error al actualizar empleado:', error);
        }
    };

    return (
        <div className='edit-modal'>
            <div className="modal-content">
                <h3>Modificar Empleado</h3>
                <form onSubmit={handleSubmit}>
                    <label>
                        NOMBRE:
                        <input 
                            type="text" 
                            name="Nombre_Empleado" 
                            value={formData.Nombre_Empleado} 
                            onChange={handleChange} 
                            required
                        />
                    </label>
                    <label>
                        CELULAR:
                        <input 
                            type="text" 
                            name="NumCelular" 
                            value={formData.NumCelular} 
                            onChange={handleChange} 
                            required
                        />
                    </label>
                    <label>
                        URL DE IMAGEN:
                        <input 
                            type="text" 
                            name="URL" 
                            value={formData.URL} 
                            onChange={handleChange}
                        />
                    </label>
                    <div className="btns">
                        <button type="submit" className='btn-guardar'>
                            <IoSaveOutline /> Guardar
                        </button>
                        <button type="button" className='btn-cancelar' onClick={onClose}>
                            <IoTrashOutline /> Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalEmpleado;
