import { create } from 'zustand'
import axios from 'axios'

// Store optimizado sin funciones redundantes
const useClienteStore = create((set, get) => ({
  clientes: [], 
  clienteActual: null,
  isAuthenticated: false,
  authToken: null,
  loading: false,

  // Inicializar desde localStorage al cargar la app
  initializeFromStorage: () => {
    try {
      const token = localStorage.getItem('authToken')
      const clienteData = localStorage.getItem('clienteData')
      
      if (token && clienteData) {
        const cliente = JSON.parse(clienteData)
        set({ 
          clienteActual: cliente, 
          isAuthenticated: true,
          authToken: token 
        })
        return true
      }
    } catch (error) {
      console.error('Error al inicializar desde storage:', error)
      get().clearStorage()
    }
    return false
  },

  // Limpiar storage completamente
  clearStorage: () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('clienteData')
    localStorage.removeItem('cliente_token')
    
    // Limpiar cookies también
    document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    document.cookie = 'connect.sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  },

  // Registrar nuevo cliente
  addCliente: async (cliente) => {
    set({ loading: true })
    try {
      const response = await axios.post('http://localhost:3001/clientes', cliente, {
        withCredentials: true
      })
      
      set((state) => ({
        clientes: [...state.clientes, response.data],
        loading: false
      }))
      
      return response.data
    } catch (error) {
      set({ loading: false })
      console.error("Error adding cliente:", error.message)
      throw error
    }
  },

  // Login de cliente
  loginCliente: async (loginData) => {
    set({ loading: true })
    try {
      const response = await axios.post('http://localhost:3001/clientes/login', loginData, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      })

      if (response.data && response.data.cliente && response.data.token) {
        const { cliente, token } = response.data
        
        // Guardar en localStorage
        localStorage.setItem('authToken', token)
        localStorage.setItem('clienteData', JSON.stringify(cliente))
        localStorage.setItem('cliente_token', cliente.ID_Cliente.toString())
        
        // Actualizar estado
        set({ 
          clienteActual: cliente, 
          isAuthenticated: true,
          authToken: token,
          loading: false
        })
        
        return { success: true, cliente, message: '¡Bienvenido de vuelta!' }
      } else {
        throw new Error('Respuesta del servidor inválida')
      }
    } catch (error) {
      set({ loading: false })
      const errorMessage = error.response?.data?.mensaje || error.message || 'Error al iniciar sesión'
      return { success: false, message: errorMessage }
    }
  },

  // Verificar token en el servidor
  verificarToken: async () => {
    try {
      const token = localStorage.getItem('authToken')
      if (!token) return false

      const response = await axios.get('http://localhost:3001/clientes/validar-token', {
        withCredentials: true,
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.data && response.data.cliente) {
        set({ 
          clienteActual: response.data.cliente,
          isAuthenticated: true,
          authToken: token
        })
        return true
      }
      
      return false
    } catch (error) {
      console.error('Token inválido:', error.message)
      get().logout()
      return false
    }
  },

  // Actualizar cliente (solo si es necesario para tu app)
  updateCliente: async (ID_Cliente, updatedData) => {
    set({ loading: true })
    try {
      const response = await axios.put(`http://localhost:3001/clientes/${ID_Cliente}`, updatedData, {
        withCredentials: true
      })
      
      const clienteActualizado = response.data
      
      // Actualizar localStorage si es el cliente actual
      const state = get()
      if (state.clienteActual && state.clienteActual.ID_Cliente === ID_Cliente) {
        const clienteConDatos = { ...state.clienteActual, ...clienteActualizado }
        localStorage.setItem('clienteData', JSON.stringify(clienteConDatos))
        
        set({
          clienteActual: clienteConDatos,
          loading: false
        })
      }
      
      return clienteActualizado
    } catch (error) {
      set({ loading: false })
      console.error("Error updating cliente:", error.message)
      throw error
    }
  },

  // LOGOUT
  logout: async () => {
    console.log("🚨 Iniciando logout completo...")
    set({ loading: true })
    
    try {
      // Intentar logout en el servidor
      await axios.post('http://localhost:3001/clientes/logout', {}, {
        withCredentials: true
      })
    } catch (error) {
      console.warn('Error en logout del servidor:', error.message)
    }
    
    // Limpiar todo el estado
    set({ 
      clienteActual: null, 
      isAuthenticated: false,
      authToken: null,
      loading: false
    })
    
    // Limpiar storage
    get().clearStorage()
    
    console.log("✅ Logout completado exitosamente")
    
    // Redireccionar después de un pequeño delay
    setTimeout(() => {
      window.location.href = '/'
    }, 100)
  }
}))
 
export default useClienteStore