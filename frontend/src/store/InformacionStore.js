import {create} from 'zustand'  //permite guardar y compartir datos entre componentes
import axios from 'axios'  // permite comunicar tu frontend con el backend

const useInformacionStore = create((set)=>({
    informacions: [],
    addInformacion: async(informacion)=>{
        try {
            const response = await axios.post('http://localhost:3001/informacion',informacion)
            set((state)=>({informacions: [...state.informacions, response.data]}))// crea una copia el "..."
        } catch (error) {
            console.log("Error adding user", error.message)
        }
    },
    fetchInformacion: async()=>{
        try {
            const response = await axios.get('http://localhost:3001/informacion')
            set({informacions: response.data})
            return response.data
        } catch (error) {
            console.log("Error fecthing informacions", error.message)
            return []
        }
    },
    deleteInformacion: async(ID_Informacion)=>{
        try {
            const response = await axios.delete(`http://localhost:3001/informacion/${ID_Informacion}`)
            console.log("informacion delete:",response.data)
            set((state)=>({informacions: state.informacions.filter(informacion=>informacion.ID_Informacion !== ID_Informacion)})) // filtra todos lo estudiantes actualizados o
        } catch (error) {                                                               // diferentes del id eliminado
            console.log("Error deleting informacion:", error.message)
        }
    },
    updateInformacion: async (ID_Informacion, updatedData) => {
        try { 
            const response = await axios.put(`http://localhost:3001/informacion/${ID_Informacion}`, updatedData)
            console.log("informacion updated:", response.data)
            set((state) => ({informacions: state.informacions.map((informacion)=> informacion.ID_Informacion === ID_Informacion ? {...informacion, ...response.data} : informacion)})) // actualiza el estudiante en el estado
        } catch (error) {
            console.log("Error updating informacion:", error.message)
        }
    }
    
}))

export default useInformacionStore