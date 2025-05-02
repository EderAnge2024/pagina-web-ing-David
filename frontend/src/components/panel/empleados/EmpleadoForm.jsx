import { useState } from "react";
import './employeeForm.css';
import axios from 'axios';

const EmpleadoForm = () => {
    const [empleadoData, setEmpleadoData] = useState({
        Nombre_Empleado: "",
        NumCelular: "",
        URL: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEmpleadoData({
            ...empleadoData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3001/empleado', empleadoData);
            alert("EMPLEADO AGREGADO");
            setEmpleadoData({
                Nombre_Empleado: "",
                NumCelular: "",
                URL: ""
            });
        } catch (error) {
            alert("Error al agregar empleado");
            console.error(error);
        }
    };

    return (
        <div className="register">
            <h1>AGREGAR EMPLEADOS</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Nombre del Empleado"
                    required
                    name="Nombre_Empleado"
                    value={empleadoData.Nombre_Empleado}
                    onChange={handleInputChange}
                />
                <input
                    type="number"
                    placeholder="Número de Celular"
                    required
                    name="NumCelular"
                    value={empleadoData.NumCelular}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    placeholder="URL de la Imagen (opcional)"
                    name="URL"
                    value={empleadoData.URL}
                    onChange={handleInputChange}
                />
                <button type="submit">AGREGAR</button>
            </form>
        </div>
    );
};

export default EmpleadoForm;
