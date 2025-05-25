import { useEffect, useState } from 'react';
import useImagenStore from '../../store/ImagenStore';
import styles from './imgFrom.module.css';

const ImagenFrom = () => {
  const { addImagen, fetchImagen, imagens, deleteImagen, updateImagen } = useImagenStore();
  const [editingImagen, setEditingImagen] = useState(null);
  const [imagenData, setImagenData] = useState({ Tipo_Imagen: '', URL: '' });
  const [formData, setFormData] = useState({ Tipo_Imagen: '', URL: '' });

  useEffect(() => {
    fetchImagen();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setImagenData({ ...imagenData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addImagen(imagenData);
    setImagenData({ Tipo_Imagen: '', URL: '' });
    alert("✅ Imagen guardada correctamente");
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Eliminar esta imagen?")) {
      deleteImagen(id);
      fetchImagen();
    }
  };

  const handleEditClick = (img) => {
    setEditingImagen(img);
    setFormData({ Tipo_Imagen: img.Tipo_Imagen, URL: img.URL });
  };

  const handleInputChangeUpdate = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = () => {
    updateImagen(editingImagen.ID_Imagen, formData);
    fetchImagen();
    setEditingImagen(null);
  };

  return (
    <div className={styles.container}>
      <section className={styles.formSection}>
        <h2>📁 Agregar Imagen</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <select name="Tipo_Imagen" value={imagenData.Tipo_Imagen} onChange={handleInputChange} required>
            <option value="">Seleccionar tipo de imagen</option>
            <option value="Logo">🖼️ Logo</option>
            <option value="Banner">🖼️ Banner</option>
          </select>

          <input
            type="text"
            name="URL"
            placeholder="URL de la imagen"
            value={imagenData.URL}
            onChange={handleInputChange}
            required
          />

          {imagenData.URL && (
            <div className={styles.preview}>
              <img src={imagenData.URL} alt="Vista previa" />
            </div>
          )}

          <button type="submit">Guardar</button>
        </form>
      </section>

      <section className={styles.listSection}>
        <h2>🖼️ Lista de Imágenes</h2>
        <div className={styles.cardGrid}>
          {imagens.map((img) => (
            <div className={styles.card} key={img.ID_Imagen}>
              <img src={img.URL} alt={img.Tipo_Imagen} />
              <p><strong>Tipo:</strong> {img.Tipo_Imagen}</p>
              <div className={styles.actions}>
                <button onClick={() => handleEditClick(img)}>✏️ Editar</button>
                <button onClick={() => handleDelete(img.ID_Imagen)} className={styles.delete}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {editingImagen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>✏️ Editar Imagen</h3>
            <select
              name="Tipo_Imagen"
              value={formData.Tipo_Imagen}
              onChange={handleInputChangeUpdate}
              required
            >
              <option value="">Seleccionar tipo de imagen</option>
              <option value="Logo">Logo</option>
              <option value="Banner">Banner</option>
            </select>

            <input
              type="text"
              name="URL"
              value={formData.URL}
              onChange={handleInputChangeUpdate}
              placeholder="Nueva URL"
            />

            {formData.URL && (
              <div className={styles.preview}>
                <img src={formData.URL} alt="Vista previa" />
              </div>
            )}

            <div className={styles.modalButtons}>
              <button onClick={handleUpdate}>Guardar cambios</button>
              <button onClick={() => setEditingImagen(null)} className={styles.cancel}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagenFrom;
