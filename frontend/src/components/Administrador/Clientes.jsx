import { useEffect, useState, useCallback } from 'react'
import useClienteStore from '../../store/ClienteStore'
import style from './Clientes.module.css'

const ClienteForm = () => {
    const { 
        fetchCliente,
        addCliente, 
        clientes, 
        updateCliente, 
        deleteCliente,
        loading,
        initializeFromStorage
    } = useClienteStore()
    
    const [editingCliente, setEditingCliente] = useState(null)
    const [formData, setFormData] = useState({
        Nombre: "",
        Apellido: "",
        NumCelular: "",
        Email:"",
        Usuario:"",
        Contrasena:"",
    })

    // Cargar datos al montar el componente
    useEffect(() => {
        initializeFromStorage()
        fetchCliente()
    }, [initializeFromStorage,fetchCliente])

    // Manejar cambios en el formulario
    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }, [])

    // Enviar nuevo cliente
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault()
        try {
            await addCliente(formData)
            setFormData({
                Nombre: "",
                Apellido: "",
                NumCelular: "",
                Email: "",
                Usuario: "",
                Contrasena: ""
            })
            alert("Cliente agregado correctamente")
        } catch (error) {
            alert("Error al agregar cliente")
        }
    }, [addCliente, formData])

    // Eliminar cliente - Función simplificada (ya no está en el store)
    const handleDelete = useCallback(async (ID_Cliente) => {
        if (window.confirm("¿Estás seguro de eliminar este cliente?")) {
            try {
                await deleteCliente(ID_Cliente)
                alert("Cliente elminado correctamente")
                fetchCliente()
            } catch (error) {
                alert("Error al eliminar cliente")
            }
        }
    }, [])

    // Iniciar edición
    const handleEditClick = useCallback((cliente) => {
        setEditingCliente(cliente)
        setFormData({
            Nombre: cliente.Nombre,
            Apellido: cliente.Apellido,
            NumCelular: cliente.NumCelular,
            Email: cliente.Email,
            Usuario: cliente.Usuario,
            Contrasena: cliente.Contrasena
        })
    }, [])

    // Actualizar cliente
    const handleUpdate = useCallback(async () => {
        try {
            await updateCliente(editingCliente.ID_Cliente, formData)
            setEditingCliente(null)
            // Resetear formulario
            setFormData({
                Nombre: "",
                Apellido: "",
                NumCelular: "",
                Email: "",
                Usuario: "",
                Contrasena: ""
            })
            alert("Cliente actualizado correctamente")
        } catch (error) {
            alert("Error al actualizar cliente")
        }
    }, [editingCliente, formData, updateCliente])

    // Cancelar edición
    const handleCancelEdit = useCallback(() => {
        setEditingCliente(null)
        setFormData({
            Nombre: "",
            Apellido: "",
            NumCelular: "",
            Email: "",
            Usuario: "",
            Contrasena: ""
        })
    }, [])

    return (
        <div className={style.cliente}>
            <div className={style.cliente__form}>
                <h1 className={style.cliente__title}>Agregar clientes</h1>
                <form onSubmit={handleSubmit} className={style.form}>
                    <input
                        type="text"
                        placeholder="Nombre del cliente"
                        required
                        name="Nombre"
                        value={formData.Nombre}
                        onChange={handleInputChange}
                        className={style.form__input}
                        disabled={loading}
                    />
                    <input
                        type="text"
                        placeholder="Apellido del cliente"
                        required
                        name="Apellido"
                        value={formData.Apellido}
                        onChange={handleInputChange}
                        className={style.form__input}
                        disabled={loading}
                    />
                    <input
                        type="text"
                        placeholder="Número de celular"
                        required
                        name="NumCelular"
                        value={formData.NumCelular}
                        onChange={handleInputChange}
                        className={style.form__input}
                        disabled={loading}
                    />
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        required
                        name="Email"
                        value={formData.Email}
                        onChange={handleInputChange}
                        className={style.form__input}
                        disabled={loading}
                    />
                    <input
                        type="text"
                        placeholder="Usuario"
                        required
                        name="Usuario"
                        value={formData.Usuario}
                        onChange={handleInputChange}
                        className={style.form__input}
                        disabled={loading}
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        required
                        name="Contrasena"
                        value={formData.Contrasena}
                        onChange={handleInputChange}
                        className={style.form__input}
                        disabled={loading}
                    />
                    <button 
                        type="submit" 
                        className={`${style.button} ${style['button--primary']}`}
                        disabled={loading}
                    >
                        {loading ? 'Guardando...' : 'Guardar Datos'}
                    </button>
                </form>
            </div>
            
            <div className={style.cliente__list}>
                <h1 className={style.cliente__title}>Lista de clientes</h1>
                {loading && <p>Cargando...</p>}
                <div className={style.list}>
                    {clientes.map((user) => (
                        <div className={style.card} key={user.ID_Cliente}>
                            <div className={style.card__content}>
                                <p className={style.card__item}>
                                    <span className={style.card__label}>Nombre:</span> 
                                    {user.Nombre}
                                </p>
                                <p className={style.card__item}>
                                    <span className={style.card__label}>Apellido:</span> 
                                    {user.Apellido}
                                </p>
                                <p className={style.card__item}>
                                    <span className={style.card__label}>Celular:</span> 
                                    {user.NumCelular}
                                </p>
                                {user.token && (
                                    <p className={style.card__item}>
                                        <span className={style.card__label}>Token:</span> 
                                        {user.token}
                                    </p>
                                )}
                                <p className={style.card__item}>
                                    <span className={style.card__label}>Email:</span> 
                                    {user.Email}
                                </p>
                                <p className={style.card__item}>
                                    <span className={style.card__label}>Usuario:</span> 
                                    {user.Usuario}
                                </p>
                                <p className={style.card__item}>
                                    <span className={style.card__label}>Contraseña:</span> 
                                    {user.Contrasena}
                                </p>
                            </div>
                            <div className={style.card__actions}>
                                <button 
                                    className={`${style.button} ${style['button--danger']}`}
                                    onClick={() => handleDelete(user.ID_Cliente)}
                                    aria-label="Eliminar cliente"
                                    disabled={loading}
                                >
                                    Eliminar
                                </button>
                                <button 
                                    className={`${style.button} ${style['button--secondary']}`}
                                    onClick={() => handleEditClick(user)}
                                    aria-label="Editar cliente"
                                    disabled={loading}
                                >
                                    Editar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {editingCliente && (
                    <div className={style.modal}>
                        <div className={style.modal__content}>
                            <span 
                                className={style.modal__close} 
                                onClick={handleCancelEdit}
                                aria-label="Cerrar modal"
                            >
                                &times;
                            </span>
                            <h3 className={style.modal__title}>Editar cliente</h3>
                            <input 
                                type="text"
                                name="Nombre"
                                value={formData.Nombre}
                                onChange={handleInputChange}
                                placeholder="Nombre del cliente"
                                className={style.form__input}
                                disabled={loading}
                            />
                            <input 
                                type="text"
                                name="Apellido"
                                value={formData.Apellido}
                                onChange={handleInputChange}
                                placeholder="Apellido del cliente"
                                className={style.form__input}
                                disabled={loading}
                            />
                            <input 
                                type="text"
                                name="NumCelular"
                                value={formData.NumCelular}
                                onChange={handleInputChange}
                                placeholder="Número de celular"
                                className={style.form__input}
                                disabled={loading}
                            />
                            <input 
                                type="email"
                                name="Email"
                                value={formData.Email}
                                onChange={handleInputChange}
                                placeholder="Email"
                                className={style.form__input}
                                disabled={loading}
                            />
                            <input 
                                type="text"
                                name="Usuario"
                                value={formData.Usuario}
                                onChange={handleInputChange}
                                placeholder="Usuario"
                                className={style.form__input}
                                disabled={loading}
                            />
                            <input 
                                type="password"
                                name="Contrasena"
                                value={formData.Contrasena}
                                onChange={handleInputChange}
                                placeholder="Contraseña"
                                className={style.form__input}
                                disabled={loading}
                            />
                            <div className={style.modal__actions}>
                                <button 
                                    className={`${style.button} ${style['button--primary']}`} 
                                    onClick={handleUpdate}
                                    disabled={loading}
                                >
                                    {loading ? 'Guardando...' : 'Guardar'}
                                </button>
                                <button 
                                    className={`${style.button} ${style['button--danger']}`} 
                                    onClick={handleCancelEdit}
                                    disabled={loading}
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

export default ClienteForm