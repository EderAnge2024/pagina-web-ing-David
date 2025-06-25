import { useEffect, useState, useCallback } from 'react'
import useClienteStore from '../../store/ClienteStore'
import style from './Clientes.module.css'

const ClienteForm = () => {
    const { 
        addCliente, 
        fetchCliente, 
        clientes, 
        deleteCliente, 
        updateCliente, 
        verificarClienteAutenticado,
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

    // Cargar clientes al montar el componente
    useEffect(() => {
        fetchCliente()
        verificarClienteAutenticado()
    }, [verificarClienteAutenticado, fetchCliente])

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

    // Eliminar cliente
    const handleDelete = useCallback(async (ID_Cliente) => {
        if (window.confirm("¿Estás seguro de eliminar este cliente?")) {
            try {
                await deleteCliente(ID_Cliente)
            } catch (error) {
                alert("Error al eliminar cliente")
            }
        }
    }, [deleteCliente])

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
                    />
                    <input
                        type="text"
                        placeholder="Apellido del cliente"
                        required
                        name="Apellido"
                        value={formData.Apellido}
                        onChange={handleInputChange}
                        className={style.form__input}
                    />
                    <input
                        type="text"
                        placeholder="Número de celular"
                        required
                        name="NumCelular"
                        value={formData.NumCelular}
                        onChange={handleInputChange}
                        className={style.form__input}
                    />
                    <input
                        type="text"
                        placeholder="Correo"
                        required
                        name="Email"
                        value={formData.Email}
                        onChange={handleInputChange}
                        className={style.form__input}
                    />
                    <input
                        type="text"
                        placeholder="Usuario"
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
            
            <div className={style.cliente__list}>
                <h1 className={style.cliente__title}>Lista de clientes</h1>
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
                                <p className={style.card__item}>
                                    <span className={style.card__label}>token:</span> 
                                    {user.token}
                                </p>
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
                                >
                                    Eliminar
                                </button>
                                <button 
                                    className={`${style.button} ${style['button--secondary']}`}
                                    onClick={() => handleEditClick(user)}
                                    aria-label="Editar cliente"
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
                            />
                            <input 
                                type="text"
                                name="Apellido"
                                value={formData.Apellido}
                                onChange={handleInputChange}
                                placeholder="Apellido del cliente"
                                className={style.form__input}
                            />
                            <input 
                                type="text"
                                name="NumCelular"
                                value={formData.NumCelular}
                                onChange={handleInputChange}
                                placeholder="Número de celular"
                                className={style.form__input}
                            />
                            <input 
                                type="text"
                                name="Email"
                                value={formData.Email}
                                onChange={handleInputChange}
                                placeholder="Email"
                                className={style.form__input}
                            />
                            <input 
                                type="text"
                                name="Usuario"
                                value={formData.Usuario}
                                onChange={handleInputChange}
                                placeholder="Usuario"
                                className={style.form__input}
                            />
                            <input 
                                type="password"
                                name="Contrasena"
                                value={formData.Contrasena}
                                onChange={handleInputChange}
                                placeholder="Contrasena"
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

export default ClienteForm