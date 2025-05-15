
import { useState, useEffect } from "react";
import SitloServicio from './Servicio.module.css'
import useEmpleadoStore from "../../store/EmpleadoStore";
import useProyectoStore from "../../store/proyectostore";

const Servicio = () =>{
    const { empleados, fetchEmpleado } = useEmpleadoStore();
    const { proyectos, fetchProyecto} = useProyectoStore();
    useEffect(() => {
        fetchProyecto();
        fetchEmpleado(); 
        const interval = setInterval(fetchEmpleado, 10000); // cada 10 segundos
        return () => clearInterval(interval);
    }, [fetchProyecto,fetchEmpleado]);

    const obtenerNombreEmpleado = (idEmpleado) => {
    const empleado = empleados.find(emp => emp.ID_Empleado === idEmpleado);
    return empleado ? empleado.Nombre_Empleado : 'Empleado no encontrado';
};
    return (
        <div className={SitloServicio.contenidoPadre}>
            <div>
                <h3>Empleados ✨</h3>
                <div>
                    <div className={SitloServicio.datosServ}>
                        {empleados
                            .map((empleado) => (
                                <div key={empleado.ID_Empleado} className={SitloServicio.contenidoPadreEmpleado}>
                                    <img src={empleado.URL} alt={empleado.Nombre_Empleado} width="150" height="150" />
                                    <p>Empleado: {empleado.Nombre_Empleado}</p>
                                    <p>Numero Cel: {empleado.NumCelular}</p>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
            <div className={SitloServicio.contenidoServicio}>
                <h3>Proyectos</h3>
                <div className={SitloServicio.datosPoryectos}>
                    <div className={SitloServicio.datosProyec}>
                        {proyectos
                            .map((proyecto) => (
                                <div key={proyecto.ID_Proyecto} className={SitloServicio.contenidoServicoCaja}>
                                    <img src={proyecto.URL} alt={proyecto.Lugar} width="150" height="150" />
                                    <p>Lugar: {proyecto.Lugar}</p>
                                    <p>Numero Cel: {obtenerNombreEmpleado(proyecto.NumCelular)}</p>
                                    <p>Empleado: {obtenerNombreEmpleado(proyecto.ID_Empleados)}</p>
                                    </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>  
    );
};

export default Servicio