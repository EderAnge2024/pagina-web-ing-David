import {create} from 'zustand'  //permite guardar y compartir datos entre componentes
import axios from 'axios'  // permite comunicar tu frontend con el backend

const useProyectoStore = create((set)=>({
    proyectos: [],
    addProyecto: async(proyecto)=>{
        try {
            const response = await axios.post('http://localhost:3001/proyecto',proyecto)
            set((state)=>({proyectos: [...state.proyectos, response.data]}))// crea una copia el "..."
        } catch (error) {
            console.log("Error adding user", error.message)
        }
    },
    fetchProyecto: async()=>{
        try {
            const response = await axios.get('http://localhost:3001/proyecto')
            set({proyectos: response.data})
        } catch (error) {
            console.log("Error fecthing proyectos", error.message)
        }
    },
    deleteProyecto: async(ID_Proyectos)=>{
        try {
            const response = await axios.delete(`http://localhost:3001/proyecto/${ID_Proyectos}`)
            console.log("proyecto delete:",response.data)
            set((state)=>({proyectos: state.proyectos.filter(proyecto=>proyecto.ID_Proyectos !== ID_Proyectos)})) // filtra todos lo estudiantes actualizados o
        } catch (error) {                                                               // diferentes del id eliminado
            console.log("Error deleting proyecto:", error.message)
        }
    },
    updateProyecto: async (ID_Proyectos, updatedData) => {
        try { 
            const response = await axios.put(`http://localhost:3001/proyecto/${ID_Proyectos}`, updatedData)
            console.log("proyecto updated:", response.data)
            set((state) => ({proyectos: state.proyectos.map((proyecto)=> proyecto.ID_Proyectos === ID_Proyectos ? {...proyecto, ...response.data} : proyecto)})) // actualiza el estudiante en el estado
        } catch (error) {
            console.log("Error updating proyecto:", error.message)
        }
    }
    
}))

export default useProyectoStore