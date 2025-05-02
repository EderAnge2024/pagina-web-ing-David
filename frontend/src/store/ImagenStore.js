import {create} from 'zustand' 
import axios from 'axios'  

const useImagenStore = create((set)=>({
    imagens: [],
    addImagen: async(imagen)=>{
        try {
            const response = await axios.post('http://localhost:3001/imagen',imagen)
            set((state)=>({imagens: [...state.imagens, response.data]}))
        } catch (error) {
            console.log("Error adding imagen", error.message)
        }
    },
    fetchImagen: async()=>{
        try {
            const response = await axios.get('http://localhost:3001/imagen')
            set({imagens: response.data})
        } catch (error) {
            console.log("Error fecthing imagens", error.message)
        }
    },
    deleteImagen: async(ID_Imagen)=>{
        try {
            const response = await axios.delete(`http://localhost:3001/imagen/${ID_Imagen}`)
            console.log("imagen delete:",response.data)
            set((state)=>({imagens: state.imagens.filter(imagen=>imagen.ID_Imagen !== ID_Imagen)})) 
        } catch (error) {                                                             
            console.log("Error deleting imagen:", error.message)
        }
    },
    updateImagen: async (ID_Imagen, updatedData) => {
        try {  
            const response = await axios.put(`http://localhost:3001/imagen/${ID_Imagen}`, updatedData)
            console.log("imagen updated:", response.data)
            set((state) => ({imagens: state.imagens.map((imagen)=> imagen.ID_Imagen === ID_Imagen ? {...imagen, ...response.data} : imagen)})) // actualiza el estudiante en el estado
        } catch (error) {
            console.log("Error updating imagen:", error.message)
        }
    }
    
}))

export default useImagenStore