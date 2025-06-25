// PerfilFrom.jsx
import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import useClienteStore from '../../store/ClienteStore'
import style from './perfil.module.css'
import Principal from '../Principal'

const PerfilFrom = () => {
    const { addCliente, fetchCliente, updateCliente, verificarClienteAutenticado, clienteActual, logout } = useClienteStore()
    const setClienteAutenticado = useClienteStore(state => state.setClienteAutenticado);

    const [modoLogin, setModoLogin] = useState(true) // true = login, false = registro
    const [editingCliente, setEditingCliente] = useState(null)
    const [formData, setFormData] = useState({
        Nombre: "",
        Apellido: "",
        NumCelular: "",
        Email: "",
        Usuario: "",
        Contrasena: "",
    })
    const [loginData, setLoginData] = useState({ Usuario: "", Contrasena: "" })
    const navigate = useNavigate()
    useEffect(() => {
        const loadInitialData = async () => {
            await fetchCliente();
            
            // Verificar si hay un cliente en el localStorage
            const storedCliente = localStorage.getItem('clienteData');
            if (storedCliente) {
                setClienteAutenticado(JSON.parse(storedCliente));
            } else {
                await verificarClienteAutenticado();
            }
        };
        
        loadInitialData();
    }, [fetchCliente, verificarClienteAutenticado, setClienteAutenticado]);

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }, [])

    const handleLoginChange = useCallback((e) => {
        const { name, value } = e.target
        setLoginData(prev => ({ ...prev, [name]: value }))
    }, [])

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault()
        try {
            await addCliente(formData)
            setFormData({ Nombre: "", Apellido: "", NumCelular: "", Email: "", Usuario: "", Contrasena: "" })
            alert("Cliente registrado correctamente")
            setModoLogin(true)
        } catch (error) {
            alert("Error al registrar cliente")
        }
    }, [addCliente, formData])

    const handleLogin = useCallback(async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/clientes/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(loginData),
              credentials: 'include'
            });
        
            const data = await response.json();
        
            if (response.ok) {
              // Guardar en localStorage
              localStorage.setItem('authToken', data.token);
              localStorage.setItem('cliente_token', data.cliente.ID_Cliente);
              localStorage.setItem('clienteData', JSON.stringify(data.cliente));
              
              // Guardar en el store (que también persiste gracias a zustand)
              setClienteAutenticado(data.cliente, data.token);
        
              alert("Login exitoso");
              navigate('/');
            } else {
              alert(data.mensaje || "Error al iniciar sesión");
            }
          } catch (error) {
            console.error("Error en login:", error);
            alert("Error del servidor");
          }
    }, [loginData, navigate, setClienteAutenticado]);
    
    const handleEditClick = (cliente) => {
        setModoLogin(false)
        setEditingCliente(cliente)
        setFormData({ ...cliente })
    }

    const handleUpdate = useCallback(async () => {
        try {
            await updateCliente(editingCliente.ID_Cliente, formData)
            setEditingCliente(null)
            alert("Cliente actualizado correctamente")
        } catch (error) {
            alert("Error al actualizar cliente")
        }
    }, [editingCliente, formData, updateCliente])

    const handleCancelEdit = () => {
        setEditingCliente(null)
        setFormData({ Nombre: "", Apellido: "", NumCelular: "", Email: "", Usuario: "", Contrasena: "" })
    }

    return (
        <div className={style.container}>
            <div className={style.card}>
                <h1 className={style.title}>{modoLogin ? "Iniciar Sesión" : editingCliente ? "Editar Cliente" : "Registrarse"}</h1>
                <form onSubmit={modoLogin ? handleLogin : editingCliente ? (e) => { e.preventDefault(); handleUpdate(); } : handleSubmit}>
                    {!modoLogin && (
                        <>
                            <input type="text" name="Nombre" placeholder="Nombre" value={formData.Nombre} onChange={handleInputChange} required className={style.input} />
                            <input type="text" name="Apellido" placeholder="Apellido" value={formData.Apellido} onChange={handleInputChange} required className={style.input} />
                            <input type="text" name="NumCelular" placeholder="Celular" value={formData.NumCelular} onChange={handleInputChange} required className={style.input} />
                            <input type="email" name="Email" placeholder="Email" value={formData.Email} onChange={handleInputChange} required className={style.input} />
                        </>
                    )}
                    <input type="text" name="Usuario" placeholder="Usuario" value={modoLogin ? loginData.Usuario : formData.Usuario} onChange={modoLogin ? handleLoginChange : handleInputChange} required className={style.input} />
                    <input type="password" name="Contrasena" placeholder="Contraseña" value={modoLogin ? loginData.Contrasena : formData.Contrasena} onChange={modoLogin ? handleLoginChange : handleInputChange} required className={style.input} />

                    <div className={style.actions}>
                        <button type="submit" className={style.btnPrimary}>{modoLogin ? "Ingresar" : editingCliente ? "Actualizar" : "Registrarse"}</button>
                        {editingCliente && <button type="button" className={style.btnSecondary} onClick={handleCancelEdit}>Cancelar</button>}
                    </div>
                </form>
                <p className={style.toggle}>
                    {modoLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"} <button className={style.linkBtn} onClick={() => { setModoLogin(!modoLogin); handleCancelEdit(); }}>{modoLogin ? "Regístrate" : "Inicia sesión"}</button>
                </p>
            </div>
        </div>
    )
}

export default PerfilFrom
