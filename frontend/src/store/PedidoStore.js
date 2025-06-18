import {create} from 'zustand'
import axios from 'axios'  

const usePedidoStore = create((set)=>({
    pedidos: [],
    addPedido: async(pedido)=>{
        try {
            const response = await axios.post('http://localhost:3001/pedidos',pedido)
            set((state)=>({pedidos: [...state.pedidos, response.data]}))// crea una copia el "..."
            return response.data
        } catch (error) {
            console.log("Error adding pedido", error.message)
            throw error
        }
    },
    fetchPedido: async()=>{
        try {
            const response = await axios.get('http://localhost:3001/pedidos')
            set({pedidos: response.data})
            return response.data
        } catch (error) {
            console.log("Error fecthing pedidos", error.message)
            return []
        }
    },
    deletePedido: async(ID_Pedido)=>{
        try {
            const response = await axios.delete(`http://localhost:3001/pedidos/${ID_Pedido}`)
            console.log("pedido delete:",response.data)
            set((state)=>({pedidos: state.pedidos.filter(pedido=>pedido.ID_Pedido !== ID_Pedido)})) // filtra todos lo estudiantes actualizados o
        } catch (error) {                                                               // diferentes del id eliminado
            console.log("Error deleting pedido:", error.message)
        }
    },
    //____----------Agregado---------------________
    updatePedido: async (ID_Pedido, updatedData) => {
        try {  // Realiza una solicitud PUT para actualizar el estudiante en el servidor.
            const response = await axios.put(`http://localhost:3001/pedidos/${ID_Pedido}`, updatedData)
            console.log("pedido updated:", response.data)
            // Actualiza el estado localmente, modificando solo el estudiante con el id coincidente.
            set((state) => ({pedidos: state.pedidos.map((pedido)=> pedido.ID_Pedido === ID_Pedido ? {...pedido, ...response.data} : pedido)})) // actualiza el estudiante en el estado
        } catch (error) {
            console.log("Error updating pedido:", error.message)
        }
    }
    
}))

export default usePedidoStore