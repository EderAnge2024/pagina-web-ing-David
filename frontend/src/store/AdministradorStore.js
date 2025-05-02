import {create} from 'zustand'
import axios from 'axios'  

const useAdministradorStore = create((set)=>({
    administradors: [],
    addAdministrador: async(administrador)=>{
        try {
            const response = await axios.post('http://localhost:3001/administrador',administrador)
            set((state)=>({administradors: [...state.administradors, response.data]}))
        } catch (error) {
            console.log("Error adding administrador", error.message)
        }
    },
    fetchAdministrador: async()=>{
        try {
            const response = await axios.get('http://localhost:3001/administrador')
            set({administradors: response.data})
        } catch (error) {
            console.log("Error fecthing administradors", error.message)
        }
    },
    deleteAdministrador: async(ID_Administrador)=>{
        try {
            const response = await axios.delete(`http://localhost:3001/administrador/${ID_Administrador}`)
            console.log("administrador delete:",response.data)
            set((state)=>({administradors: state.administradors.filter(administrador=>administrador.ID_Administrador !== ID_Administrador)})) 
        } catch (error) {                                                          
            console.log("Error deleting administrador:", error.message)
        }
    },
    //____----------Agregado---------------________
    updateAdministrador: async (ID_Administrador, updatedData) => {
        try { 
            const response = await axios.put(`http://localhost:3001/administrador/${ID_Administrador}`, updatedData)
            console.log("administrador updated:", response.data)
            set((state) => ({administradors: state.administradors.map((administrador)=> administrador.ID_Administrador === ID_Administrador ? {...administrador, ...response.data} : administrador)})) 
        } catch (error) {
            console.log("Error updating administrador:", error.message)
        }
    }
    
}))

export default useAdministradorStore