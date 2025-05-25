import { useEffect, useState } from 'react'
import useAdministradorStore from '../../store/AdministradorStore'
import styles from './Administrador.module.css'

const Administrador = () => {
  const { addAdministrador, fetchAdministrador, administradors, deleteAdministrador, updateAdministrador } = useAdministradorStore()
  const [editingAdministrador, setEditingAdministrador] = useState(null)
  const [administradorData, setAdministradorData] = useState({ Nombre_Administrador: "", Usuario: "", Contrasena: "" })
  const [formData, setFormData] = useState({ Nombre_Administrador: "", Usuario: "", Contrasena: "" })

  useEffect(() => {
    fetchAdministrador()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setAdministradorData({
      ...administradorData,
      [name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    addAdministrador(administradorData)
    setAdministradorData({ Nombre_Administrador: "", Usuario: "", Contrasena: "" })
    alert("Se agregó al administrador")
  }

  const handleDelete = (ID_Administrador) => {
    if (window.confirm("¿Está seguro de eliminar este administrador?")) {
      deleteAdministrador(ID_Administrador)
      fetchAdministrador()
    }
  }

  const handleEditClick = (administrador) => {
    setEditingAdministrador(administrador)
    setFormData({ Nombre_Administrador: administrador.Nombre_Administrador, Usuario: administrador.Usuario, Contrasena: administrador.Contrasena })
  }

  const handleInputChangeUpdate = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleUpdate = async () => {
    updateAdministrador(editingAdministrador.ID_Administrador, formData)
    fetchAdministrador()
    setEditingAdministrador(null)
  }

  const handleCancelEdit = () => {
    setEditingAdministrador(null)
  }

  return (
    <div className={styles.container}>
      <section className={styles.formSection}>
        <h1 className={styles.title}>Agregar Administradores</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            placeholder="Nombre del administrador"
            required
            name="Nombre_Administrador"
            value={administradorData.Nombre_Administrador}
            onChange={handleInputChange}
            className={styles.input}
          />
          <input
            type="text"
            placeholder="Usuario"
            required
            name="Usuario"
            value={administradorData.Usuario}
            onChange={handleInputChange}
            className={styles.input}
          />
          <input
            type="password"
            placeholder="Contraseña"
            required
            name="Contrasena"
            value={administradorData.Contrasena}
            onChange={handleInputChange}
            className={styles.input}
          />
          <button type="submit" className={styles.button}>Guardar Datos</button>
        </form>
      </section>

      <section className={styles.listSection}>
        <h1 className={styles.title}>Lista de Administradores</h1>
        <div className={styles.list}>
          {administradors.map((user) => (
            <div key={user.ID_Administrador} className={styles.listItem}>
              <p><strong>Nombre:</strong> {user.Nombre_Administrador}</p>
              <p><strong>Usuario:</strong> {user.Usuario}</p>
              <p><strong>Contraseña:</strong> {user.Contrasena}</p>
              <div className={styles.buttonsGroup}>
                <button onClick={() => handleDelete(user.ID_Administrador)} className={styles.deleteBtn} title="Eliminar administrador">❌</button>
                <button onClick={() => handleEditClick(user)} className={styles.editBtn} title="Editar administrador">✍️</button>
              </div>
            </div>
          ))}
        </div>

        {editingAdministrador && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalWindow}>
              <button className={styles.modalClose} onClick={handleCancelEdit} aria-label="Cerrar ventana">&times;</button>
              <h3 className={styles.modalTitle}>Editar Administrador</h3>
              <input
                type="text"
                name="Nombre_Administrador"
                value={formData.Nombre_Administrador}
                onChange={handleInputChangeUpdate}
                placeholder="Nombre del administrador"
                className={styles.input}
              />
              <input
                type="text"
                name="Usuario"
                value={formData.Usuario}
                onChange={handleInputChangeUpdate}
                placeholder="Usuario"
                className={styles.input}
              />
              <input
                type="password"
                name="Contrasena"
                value={formData.Contrasena}
                onChange={handleInputChangeUpdate}
                placeholder="Contraseña"
                className={styles.input}
              />
              <div className={styles.modalButtons}>
                <button onClick={handleUpdate} className={styles.button}>Guardar</button>
                <button onClick={handleCancelEdit} className={styles.cancelBtn}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

export default Administrador

