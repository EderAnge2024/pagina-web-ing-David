import {create} from 'zustand'  //permite guardar y compartir datos entre componentes
import axios from 'axios'  // permite comunicar tu frontend con el backend

const useDetallePedidoStore = create((set)=>({
    detallePedidos: [],
    addDetallePedido: async(detalle)=>{
        try {
            const response = await axios.post('http://localhost:3001/detalle',detalle)
            set((state)=>({detallePedidos: [...state.detallePedidos, response.data]}))// crea una copia el "..."
        } catch (error) {
            console.log("Error adding detalle", error.message)
        }
    },
    fetchDetallePedido: async()=>{
        try {
            const response = await axios.get('http://localhost:3001/detalle')
            set({detallePedidos: response.data})
        } catch (error) {
            console.log("Error fecthing detallePedidos", error.message)
        }
    },
    deleteDetallePedido: async(ID_Detalle)=>{
        try {
            const response = await axios.delete(`http://localhost:3001/detalle/${ID_Detalle}`)
            console.log("detalle delete:",response.data)
            set((state)=>({detallePedidos: state.detallePedidos.filter(detalle=>detalle.ID_Detalle !== ID_Detalle)})) // filtra todos lo estudiantes actualizados o
        } catch (error) {                                                               // diferentes del id eliminado
            console.log("Error deleting detalle:", error.message)
        }
    },
    //____----------Agregado---------------________
    updateDetallePedido: async (ID_Detalle, updatedData) => {
        try {  // Realiza una solicitud PUT para actualizar el estudiante en el servidor.
            const response = await axios.put(`http://localhost:3001/detalle/${ID_Detalle}`, updatedData)
            console.log("detalle updated:", response.data)
            // Actualiza el estado localmente, modificando solo el estudiante con el id coincidente.
            set((state) => ({detallePedidos: state.detallePedidos.map((detalle)=> detalle.ID_Detalle === ID_Detalle ? {...detalle, ...response.data} : detalle)})) // actualiza el estudiante en el estado
        } catch (error) {
            console.log("Error updating detalle:", error.message)
        }
    }
    
}))

export default useDetallePedidoStore