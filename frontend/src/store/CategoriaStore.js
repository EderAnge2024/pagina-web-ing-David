import {create} from 'zustand'
import axios from 'axios'

const useCategoriaStore = create((set, get) => ({
    categorias: [],
    loading: false,
    error: null,
    
    addCategoria: async (categoria) => {
        try {
            console.log("Añadiendo categoría:", categoria);
            const response = await axios.post('http://localhost:3001/Categorias', categoria);
            // Ensure we're using the data from the response
            const newCategoria = response.data;
            console.log("Respuesta del servidor al añadir:", newCategoria);
            
            set((state) => ({ 
                categorias: [...state.categorias, newCategoria],
                error: null
            }));
            
            // Refresh the categories list to ensure synchronization
            await get().fetchCategoria();
            return true;
        } catch (error) {
            console.error("Error adding categoria:", error);
            set({ error: error.message });
            return false;
        }
    },
    
    fetchCategoria: async () => {
        set({ loading: true });
        try {
            console.log("Fetching categorias...");
            const response = await axios.get('http://localhost:3001/Categorias');
            // Log the fetched data to help with debugging
            console.log('Fetched categorias:', response.data);
            
            // Make sure we're setting the categorias correctly
            set({ 
                categorias: response.data,
                loading: false,
                error: null
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching categorias:", error);
            set({ 
                loading: false, 
                error: error.message 
            });
            throw error;
        }
    },
    
    deleteCategoria: async(ID_Categoria) => {
        try {
            await axios.delete(`http://localhost:3001/Categorias/${ID_Categoria}`);
            set((state) => ({
                categorias: state.categorias.filter(categoria => categoria.ID_Categoria !== ID_Categoria),
                error: null
            }));
            return true;
        } catch (error) {
            console.error("Error deleting categoria:", error);
            set({ error: error.message });
            return false;
        }
    },
    
    updateCategoria: async (ID_Categoria, updatedData) => {
        try {
            const response = await axios.put(`http://localhost:3001/Categorias/${ID_Categoria}`, updatedData);
            const updatedCategoria = response.data;
            
            set((state) => ({
                categorias: state.categorias.map(categoria => 
                    categoria.ID_Categoria === ID_Categoria ? {...categoria, ...updatedCategoria} : categoria
                ),
                error: null
            }));
            return true;
        } catch (error) {
            console.error("Error updating categoria:", error);
            set({ error: error.message });
            return false;
        }
    }
}));

export default useCategoriaStore