import {create} from 'zustand'  //permite guardar y compartir datos entre componentes
import axios from 'axios'  // permite comunicar tu frontend con el backend

const useCategoriaStore = create((set)=>({
    categorias: [],
    addCategoria: async(categoria)=>{
        try {
            const response = await axios.post('http://localhost:3001/categoria',categoria)
            set((state)=>({categorias: [...state.categorias, response.data]}))// crea una copia el "..."
        } catch (error) {
            console.log("Error adding categoria", error.message)
        }
    },
    fetchCategoria: async()=>{
        try {
            const response = await axios.get('http://localhost:3001/categoria')
            set({categorias: response.data})
        } catch (error) {
            console.log("Error fecthing categorias", error.message)
        }
    },
    deleteCategoria: async(ID_Categoria)=>{
        try {
            const response = await axios.delete(`http://localhost:3001/categoria/${ID_Categoria}`)
            console.log("categoria delete:",response.data)
            set((state)=>({categorias: state.categorias.filter(categoria=>categoria.ID_Categoria !== ID_Categoria)})) // filtra todos lo estudiantes actualizados o
        } catch (error) {                                                               // diferentes del id eliminado
            console.log("Error deleting categoria:", error.message)
        }
    },
    //____----------Agregado---------------________
    updateCategoria: async (ID_Categoria, updatedData) => {
        try {  // Realiza una solicitud PUT para actualizar el estudiante en el servidor.
            const response = await axios.put(`http://localhost:3001/categoria/${ID_Categoria}`, updatedData)
            console.log("categoria updated:", response.data)
            // Actualiza el estado localmente, modificando solo el estudiante con el id coincidente.
            set((state) => ({categorias: state.categorias.map((categoria)=> categoria.ID_Categoria === ID_Categoria ? {...categoria, ...response.data} : categoria)})) // actualiza el estudiante en el estado
        } catch (error) {
            console.log("Error updating categoria:", error.message)
        }
    }
    
}))

export default useCategoriaStore