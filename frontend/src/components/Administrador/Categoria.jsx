import { useEffect, useState } from 'react';
import useCategoriaStore from '../../store/CategoriaStore';
import styles from './Categoria.module.css';

const CategoriaForm = () => {
  const { addCategoria, fetchCategoria, categorias, deleteCategoria, updateCategoria } = useCategoriaStore();
  const [editingCategoria, setEditingCategoria] = useState(null);
  const [categoriaData, setCategoriaData] = useState({ Tipo_Producto: "", Descripcion: "" });
  const [formData, setFormData] = useState({ Tipo_Producto: "", Descripcion: "" });

  useEffect(() => {
    fetchCategoria();
  }, [fetchCategoria]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategoriaData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addCategoria(categoriaData);
    setCategoriaData({ Tipo_Producto: "", Descripcion: "" });
  };

  const handleDelete = async (ID_Categoria) => {
    if (window.confirm("¿Estás seguro de eliminar esta categoría?")) {
      await deleteCategoria(ID_Categoria);
      fetchCategoria();
    }
  };

  const handleEditClick = (categoria) => {
    setEditingCategoria(categoria);
    setFormData({
      Tipo_Producto: categoria.Tipo_Producto,
      Descripcion: categoria.Descripcion
    });
  };

  const handleInputChangeUpdate = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleUpdate = async () => {
    await updateCategoria(editingCategoria.ID_Categoria, formData);
    fetchCategoria();
    setEditingCategoria(null);
  };

  const handleCancelEdit = () => {
    setEditingCategoria(null);
    
  };

  return (
    <div className={styles.container}>
      <div className={styles.formSection}>
        <h1 className={styles.title}>Agregar categorías</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            placeholder="Tipo de producto"
            required
            name="Tipo_Producto"
            value={categoriaData.Tipo_Producto}
            onChange={handleInputChange}
            className={styles.input}
          />
          <input
            type="text"
            placeholder="Descripción"
            required
            name="Descripcion"
            value={categoriaData.Descripcion}
            onChange={handleInputChange}
            className={styles.input}
          />
          <button type="submit" className={styles.button}>Guardar Datos</button>
        </form>
      </div>

      <div className={styles.listSection}>
        <h1 className={styles.title}>Lista de categorías</h1>
        <div className={styles.categoriaList}>
          {categorias.map((categoria) => (
            <div key={categoria.ID_Categoria} className={styles.categoriaItem}>
              <p className={styles.categoriaText}>Nombre: {categoria.Tipo_Producto}</p>
              <p className={styles.categoriaText}>Descripción: {categoria.Descripcion}</p>
              <div className={styles.actions}>
                <button 
                  onClick={() => handleDelete(categoria.ID_Categoria)}
                  className={`${styles.button} ${styles.buttonDanger}`}
                >
                  Eliminar
                </button>
                <button 
                  onClick={() => handleEditClick(categoria)}
                  className={`${styles.button} ${styles.buttonEdit}`}
                >
                  Editar
                </button>
              </div>
            </div>
          ))}
        </div>

        {editingCategoria && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalWindow}>
              <span className={styles.modalClose} onClick={handleCancelEdit}>&times;</span>
              <h3 className={styles.modalTitle}>Editar categoría</h3>
              <input
                type="text"
                name="Tipo_Producto"
                value={formData.Tipo_Producto}
                onChange={handleInputChangeUpdate}
                placeholder="Tipo de categoría"
                className={styles.input}
              />
              <input
                type="text"
                name="Descripcion"
                value={formData.Descripcion}
                onChange={handleInputChangeUpdate}
                placeholder="Descripción"
                className={styles.input}
              />
              <div className={styles.modalActions}>
                <button onClick={handleUpdate} className={styles.button}>
                  Guardar
                </button>
                <button onClick={handleCancelEdit} className={`${styles.button} ${styles.buttonSecondary}`}>
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

export default CategoriaForm;