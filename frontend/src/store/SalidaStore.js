import {create} from 'zustand'
import axios from 'axios'  // para hacer peticiones

const useSalidaStore = create((set)=>({
    salidas: [],
    addSalida: async(salida)=>{
        try {
            const response = await axios.post('http://localhost:3001/salida',salida)
            set((state)=>({salidas: [...state.salidas, response.data]}))// crea una copia el "..."
        } catch (error) {
            console.log("Error adding user", error.message)
        }
    },
    fetchSalida: async()=>{
        try {
            const response = await axios.get('http://localhost:3001/salida')
            set({salidas: response.data})
        } catch (error) {
            console.log("Error fecthing salidas", error.message)
        }
    },
    deleteSalida: async(salidaId)=>{
        try {
            const response = await axios.delete(`http://localhost:3001/salida/${salidaId}`)
            console.log("salida delete:",response.data)
            set((state)=>({salidas: state.salidas.filter(salida=>salida.salidaId !== salidaId)})) // filtra todos lo estudiantes actualizados o
        } catch (error) {                                                               // diferentes del id eliminado
            console.log("Error deleting salida:", error.message)
        }
    },
    //____----------Agregado---------------________
    updateSalida: async (salidaId, updatedData) => {
        try {  // Realiza una solicitud PUT para actualizar el estudiante en el servidor.
            const response = await axios.put(`http://localhost:3001/salida/${salidaId}`, updatedData)
            console.log("salida updated:", response.data)
            // Actualiza el estado localmente, modificando solo el estudiante con el id coincidente.
            set((state) => ({salidas: state.salidas.map((salida)=> salida.salidaId === salidaId ? {...salida, ...response.data} : salida)})) // actualiza el estudiante en el estado
        } catch (error) {
            console.log("Error updating salida:", error.message)
        }
    }
    
}))

export default useSalidaStore