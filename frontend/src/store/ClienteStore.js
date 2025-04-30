import {create} from 'zustand'
import axios from 'axios'  

const useClienteStore = create((set)=>({
    clientes: [],
    addCliente: async(cliente)=>{
        try {
            const response = await axios.post('http://localhost:3001/cliente',cliente)
            set((state)=>({clientes: [...state.clientes, response.data]}))// crea una copia el "..."
        } catch (error) {
<<<<<<< HEAD
            console.log("Error adding user", error.message)
=======
            console.log("Error adding cliente", error.message)
>>>>>>> 631cd88f76fa19b2b50f8e9bf42c1630a4b9166c
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
<<<<<<< HEAD
    deleteCliente: async(clienteId)=>{
        try {
            const response = await axios.delete(`http://localhost:3001/cliente/${clienteId}`)
            console.log("cliente delete:",response.data)
            set((state)=>({clientes: state.clientes.filter(cliente=>cliente.clienteId !== clienteId)})) // filtra todos lo estudiantes actualizados o
=======
    deleteCliente: async(ID_Cliente)=>{
        try {
            const response = await axios.delete(`http://localhost:3001/cliente/${ID_Cliente}`)
            console.log("cliente delete:",response.data)
            set((state)=>({clientes: state.clientes.filter(cliente=>cliente.ID_Cliente !== ID_Cliente)})) // filtra todos lo estudiantes actualizados o
>>>>>>> 631cd88f76fa19b2b50f8e9bf42c1630a4b9166c
        } catch (error) {                                                               // diferentes del id eliminado
            console.log("Error deleting cliente:", error.message)
        }
    },
    //____----------Agregado---------------________
<<<<<<< HEAD
    updateCliente: async (clienteId, updatedData) => {
        try {  // Realiza una solicitud PUT para actualizar el estudiante en el servidor.
            const response = await axios.put(`http://localhost:3001/cliente/${clienteId}`, updatedData)
            console.log("cliente updated:", response.data)
            // Actualiza el estado localmente, modificando solo el estudiante con el id coincidente.
            set((state) => ({clientes: state.clientes.map((cliente)=> cliente.clienteId === clienteId ? {...cliente, ...response.data} : cliente)})) // actualiza el estudiante en el estado
=======
    updateCliente: async (ID_Cliente, updatedData) => {
        try {  // Realiza una solicitud PUT para actualizar el estudiante en el servidor.
            const response = await axios.put(`http://localhost:3001/cliente/${ID_Cliente}`, updatedData)
            console.log("cliente updated:", response.data)
            // Actualiza el estado localmente, modificando solo el estudiante con el id coincidente.
            set((state) => ({clientes: state.clientes.map((cliente)=> cliente.ID_Cliente === ID_Cliente ? {...cliente, ...response.data} : cliente)})) // actualiza el estudiante en el estado
>>>>>>> 631cd88f76fa19b2b50f8e9bf42c1630a4b9166c
        } catch (error) {
            console.log("Error updating cliente:", error.message)
        }
    }
    
}))

export default useClienteStore