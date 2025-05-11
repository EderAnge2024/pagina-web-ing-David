import { useEffect, useState } from 'react'
import useEmpleadoStore from '../../store/EmpleadoStore'

const Empleado= ()=>{
    const {addEmpleado,fetchEmpleado,empleados,deleteEmpleado,updateEmpleado} = useEmpleadoStore() 
    const [editingEmpleado, setEditingEmpleado]= useState(null)
    const [empleadoData, setEmpleadoData] = useState ({Nombre_Empleado:"",NumCelular:"",URL:""})
    const [fromData, setFormData] = useState ({Nombre_Empleado:"",NumCelular:"",URL:""})

    console.log(empleadoData)
    useEffect(()=>{
        fetchEmpleado()
    },[])

    // escucha lo que se ecribe en los input de la interfaz creada.
    const handleInputChange = (e)=>{
       const {name, value} = e. target 
       setEmpleadoData({
        ...empleadoData,
        [name]:value
       })
    }

    // creamos la funcion que graba los datos de los input
    const handelSubmit = async(e)=>{
        e.preventDefault()      // previene algo por defecto nose
        addEmpleado(empleadoData)
        setEmpleadoData({Nombre_Empleado:"",NumCelular:"",URL:""})
        alert("se agrego al profe")
    }
    // elimina a la empleado
    const handleDelete = (ID_Empleado)=>{
        if(window.confirm("Are you sure")){
            deleteEmpleado(ID_Empleado)
            fetchEmpleado()
        }
    }
    //configura al estudinate para su edicion
    const handleEditClick = (empleado) => {
        setEditingEmpleado(empleado)
        setFormData({Nombre_Empleado:empleado.Nombre_Empleado, NumCelular:empleado.NumCelular, URL:empleado.URL})
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
        updateEmpleado(editingEmpleado.ID_Empleado, fromData)
        fetchEmpleado()
        setEditingEmpleado(null)
    }
    const handleCancelEdit = () => {
        setEditingEmpleado(null);
      }
    return (
        <div>
        <div>
            <h1>Agregar empleados</h1>
            <form onSubmit={handelSubmit}>
                <input
                type="text"
                placeholder="enter Nombre_Empleado"
                required
                name="Nombre_Empleado"
                value={empleadoData.Nombre_Empleado}
                onChange={handleInputChange}
                />
                <input
                type="text"
                placeholder="enter NumCelular"
                required
                name="NumCelular"
                value={empleadoData.NumCelular}
                onChange={handleInputChange}
                />
                <input
                type="text"
                placeholder="enter URL"
                required
                name="URL"
                value={empleadoData.URL}
                onChange={handleInputChange}
                />
                <button>Guardar Datos</button>
            </form>
        </div>
        <div>
            
            <div>
                <div>
                <h1>Lista de la empleadoes</h1>
                {
                    empleados.map((user) =>(
                        <div key={user.ID_Empleado}>
                            <p>Nombre_Empleado: {user.Nombre_Empleado} </p>
                            <p>NumeroCelular: {user.NumCelular}</p>
                            <p>Ruta img: {user.URL}</p>
                            <button onClick={()=> handleDelete(user.ID_Empleado)}>❌👍</button>
                            <button onClick={()=> handleEditClick(user)}>👌✍️🗃️</button>
                        </div>
                    ))
                }
                </div>
                {editingEmpleado && (
                  <div className="modal-overlay">
                    <div className="modal-window">
                      <span className="modal-close" onClick={handleCancelEdit}>&times;</span>
                      <h3>Editar empleado</h3>
                      <input 
                        type="text"
                        name="Nombre_Empleado"
                        value={fromData.Nombre_Empleado}
                        onChange={handleInputChangeUpdate}
                        placeholder="Tipo de empleado"
                      />
                      <input 
                        type="text"
                        name="NumCelular"
                        value={fromData.NumCelular}
                        onChange={handleInputChangeUpdate}
                        placeholder="NumCelular o ruta"
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

export default Empleado
