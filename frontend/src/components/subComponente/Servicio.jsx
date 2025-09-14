import { useState, useEffect } from "react";
import styles from './Servicio.module.css';
import useEmpleadoStore from "../../store/EmpleadoStore";
import useProyectoStore from "../../store/proyectostore";

const Servicio = () => {
    const { empleados, fetchEmpleado } = useEmpleadoStore();
    const { proyectos, fetchProyecto } = useProyectoStore();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);
    
    useEffect(() => {
        fetchProyecto();
        fetchEmpleado();
        const interval = setInterval(fetchEmpleado, 10000); // cada 10 segundos
        return () => clearInterval(interval);
    }, [fetchProyecto, fetchEmpleado]);

    const obtenerNombreEmpleado = (idEmpleado) => {
        const empleado = empleados.find(emp => emp.ID_Empleado === idEmpleado);
        return empleado ? empleado.Nombre_Empleado : 'Empleado no encontrado';
    };

    return (
        <div className={styles.servicio}>
            <section className={styles.servicio__seccion}>
                <h3 className={styles.servicio__titulo}>Empleados ✨</h3>
                <div className={styles.servicio__contenedor}>
                    <div className={styles.servicio__lista}>
                        {empleados.map((empleado) => (
                            <div key={empleado.ID_Empleado} className={styles.empleado}>
                                <img 
                                    className={styles.empleado__imagen}
                                    src={empleado.URL} 
                                    alt={empleado.Nombre_Empleado} 
                                    width="150" 
                                    height="150" 
                                />
                                <p className={styles.empleado__texto}>
                                    Empleado: {empleado.Nombre_Empleado}
                                </p>
                                <p className={styles.empleado__texto}>
                                    Numero Cel: {empleado.NumCelular}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className={styles.servicio__seccion}>
                <h3 className={styles.servicio__titulo}>Proyectos</h3>
                <div className={styles.servicio__contenedor}>
                    <div className={styles.servicio__lista}>
                        {proyectos.map((proyecto) => (
                            <div key={proyecto.ID_Proyecto} className={styles.proyecto}>
                                <img 
                                    className={styles.proyecto__imagen}
                                    src={proyecto.URL} 
                                    alt={proyecto.Lugar} 
                                    width="150" 
                                    height="150" 
                                />
                                <p className={styles.proyecto__texto}>
                                    Lugar: {proyecto.Lugar}
                                </p>
                                <p className={styles.proyecto__texto}>
                                    Numero Cel: {obtenerNombreEmpleado(proyecto.NumCelular)}
                                </p>
                                <p className={styles.proyecto__texto}>
                                    Empleado: {obtenerNombreEmpleado(proyecto.ID_Empleados)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Servicio;