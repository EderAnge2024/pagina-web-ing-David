import {create} from 'zustand'  //permite guardar y compartir datos entre componentes
import axios from 'axios'  // permite comunicar tu frontend con el backend

const useEmpleadoStore = create((set)=>({
    empleados: [],
    addEmpleado: async(empleado)=>{
        try {
            const response = await axios.post('http://localhost:3001/empleado',empleado)
            set((state)=>({empleados: [...state.empleados, response.data]}))// crea una copia el "..."
        } catch (error) {
            console.log("Error adding user", error.message)
        }
    },
    fetchEmpleado: async()=>{
        try {
            const response = await axios.get('http://localhost:3001/empleado')
            set({empleados: response.data})
        } catch (error) {
            console.log("Error fecthing empleados", error.message)
        }
    },
    deleteEmpleado: async(ID_Empleado)=>{
        try {
            const response = await axios.delete(`http://localhost:3001/empleado/${ID_Empleado}`)
            console.log("empleado delete:",response.data)
            set((state)=>({empleados: state.empleados.filter(empleado=>empleado.ID_Empleado !== ID_Empleado)})) // filtra todos lo estudiantes actualizados o
        } catch (error) {                                                               // diferentes del id eliminado
            console.log("Error deleting empleado:", error.message)
        }
    },
    //____----------Agregado---------------________
    updateEmpleado: async (ID_Empleado, updatedData) => {
        try {  // Realiza una solicitud PUT para actualizar el estudiante en el servidor.
            const response = await axios.put(`http://localhost:3001/empleado/${ID_Empleado}`, updatedData)
            console.log("empleado updated:", response.data)
            // Actualiza el estado localmente, modificando solo el estudiante con el id coincidente.
            set((state) => ({empleados: state.empleados.map((empleado)=> empleado.ID_Empleado === ID_Empleado ? {...empleado, ...response.data} : empleado)})) // actualiza el estudiante en el estado
        } catch (error) {
            console.log("Error updating empleado:", error.message)
        }
    }
    
}))

export default useEmpleadoStore