import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './servicio.css';

const Servicio = () => {
    const navigate = useNavigate();
    const [empleados, setEmpleados] = useState([]);
    const [proyectos, setProyectos] = useState([]);
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        const fetchDatos = async () => {
            try {
                const [empleadosRes, proyectosRes] = await Promise.all([
                    fetch("http://localhost:3001/empleado"),
                    fetch("http://localhost:3001/proyecto")
                ]);
                const empleadosData = await empleadosRes.json();
                const proyectosData = await proyectosRes.json();

                setEmpleados(empleadosData);
                setProyectos(proyectosData);
            } catch (error) {
                console.error("Error al obtener datos:", error);
            }
        };

        fetchDatos();
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

        setTimeout(() => setMensaje(""), 1500);
    };

    return (
        <div className="servicio">
            {mensaje && <div className="toast">{mensaje}</div>}

            <header>
                <h1>Bienvenido al Sistema de Empleados</h1>
            </header>

            <section>
                <h2>Empleados disponibles</h2>
                <div className="empleados">
                    {empleados.map((empleado) => (
                        <div
                            className="empleado"
                            key={empleado.ID_Empleado}
                            onClick={() => manejarEmpleadoSeleccionado(empleado)}
                        >
                            <img src={empleado.URL || 'default-avatar.jpg'} alt={empleado.Nombre_Empleado} />
                            <h3>{empleado.Nombre_Empleado}</h3>
                            <p>Celular: {empleado.NumCelular}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <h2>Proyectos Asignados</h2>
                <div className="proyectos">
                    {proyectos.map((proyecto) => (
                        <div className="proyecto" key={proyecto.ID_Proyectos}>
                            <h3>Lugar: {proyecto.Lugar}</h3>
                            <p>Empleado asignado: {proyecto.Empleado?.Nombre_Empleado || "No disponible"}</p>
                            {proyecto.URL && <img src={proyecto.URL} alt="Imagen del proyecto" />}
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
