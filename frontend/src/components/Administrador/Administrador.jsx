import { useEffect, useState } from 'react'
import useAdministradorStore from '../../store/AdministradorStore'

const Administrador= ()=>{
    const {addAdministrador,fetchAdministrador,administradors,deleteAdministrador,updateAdministrador} = useAdministradorStore() 
    const [editingAdministrador, setEditingAdministrador]= useState(null)
    const [administradorData, setAdministradorData] = useState ({Nombre_Administrador:"",Usuario:"",Contrasena: ""})
    const [fromData, setFormData] = useState ({Nombre_Administrador:"",Usuario:"",Contrasena: ""})

    console.log(administradorData)
    useEffect(()=>{
        fetchAdministrador()
    },[])

    // escucha lo que se ecribe en los input de la interfaz creada.
    const handleInputChange = (e)=>{
       const {name, value} = e. target 
       setAdministradorData({
        ...administradorData,
        [name]:value
       })
    }

    // creamos la funcion que graba los datos de los input
    const handelSubmit = async(e)=>{
        e.preventDefault()      // previene algo por defecto nose
        addAdministrador(administradorData)
        setAdministradorData({Nombre_Administrador:"",Usuario:"",Contrasena: ""})
        alert("se agrego al profe")
    }
    // elimina a la administrador
    const handleDelete = (ID_Administrador)=>{
        if(window.confirm("Are you sure")){
            deleteAdministrador(ID_Administrador)
            fetchAdministrador()
        }
    }
    //configura al estudinate para su edicion
    const handleEditClick = (administrador) => {
        setEditingAdministrador(administrador)
        setFormData({Nombre_Administrador:administrador.Nombre_Administrador, Usuario:administrador.Usuario, Contrasena:administrador.Contrasena})
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
        updateAdministrador(editingAdministrador.ID_Administrador, fromData)
        fetchAdministrador()
        setEditingAdministrador(null)
    }
    const handleCancelEdit = () => {
        setEditingAdministrador(null);
      }
    return (
        <div>
        <div>
            <h1>Agregar administradores</h1>
            <form onSubmit={handelSubmit}>
                <input
                type="text"
                placeholder="enter Nombre_Administrador"
                required
                name="Nombre_Administrador"
                value={administradorData.Nombre_Administrador}
                onChange={handleInputChange}
                />
                <input
                type="text"
                placeholder="enter Usuario"
                required
                name="Usuario"
                value={administradorData.Usuario}
                onChange={handleInputChange}
                />
                <input
                type="text"
                placeholder="enter Contrasena"
                required
                name="Contrasena"
                value={administradorData.Contrasena}
                onChange={handleInputChange}
                />
                <button>Guardar Datos</button>
            </form>
        </div>
        <div>
            
            <div>
                <div>
                <h1>Lista de la administradores</h1>
                {
                    administradors.map((user) =>(
                        <div key={user.ID_Administrador}>
                            <p>Nombre: {user.Nombre_Administrador} </p>
                            <p>Usuario: {user.Usuario}</p>
                            <p>Contraseña: {user.Contrasena}</p>
                            <button onClick={()=> handleDelete(user.ID_Administrador)}>❌👍</button>
                            <button onClick={()=> handleEditClick(user)}>👌✍️🗃️</button>
                        </div>
                    ))
                }
                </div>
                {editingAdministrador && (
                  <div className="modal-overlay">
                    <div className="modal-window">
                      <span className="modal-close" onClick={handleCancelEdit}>&times;</span>
                      <h3>Editar administrador</h3>
                      <input 
                        type="text"
                        name="Nombre_Administrador"
                        value={fromData.Nombre_Administrador}
                        onChange={handleInputChangeUpdate}
                        placeholder="Tipo de administrador"
                      />
                      <input 
                        type="text"
                        name="Usuario"
                        value={fromData.Usuario}
                        onChange={handleInputChangeUpdate}
                        placeholder="Usuario o ruta"
                      />
                      <input 
                        type="text"
                        name="Contrasena"
                        value={fromData.Contrasena}
                        onChange={handleInputChangeUpdate}
                        placeholder="Contrasena"
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

export default Administrador
