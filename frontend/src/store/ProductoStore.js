import {create} from 'zustand'  //permite guardar y compartir datos entre componentes
import axios from 'axios'  // permite comunicar tu frontend con el backend

const useProductoStore = create((set, get)=>({
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
            set((state) => ({productos: state.productos.map((producto)=> producto.ID_Producto === ID_Producto ? {...producto, ...response.data} : producto)}))
        } catch (error) {
            console.log("Error updating producto:", error.message)
        }
    },

    // Nueva función para disminuir stock
    decreaseStock: async (ID_Producto, cantidadVendida) => {
        try {
            const productos = get().productos;
            const producto = productos.find(p => p.ID_Producto === ID_Producto);
            
            if (!producto) {
                throw new Error('Producto no encontrado');
            }

            const cantidadActual = parseInt(producto.cantidad_Disponible);
            const nuevaCantidad = cantidadActual - cantidadVendida;

            if (nuevaCantidad < 0) {
                throw new Error('Stock insuficiente');
            }

            // Actualizar en el backend
            const updatedData = {
                ...producto,
                cantidad_Disponible: nuevaCantidad.toString()
            };

            const response = await axios.put(`http://localhost:3001/productos/${ID_Producto}`, updatedData);
            
            // Actualizar en el estado local
            set((state) => ({
                productos: state.productos.map((producto) => 
                    producto.ID_Producto === ID_Producto 
                        ? {...producto, cantidad_Disponible: nuevaCantidad.toString()} 
                        : producto
                )
            }));

            console.log("Stock actualizado:", response.data);
            return { success: true, nuevaCantidad };
            
        } catch (error) {
            console.log("Error decreasing stock:", error.message);
            return { success: false, error: error.message };
        }
    },

    // Función para aumentar stock (útil para devoluciones o restock)
    increaseStock: async (ID_Producto, cantidadAgregada) => {
        try {
            const productos = get().productos;
            const producto = productos.find(p => p.ID_Producto === ID_Producto);
            
            if (!producto) {
                throw new Error('Producto no encontrado');
            }

            const cantidadActual = parseInt(producto.cantidad_Disponible);
            const nuevaCantidad = cantidadActual + cantidadAgregada;

            // Actualizar en el backend
            const updatedData = {
                ...producto,
                cantidad_Disponible: nuevaCantidad.toString()
            };

            const response = await axios.put(`http://localhost:3001/productos/${ID_Producto}`, updatedData);
            
            // Actualizar en el estado local
            set((state) => ({
                productos: state.productos.map((producto) => 
                    producto.ID_Producto === ID_Producto 
                        ? {...producto, cantidad_Disponible: nuevaCantidad.toString()} 
                        : producto
                )
            }));

            console.log("Stock aumentado:", response.data);
            return { success: true, nuevaCantidad };
            
        } catch (error) {
            console.log("Error increasing stock:", error.message);
            return { success: false, error: error.message };
        }
    },

    // Función para verificar disponibilidad de stock
    checkStock: (ID_Producto, cantidadRequerida) => {
        const productos = get().productos;
        const producto = productos.find(p => p.ID_Producto === ID_Producto);
        
        if (!producto) {
            return { available: false, error: 'Producto no encontrado' };
        }

        const cantidadDisponible = parseInt(producto.cantidad_Disponible);
        
        return {
            available: cantidadDisponible >= cantidadRequerida,
            cantidadDisponible,
            cantidadRequerida
        };
    }
}))

export default useProductoStore