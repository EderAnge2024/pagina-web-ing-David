import { useState, useEffect } from "react";
import './proyectofrom.css';
import axios from 'axios';

const ProyectoForm = () => {
    const [proyectoData, setProyectoData] = useState({
        ID_Empleados: "",  // Asociar a un empleado
        Lugar: "",         // Lugar del proyecto
        URL: "",           // URL de la imagen
    });
    const [empleados, setEmpleados] = useState([]);  // Lista de empleados

    useEffect(() => {
        fetchEmpleados();
    }, []);

    const fetchEmpleados = async () => {
        try {
            const response = await axios.get('http://localhost:3001/empleado');  // Asegúrate de tener esta API disponible
            setEmpleados(response.data);
        } catch (error) {
            console.error("Error al obtener los empleados:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProyectoData({
            ...proyectoData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3001/proyecto', proyectoData);  // Asegúrate de que esta ruta esté configurada
            alert("PROYECTO AGREGADO");
            setProyectoData({
                ID_Empleados: "",
                Lugar: "",
                URL: "",
            });
        } catch (error) {
            alert("Error al agregar proyecto");
            console.error(error);
        }
    };

    return (
        <div className="register">
            <h1>AGREGAR PROYECTO</h1>
            <form onSubmit={handleSubmit}>
                <select name="ID_Empleados" required value={proyectoData.ID_Empleados} onChange={handleInputChange}>
                    <option value="">Seleccione el Empleado</option>
                    {empleados.map((empleado) => (
                        <option key={empleado.ID_Empleado} value={empleado.ID_Empleado}>
                            {empleado.Nombre} {/* Suponiendo que el empleado tiene un campo "Nombre" */}
                        </option>
                    ))}
                </select>

                <input type="text" name="Lugar" placeholder="Lugar del Proyecto" required value={proyectoData.Lugar} onChange={handleInputChange} />

                <input type="text" name="URL" placeholder="URL de la Imagen" required value={proyectoData.URL} onChange={handleInputChange} />

                <button type="submit">AGREGAR PROYECTO</button>
            </form>
        </div>
    );
};

export default ProyectoForm;
