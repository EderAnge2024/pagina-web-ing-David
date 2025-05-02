import {create} from 'zustand'  //permite guardar y compartir datos entre componentes
import axios from 'axios'  // permite comunicar tu frontend con el backend

const useEstadoPedidoStore = create((set)=>({
    estadoPedidos: [],
    addEstadoPedido: async(estadoPedido)=>{
        try {
            const response = await axios.post('http://localhost:3001/estadoPedido',estadoPedido)
            set((state)=>({estadoPedidos: [...state.estadoPedidos, response.data]}))
        } catch (error) {
            console.log("Error adding user", error.message)
        }
    },
    fetchEstadoPedido: async()=>{
        try {
            const response = await axios.get('http://localhost:3001/estadoPedido')
            set({estadoPedidos: response.data})
        } catch (error) {
            console.log("Error fecthing estadoPedidos", error.message)
        }
    },
    deleteEstadoPedido: async(ID_EstadoPedido)=>{
        try {
            const response = await axios.delete(`http://localhost:3001/estadoPedido/${ID_EstadoPedido}`)
            console.log("estadoPedido delete:",response.data)
            set((state)=>({estadoPedidos: state.estadoPedidos.filter(estadoPedido=>estadoPedido.ID_EstadoPedido !== ID_EstadoPedido)})) 
        } catch (error) {                                                       
            console.log("Error deleting estadoPedido:", error.message)
        }
    },

    updateEstadoPedido: async (ID_EstadoPedido, updatedData) => {
        try { 
            const response = await axios.put(`http://localhost:3001/estadoPedido/${ID_EstadoPedido}`, updatedData)
            console.log("estadoPedido updated:", response.data)
            set((state) => ({estadoPedidos: state.estadoPedidos.map((estadoPedido)=> estadoPedido.ID_EstadoPedido === ID_EstadoPedido ? {...estadoPedido, ...response.data} : estadoPedido)})) // actualiza el estudiante en el estado
        } catch (error) {
            console.log("Error updating estadoPedido:", error.message)
        }
    }
    
}))

export default useEstadoPedidoStore