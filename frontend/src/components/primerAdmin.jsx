import { useState } from 'react'
import useAdministradorStore from '../store/AdministradorStore'
import styles from './AgregarAdministradorPrimer.module.css'

const AgregarAdministradorPrimer = () => {
  const { addAdministrador } = useAdministradorStore()
  const [administradorData, setAdministradorData] = useState({
    Nombre_Administrador: '',
    Usuario: '',
    Contrasena: ''
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
        Contrasena: '' 
      })
      alert('Administrador registrado exitosamente!')
      // Recargar la página para que App.js redirija adecuadamente
      window.location.href = '/'
    } catch (error) {
      console.error('Error al agregar administrador:', error)
      alert('Error al registrar administrador: ' + error.message)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Registro del Primer Administrador</h2>
        
        <div className={styles.infoText}>
          Bienvenido! Por favor registre el primer administrador del sistema.
        </div>
        
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="Nombre_Administrador">Nombre Completo</label>
            <input
              type="text"
              name="Nombre_Administrador"
              value={administradorData.Nombre_Administrador}
              onChange={handleInputChange}
              required
              placeholder="Ej: Juan Pérez"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="Usuario">Nombre de Usuario</label>
            <input
              type="text"
              name="Usuario"
              value={administradorData.Usuario}
              onChange={handleInputChange}
              required
              placeholder="Ej: juan.admin"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="Contrasena">Contraseña</label>
            <input
              type="password"
              name="Contrasena"
              value={administradorData.Contrasena}
              onChange={handleInputChange}
              required
              placeholder="Mínimo 8 caracteres"
              minLength="8"
            />
          </div>
          <button className={styles.submitButton} type="submit">
            Registrar Administrador
          </button>
        </form>
      </div>
    </div>
  )
}

export default AgregarAdministradorPrimer