import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './modal.css';

const ModalProyecto = ({ proyecto, onClose }) => {
    const [formData, setFormData] = useState({
        ID_Empleados: '',
        Lugar: '',
        URL: ''
    });

    const [empleados, setEmpleados] = useState([]);

    useEffect(() => {
        if (proyecto) {
            setFormData({
                ID_Empleados: proyecto.ID_Empleados,
                Lugar: proyecto.Lugar,
                URL: proyecto.URL
            });
        }
        fetchEmpleados();
    }, [proyecto]);

    const fetchEmpleados = async () => {
        try {
            const res = await axios.get('http://localhost:3001/empleado');
            setEmpleados(res.data);
        } catch (err) {
            console.error('Error al obtener empleados:', err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`http://localhost:3001/proyecto/${proyecto.ID_Proyectos}`, formData);
            alert('Proyecto actualizado');
            onClose();
        } catch (err) {
            console.error('Error al actualizar proyecto:', err);
            alert('Error al actualizar proyecto');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Editar Proyecto</h2>

                <select name="ID_Empleados" value={formData.ID_Empleados} onChange={handleChange} required>
                    <option value="">Seleccione Empleado</option>
                    {empleados.map(emp => (
                        <option key={emp.ID_Empleado} value={emp.ID_Empleado}>
                            {emp.Nombre_Empleado}
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    name="Lugar"
                    placeholder="Lugar del Proyecto"
                    value={formData.Lugar}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="URL"
                    placeholder="URL de la imagen"
                    value={formData.URL}
                    onChange={handleChange}
                />

                <div className="modal-buttons">
                    <button className="btn-SI" onClick={handleUpdate}>Guardar Cambios</button>
                    <button className="btn-NO" onClick={onClose}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

export default ModalProyecto;
