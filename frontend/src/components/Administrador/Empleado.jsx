import { useEffect, useState } from 'react';
import useEmpleadoStore from '../../store/EmpleadoStore';
import styles from './Empleado.module.css';

const Empleado = () => {
  const { addEmpleado, fetchEmpleado, empleados, deleteEmpleado, updateEmpleado } = useEmpleadoStore();
  const [editingEmpleado, setEditingEmpleado] = useState(null);
  const [empleadoData, setEmpleadoData] = useState({ 
    Nombre_Empleado: "", 
    NumCelular: "", 
    URL: "" 
  });
  const [formData, setFormData] = useState({ 
    Nombre_Empleado: "", 
    NumCelular: "", 
    URL: "" 
  });

  useEffect(() => {
    fetchEmpleado();
  }, [fetchEmpleado]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmpleadoData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addEmpleado(empleadoData);
    setEmpleadoData({ 
      Nombre_Empleado: "", 
      NumCelular: "", 
      URL: "" 
    });
  };

  const handleDelete = async (ID_Empleado) => {
    if (window.confirm("¿Estás seguro de eliminar este empleado?")) {
      await deleteEmpleado(ID_Empleado);
      fetchEmpleado();
    }
  };

  const handleEditClick = (empleado) => {
    setEditingEmpleado(empleado);
    setFormData({ 
      Nombre_Empleado: empleado.Nombre_Empleado, 
      NumCelular: empleado.NumCelular, 
      URL: empleado.URL 
    });
  };

  const handleInputChangeUpdate = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleUpdate = async () => {
    await updateEmpleado(editingEmpleado.ID_Empleado, formData);
    fetchEmpleado();
    setEditingEmpleado(null);
  };

  const handleCancelEdit = () => {
    setEditingEmpleado(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.formSection}>
        <h1 className={styles.title}>Agregar empleados</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            placeholder="Nombre del empleado"
            required
            name="Nombre_Empleado"
            value={empleadoData.Nombre_Empleado}
            onChange={handleInputChange}
            className={styles.input}
          />
          <input
            type="text"
            placeholder="Número de celular"
            required
            name="NumCelular"
            value={empleadoData.NumCelular}
            onChange={handleInputChange}
            className={styles.input}
          />
          <input
            type="text"
            placeholder="URL de imagen"
            required
            name="URL"
            value={empleadoData.URL}
            onChange={handleInputChange}
            className={styles.input}
          />
          <button type="submit" className={styles.button}>
            Guardar Datos
          </button>
        </form>
      </div>

      <div className={styles.listSection}>
        <h1 className={styles.title}>Lista de empleados</h1>
        <div className={styles.empleadoList}>
          {empleados.map((empleado) => (
            <div key={empleado.ID_Empleado} className={styles.empleadoItem}>
              <p className={styles.empleadoText}>
                <strong>Nombre:</strong> {empleado.Nombre_Empleado}
              </p>
              <p className={styles.empleadoText}>
                <strong>Teléfono:</strong> {empleado.NumCelular}
              </p>
              <p className={styles.empleadoText}>
                <strong>Imagen:</strong> 
                {empleado.URL && (
                  <a href={empleado.URL} target="_blank" rel="noopener noreferrer" className={styles.link}>
                    Ver imagen
                  </a>
                )}
              </p>
              <div className={styles.actions}>
                <button
                  onClick={() => handleDelete(empleado.ID_Empleado)}
                  className={`${styles.button} ${styles.buttonDanger}`}
                >
                  Eliminar
                </button>
                <button
                  onClick={() => handleEditClick(empleado)}
                  className={`${styles.button} ${styles.buttonEdit}`}
                >
                  Editar
                </button>
              </div>
            </div>
          ))}
        </div>

        {editingEmpleado && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalWindow}>
              <span className={styles.modalClose} onClick={handleCancelEdit}>
                &times;
              </span>
              <h3 className={styles.modalTitle}>Editar empleado</h3>
              <input
                type="text"
                name="Nombre_Empleado"
                value={formData.Nombre_Empleado}
                onChange={handleInputChangeUpdate}
                placeholder="Nombre del empleado"
                className={styles.input}
              />
              <input
                type="text"
                name="NumCelular"
                value={formData.NumCelular}
                onChange={handleInputChangeUpdate}
                placeholder="Número de celular"
                className={styles.input}
              />
              <input
                type="text"
                name="URL"
                value={formData.URL}
                onChange={handleInputChangeUpdate}
                placeholder="URL de imagen"
                className={styles.input}
              />
              <div className={styles.modalActions}>
                <button onClick={handleUpdate} className={styles.button}>
                  Guardar
                </button>
                <button
                  onClick={handleCancelEdit}
                  className={`${styles.button} ${styles.buttonSecondary}`}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Empleado;