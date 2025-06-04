import { useEffect, useState } from 'react';
import useEstadoPedidoStore from '../../store/EstadoPedidoStore';
import styles from './EstadoPedido.module.css';

const EstadoPedidoForm = () => {
  const {
    addEstadoPedido,
    fetchEstadoPedido,
    estadoPedidos,
    deleteEstadoPedido,
    updateEstadoPedido
  } = useEstadoPedidoStore();
  
  const [editingEstadoPedido, setEditingEstadoPedido] = useState(null);
  const [estadoPedidoData, setEstadoPedidoData] = useState({ Estado: "" });
  const [formData, setFormData] = useState({ Estado: "" });

  useEffect(() => {
    fetchEstadoPedido();
  }, [fetchEstadoPedido]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEstadoPedidoData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addEstadoPedido(estadoPedidoData);
    setEstadoPedidoData({ Estado: "" });
  };

  const handleDelete = async (ID_EstadoPedido) => {
    if (window.confirm("¿Estás seguro de eliminar este estado de pedido?")) {
      await deleteEstadoPedido(ID_EstadoPedido);
      fetchEstadoPedido();
    }
  };

  const handleEditClick = (estadoPedido) => {
    setEditingEstadoPedido(estadoPedido);
    setFormData({ Estado: estadoPedido.Estado });
  };

  const handleInputChangeUpdate = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleUpdate = async () => {
    await updateEstadoPedido(editingEstadoPedido.ID_EstadoPedido, formData);
    fetchEstadoPedido();
    setEditingEstadoPedido(null);
  };

  const handleCancelEdit = () => {
    setEditingEstadoPedido(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.formSection}>
        <h1 className={styles.title}>Agregar estado de pedido</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <select
            required
            name="Estado"
            value={estadoPedidoData.Estado}
            onChange={handleInputChange}
            className={styles.select}
          >
            <option value="">Seleccione un estado</option>
            <option value="En Proceso">En Proceso</option>
            <option value="Completado">Completado</option>
            <option value="Cancelado">Cancelado</option>
            <option value="Enviado">Enviado</option>
          </select>
          <button type="submit" className={styles.button}>
            Guardar Datos
          </button>
        </form>
      </div>

      <div className={styles.listSection}>
        <h1 className={styles.title}>Lista de estados de pedido</h1>
        <div className={styles.estadoList}>
          {estadoPedidos.map((estado) => (
            <div key={estado.ID_EstadoPedido} className={styles.estadoItem}>
              <p className={styles.estadoText}>
                <strong>Estado:</strong> {estado.Estado}
              </p>
              <div className={styles.actions}>
                <button
                  onClick={() => handleDelete(estado.ID_EstadoPedido)}
                  className={`${styles.button} ${styles.buttonDanger}`}
                >
                  Eliminar
                </button>
                <button
                  onClick={() => handleEditClick(estado)}
                  className={`${styles.button} ${styles.buttonEdit}`}
                >
                  Editar
                </button>
              </div>
            </div>
          ))}
        </div>

        {editingEstadoPedido && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalWindow}>
              <span className={styles.modalClose} onClick={handleCancelEdit}>
                &times;
              </span>
              <h3 className={styles.modalTitle}>Editar estado de pedido</h3>
              <select
                name="Estado"
                value={formData.Estado}
                onChange={handleInputChangeUpdate}
                className={styles.select}
              >
                <option value="En Proceso">En Proceso</option>
                <option value="Completado">Completado</option>
                <option value="Cancelado">Cancelado</option>
                <option value="Enviado">Enviado</option>
              </select>
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

export default EstadoPedidoForm;