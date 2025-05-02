import {create} from 'zustand'  //permite guardar y compartir datos entre componentes
import axios from 'axios'  // permite comunicar tu frontend con el backend

const useProductoStore = create((set)=>({
    productos: [],
    addProducto: async(producto)=>{
        try {
            const response = await axios.post('http://localhost:3001/productos',producto)
            set((state)=>({productos: [...state.productos, response.data]}))
        } catch (error) {
            console.log("Error adding user", error.message)
        }
    },
    fetchProducto: async()=>{
        try {
            const response = await axios.get('http://localhost:3001/productos')
            set({productos: response.data})
        } catch (error) {
            console.log("Error fecthing productos", error.message)
        }
    },
    deleteProducto: async(ID_Producto)=>{
        try {
            const response = await axios.delete(`http://localhost:3001/productos/${ID_Producto}`)
            console.log("producto delete:",response.data)
            set((state)=>({productos: state.productos.filter(producto=>producto.ID_Producto !== ID_Producto)})) 
        } catch (error) {                                                       
            console.log("Error deleting producto:", error.message)
        }
    },

    updateProducto: async (ID_Producto, updatedData) => {
        try { 
            const response = await axios.put(`http://localhost:3001/productos/${ID_Producto}`, updatedData)
            console.log("producto updated:", response.data)
            set((state) => ({productos: state.productos.map((producto)=> producto.ID_Producto === ID_Producto ? {...producto, ...response.data} : producto)})) // actualiza el estudiante en el estado
        } catch (error) {
            console.log("Error updating producto:", error.message)
        }
    }
    
}))

export default useProductoStore