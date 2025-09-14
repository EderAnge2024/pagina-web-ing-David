import {create} from 'zustand'
import axios from 'axios'

const useImagenStore = create((set, get) => ({
    imagenes: [],
    
    addImagen: async (imagen) => {
        try {
            const response = await axios.post('http://localhost:3001/imagen', imagen)
            
            // Si la nueva imagen es un logo principal, actualizar los demás
            if (imagen.Tipo_Imagen === "Logo" && imagen.es_principal) {
                await get().setLogoPrincipal(response.data.ID_Imagen)
            } else {
                set((state) => ({
                    imagenes: [...state.imagenes, response.data]
                }))
            }
            
            // Refrescar datos desde el servidor
            await get().fetchImagen()
            
            console.log("Imagen agregada exitosamente:", response.data)
        } catch (error) {
            console.error("Error adding imagen:", error.message)
            throw error
        }
    },
    
    fetchImagen: async () => {
        try {
            const response = await axios.get('http://localhost:3001/imagen')
            set({ imagenes: response.data })
            console.log("✅ Imágenes obtenidas del servidor:", response.data.length)
            
            // Debug: mostrar logos y cuál es principal
            const logos = response.data.filter(img => img.Tipo_Imagen === "Logo")
            const logoPrincipal = logos.find(logo => logo.es_principal === true)
            console.log("📊 Logos disponibles:", logos.length)
            console.log("⭐ Logo principal:", logoPrincipal ? logoPrincipal.ID_Imagen : 'ninguno')
            
        } catch (error) {
            console.error("Error fetching imagenes:", error.message)
            throw error
        }
    },
    
    deleteImagen: async (ID_Imagen) => {
        try {
            const response = await axios.delete(`http://localhost:3001/imagen/${ID_Imagen}`)
            console.log("Imagen deleted:", response.data)
            
            // Actualizar estado local inmediatamente
            set((state) => ({
                imagenes: state.imagenes.filter(imagen => imagen.ID_Imagen !== ID_Imagen)
            }))
            
            // Refrescar desde el servidor para asegurar consistencia
            await get().fetchImagen()
            
        } catch (error) {
            console.error("Error deleting imagen:", error.message)
            throw error
        }
    },
    
    // 🔥 Función de actualización mejorada
    updateImagen: async (ID_Imagen, updatedData) => {
        try {
            console.log("🔄 Actualizando imagen:", ID_Imagen, "con datos:", updatedData)
            
            const response = await axios.put(`http://localhost:3001/imagen/${ID_Imagen}`, updatedData)
            console.log("✅ Respuesta del servidor:", response.data)
            
            // Si es un logo y se está marcando como principal
            if (updatedData.Tipo_Imagen === "Logo" && updatedData.es_principal) {
                console.log("🎯 Actualizando logo principal...")
                await get().setLogoPrincipal(ID_Imagen)
            } else {
                // Actualización normal
                set((state) => ({
                    imagenes: state.imagenes.map((imagen) => 
                        imagen.ID_Imagen === ID_Imagen 
                            ? { ...imagen, ...updatedData, ID_Imagen }
                            : imagen
                    )
                }))
                
                // Refrescar desde el servidor
                await get().fetchImagen()
            }
            
            console.log("✅ Imagen actualizada correctamente")
            return response.data
            
        } catch (error) {
            console.error("❌ Error updating imagen:", error.message)
            throw error
        }
    },
    
    // 🔥 Función mejorada para cambiar logo principal
    setLogoPrincipal: async (logoId) => {
        try {
            console.log("🎯 Iniciando cambio de logo principal a:", logoId)
            
            const { imagenes } = get()
            const logos = imagenes.filter(img => img.Tipo_Imagen === "Logo")
            
            console.log("📊 Logos encontrados:", logos.length)
            console.log("📊 Logo a marcar como principal:", logoId)
            
            if (logos.length === 0) {
                throw new Error("No hay logos disponibles")
            }
            
            // Verificar que el logo existe
            const logoToUpdate = logos.find(logo => logo.ID_Imagen === logoId)
            if (!logoToUpdate) {
                throw new Error(`Logo con ID ${logoId} no encontrado`)
            }
            
            // Actualizar todos los logos en el servidor
            const updatePromises = logos.map(async (logo) => {
                const esPrincipal = logo.ID_Imagen === logoId
                console.log(`🔄 Actualizando logo ${logo.ID_Imagen}: es_principal = ${esPrincipal}`)
                
                return axios.put(`http://localhost:3001/imagen/${logo.ID_Imagen}`, {
                    ...logo,
                    es_principal: esPrincipal
                })
            })
            
            // Esperar a que todas las actualizaciones terminen
            await Promise.all(updatePromises)
            console.log("✅ Todas las actualizaciones de logos completadas")
            
            // Actualizar estado local inmediatamente
            set((state) => ({
                imagenes: state.imagenes.map((imagen) => {
                    if (imagen.Tipo_Imagen === "Logo") {
                        return {
                            ...imagen,
                            es_principal: imagen.ID_Imagen === logoId
                        }
                    }
                    return imagen
                })
            }))
            
            // Refrescar desde el servidor para asegurar consistencia
            setTimeout(async () => {
                await get().fetchImagen()
                console.log("🔄 Datos actualizados desde el servidor")
            }, 100)
            
            console.log("🎉 Logo principal cambiado exitosamente")
            
        } catch (error) {
            console.error("❌ Error setting logo principal:", error.message)
            throw error
        }
    },
    
    // 🔥 Función helper mejorada para obtener logo principal
    getLogoPrincipal: () => {
        const { imagenes } = get()
        const logoPrincipal = imagenes.find(img => 
            img.Tipo_Imagen === "Logo" && 
            img.es_principal === true &&
            img.URL // Asegurar que tenga URL
        )
        
        console.log("🔍 Buscando logo principal...", {
            totalImagenes: imagenes.length,
            totalLogos: imagenes.filter(img => img.Tipo_Imagen === "Logo").length,
            logoPrincipalEncontrado: !!logoPrincipal,
            logoPrincipalId: logoPrincipal?.ID_Imagen
        })
        
        return logoPrincipal
    },
    
    // 🔥 Función helper mejorada para obtener todos los logos
    getLogos: () => {
        const { imagenes } = get()
        const logos = imagenes.filter(img => img.Tipo_Imagen === "Logo")
        
        // Ordenar para que el principal aparezca primero
        return logos.sort((a, b) => {
            if (a.es_principal && !b.es_principal) return -1
            if (!a.es_principal && b.es_principal) return 1
            return 0
        })
    },
    
    // 🆕 Función para debug - obtener estado actual
    getDebugInfo: () => {
        const { imagenes } = get()
        const logos = imagenes.filter(img => img.Tipo_Imagen === "Logo")
        const logoPrincipal = logos.find(logo => logo.es_principal === true)
        
        return {
            totalImagenes: imagenes.length,
            totalLogos: logos.length,
            logoPrincipal: logoPrincipal ? {
                id: logoPrincipal.ID_Imagen,
                url: logoPrincipal.URL
            } : null,
            todosLosLogos: logos.map(logo => ({
                id: logo.ID_Imagen,
                url: logo.URL,
                esPrincipal: logo.es_principal
            }))
        }
    }
}))

export default useImagenStore