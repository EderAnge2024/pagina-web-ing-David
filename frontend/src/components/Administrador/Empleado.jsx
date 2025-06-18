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

  // Estados para manejo de archivos
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [editingFile, setEditingFile] = useState(null);
  const [editingPreview, setEditingPreview] = useState("");

  // Configuración de Cloudinary - Reemplaza con tus credenciales
  const CLOUDINARY_UPLOAD_PRESET = 'bradatec'; // Reemplaza con tu upload preset
  const CLOUDINARY_CLOUD_NAME = 'davbpytad'; // Reemplaza con tu cloud name

  useEffect(() => {
    fetchEmpleado();
  }, [fetchEmpleado]);

  // Manejar selección de archivo para nuevo empleado
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Crear preview local
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Manejar selección de archivo para edición
  const handleEditFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditingFile(file);
      // Crear preview local
      const reader = new FileReader();
      reader.onload = (e) => setEditingPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Subir imagen a Cloudinary
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      
      if (!response.ok) {
        throw new Error('Error al subir imagen a Cloudinary');
      }
      
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Error en upload:', error);
      throw error;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmpleadoData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      let finalEmpleadoData = { ...empleadoData };
      
      // Si hay un archivo seleccionado, subirlo a Cloudinary
      if (selectedFile) {
        const uploadedUrl = await uploadToCloudinary(selectedFile);
        finalEmpleadoData.URL = uploadedUrl;
      }
      
      await addEmpleado(finalEmpleadoData);
      
      // Limpiar formulario
      setEmpleadoData({ 
        Nombre_Empleado: "", 
        NumCelular: "", 
        URL: "" 
      });
      setSelectedFile(null);
      setPreviewUrl("");
      
      // Limpiar input file
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";
      
    } catch (error) {
      console.error('Error al agregar empleado:', error);
      alert('Error al subir la imagen. Por favor, verifica tu configuración de Cloudinary.');
    } finally {
      setUploading(false);
    }
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
    setEditingFile(null);
    setEditingPreview("");
  };

  const handleInputChangeUpdate = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleUpdate = async () => {
    setUploading(true);
    
    try {
      let finalFormData = { ...formData };
      
      // Si hay un nuevo archivo, subirlo a Cloudinary
      if (editingFile) {
        const uploadedUrl = await uploadToCloudinary(editingFile);
        finalFormData.URL = uploadedUrl;
      }
      
      await updateEmpleado(editingEmpleado.ID_Empleado, finalFormData);
      fetchEmpleado();
      setEditingEmpleado(null);
      setEditingFile(null);
      setEditingPreview("");
    } catch (error) {
      console.error('Error al actualizar empleado:', error);
      alert('Error al actualizar la imagen del empleado.');
    } finally {
      setUploading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingEmpleado(null);
    setEditingFile(null);
    setEditingPreview("");
  };

  // Función para remover archivo seleccionado
  const removeSelectedFile = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = "";
  };

  // Función para remover archivo de edición
  const removeEditingFile = () => {
    setEditingFile(null);
    setEditingPreview("");
  };

  return (
    <div className={styles.container}>
      <div className={styles.formSection}>
        <h1 className={styles.title}>Agregar empleados</h1>
        
        {/* Mensaje de configuración */}
        <div className={styles.configAlert}>
          <p><strong>⚠️ Configuración necesaria:</strong></p>
          <p>Asegúrate de configurar tu CLOUDINARY_CLOUD_NAME y CLOUDINARY_UPLOAD_PRESET en el componente.</p>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            placeholder="Nombre del empleado"
            required
            name="Nombre_Empleado"
            value={empleadoData.Nombre_Empleado}
            onChange={handleInputChange}
            className={styles.input}
            disabled={uploading}
          />
          <input
            type="text"
            placeholder="Número de celular"
            required
            name="NumCelular"
            value={empleadoData.NumCelular}
            onChange={handleInputChange}
            className={styles.input}
            disabled={uploading}
          />

          {/* Sección de subida de archivo */}
          <div className={styles.fileUploadSection}>
            <label className={styles.fileLabel}>Foto del empleado</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className={styles.fileInput}
              disabled={uploading}
            />
            <p className={styles.fileHint}>
              Selecciona una imagen (JPG, PNG, GIF, etc.)
            </p>
          </div>

          {/* Preview de imagen seleccionada */}
          {previewUrl && (
            <div className={styles.previewContainer}>
              <label>Vista previa:</label>
              <div className={styles.imagePreviewWrapper}>
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className={styles.imagePreview}
                />
                <button 
                  type="button"
                  onClick={removeSelectedFile}
                  className={styles.removePreviewBtn}
                  disabled={uploading}
                >
                  ❌
                </button>
              </div>
            </div>
          )}

          {/* Separador O */}
          <div className={styles.separator}>
            <span>O</span>
          </div>

          {/* URL manual como alternativa */}
          <input
            type="url"
            placeholder="URL de imagen (opcional)"
            name="URL"
            value={empleadoData.URL}
            onChange={handleInputChange}
            className={styles.input}
            disabled={uploading || selectedFile !== null}
          />
          <p className={styles.urlHint}>
            Solo se usará si no has seleccionado un archivo
          </p>

          {/* Progress bar durante upload */}
          {uploading && (
            <div className={styles.uploadProgress}>
              <p>Subiendo datos del empleado...</p>
              <div className={styles.progressBar}>
                <div className={styles.progressFill}></div>
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className={styles.button}
            disabled={uploading || (!selectedFile && !empleadoData.URL)}
          >
            {uploading ? 'Guardando...' : 'Guardar Datos'}
          </button>
        </form>
      </div>

      <div className={styles.listSection}>
        <h1 className={styles.title}>Lista de empleados</h1>
        <div className={styles.empleadoList}>
          {empleados.map((empleado) => (
            <div key={empleado.ID_Empleado} className={styles.empleadoItem}>
              {/* Mostrar imagen del empleado si existe */}
              {empleado.URL && (
                <div className={styles.empleadoImageContainer}>
                  <img 
                    src={empleado.URL} 
                    alt={empleado.Nombre_Empleado}
                    className={styles.empleadoImage}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              <div className={styles.empleadoInfo}>
                <p className={styles.empleadoText}>
                  <strong>Nombre:</strong> {empleado.Nombre_Empleado}
                </p>
                <p className={styles.empleadoText}>
                  <strong>Teléfono:</strong> {empleado.NumCelular}
                </p>
                {empleado.URL && (
                  <p className={styles.empleadoText}>
                    <strong>Imagen:</strong> 
                    <a href={empleado.URL} target="_blank" rel="noopener noreferrer" className={styles.link}>
                      Ver imagen completa
                    </a>
                  </p>
                )}
              </div>
              
              <div className={styles.actions}>
                <button
                  onClick={() => handleDelete(empleado.ID_Empleado)}
                  className={`${styles.button} ${styles.buttonDanger}`}
                  disabled={uploading}
                >
                  Eliminar
                </button>
                <button
                  onClick={() => handleEditClick(empleado)}
                  className={`${styles.button} ${styles.buttonEdit}`}
                  disabled={uploading}
                >
                  Editar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal de edición mejorado */}
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
                disabled={uploading}
              />
              <input
                type="text"
                name="NumCelular"
                value={formData.NumCelular}
                onChange={handleInputChangeUpdate}
                placeholder="Número de celular"
                className={styles.input}
                disabled={uploading}
              />

              {/* Imagen actual */}
              {formData.URL && !editingPreview && (
                <div className={styles.currentImageContainer}>
                  <label>Imagen actual:</label>
                  <img 
                    src={formData.URL} 
                    alt="Imagen actual" 
                    className={styles.currentImage}
                  />
                </div>
              )}

              {/* Subir nueva imagen */}
              <div className={styles.fileUploadSection}>
                <label>Cambiar foto del empleado</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleEditFileSelect}
                  className={styles.fileInput}
                  disabled={uploading}
                />
              </div>

              {/* Preview de nueva imagen */}
              {editingPreview && (
                <div className={styles.previewContainer}>
                  <label>Nueva imagen:</label>
                  <div className={styles.imagePreviewWrapper}>
                    <img 
                      src={editingPreview} 
                      alt="Preview" 
                      className={styles.imagePreview}
                    />
                    <button 
                      type="button"
                      onClick={removeEditingFile}
                      className={styles.removePreviewBtn}
                      disabled={uploading}
                    >
                      ❌
                    </button>
                  </div>
                </div>
              )}

              {/* Separador O */}
              <div className={styles.separator}>
                <span>O</span>
              </div>

              {/* URL manual */}
              <input
                type="url"
                name="URL"
                value={formData.URL}
                onChange={handleInputChangeUpdate}
                placeholder="URL de imagen"
                className={styles.input}
                disabled={uploading || editingFile !== null}
              />

              {/* Progress bar durante upload */}
              {uploading && (
                <div className={styles.uploadProgress}>
                  <p>Actualizando empleado...</p>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill}></div>
                  </div>
                </div>
              )}

              <div className={styles.modalActions}>
                <button 
                  onClick={handleUpdate} 
                  className={styles.button}
                  disabled={uploading}
                >
                  {uploading ? 'Guardando...' : 'Guardar'}
                </button>
                <button
                  onClick={handleCancelEdit}
                  className={`${styles.button} ${styles.buttonSecondary}`}
                  disabled={uploading}
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