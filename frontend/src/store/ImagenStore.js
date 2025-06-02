import {create} from 'zustand'
import axios from 'axios'

const useImagenStore = create((set, get) => ({
    imagenes: [],
    
    addImagen: async (imagen) => {
        try {
            const response = await axios.post('http://localhost:3001/imagen', imagen)
            set((state) => ({
                imagenes: [...state.imagenes, response.data]
            }))
            console.log("Imagen agregada exitosamente:", response.data)
        } catch (error) {
            console.error("Error adding imagen:", error.message)
            throw error // Re-lanzar el error para manejarlo en el componente
        }
    },
    
    fetchImagen: async () => {
        try {
            const response = await axios.get('http://localhost:3001/imagen')
            set({ imagenes: response.data })
            console.log("Imágenes obtenidas:", response.data.length)
        } catch (error) {
            console.error("Error fetching imagenes:", error.message)
            throw error
        }
    },
    
    deleteImagen: async (ID_Imagen) => {
        try {
            const response = await axios.delete(`http://localhost:3001/imagen/${ID_Imagen}`)
            console.log("Imagen deleted:", response.data)
            set((state) => ({
                imagenes: state.imagenes.filter(imagen => imagen.ID_Imagen !== ID_Imagen)
            }))
        } catch (error) {
            console.error("Error deleting imagen:", error.message)
            throw error
        }
    },
    
    // ⚠️ ESTE ES EL PROBLEMA PRINCIPAL
    updateImagen: async (ID_Imagen, updatedData) => {
        try {
            console.log("Updating imagen:", ID_Imagen, "with data:", updatedData)
            
            const response = await axios.put(`http://localhost:3001/imagen/${ID_Imagen}`, updatedData)
            console.log("Imagen updated - Server response:", response.data)
            
            // 🔥 PROBLEMA: Estás usando response.data en lugar de updatedData
            // El servidor podría no devolver los datos actualizados completos
            set((state) => ({
                imagenes: state.imagenes.map((imagen) => 
                    imagen.ID_Imagen === ID_Imagen 
                        ? { ...imagen, ...updatedData } // ✅ Usar updatedData en lugar de response.data
                        : imagen
                )
            }))
            
            console.log("Estado actualizado localmente")
            return response.data
            
        } catch (error) {
            console.error("Error updating imagen:", error.message)
            throw error
        }
    },
    
    // 🆕 NUEVA FUNCIÓN: Para actualizar múltiples imágenes (útil para logos principales)
    updateMultipleImagenes: async (updates) => {
        try {
            console.log("Updating multiple imagenes:", updates)
            
            // Ejecutar todas las actualizaciones
            const promises = updates.map(({ ID_Imagen, data }) => 
                axios.put(`http://localhost:3001/imagen/${ID_Imagen}`, data)
            );
            
            await Promise.all(promises)
            
            // Actualizar el estado local
            set((state) => ({
                imagenes: state.imagenes.map((imagen) => {
                    const update = updates.find(u => u.ID_Imagen === imagen.ID_Imagen)
                    return update ? { ...imagen, ...update.data } : imagen
                })
            }))
            
            console.log("Multiple imagenes updated successfully")
            
        } catch (error) {
            console.error("Error updating multiple imagenes:", error.message)
            throw error
        }
    },
    
    // 🆕 FUNCIÓN ESPECÍFICA: Para cambiar logo principal
    setLogoPrincipal: async (logoId) => {
        try {
            const { imagenes } = get() // Obtener estado actual
            const logos = imagenes.filter(img => img.Tipo_Imagen === "Logo")
            
            console.log("Setting logo principal:", logoId)
            console.log("Current logos:", logos)
            
            // Preparar las actualizaciones
            const updates = logos.map(logo => ({
                ID_Imagen: logo.ID_Imagen,
                data: {
                    ...logo,
                    es_principal: logo.ID_Imagen === logoId
                }
            }))
            
            // Usar la función de actualización múltiple
            await get().updateMultipleImagenes(updates)
            
            console.log("Logo principal actualizado exitosamente")
            
        } catch (error) {
            console.error("Error setting logo principal:", error.message)
            throw error
        }
    },
    
    // 🆕 FUNCIÓN HELPER: Para obtener logo principal
    getLogoPrincipal: () => {
        const { imagenes } = get()
        return imagenes.find(img => img.Tipo_Imagen === "Logo" && img.es_principal === true)
    },
    
    // 🆕 FUNCIÓN HELPER: Para obtener todos los logos
    getLogos: () => {
        const { imagenes } = get()
        return imagenes.filter(img => img.Tipo_Imagen === "Logo")
    }
}))

export default useImagenStore