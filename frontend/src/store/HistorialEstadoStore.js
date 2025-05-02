import {create} from 'zustand' 
import axios from 'axios'  

const useHistorialEstadoStore = create((set)=>({
    historialEstados: [],
    addHistorialEstado: async(historialEstado)=>{
        try {
            const response = await axios.post('http://localhost:3001/historialEstado',historialEstado)
            set((state)=>({historialEstados: [...state.historialEstados, response.data]}))
        } catch (error) {
            console.log("Error adding historialEstado", error.message)
        }
    },
    fetchHistorialEstado: async()=>{
        try {
            const response = await axios.get('http://localhost:3001/historialEstado')
            set({historialEstados: response.data})
        } catch (error) {
            console.log("Error fecthing historialEstados", error.message)
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
            set((state) => ({historialEstados: state.historialEstados.map((historialEstado)=> historialEstado.ID_Historial === ID_Historial ? {...historialEstado, ...response.data} : historialEstado)})) // actualiza el estudiante en el estado
        } catch (error) {
            console.log("Error updating historialEstado:", error.message)
        }
    }
    
}))

export default useHistorialEstadoStore