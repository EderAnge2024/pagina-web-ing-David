import { useEffect, useState, useCallback } from 'react';
import useProyectoStore from '../../store/proyectostore';
import useEmpleadoStore from '../../store/EmpleadoStore';
import styles from './Proyecto.module.css';

const Proyecto = () => {
  const { 
    addProyecto, 
    fetchProyecto, 
    proyectos, 
    deleteProyecto, 
    updateProyecto 
  } = useProyectoStore();
  
  const { empleados, fetchEmpleado } = useEmpleadoStore();
  const [editingProyecto, setEditingProyecto] = useState(null);
  const [proyectoData, setProyectoData] = useState({
    ID_Empleados: "",
    Lugar: "",
    URL: ""
  });
  const [formData, setFormData] = useState({
    ID_Empleados: "",
    Lugar: "",
    URL: ""
  });

  // Memoized fetch function to prevent unnecessary recreations
  const fetchData = useCallback(async () => {
    await Promise.all([fetchProyecto(), fetchEmpleado()]);
  }, [fetchProyecto, fetchEmpleado]);

  useEffect(() => { 
    fetchData();
  }, [fetchData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProyectoData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addProyecto(proyectoData);
      setProyectoData({ ID_Empleados: "", Lugar: "", URL: "" });
      await fetchProyecto(); // Refresh the list after adding
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  const handleDelete = async (ID_Proyectos) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este proyecto?")) {
      try {
        await deleteProyecto(ID_Proyectos);
        await fetchProyecto();
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  const handleEditClick = (proyecto) => {
    setEditingProyecto(proyecto);
    setFormData({
      ID_Empleados: proyecto.ID_Empleados,
      Lugar: proyecto.Lugar,
      URL: proyecto.URL
    });
  };

  const handleInputChangeUpdate = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleUpdate = async () => {
    try {
      await updateProyecto(editingProyecto.ID_Proyectos, formData);
      await fetchProyecto();
      setEditingProyecto(null);
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingProyecto(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.formSection}>
        <h1 className={styles.title}>Agregar proyectos</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <select
            name="ID_Empleados"
            value={proyectoData.ID_Empleados}
            onChange={handleInputChange}
            required
            className={styles.form__select}
          >
            <option value="">-- Seleccionar empleado --</option>
            {empleados.map((empleado) => (
              <option key={empleado.ID_Empleado} value={empleado.ID_Empleado}>
                {empleado.Nombre_Empleado}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Ingrese lugar"
            required
            name="Lugar"
            value={proyectoData.Lugar}
            onChange={handleInputChange}
            className={styles.form__input}
          />
          <input
            type="text"
            placeholder="Ingrese URL"
            required
            name="URL"
            value={proyectoData.URL}
            onChange={handleInputChange}
            className={styles.form__input}
          />
          <button type="submit" className={styles.form__button}>
            Guardar Datos
          </button>
        </form>
      </div>

      <div className={styles.listSection}>
        <h1 className={styles.title}>Lista de Proyectos</h1>
        <div className={styles.projectsGrid}>
          {proyectos.map((proyecto) => (
            <div key={proyecto.ID_Proyectos} className={styles.projectCard}>
              <p><strong>Empleado:</strong> {
                empleados.find(e => e.ID_Empleado === proyecto.ID_Empleados)?.Nombre_Empleado || 'N/A'
              }</p>
              <p><strong>Lugar:</strong> {proyecto.Lugar}</p>
              <p><strong>Ruta:</strong> {proyecto.URL}</p>
              <div className={styles.projectCard__actions}>
                <button 
                  onClick={() => handleEditClick(proyecto)}
                  className={styles.projectCard__button}
                >
                  Editar
                </button>
                <button 
                  onClick={() => handleDelete(proyecto.ID_Proyectos)}
                  className={`${styles.projectCard__button} ${styles['projectCard__button--delete']}`}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editingProyecto && (
        <div className={styles.modal}>
          <div className={styles.modal__content}>
            <span 
              className={styles.modal__close}
              onClick={handleCancelEdit}
            >
              &times;
            </span>
            <h3 className={styles.modal__title}>Editar proyecto</h3>
            <select
              name="ID_Empleados"
              value={formData.ID_Empleados}
              onChange={handleInputChangeUpdate}
              className={styles.modal__input}
              required
            >
              <option value="">-- Seleccionar empleado --</option>
              {empleados.map((empleado) => (
                <option key={empleado.ID_Empleado} value={empleado.ID_Empleado}>
                  {empleado.Nombre_Empleado}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="Lugar"
              value={formData.Lugar}
              onChange={handleInputChangeUpdate}
              placeholder="Lugar o ruta"
              className={styles.modal__input}
              required
            />
            <input
              type="text"
              name="URL"
              value={formData.URL}
              onChange={handleInputChangeUpdate}
              placeholder="URL"
              className={styles.modal__input}
              required
            />
            <div className={styles.modal__buttons}>
              <button 
                onClick={handleUpdate}
                className={styles.modal__button}
              >
                Guardar
              </button>
              <button 
                onClick={handleCancelEdit}
                className={`${styles.modal__button} ${styles['modal__button--cancel']}`}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Proyecto;