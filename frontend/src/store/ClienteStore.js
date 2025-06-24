import {create} from 'zustand'
import axios from 'axios'  

const useClienteStore = create((set)=>({
    clientes: [],
    clienteActual: null,
    
    addCliente: async (cliente) => {
      try {
        const response = await axios.post('http://localhost:3001/clientes', cliente, {
          withCredentials: true // ✅ necesario para que se envíe/reciba la cookie
        });
        set((state) => ({
          clientes: [...state.clientes, response.data],
          clienteActual: response.data // guarda al cliente logueado
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
          withCredentials: true // ✅ para enviar la cookie al backend
        });
        set({ clienteActual: response.data.cliente }); // guarda cliente actual
        return true;
      } catch (error) {
        console.log("Cliente no autenticado:", error.message);
        set({ clienteActual: null });
        return false;
      }
    },
    verificarClienteAutenticadoId : async () => {
      const idCliente = localStorage.getItem("cliente_token");
      if (!idCliente) return null;
    
      const { clientes, fetchCliente } = useClienteStore.getState();
      
      // Si aún no se ha cargado la lista de clientes, la cargamos
      if (clientes.length === 0) {
        await fetchCliente();
      }
    
      return clientes.find(c => c.ID_Cliente === Number(idCliente)) || null;
    },
  
    fetchCliente: async()=>{
        try {
            const response = await axios.get('http://localhost:3001/clientes')
            set({clientes: response.data})
            return response.data
        } catch (error) {
            console.log("Error fecthing clientes", error.message)
            return []
        }
    },
    deleteCliente: async(ID_Cliente)=>{
        try {
            const response = await axios.delete(`http://localhost:3001/clientes/${ID_Cliente}`)
            console.log("cliente delete:",response.data)
            set((state)=>({clientes: state.clientes.filter(cliente=>cliente.ID_Cliente !== ID_Cliente)})) // filtra todos lo estudiantes actualizados o
        } catch (error) {                                                               // diferentes del id eliminado
            console.log("Error deleting cliente:", error.message)
        }
    },
    //____----------Agregado---------------________
    updateCliente: async (ID_Cliente, updatedData) => {
        try {  // Realiza una solicitud PUT para actualizar el estudiante en el servidor.
            const response = await axios.put(`http://localhost:3001/clientes/${ID_Cliente}`, updatedData)
            console.log("cliente updated:", response.data)
            // Actualiza el estado localmente, modificando solo el estudiante con el id coincidente.
            set((state) => ({clientes: state.clientes.map((cliente)=> cliente.ID_Cliente === ID_Cliente ? {...cliente, ...response.data} : cliente)})) // actualiza el estudiante en el estado
        } catch (error) {
            console.log("Error updating cliente:", error.message)
        }
    }
    
}))

export default useClienteStore