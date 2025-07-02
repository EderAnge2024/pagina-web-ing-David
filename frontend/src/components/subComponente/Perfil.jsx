import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import useClienteStore from '../../store/ClienteStore'
import style from './perfil.module.css'
import TerminosCondiciones from '../subComponente/TerminosCondiciones'

const PerfilForm = () => {
    const { 
        addCliente, 
        loginCliente,
        fetchCliente, 
        updateCliente, 
        verificarToken,
        clienteActual, 
        isAuthenticated,
        logout,
        loading,
        initializeFromStorage
    } = useClienteStore()

    const [modoLogin, setModoLogin] = useState(true)
    const [editandoPerfil, setEditandoPerfil] = useState(false)
    const [localLoading, setLocalLoading] = useState(false)
    const [aceptaTerminos,setAceptaTerminos] = useState(false)
    
    const [formData, setFormData] = useState({
        Nombre: "",
        Apellido: "",
        NumCelular: "",
        Email: "",
        Usuario: "",
        Contrasena: "",
    })
    
    const [loginData, setLoginData] = useState({ 
        Usuario: "", 
        Contrasena: "" 
    })
    
    const navigate = useNavigate()

    // Scroll al inicio al montar
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [])

    // Inicialización de la aplicación
    useEffect(() => {
        const initializeApp = async () => {
            setLocalLoading(true)
            
            try {
                // Primero intentar cargar desde localStorage
                const hasStoredData = initializeFromStorage()
                
                if (hasStoredData) {
                    // Verificar que el token siga siendo válido
                    const isValid = await verificarToken()
                    if (!isValid) {
                        console.log("Token expirado, limpiando datos...")
                    }
                }
                
                // Cargar lista de clientes
                await fetchCliente()
                
            } catch (error) {
                console.error("Error en inicialización:", error)
            } finally {
                setLocalLoading(false)
            }
        }
        
        initializeApp()
    }, [initializeFromStorage, verificarToken, fetchCliente])

    // Handlers de formularios
    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }, [])

    const handleLoginChange = useCallback((e) => {
        const { name, value } = e.target
        setLoginData(prev => ({ ...prev, [name]: value }))
    }, [])

    // Registro de nuevo cliente
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault()
        setLocalLoading(true)
    
        try {
            console.log("aceptaTerminos:", aceptaTerminos)
    
            if (!aceptaTerminos) {
                alert("Debes aceptar los términos y condiciones antes de registrarte.")
                setLocalLoading(false)
                return // <-- Esto es importante para que NO continúe
            }
    
            await addCliente(formData)
    
            setFormData({ 
                Nombre: "", 
                Apellido: "", 
                NumCelular: "", 
                Email: "", 
                Usuario: "", 
                Contrasena: "" 
            })
    
            setAceptaTerminos(false) // Reiniciamos checkbox después del registro
    
            alert("Cliente registrado correctamente. Ahora puedes iniciar sesión.")
            setModoLogin(true)
        } catch (error) {
            const errorMessage = error.response?.data?.mensaje || error.message || "Error desconocido"
            alert("Error al registrar cliente: " + errorMessage)
        } finally {
            setLocalLoading(false)
        }
    }, [addCliente, formData, aceptaTerminos])
    
    // Login de cliente
    const handleLogin = useCallback(async (e) => {
        e.preventDefault()
        setLocalLoading(true)
        
        try {
            const result = await loginCliente(loginData)
            
            if (result.success) {
                setLoginData({ Usuario: "", Contrasena: "" })
                alert(result.message)
            } else {
                alert(result.message)
            }
        } catch (error) {
            alert("Error inesperado en el login")
        } finally {
            setLocalLoading(false)
        }
    }, [loginCliente, loginData])

    // Logout mejorado
    const handleLogout = useCallback(async () => {
        if (window.confirm("¿Estás seguro de que quieres cerrar sesión?")) {
            await logout()
        }
    }, [logout])

    // Editar perfil
    const handleEditarPerfil = useCallback(() => {
        if (clienteActual) {
            setFormData({
                Nombre: clienteActual.Nombre || "",
                Apellido: clienteActual.Apellido || "",
                NumCelular: clienteActual.NumCelular || "",
                Email: clienteActual.Email || "",
                Usuario: clienteActual.Usuario || "",
                Contrasena: "",
            })
            setEditandoPerfil(true)
        }
    }, [clienteActual])

    // Actualizar perfil
    const handleActualizarPerfil = useCallback(async (e) => {
        e.preventDefault()
        setLocalLoading(true)
        
        try {
            if (!clienteActual) {
                throw new Error("No hay cliente autenticado")
            }
            
            const dataToUpdate = { ...formData }
            if (!dataToUpdate.Contrasena) {
                delete dataToUpdate.Contrasena
            }
            
            await updateCliente(clienteActual.ID_Cliente, dataToUpdate)
            
            setEditandoPerfil(false)
            alert("Perfil actualizado correctamente")
        } catch (error) {
            const errorMessage = error.response?.data?.mensaje || error.message || "Error desconocido"
            alert("Error al actualizar perfil: " + errorMessage)
        } finally {
            setLocalLoading(false)
        }
    }, [formData, clienteActual, updateCliente])

    // Cancelar edición
    const handleCancelarEdicion = useCallback(() => {
        setEditandoPerfil(false)
        setFormData({ 
            Nombre: "", 
            Apellido: "", 
            NumCelular: "", 
            Email: "", 
            Usuario: "", 
            Contrasena: "" 
        })
    }, [])

    // Loading general
    if (localLoading || loading) {
        return (
            <div className={style.container}>
                <div className={style.card}>
                    <h2 className={style.title}>Cargando...</h2>
                </div>
            </div>
        )
    }

    // Renderizar Dashboard/Perfil si está autenticado
    if (isAuthenticated && clienteActual) {
        return (
            <div className={style.container}>
                <div className={style.card}>
                    {editandoPerfil ? (
                        <>
                            <h1 className={style.title}>Editar Perfil</h1>
                            <form onSubmit={handleActualizarPerfil}>
                                <input 
                                    type="text" 
                                    name="Nombre" 
                                    placeholder="Nombre" 
                                    value={formData.Nombre} 
                                    onChange={handleInputChange} 
                                    required 
                                    className={style.input} 
                                />
                                <input 
                                    type="text" 
                                    name="Apellido" 
                                    placeholder="Apellido" 
                                    value={formData.Apellido} 
                                    onChange={handleInputChange} 
                                    required 
                                    className={style.input} 
                                />
                                <input 
                                    type="text" 
                                    name="NumCelular" 
                                    placeholder="Celular" 
                                    value={formData.NumCelular} 
                                    onChange={handleInputChange} 
                                    required 
                                    className={style.input} 
                                />
                                <input 
                                    type="email" 
                                    name="Email" 
                                    placeholder="Email" 
                                    value={formData.Email} 
                                    onChange={handleInputChange} 
                                    required 
                                    className={style.input} 
                                />
                                <input 
                                    type="text" 
                                    name="Usuario" 
                                    placeholder="Usuario" 
                                    value={formData.Usuario} 
                                    onChange={handleInputChange} 
                                    required 
                                    className={style.input} 
                                />
                                <input 
                                    type="password" 
                                    name="Contrasena" 
                                    placeholder="Nueva Contraseña (opcional)" 
                                    value={formData.Contrasena} 
                                    onChange={handleInputChange} 
                                    className={style.input} 
                                />
                                <div className={style.actions}>
                                    <button 
                                        type="submit" 
                                        className={style.btnPrimary}
                                        disabled={localLoading}
                                    >
                                        {localLoading ? "Actualizando..." : "Actualizar"}
                                    </button>
                                    <button 
                                        type="button" 
                                        className={style.btnSecondary} 
                                        onClick={handleCancelarEdicion}
                                        disabled={localLoading}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <>
                            <h1 className={style.title}>Mi Perfil</h1>
                            <div className={style.perfilInfo}>
                                <h2 className={style.welcomeText}>¡Hola, {clienteActual.Nombre}!</h2>
                                
                                <div className={style.infoGrid}>
                                    <div className={style.infoItem}>
                                        <span className={style.infoLabel}>Nombre:</span>
                                        <span className={style.infoValue}>
                                            {clienteActual.Nombre} {clienteActual.Apellido}
                                        </span>
                                    </div>
                                    <div className={style.infoItem}>
                                        <span className={style.infoLabel}>Usuario:</span>
                                        <span className={style.infoValue}>{clienteActual.Usuario}</span>
                                    </div>
                                    <div className={style.infoItem}>
                                        <span className={style.infoLabel}>Email:</span>
                                        <span className={style.infoValue}>{clienteActual.Email}</span>
                                    </div>
                                    <div className={style.infoItem}>
                                        <span className={style.infoLabel}>Celular:</span>
                                        <span className={style.infoValue}>{clienteActual.NumCelular}</span>
                                    </div>
                                </div>
                                
                                <div className={style.actions}>
                                    <button 
                                        className={style.btnPrimary} 
                                        onClick={handleEditarPerfil}
                                        disabled={localLoading}
                                    >
                                        Editar Perfil
                                    </button>
                
                                    <button 
                                        className={style.btnDanger} 
                                        onClick={handleLogout}
                                        disabled={localLoading}
                                    >
                                        Cerrar Sesión
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        )
    }

    // Renderizar formulario de login/registro
    return (
        <div className={style.container}>
            <div className={style.card}>
                <h1 className={style.title}>
                    {modoLogin ? "Iniciar Sesión" : "Registrarse"}
                </h1>
                <form onSubmit={modoLogin ? handleLogin : handleSubmit}>
                    {!modoLogin && (
                        <>
                            <input 
                                type="text" 
                                name="Nombre" 
                                placeholder="Nombre" 
                                value={formData.Nombre} 
                                onChange={handleInputChange} 
                                required 
                                className={style.input} 
                            />
                            <input 
                                type="text" 
                                name="Apellido" 
                                placeholder="Apellido" 
                                value={formData.Apellido} 
                                onChange={handleInputChange} 
                                required 
                                className={style.input} 
                            />
                            <input 
                                type="text" 
                                name="NumCelular" 
                                placeholder="Celular" 
                                value={formData.NumCelular} 
                                onChange={handleInputChange} 
                                required 
                                className={style.input} 
                            />
                            <input 
                                type="email" 
                                name="Email" 
                                placeholder="Email" 
                                value={formData.Email} 
                                onChange={handleInputChange} 
                                required 
                                className={style.input} 
                            />
                        </>
                    )}
                    <input 
                        type="text" 
                        name="Usuario" 
                        placeholder="Usuario" 
                        value={modoLogin ? loginData.Usuario : formData.Usuario} 
                        onChange={modoLogin ? handleLoginChange : handleInputChange} 
                        required 
                        className={style.input} 
                    />
                    <input 
                        type="password" 
                        name="Contrasena" 
                        placeholder="Contraseña" 
                        value={modoLogin ? loginData.Contrasena : formData.Contrasena} 
                        onChange={modoLogin ? handleLoginChange : handleInputChange} 
                        required 
                        className={style.input} 
                    />
                    
                    {/* Términos y condiciones solo para registro */}
                    {!modoLogin && (
                        <div className={style.terminosContainer}>
                            <label className={style.terminosLabel}>
                                <input
                                    type="checkbox"
                                    checked={aceptaTerminos}
                                    onChange={e => setAceptaTerminos(e.target.checked)}
                                    className={style.terminosCheckbox}
                                />
                                Acepto los{' '}
                                <a 
                                    href="/terminos-condiciones" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className={style.terminosLink}
                                >
                                    términos y condiciones
                                </a>
                            </label>
                        </div>
                    )}
                    
                    <div className={style.actions}>
                        <button 
                            type="submit" 
                            className={style.btnPrimary}
                            disabled={localLoading}
                        >
                            {localLoading ? "Procesando..." : (modoLogin ? "Ingresar" : "Registrarse")}
                        </button>
                    </div>
                </form>
                
                <p className={style.toggle}>
                    {modoLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"} 
                    <button 
                        className={style.linkBtn} 
                        onClick={() => setModoLogin(!modoLogin)}
                        disabled={localLoading}
                    >
                        {modoLogin ? "Regístrate" : "Inicia sesión"}
                    </button>
                </p>
            </div>
        </div>
    )
}

export default PerfilForm