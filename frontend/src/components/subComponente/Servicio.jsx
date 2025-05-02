import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import './servicio.css';

const Servicio = () => {
    const navigate = useNavigate(); // Crea una instancia de navigate
    const [empleados, setEmpleados] = useState([]);
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        const fetchEmpleados = async () => {
            try {
                const response = await fetch("http://localhost:3001/empleado");
                const data = await response.json();
                setEmpleados(data);
            } catch (error) {
                console.error("Error al obtener empleados:", error);
            }
        };

        fetchEmpleados();
    }, []);

    const manejarEmpleadoSeleccionado = (empleado) => {
        const empleadosActuales = JSON.parse(localStorage.getItem("empleadosSeleccionados")) || [];

        const empleadoExistente = empleadosActuales.find(e => e.ID_Empleado === empleado.ID_Empleado);
        if (empleadoExistente) {
            setMensaje("✅ Empleado ya seleccionado");
        } else {
            empleadosActuales.push({ ...empleado });
            localStorage.setItem("empleadosSeleccionados", JSON.stringify(empleadosActuales));
            setMensaje("✅ Empleado agregado a la selección");
        }

        setTimeout(() => {
            setMensaje("");
        }, 1500);
    };

    return (
        <div className="servicio">
            {mensaje && <div className="toast">{mensaje}</div>}
            <header>
                <h1>Bienvenido al Sistema de Empleados</h1>
                <p>Gestiona y selecciona a los mejores empleados</p>
            </header>

            <section>
                <h2>Empleados disponibles</h2>
                <div className="empleados">
                    {empleados.map((empleado) => (
                        <div className="empleado" key={empleado.ID_Empleado}>
                            <img src={empleado.URL || 'default-avatar.jpg'} alt={empleado.Nombre_Empleado} />
                            <h3>{empleado.Nombre_Empleado}</h3>
                            <p>Número de celular: {empleado.NumCelular}</p>
                            
                        </div>
                    ))}
                </div>
            </section>

            <footer>
                <button className="administrar-btn" onClick={() => navigate("/login")}> 
                    Administrar
                </button>
            </footer>
        </div>
    );
};

export default Servicio;
