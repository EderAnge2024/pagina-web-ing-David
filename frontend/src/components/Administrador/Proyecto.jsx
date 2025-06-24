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

  // Estados para manejo de imágenes
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [editingFiles, setEditingFiles] = useState([]);
  const [editingPreviews, setEditingPreviews] = useState([]);

  // Configuración de Cloudinary
  const CLOUDINARY_UPLOAD_PRESET = 'bradatec';
  const CLOUDINARY_CLOUD_NAME = 'davbpytad';

  // Memoized fetch function to prevent unnecessary recreations
  const fetchData = useCallback(async () => {
    await Promise.all([fetchProyecto(), fetchEmpleado()]);
  }, [fetchProyecto, fetchEmpleado]);

  useEffect(() => { 
    fetchData();
  }, [fetchData]);

  // Función para subir imagen a Cloudinary
  const uploadToCloudinary = async (file) => {
    setUploadProgress(0);
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

  // Manejar selección de archivo (solo uno para que vaya al campo URL)
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Solo tomar el primer archivo
      const file = files[0];
      setSelectedFiles([file]);
      
      // Limpiar URL manual cuando se selecciona archivo
      setProyectoData(prev => ({
        ...prev,
        URL: ""
      }));
      
      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrls([e.target.result]);
      };
      reader.readAsDataURL(file);
    }
  };

  // Manejar selección de archivo para edición
  const handleEditFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const file = files[0];
      setEditingFiles([file]);
      
      // Limpiar URL cuando se selecciona archivo en edición
      setFormData(prev => ({
        ...prev,
        URL: ""
      }));
      
      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditingPreviews([e.target.result]);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remover archivo seleccionado
  const removeSelectedFile = () => {
    setSelectedFiles([]);
    setPreviewUrls([]);
  };

  // Remover archivo de edición
  const removeEditingFile = () => {
    setEditingFiles([]);
    setEditingPreviews([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Si cambiamos la URL, limpiar archivos seleccionados
    if (name === 'URL' && value.trim() !== '') {
      setSelectedFiles([]);
      setPreviewUrls([]);
      // Limpiar input file
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";
    }
    
    setProyectoData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      let finalProyectoData = { ...proyectoData };
      
      // Si hay archivo seleccionado, subirlo y usar su URL
      if (selectedFiles.length > 0) {
        const uploadedUrl = await uploadToCloudinary(selectedFiles[0]);
        finalProyectoData.URL = uploadedUrl;
      }
      
      await addProyecto(finalProyectoData);
      
      // Limpiar formulario
      setProyectoData({ 
        ID_Empleados: "", 
        Lugar: "", 
        URL: ""
      });
      setSelectedFiles([]);
      setPreviewUrls([]);
      
      // Limpiar input file
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";
      
      await fetchProyecto();
    } catch (error) {
      console.error("Error adding project:", error);
      alert('Error al crear el proyecto. Verifica tu configuración de Cloudinary.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
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
    setEditingFiles([]);
    setEditingPreviews([]);
  };

  const handleInputChangeUpdate = (e) => {
    const { name, value } = e.target;
    
    // Si cambiamos la URL en edición, limpiar archivos seleccionados
    if (name === 'URL' && value.trim() !== '') {
      setEditingFiles([]);
      setEditingPreviews([]);
      // Limpiar input file de edición
      const fileInput = document.querySelector('.modal input[type="file"]');
      if (fileInput) fileInput.value = "";
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async () => {
    setUploading(true);
    
    try {
      let finalFormData = { ...formData };
      
      // Si hay nuevo archivo, subirlo a Cloudinary y usar su URL
      if (editingFiles.length > 0) {
        const uploadedUrl = await uploadToCloudinary(editingFiles[0]);
        finalFormData.URL = uploadedUrl;
      }
      
      await updateProyecto(editingProyecto.ID_Proyectos, finalFormData);
      await fetchProyecto();
      setEditingProyecto(null);
      setEditingFiles([]);
      setEditingPreviews([]);
    } catch (error) {
      console.error("Error updating project:", error);
      alert('Error al actualizar el proyecto.');
    } finally {
      setUploading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingProyecto(null);
    setEditingFiles([]);
    setEditingPreviews([]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.formSection}>
        <h1 className={styles.title}>Agregar proyectos</h1>
        
        {/* Mensaje de configuración */}
        <div className={styles.configAlert}>
          <p><strong>⚠️ Configuración:</strong> Cloudinary configurado para subida de imágenes</p>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <select
            name="ID_Empleados"
            value={proyectoData.ID_Empleados}
            onChange={handleInputChange}
            required
            className={styles.form__select}
            disabled={uploading}
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
            disabled={uploading}
          />
          
          <input
            type="text"
            placeholder="Ingrese URL del proyecto (o sube una imagen abajo)"
            required
            name="URL"
            value={proyectoData.URL}
            onChange={handleInputChange}
            className={styles.form__input}
            disabled={uploading || selectedFiles.length > 0}
            title={selectedFiles.length > 0 ? "Deshabilitado porque hay una imagen seleccionada" : ""}
          />

          {/* Sección de subida de imagen */}
          <div className={styles.imageUploadSection}>
            <label className={styles.fileLabel}>
              📸 O sube una imagen del proyecto
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className={styles.fileInput}
              disabled={uploading || proyectoData.URL.trim() !== ''}
              title={proyectoData.URL.trim() !== '' ? "Deshabilitado porque hay una URL ingresada" : ""}
            />
            <p className={styles.fileHint}>
              Puedes ingresar una URL O subir una imagen, no ambas. La imagen se guardará como URL en la base de datos.
            </p>
          </div>

          {/* Preview de imagen seleccionada */}
          {previewUrls.length > 0 && (
            <div className={styles.previewContainer}>
              <label>Vista previa de la imagen:</label>
              <div className={styles.previewGrid}>
                <div className={styles.previewItem}>
                  <img 
                    src={previewUrls[0]} 
                    alt="Preview" 
                    className={styles.previewImage}
                  />
                  <button 
                    type="button"
                    onClick={removeSelectedFile}
                    className={styles.removeBtn}
                    disabled={uploading}
                  >
                    ❌
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Progress bar durante upload */}
          {uploading && (
            <div className={styles.uploadProgress}>
              <p>Procesando proyecto y subiendo imagen...</p>
              <div className={styles.progressBar}>
                <div className={styles.progressFill}></div>
              </div>
            </div>
          )}
          
          <button 
            type="submit" 
            className={styles.form__button}
            disabled={uploading}
          >
            {uploading ? 'Guardando...' : 'Guardar Proyecto'}
          </button>
        </form>
      </div>

      <div className={styles.listSection}>
        <h1 className={styles.title}>Lista de Proyectos</h1>
        <div className={styles.projectsGrid}>
          {proyectos.map((proyecto) => (
            <div key={proyecto.ID_Proyectos} className={styles.projectCard}>
              <div className={styles.projectInfo}>
                <p><strong>Empleado:</strong> {
                  empleados.find(e => e.ID_Empleado === proyecto.ID_Empleados)?.Nombre_Empleado || 'N/A'
                }</p>
                <p><strong>Lugar:</strong> {proyecto.Lugar}</p>
                <p><strong>URL:</strong> 
                  <a href={proyecto.URL} target="_blank" rel="noopener noreferrer" className={styles.projectLink}>
                    {proyecto.URL}
                  </a>
                </p>
              </div>

              {/* Mostrar imagen del proyecto si la URL es una imagen */}
              {proyecto.URL && (
                <div className={styles.projectImage}>
                  <img 
                    src={proyecto.URL} 
                    alt={`Proyecto ${proyecto.ID_Proyectos}`}
                    className={styles.projectImg}
                    onError={(e) => {
                      // Si falla cargar como imagen, ocultar el elemento
                      e.target.style.display = 'none';
                    }}
                    onLoad={(e) => {
                      // Si carga correctamente, mostrar
                      e.target.style.display = 'block';
                    }}
                  />
                </div>
              )}

              <div className={styles.projectCard__actions}>
                <button 
                  onClick={() => handleEditClick(proyecto)}
                  className={styles.projectCard__button}
                  disabled={uploading}
                >
                  Editar
                </button>
                <button 
                  onClick={() => handleDelete(proyecto.ID_Proyectos)}
                  className={`${styles.projectCard__button} ${styles['projectCard__button--delete']}`}
                  disabled={uploading}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de edición */}
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
              disabled={uploading}
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
              placeholder="Lugar"
              className={styles.modal__input}
              required
              disabled={uploading}
            />
            
            <input
              type="text"
              name="URL"
              value={formData.URL}
              onChange={handleInputChangeUpdate}
              placeholder="URL del proyecto (o sube una imagen abajo)"
              className={styles.modal__input}
              required
              disabled={uploading || editingFiles.length > 0}
              title={editingFiles.length > 0 ? "Deshabilitado porque hay una imagen seleccionada" : ""}
            />

            {/* Imagen actual del proyecto */}
            {formData.URL && (
              <div className={styles.currentImageSection}>
                <label>Imagen actual:</label>
                <div className={styles.currentImageContainer}>
                  <img 
                    src={formData.URL} 
                    alt="Imagen actual"
                    className={styles.currentImage}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}

            {/* Subir nueva imagen */}
            <div className={styles.newImageSection}>
              <label>O cambiar por nueva imagen:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleEditFileSelect}
                className={styles.fileInput}
                disabled={uploading || formData.URL.trim() !== ''}
                title={formData.URL.trim() !== '' ? "Limpie la URL primero para subir una nueva imagen" : ""}
              />
              <p className={styles.fileHint}>
                Limpie la URL arriba si quiere subir una nueva imagen
              </p>
            </div>

            {/* Preview de nueva imagen */}
            {editingPreviews.length > 0 && (
              <div className={styles.newPreviewContainer}>
                <label>Nueva imagen:</label>
                <div className={styles.previewGrid}>
                  <div className={styles.previewItem}>
                    <img 
                      src={editingPreviews[0]} 
                      alt="Nueva imagen" 
                      className={styles.previewImage}
                    />
                    <button 
                      type="button"
                      onClick={removeEditingFile}
                      className={styles.removeBtn}
                      disabled={uploading}
                    >
                      ❌
                    </button>
                  </div>
                </div>
              </div>
            )}

            {uploading && (
              <div className={styles.uploadProgress}>
                <p>Actualizando proyecto...</p>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill}></div>
                </div>
              </div>
            )}
            
            <div className={styles.modal__buttons}>
              <button 
                onClick={handleUpdate}
                className={styles.modal__button}
                disabled={uploading}
              >
                {uploading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
              <button 
                onClick={handleCancelEdit}
                className={`${styles.modal__button} ${styles['modal__button--cancel']}`}
                disabled={uploading}
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