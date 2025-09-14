import { useState } from 'react'
import useAdministradorStore from '../store/AdministradorStore'
import useAuthStore from '../store/AuthStore'
import styles from './primerAdmin.module.css'

const AgregarAdministradorPrimer = () => {
  const { addAdministrador } = useAdministradorStore()
  const { logout } = useAuthStore()

  const [administradorData, setAdministradorData] = useState({
    Nombre_Administrador: '',
    Usuario: '',
    Contrasena: '',
    NumAdministrador:'',
    Email:''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setAdministradorData({
      ...administradorData,
      [name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await addAdministrador(administradorData)
      setAdministradorData({ 
        Nombre_Administrador: '', 
        Usuario: '',  
        Contrasena: '',
        NumAdministrador:'',
        Email:''
      })
      alert('Administrador registrado exitosamente!')
      window.location.href = '/loginFrom'
    } catch (error) {
      console.error('Error al agregar administrador:', error)
      alert('Error al registrar administrador: ' + error.message)
    }
  }

  return (
    <div className={styles.adminContainer}>
      <div className={styles.adminCard}>
        <h2 className={styles.adminTitle}>🎯 Registro del Primer Administrador</h2>
        <p className={styles.adminSubtitle}>
          Bienvenido! Registra al primer administrador para habilitar el sistema.
        </p>
        <form className={styles.adminForm} onSubmit={handleSubmit}>
          <div className={styles.adminFormGroup}>
            <label htmlFor="Nombre_Administrador" className={styles.adminLabel}>Nombre Completo</label>
            <input
              type="text"
              name="Nombre_Administrador"
              value={administradorData.Nombre_Administrador}
              onChange={handleInputChange}
              required
              placeholder="Ej: Juan Pérez"
              className={styles.adminInput}
            />
          </div>
          <div className={styles.adminFormGroup}>
            <label htmlFor="Usuario" className={styles.adminLabel}>Nombre de Usuario</label>
            <input
              type="text"
              name="Usuario"
              value={administradorData.Usuario}
              onChange={handleInputChange}
              required
              placeholder="Ej: juan.admin"
              className={styles.adminInput}
            />
          </div>
          <div className={styles.adminFormGroup}>
            <label htmlFor="Contrasena" className={styles.adminLabel}>Contraseña</label>
            <input
              type="password"
              name="Contrasena"
              value={administradorData.Contrasena}
              onChange={handleInputChange}
              required
              placeholder="Mínimo 8 caracteres"
              minLength="8"
              className={styles.adminInput}
            />
          </div>
          <div className={styles.adminFormGroup}>
            <label htmlFor="Email" className={styles.adminLabel}>Email</label>
            <input
              type="text"
              name="Email"
              value={administradorData.Email}
              onChange={handleInputChange}
              required
              placeholder="ejm: hola@gmail.com"
              className={styles.adminInput}
            />
          </div>
          <div className={styles.adminFormGroup}>
            <label htmlFor="NumAdministrador" className={styles.adminLabel}>Telefono</label>
            <input
              type="text"
              name="NumAdministrador"
              value={administradorData.NumAdministrador}
              onChange={handleInputChange}
              required
              placeholder="Mumero del Administrador"
              minLength="9"
              className={styles.adminInput}
            />
          </div>
          <button className={styles.adminButton} type="submit">
            Registrar Administrador
          </button>
        </form>
      </div>
    </div>
  )
}

export default AgregarAdministradorPrimer