import { useEffect, useState } from 'react'
import useProyectoStore from '../../store/proyectostore'
import useEmpleadoStore from '../../store/EmpleadoStore'

const Proyecto= ()=>{
    const {addProyecto,fetchProyecto,proyectos,deleteProyecto,updateProyecto} = useProyectoStore() 
    const {empleados, fetchEmpleado} = useEmpleadoStore()
    const [editingProyecto, setEditingProyecto]= useState(null)
    const [proyectoData, setProyectoData] = useState ({ID_Empleados:"",Lugar:"",URL:""})
    const [fromData, setFormData] = useState ({ID_Empleados:"",Lugar:"",URL:""})

    console.log(proyectoData)
    useEffect(()=>{
        fetchProyecto()
        fetchEmpleado()
    },[])

    // escucha lo que se ecribe en los input de la interfaz creada.
    const handleInputChange = (e)=>{
       const {name, value} = e. target 
       setProyectoData({
        ...proyectoData,
        [name]:value
       })
    }

    // creamos la funcion que graba los datos de los input
    const handelSubmit = async(e)=>{
        e.preventDefault()      // previene algo por defecto nose
        addProyecto(proyectoData)
        setProyectoData({ID_Empleados:"",Lugar:"",URL:""})
        alert("se agrego al proyecto")
    }
    // elimina a la empleado
    const handleDelete = (ID_Proyectos)=>{
        if(window.confirm("Are you sure")){
            deleteProyecto(ID_Proyectos)
            fetchProyecto()
        }
    }
    //configura al estudinate para su edicion
    const handleEditClick = (proyecto) => {
        setEditingProyecto(proyecto)
        setFormData({ID_Empleados:proyecto.ID_Empleados, Lugar:proyecto.Lugar, URL:proyecto.URL})
    }
    // manejar can¿bios de la formulaion edicion
    const handleInputChangeUpdate = (e)=>{
        setFormData({
            ...fromData,
            [e.target.name]: e.target.value
        })
    }

    // actualiza a la imgen
    const handleUpdate = async()=>{
        updateProyecto(editingProyecto.ID_Proyectos, fromData)
        fetchProyecto()
        setEditingProyecto(null)
    }
    const handleCancelEdit = () => {
        setEditingProyecto(null);
      }
    return (
        <div>
        <div>
            <h1>Agregar proyectos</h1>
            <form onSubmit={handelSubmit}>
                <select
                  name="ID_Empleados"
                  value={proyectoData.ID_Empleados}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">-- Seleccionar empleado --</option>
                  {empleados.map((empleado) => (
                    <option key={empleado.ID_Empleado} value={empleado.ID_Empleado}>
                      {empleado.Nombre_Empleado}
                    </option>
                  ))}
                </select>
                <input
                type="text"
                placeholder="enter Lugar"
                required
                name="Lugar"
                value={proyectoData.Lugar}
                onChange={handleInputChange}
                />
                <input
                type="text"
                placeholder="enter URL"
                required
                name="URL"
                value={proyectoData.URL}
                onChange={handleInputChange}
                />
                <button>Guardar Datos</button>
            </form>
        </div>
        <div>
            
            <div>
                <div>
                <h1>Lista de la Proyectos</h1>
                {
                    proyectos.map((user) =>(
                        <div key={user.ID_Proyectos}>
                            <p>ID_Empleados: {user.ID_Empleados} </p>
                            <p>Lugar: {user.Lugar}</p>
                            <p>Ruta: {user.URL}</p>
                            <button onClick={()=> handleDelete(user.ID_Proyectos)}>❌👍</button>
                            <button onClick={()=> handleEditClick(user)}>👌✍️🗃️</button>
                        </div>
                    ))
                }
                </div>
                {editingProyecto && (
                  <div className="modal-overlay">
                    <div className="modal-window">
                      <span className="modal-close" onClick={handleCancelEdit}>&times;</span>
                      <h3>Editar empleado</h3>
                      <input 
                        type="text"
                        name="ID_Empleados"
                        value={fromData.ID_Empleados}
                        onChange={handleInputChangeUpdate}
                        placeholder="Tipo de empleado"
                      />
                      <input 
                        type="text"
                        name="Lugar"
                        value={fromData.Lugar}
                        onChange={handleInputChangeUpdate}
                        placeholder="Lugar o ruta"
                      />
                      <input 
                        type="text"
                        name="URL"
                        value={fromData.URL}
                        onChange={handleInputChangeUpdate}
                        placeholder="URL"
                      />
                      <div className="botones">
                        <button onClick={handleUpdate}>Guardar</button>
                        <button onClick={handleCancelEdit}>Cancelar</button>
                    
                      </div>
                     </div>
                  </div>
                )}

            </div>
        </div>
        </div>
    )
}

export default Proyecto
