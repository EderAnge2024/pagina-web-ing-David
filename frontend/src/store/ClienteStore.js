import {create} from 'zustand'
import axios from 'axios'  

const useClienteStore = create((set)=>({
    clientes: [],
    addCliente: async(cliente)=>{
        try {
            const response = await axios.post('http://localhost:3001/cliente',cliente)
            set((state)=>({clientes: [...state.clientes, response.data]}))// crea una copia el "..."
        } catch (error) {
            console.log("Error adding user", error.message)
        }
    },
    fetchCliente: async()=>{
        try {
            const response = await axios.get('http://localhost:3001/cliente')
            set({clientes: response.data})
        } catch (error) {
            console.log("Error fecthing clientes", error.message)
        }
    },
    deleteCliente: async(clienteId)=>{
        try {
            const response = await axios.delete(`http://localhost:3001/cliente/${clienteId}`)
            console.log("cliente delete:",response.data)
            set((state)=>({clientes: state.clientes.filter(cliente=>cliente.clienteId !== clienteId)})) // filtra todos lo estudiantes actualizados o
        } catch (error) {                                                               // diferentes del id eliminado
            console.log("Error deleting cliente:", error.message)
        }
    },
    //____----------Agregado---------------________
    updateCliente: async (clienteId, updatedData) => {
        try {  // Realiza una solicitud PUT para actualizar el estudiante en el servidor.
            const response = await axios.put(`http://localhost:3001/cliente/${clienteId}`, updatedData)
            console.log("cliente updated:", response.data)
            // Actualiza el estado localmente, modificando solo el estudiante con el id coincidente.
            set((state) => ({clientes: state.clientes.map((cliente)=> cliente.clienteId === clienteId ? {...cliente, ...response.data} : cliente)})) // actualiza el estudiante en el estado
        } catch (error) {
            console.log("Error updating cliente:", error.message)
        }
    }
    
}))

export default useClienteStore