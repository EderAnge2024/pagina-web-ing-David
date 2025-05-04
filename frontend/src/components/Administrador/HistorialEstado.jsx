import { useEffect, useState } from 'react'
import useHistorialEstadoStore from '../../store/HistorialEstadoStore'

const HistorialEstado= ()=>{
    const {addHistorialEstado,fetchHistorialEstado,historialEstados,deleteHistorialEstado,updateHistorialEstado} = useHistorialEstadoStore() 
    const [editingHistorialEstado, setEditingHistorialEstado]= useState(null)
    const [historialEstadoData, setHistorialEstadoData] = useState ({ID_EstadoPedido:"",ID_Pedido:"",Fecha:""})
    const [fromData, setFormData] = useState ({ID_EstadoPedido:"",ID_Pedido:"",Fecha:""})

    console.log(historialEstadoData)
    useEffect(()=>{
        fetchHistorialEstado()
    },[])

    // escucha lo que se ecribe en los input de la interfaz creada.
    const handleInputChange = (e)=>{
       const {name, value} = e. target 
       setHistorialEstadoData({
        ...historialEstadoData,
        [name]:value
       })
    }

    // creamos la funcion que graba los datos de los input
    const handelSubmit = async(e)=>{
        e.preventDefault()      // previene algo por defecto nose
        addHistorialEstado(historialEstadoData)
        setHistorialEstadoData({ID_EstadoPedido:"",ID_Pedido:"",Fecha:""})
        alert("se agrego al profe")
    }
    // elimina a la historial
    const handleDelete = (ID_Historial)=>{
        if(window.confirm("Are you sure")){
            deleteHistorialEstado(ID_Historial)
            fetchHistorialEstado()
        }
    }
    //configura al estudinate para su edicion
    const handleEditClick = (historial) => {
        setEditingHistorialEstado(historial)
        setFormData({ID_EstadoPedido:historial.ID_EstadoPedido, ID_Pedido:historial.ID_Pedido, Fecha:historial.Fecha})
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
        updateHistorialEstado(editingHistorialEstado.ID_Historial, fromData)
        fetchHistorialEstado()
        setEditingHistorialEstado(null)
    }
    const handleCancelEdit = () => {
        setEditingHistorialEstado(null);
      }
    return (
        <div>
        <div>
            <h1>Agregar historialEstados</h1>
            <form onSubmit={handelSubmit}>
                <input
                type="text"
                placeholder="enter ID_EstadoPedido"
                required
                name="ID_EstadoPedido"
                value={historialEstadoData.ID_EstadoPedido}
                onChange={handleInputChange}
                />
                <input
                type="text"
                placeholder="enter ID_Pedido"
                required
                name="ID_Pedido"
                value={historialEstadoData.ID_Pedido}
                onChange={handleInputChange}
                />
                <input
                type="text"
                placeholder="enter Fecha"
                required
                name="Fecha"
                value={historialEstadoData.Fecha}
                onChange={handleInputChange}
                />
                <button>Guardar Datos</button>
            </form>
        </div>
        <div>
            
            <div>
                <div>
                <h1>Lista de la historiales</h1>
                {
                    historialEstados.map((user) =>(
                        <div key={user.ID_Historial}>
                            <p>ID_EstadoPedido: {user.ID_EstadoPedido} </p>
                            <p>ID_Pedido: {user.ID_Pedido}</p>
                            <p>Fecha: {user.Fecha}</p>
                            <button onClick={()=> handleDelete(user.ID_Historial)}>❌👍</button>
                            <button onClick={()=> handleEditClick(user)}>👌✍️🗃️</button>
                        </div>
                    ))
                }
                </div>
                {editingHistorialEstado && (
                  <div className="modal-overlay">
                    <div className="modal-window">
                      <span className="modal-close" onClick={handleCancelEdit}>&times;</span>
                      <h3>Editar historial</h3>
                      <input 
                        type="text"
                        name="ID_EstadoPedido"
                        value={fromData.ID_EstadoPedido}
                        onChange={handleInputChangeUpdate}
                        placeholder="Tipo de historial"
                      />
                      <input 
                        type="text"
                        name="ID_Pedido"
                        value={fromData.ID_Pedido}
                        onChange={handleInputChangeUpdate}
                        placeholder="ID_Pedido o ruta"
                      />
                      <input 
                        type="text"
                        name="Fecha"
                        value={fromData.Fecha}
                        onChange={handleInputChangeUpdate}
                        placeholder="Fecha"
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

export default HistorialEstado
