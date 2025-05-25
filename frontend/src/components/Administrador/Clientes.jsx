import { useEffect, useState } from 'react'
import useClienteStore from '../../store/ClienteStore'

const ClienteFrom= ()=>{
    const {addCliente,fetchCliente,clientes,deleteCliente,updateCliente} = useClienteStore() 
    const [editingCliente, setEditingCliente]= useState(null)
    const [clienteData, setClienteData] = useState ({Nombre:"",Apellido:"",NumCelular:""})
    const [fromData, setFormData] = useState ({Nombre:"",Apellido:"",NumCelular:""})

    console.log(clienteData)
    useEffect(()=>{
        fetchCliente()
    },[])

    // escucha lo que se ecribe en los input de la interfaz creada.
    const handleInputChange = (e)=>{
       const {name, value} = e. target 
       setClienteData({
        ...clienteData,
        [name]:value
       })
    }

    // creamos la funcion que graba los datos de los input
    const handelSubmit = async(e)=>{
        e.preventDefault()      // previene algo por defecto nose
        addCliente(clienteData)
        setClienteData({Nombre:"",Apellido:"",NumCelular:""})
        alert("se agrego cliente nuevo")
    }
    // elimina a la cliente
    const handleDelete = (ID_Cliente)=>{
        if(window.confirm("Are you sure")){
            deleteCliente(ID_Cliente)
            fetchCliente()
        }
    }
    //configura al estudinate para su edicion
    const handleEditClick = (cliente) => {
        setEditingCliente(cliente)
        setFormData({Nombre:cliente.Nombre, Apellido:cliente.Apellido, NumCelular:cliente.NumCelular})
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
        updateCliente(editingCliente.ID_Cliente, fromData)
        fetchCliente()
        setEditingCliente(null)
    }
    const handleCancelEdit = () => {
        setEditingCliente(null);
      }
    return (
        <div>
        <div>
            <h1>Agregar clientes</h1>
            <form onSubmit={handelSubmit}>
                <input
                type="text"
                placeholder="enter Nombre"
                required
                name="Nombre"
                value={clienteData.Nombre}
                onChange={handleInputChange}
                />
                <input
                type="text"
                placeholder="enter Apellido"
                required
                name="Apellido"
                value={clienteData.Apellido}
                onChange={handleInputChange}
                />
                <input
                type="text"
                placeholder="enter NumCelular"
                required
                name="NumCelular"
                value={clienteData.NumCelular}
                onChange={handleInputChange}
                />
                <button>Guardar Datos</button>
            </form>
        </div>
        <div>
            
            <div>
                <div>
                <h1>Lista de la clientees</h1>
                {
                    clientes.map((user) =>(
                        <div key={user.ID_Cliente}>
                            <p>Nombre: {user.Nombre} </p>
                            <p>Apellido: {user.Apellido}</p>
                            <p>Numero Celular: {user.NumCelular}</p>
                            <button onClick={()=> handleDelete(user.ID_Cliente)}>❌👍</button>
                            <button onClick={()=> handleEditClick(user)}>👌✍️🗃️</button>
                        </div>
                    ))
                }
                </div>
                {editingCliente && (
                  <div className="modal-overlay">
                    <div className="modal-window">
                      <span className="modal-close" onClick={handleCancelEdit}>&times;</span>
                      <h3>Editar cliente</h3>
                      <input 
                        type="text"
                        name="Nombre"
                        value={fromData.Nombre}
                        onChange={handleInputChangeUpdate}
                        placeholder="Tipo de cliente"
                      />
                      <input 
                        type="text"
                        name="Apellido"
                        value={fromData.Apellido}
                        onChange={handleInputChangeUpdate}
                        placeholder="Apellido o ruta"
                      />
                      <input 
                        type="text"
                        name="NumCelular"
                        value={fromData.NumCelular}
                        onChange={handleInputChangeUpdate}
                        placeholder="NumCelular"
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

export default ClienteFrom
