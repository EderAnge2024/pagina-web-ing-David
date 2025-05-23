import { useEffect, useState, useCallback } from 'react'
import useAdministradorStore from '../../store/AdministradorStore'
import style from './Administrador.module.css'

const Administrador = () => {
    const { 
        addAdministrador, 
        fetchAdministrador, 
        administradors, 
        deleteAdministrador, 
        updateAdministrador 
    } = useAdministradorStore()
    
    const [editingAdministrador, setEditingAdministrador] = useState(null)
    const [formData, setFormData] = useState({
        Nombre_Administrador: "",
        Usuario: "",
        Contrasena: ""
    })

    // Cargar administradores al montar el componente
    useEffect(() => {
        fetchAdministrador()
    }, [fetchAdministrador])

    // Manejar cambios en el formulario principal
    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }, [])

    // Enviar nuevo administrador
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault()
        try {
            await addAdministrador(formData)
            setFormData({
                Nombre_Administrador: "",
                Usuario: "",
                Contrasena: ""
            })
            alert("Administrador agregado correctamente")
        } catch (error) {
            alert("Error al agregar administrador")
        }
    }, [addAdministrador, formData])

    // Eliminar administrador
    const handleDelete = useCallback(async (ID_Administrador) => {
        if (window.confirm("¿Estás seguro de eliminar este administrador?")) {
            try {
                await deleteAdministrador(ID_Administrador)
            } catch (error) {
                alert("Error al eliminar administrador")
            }
        }
    }, [deleteAdministrador])

    // Iniciar edición
    const handleEditClick = useCallback((administrador) => {
        setEditingAdministrador(administrador)
        setFormData({
            Nombre_Administrador: administrador.Nombre_Administrador,
            Usuario: administrador.Usuario,
            Contrasena: administrador.Contrasena
        })
    }, [])

    // Actualizar administrador
    const handleUpdate = useCallback(async () => {
        try {
            await updateAdministrador(editingAdministrador.ID_Administrador, formData)
            setEditingAdministrador(null)
        } catch (error) {
            alert("Error al actualizar administrador")
        }
    }, [editingAdministrador, formData, updateAdministrador])

    // Cancelar edición
    const handleCancelEdit = useCallback(() => {
        setEditingAdministrador(null)
        setFormData({
            Nombre_Administrador: "",
            Usuario: "",
            Contrasena: ""
        })
    }, [])

    return (
        <div className={style.administrador}>
            <div className={style.administrador__form}>
                <h1 className={style.administrador__title}>Agregar administradores</h1>
                <form onSubmit={handleSubmit} className={style.form}>
                    <input
                        type="text"
                        placeholder="Nombre del administrador"
                        required
                        name="Nombre_Administrador"
                        value={formData.Nombre_Administrador}
                        onChange={handleInputChange}
                        className={style.form__input}
                    />
                    <input
                        type="text"
                        placeholder="Nombre de usuario"
                        required
                        name="Usuario"
                        value={formData.Usuario}
                        onChange={handleInputChange}
                        className={style.form__input}
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        required
                        name="Contrasena"
                        value={formData.Contrasena}
                        onChange={handleInputChange}
                        className={style.form__input}
                    />
                    <button type="submit" className={`${style.button} ${style['button--primary']}`}>
                        Guardar Datos
                    </button>
                </form>
            </div>
            
            <div className={style.administrador__list}>
                <h1 className={style.administrador__title}>Lista de administradores</h1>
                <div className={style.list}>
                    {administradors.map((user) => (
                        <div className={style.card} key={user.ID_Administrador}>
                            <div className={style.card__content}>
                                <p className={style.card__item}>
                                    <span className={style.card__label}>Nombre:</span> 
                                    {user.Nombre_Administrador}
                                </p>
                                <p className={style.card__item}>
                                    <span className={style.card__label}>Usuario:</span> 
                                    {user.Usuario}
                                </p>
                                <p className={style.card__item}>
                                    <span className={style.card__label}>Contraseña:</span> 
                                    {user.Contrasena.replace(/./g, '*')}
                                </p>
                            </div>
                            <div className={style.card__actions}>
                                <button 
                                    className={`${style.button} ${style['button--danger']}`}
                                    onClick={() => handleDelete(user.ID_Administrador)}
                                >
                                    Eliminar
                                </button>
                                <button 
                                    className={`${style.button} ${style['button--secondary']}`}
                                    onClick={() => handleEditClick(user)}
                                >
                                    Editar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {editingAdministrador && (
                    <div className={style.modal}>
                        <div className={style.modal__content}>
                            <span 
                                className={style.modal__close} 
                                onClick={handleCancelEdit}
                            >
                                &times;
                            </span>
                            <h3 className={style.modal__title}>Editar administrador</h3>
                            <input 
                                type="text"
                                name="Nombre_Administrador"
                                value={formData.Nombre_Administrador}
                                onChange={handleInputChange}
                                placeholder="Nombre del administrador"
                                className={style.form__input}
                            />
                            <input 
                                type="text"
                                name="Usuario"
                                value={formData.Usuario}
                                onChange={handleInputChange}
                                placeholder="Nombre de usuario"
                                className={style.form__input}
                            />
                            <input 
                                type="password"
                                name="Contrasena"
                                value={formData.Contrasena}
                                onChange={handleInputChange}
                                placeholder="Contraseña"
                                className={style.form__input}
                            />
                            <div className={style.modal__actions}>
                                <button 
                                    className={`${style.button} ${style['button--primary']}`} 
                                    onClick={handleUpdate}
                                >
                                    Guardar
                                </button>
                                <button 
                                    className={`${style.button} ${style['button--danger']}`} 
                                    onClick={handleCancelEdit}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Administrador