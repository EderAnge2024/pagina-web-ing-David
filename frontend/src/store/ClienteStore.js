import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'

const useClienteStore = create(
  persist(
    (set, get) => ({
      clientes: [],
      clienteActual: null,
      authToken: null, // <-- Agregado para guardar el token en el estado

      addCliente: async (cliente) => {
        try {
          const response = await axios.post('http://localhost:3001/clientes', cliente, {
            withCredentials: true
          });
          set((state) => ({
            clientes: [...state.clientes, response.data],
            clienteActual: response.data
          }));
          return response.data;
        } catch (error) {
          console.log("Error adding cliente", error.message);
          throw error;
        }
      },

      verificarClienteAutenticado: async () => {
        try {
          const response = await axios.get('http://localhost:3001/clientes/validar-token', {
            withCredentials: true
          });
          set({ clienteActual: response.data.cliente });
          return true;
        } catch (error) {
          console.log("Cliente no autenticado:", error.message);
      
          // Solo limpia el store, pero NO borres el token guardado localment
      
          return false;
        }
      },

      verificarClienteAutenticadoId: async () => {
        console.log("✅ Verificando autenticación del cliente...");
        const idCliente = localStorage.getItem("cliente_token");
        if (!idCliente) return null;
      
        const { clientes, fetchCliente } = get();
        
        if (clientes.length === 0) {
          await fetchCliente();
        }
      
        return clientes.find(c => c.ID_Cliente === Number(idCliente)) || null;
      },
    
      fetchCliente: async() => {
        try {
          const response = await axios.get('http://localhost:3001/clientes')
          set({clientes: response.data})
          return response.data
        } catch (error) {
          console.log("Error fetching clientes", error.message)
          return []
        }
      },
      
      deleteCliente: async(ID_Cliente) => {
        try {
          const response = await axios.delete(`http://localhost:3001/clientes/${ID_Cliente}`)
          console.log("cliente delete:",response.data)
          set((state) => ({clientes: state.clientes.filter(cliente => cliente.ID_Cliente !== ID_Cliente)}))
        } catch (error) {
          console.log("Error deleting cliente:", error.message)
        }
      },
      
      updateCliente: async (ID_Cliente, updatedData) => {
        try {
          const response = await axios.put(`http://localhost:3001/clientes/${ID_Cliente}`, updatedData)
          console.log("cliente updated:", response.data)
          set((state) => ({
            clientes: state.clientes.map((cliente) => 
              cliente.ID_Cliente === ID_Cliente ? {...cliente, ...response.data} : cliente
            )
          }))
        } catch (error) {
          console.log("Error updating cliente:", error.message)
        }
      }, 
      
      setClienteAutenticado: (clienteData, token) => {
        set({ clienteActual: clienteData, authToken: token }); // Guardar token en estado
    
        if (clienteData?.ID_Cliente) {
          localStorage.setItem("cliente_token", clienteData.ID_Cliente);
        }
    
        if (token) {
          localStorage.setItem("auth_token", token);
        }
      },
      
      logout: () => {
        console.log("🚨 logout ejecutado: limpiando cliente_token");
        console.trace("🧭 Rastro de quién llamó logout");
        set({ clienteActual: null, authToken: null }); // Limpiar token también
        localStorage.removeItem("cliente_token");
        localStorage.removeItem("auth_token");
      }
      
    }),
    {
      name: 'cliente-storage', // nombre para el localStorage
      partialize: (state) => ({ 
        clienteActual: state.clienteActual,
        authToken: state.authToken // <-- Persistir también el token
      }),
    }
  )
)

export default useClienteStore
