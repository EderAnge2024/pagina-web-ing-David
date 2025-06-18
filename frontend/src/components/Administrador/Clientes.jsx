import { useEffect, useState, useCallback, useMemo } from 'react'
import useClienteStore from '../../store/ClienteStore'
import style from './Clientes.module.css'

const ClienteForm = () => {
    const { 
        addCliente, 
        fetchCliente, 
        clientes, 
        deleteCliente,  
        updateCliente 
    } = useClienteStore()
    
    const [editingCliente, setEditingCliente] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        Nombre: "",
        Apellido: "",
        NumCelular: ""
    })

    // Cargar clientes al montar el componente
    useEffect(() => {
        const loadClientes = async () => {
            setIsLoading(true)
            try {
                await fetchCliente()
            } finally {
                setIsLoading(false)
            }
        }
        loadClientes()
    }, [fetchCliente])

    // Filtrar clientes basado en el término de búsqueda
    const filteredClientes = useMemo(() => {
        if (!searchTerm.trim()) return clientes
        
        const term = searchTerm.toLowerCase().trim()
        return clientes.filter(cliente => 
            cliente.Nombre.toLowerCase().includes(term) ||
            cliente.Apellido.toLowerCase().includes(term) ||
            cliente.NumCelular.includes(term)
        )
    }, [clientes, searchTerm])

    // Validar formato de teléfono
    const validatePhoneNumber = (phone) => {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/
        return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 7
    }

    // Validar nombre y apellido
    const validateName = (name) => {
        return name.trim().length >= 2 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name)
    }

    // Manejar cambios en el formulario con validación
    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target
        
        // Formatear número de teléfono
        if (name === 'NumCelular') {
            const formatted = value.replace(/[^\d\s\-\+\(\)]/g, '')
            setFormData(prev => ({
                ...prev,
                [name]: formatted
            }))
            return
        }

        // Formatear nombres (primera letra mayúscula)
        if (name === 'Nombre' || name === 'Apellido') {
            const formatted = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '')
                                  .replace(/\b\w/g, l => l.toUpperCase())
            setFormData(prev => ({
                ...prev,
                [name]: formatted
            }))
            return
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }, [])

    // Validar formulario completo
    const validateForm = () => {
        if (!validateName(formData.Nombre)) {
            alert('El nombre debe tener al menos 2 caracteres y solo contener letras')
            return false
        }
        if (!validateName(formData.Apellido)) {
            alert('El apellido debe tener al menos 2 caracteres y solo contener letras')
            return false
        }
        if (!validatePhoneNumber(formData.NumCelular)) {
            alert('El número de celular no es válido')
            return false
        }
        return true
    }

    // Limpiar formulario
    const clearForm = () => {
        setFormData({
            Nombre: "",
            Apellido: "",
            NumCelular: ""
        })
    }

    // Enviar nuevo cliente
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault()
        
        if (!validateForm()) return

        setIsLoading(true)
        try {
            await addCliente(formData)
            clearForm()
            alert("Cliente agregado correctamente")
        } catch (error) {
            console.error('Error al agregar cliente:', error)
            alert("Error al agregar cliente: " + (error.message || 'Error desconocido'))
        } finally {
            setIsLoading(false)
        }
    }, [addCliente, formData])

    // Eliminar cliente con mejor UX
    const handleDelete = useCallback(async (cliente) => {
        const confirmMessage = `¿Estás seguro de eliminar a ${cliente.Nombre} ${cliente.Apellido}?`
        if (window.confirm(confirmMessage)) {
            setIsLoading(true)
            try {
                await deleteCliente(cliente.ID_Cliente)
                alert("Cliente eliminado correctamente")
            } catch (error) {
                console.error('Error al eliminar cliente:', error)
                alert("Error al eliminar cliente: " + (error.message || 'Error desconocido'))
            } finally {
                setIsLoading(false)
            }
        }
    }, [deleteCliente])

    // Iniciar edición
    const handleEditClick = useCallback((cliente) => {
        setEditingCliente(cliente)
        setFormData({
            Nombre: cliente.Nombre,
            Apellido: cliente.Apellido,
            NumCelular: cliente.NumCelular
        })
    }, [])

    // Actualizar cliente
    const handleUpdate = useCallback(async () => {
        if (!validateForm()) return

        setIsLoading(true)
        try {
            await updateCliente(editingCliente.ID_Cliente, formData)
            setEditingCliente(null)
            clearForm()
            alert("Cliente actualizado correctamente")
        } catch (error) {
            console.error('Error al actualizar cliente:', error)
            alert("Error al actualizar cliente: " + (error.message || 'Error desconocido'))
        } finally {
            setIsLoading(false)
        }
    }, [editingCliente, formData, updateCliente])

    // Cancelar edición
    const handleCancelEdit = useCallback(() => {
        setEditingCliente(null)
        clearForm()
    }, [])

    // Manejar búsqueda
    const handleSearchChange = useCallback((e) => {
        setSearchTerm(e.target.value)
    }, [])

    // Limpiar búsqueda
    const clearSearch = useCallback(() => {
        setSearchTerm('')
    }, [])

    return (
        <div className={style.cliente}>
            {/* Formulario de agregar cliente */}
            <div className={style.cliente__form}>
                <h1 className={style.cliente__title}>
                    {editingCliente ? 'Editar Cliente' : 'Agregar Cliente'}
                </h1>
                <form onSubmit={handleSubmit} className={style.form}>
                    <div className={style.form__group}>
                        <input
                            type="text"
                            placeholder="Nombre del cliente"
                            required
                            name="Nombre"
                            value={formData.Nombre}
                            onChange={handleInputChange}
                            className={style.form__input}
                            disabled={isLoading}
                            maxLength={50}
                        />
                        <small className={style.form__hint}>
                            Solo letras, mínimo 2 caracteres
                        </small>
                    </div>
                    
                    <div className={style.form__group}>
                        <input
                            type="text"
                            placeholder="Apellido del cliente"
                            required
                            name="Apellido"
                            value={formData.Apellido}
                            onChange={handleInputChange}
                            className={style.form__input}
                            disabled={isLoading}
                            maxLength={50}
                        />
                        <small className={style.form__hint}>
                            Solo letras, mínimo 2 caracteres
                        </small>
                    </div>
                    
                    <div className={style.form__group}>
                        <input
                            type="tel"
                            placeholder="Número de celular"
                            required
                            name="NumCelular"
                            value={formData.NumCelular}
                            onChange={handleInputChange}
                            className={style.form__input}
                            disabled={isLoading}
                            maxLength={20}
                        />
                        <small className={style.form__hint}>
                            Ej: +1234567890 o 123-456-7890
                        </small>
                    </div>

                    <div className={style.form__actions}>
                        <button 
                            type="submit" 
                            className={`${style.button} ${style['button--primary']}`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Guardando...' : 'Guardar Cliente'}
                        </button>
                        
                        <button 
                            type="button"
                            onClick={clearForm}
                            className={`${style.button} ${style['button--secondary']}`}
                            disabled={isLoading}
                        >
                            Limpiar
                        </button>
                    </div>
                </form>
            </div>
            
            {/* Lista de clientes con buscador */}
            <div className={style.cliente__list}>
                <div className={style.list__header}>
                    <h1 className={style.cliente__title}>
                        Lista de Clientes ({filteredClientes.length})
                    </h1>
                    
                    {/* Buscador */}
                    <div className={style.search}>
                        <div className={style.search__container}>
                            <input
                                type="text"
                                placeholder="Buscar por nombre, apellido o teléfono..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className={style.search__input}
                                disabled={isLoading}
                            />
                            {searchTerm && (
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    className={style.search__clear}
                                    aria-label="Limpiar búsqueda"
                                >
                                    ✕
                                </button>
                            )}
                            <div className={style.search__icon}>🔍</div>
                        </div>
                        {searchTerm && (
                            <small className={style.search__results}>
                                {filteredClientes.length === 0 
                                    ? 'No se encontraron clientes' 
                                    : `${filteredClientes.length} cliente(s) encontrado(s)`
                                }
                            </small>
                        )}
                    </div>
                </div>

                {/* Lista de clientes */}
                <div className={style.list}>
                    {isLoading ? (
                        <div className={style.loading}>
                            <p>Cargando clientes...</p>
                        </div>
                    ) : filteredClientes.length === 0 ? (
                        <div className={style.empty}>
                            <p>
                                {searchTerm 
                                    ? 'No se encontraron clientes con ese criterio de búsqueda' 
                                    : 'No hay clientes registrados'
                                }
                            </p>
                            {searchTerm && (
                                <button 
                                    onClick={clearSearch}
                                    className={`${style.button} ${style['button--secondary']}`}
                                >
                                    Mostrar todos los clientes
                                </button>
                            )}
                        </div>
                    ) : (
                        filteredClientes.map((user) => (
                            <div className={style.card} key={user.ID_Cliente}>
                                <div className={style.card__content}>
                                    <div className={style.card__header}>
                                        <h3 className={style.card__name}>
                                            {user.Nombre} {user.Apellido}
                                        </h3>
                                        <span className={style.card__id}>
                                            ID: {user.ID_Cliente}
                                        </span>
                                    </div>
                                    <p className={style.card__item}>
                                        <span className={style.card__label}>📱 Celular:</span> 
                                        <a href={`tel:${user.NumCelular}`} className={style.card__phone}>
                                            {user.NumCelular}
                                        </a>
                                    </p>
                                </div>
                                <div className={style.card__actions}>
                                    <button 
                                        className={`${style.button} ${style['button--secondary']}`}
                                        onClick={() => handleEditClick(user)}
                                        aria-label={`Editar cliente ${user.Nombre} ${user.Apellido}`}
                                        disabled={isLoading}
                                    >
                                        ✏️ Editar
                                    </button>
                                    <button 
                                        className={`${style.button} ${style['button--danger']}`}
                                        onClick={() => handleDelete(user)}
                                        aria-label={`Eliminar cliente ${user.Nombre} ${user.Apellido}`}
                                        disabled={isLoading}
                                    >
                                        🗑️ Eliminar
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Modal de edición */}
            {editingCliente && (
                <div className={style.modal} onClick={handleCancelEdit}>
                    <div className={style.modal__content} onClick={(e) => e.stopPropagation()}>
                        <div className={style.modal__header}>
                            <h3 className={style.modal__title}>
                                Editar Cliente: {editingCliente.Nombre} {editingCliente.Apellido}
                            </h3>
                            <button 
                                className={style.modal__close} 
                                onClick={handleCancelEdit}
                                aria-label="Cerrar modal"
                                disabled={isLoading}
                            >
                                ✕
                            </button>
                        </div>
                        
                        <div className={style.modal__body}>
                            <div className={style.form__group}>
                                <input 
                                    type="text"
                                    name="Nombre"
                                    value={formData.Nombre}
                                    onChange={handleInputChange}
                                    placeholder="Nombre del cliente"
                                    className={style.form__input}
                                    disabled={isLoading}
                                    maxLength={50}
                                />
                            </div>
                            
                            <div className={style.form__group}>
                                <input 
                                    type="text"
                                    name="Apellido"
                                    value={formData.Apellido}
                                    onChange={handleInputChange}
                                    placeholder="Apellido del cliente"
                                    className={style.form__input}
                                    disabled={isLoading}
                                    maxLength={50}
                                />
                            </div>
                            
                            <div className={style.form__group}>
                                <input 
                                    type="tel"
                                    name="NumCelular"
                                    value={formData.NumCelular}
                                    onChange={handleInputChange}
                                    placeholder="Número de celular"
                                    className={style.form__input}
                                    disabled={isLoading}
                                    maxLength={20}
                                />
                            </div>
                        </div>
                        
                        <div className={style.modal__actions}>
                            <button 
                                className={`${style.button} ${style['button--primary']}`} 
                                onClick={handleUpdate}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Guardando...' : '💾 Guardar'}
                            </button>
                            <button 
                                className={`${style.button} ${style['button--danger']}`} 
                                onClick={handleCancelEdit}
                                disabled={isLoading}
                            >
                                ❌ Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ClienteForm