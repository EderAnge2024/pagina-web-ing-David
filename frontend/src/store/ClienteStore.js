import {create} from 'zustand'
import axios from 'axios'  

const useClienteStore = create((set)=>({
    clientes: [],
    addCliente: async (cliente) => {
      try {
        const response = await axios.post('http://localhost:3001/clientes', cliente);
        set((state) => ({ clientes: [...state.clientes, response.data] }));
        return response.data; // <--- Aquí retornamos el cliente creado
      } catch (error) {
        console.log("Error adding cliente", error.message);
        throw error; // para que el error se propague al componente
      }
    },

    fetchCliente: async()=>{
        try {
            const response = await axios.get('http://localhost:3001/clientes')
            set({clientes: response.data})
        } catch (error) {
            console.log("Error fecthing clientes", error.message)
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