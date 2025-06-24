import {create} from 'zustand' 
import axios from 'axios'  

const useHistorialEstadoStore = create((set)=>({
    historialEstados: [],
    addHistorialEstado: async(historialEstado)=>{
        try {
            // CORRECCIÓN: Validar y formatear los datos antes de enviar
            const dataToSend = {
                ID_EstadoPedido: historialEstado.ID_EstadoPedido,
                ID_Pedido: historialEstado.ID_Pedido,
                Fecha: new Date(historialEstado.Fecha).toISOString()
            };
            
            console.log('Enviando historialEstado:', dataToSend); // Para debug
            
            const response = await axios.post('http://localhost:3001/historialEstado', dataToSend)
            set((state)=>({historialEstados: [...state.historialEstados, response.data]}))
            return response.data; // Devolver la respuesta para uso posterior
        } catch (error) {
            console.log("Error adding historialEstado:", error.message)
            console.log("Error details:", error.response?.data); // Más información del error
            throw error; // Re-lanzar el error para que se maneje en el componente
        }
    },
    fetchHistorialEstado: async()=>{
        try {
            const response = await axios.get('http://localhost:3001/historialEstado')
            set({historialEstados: response.data})
        } catch (error) {
            console.log("Error fetching historialEstados:", error.message)
        }
    },
    deleteHistorialEstado: async(ID_Historial)=>{
        try {
            const response = await axios.delete(`http://localhost:3001/historialEstado/${ID_Historial}`)
            console.log("historialEstado delete:",response.data)
            set((state)=>({historialEstados: state.historialEstados.filter(historialEstado=>historialEstado.ID_Historial !== ID_Historial)})) 
        } catch (error) {                                                             
            console.log("Error deleting historialEstado:", error.message)
        }
    },
    updateHistorialEstado: async (ID_Historial, updatedData) => {
        try {  
            const response = await axios.put(`http://localhost:3001/historialEstado/${ID_Historial}`, updatedData)
            console.log("historialEstado updated:", response.data)
            set((state) => ({historialEstados: state.historialEstados.map((historialEstado)=> historialEstado.ID_Historial === ID_Historial ? {...historialEstado, ...response.data} : historialEstado)}))
        } catch (error) {
            console.log("Error updating historialEstado:", error.message)
        }
    }
    
}))

export default useHistorialEstadoStore