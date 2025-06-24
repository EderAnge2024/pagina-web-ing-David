import {create} from 'zustand'  //permite guardar y compartir datos entre componentes
import axios from 'axios'  // permite comunicar tu frontend con el backend

const useDetallePedidoStore = create((set)=>({
    detallePedidos: [],
    addDetallePedido: async(detallePedido)=>{
        try {
            const response = await axios.post('http://localhost:3001/detallePedido',detallePedido)
            set((state)=>({detallePedidos: [...state.detallePedidos, response.data]}))// crea una copia el "..."
        } catch (error) {
            console.log("Error adding detallePedido", error.message)
        }
    },
    fetchDetallePedido: async()=>{
        try {
            const response = await axios.get('http://localhost:3001/detallePedido')
            set({detallePedidos: response.data})
            return response.data
        } catch (error) {
            console.log("Error fecthing detallePedidos", error.message)
            return []
        }
    },
    deleteDetallePedido: async(ID_Detalle)=>{
        try {
            const response = await axios.delete(`http://localhost:3001/detallePedido/${ID_Detalle}`)
            console.log("detallePedido delete:",response.data)
            set((state)=>({detallePedidos: state.detallePedidos.filter(detallePedido=>detallePedido.ID_Detalle !== ID_Detalle)})) // filtra todos lo estudiantes actualizados o
        } catch (error) {                                                               // diferentes del id eliminado
            console.log("Error deleting detallePedido:", error.message)
        }
    },
    //____----------Agregado---------------________
    updateDetallePedido: async (ID_Detalle, updatedData) => {
        try {  // Realiza una solicitud PUT para actualizar el estudiante en el servidor.
            const response = await axios.put(`http://localhost:3001/detallePedido/${ID_Detalle}`, updatedData)
            console.log("detallePedido updated:", response.data)
            // Actualiza el estado localmente, modificando solo el estudiante con el id coincidente.
            set((state) => ({detallePedidos: state.detallePedidos.map((detallePedido)=> detallePedido.ID_Detalle === ID_Detalle ? {...detallePedido, ...response.data} : detallePedido)})) // actualiza el estudiante en el estado
        } catch (error) {
            console.log("Error updating detallePedido:", error.message)
        }
    }
    
}))

export default useDetallePedidoStore