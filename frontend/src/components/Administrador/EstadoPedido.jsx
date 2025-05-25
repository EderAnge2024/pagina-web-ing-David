import { useEffect, useState } from 'react'
import useEstadoPedidoStore from '../../store/EstadoPedidoStore'

const EstadoPedidoFrom= ()=>{
    const {addEstadoPedido,fetchEstadoPedido,estadoPedidos,deleteEstadoPedido,updateEstadoPedido} = useEstadoPedidoStore() 
    const [editingEstadoPedido, setEditingEstadoPedido]= useState(null)
    const [estadoPedidoData, setEstadoPedidoData] = useState ({Estado:""})
    const [fromData, setFormData] = useState ({Estado:""})

    console.log(estadoPedidoData)
    useEffect(()=>{
        fetchEstadoPedido()
    },[])

    // escucha lo que se ecribe en los input de la interfaz creada.
    const handleInputChange = (e)=>{
       const {name, value} = e. target 
       setEstadoPedidoData({
        ...estadoPedidoData,
        [name]:value
       })
    }

    // creamos la funcion que graba los datos de los input
    const handelSubmit = async(e)=>{
        e.preventDefault()      // previene algo por defecto nose
        addEstadoPedido(estadoPedidoData)
        setEstadoPedidoData({Estado:""})
        alert("se agrego al estado del pedido")
    }
    // elimina a la imagen
    const handleDelete = (ID_EstadoPedido)=>{
        if(window.confirm("Are you sure")){
            deleteEstadoPedido(ID_EstadoPedido)
            fetchEstadoPedido()
        }
    }
    //configura al estudinate para su edicion
    const handleEditClick = (imagen) => {
        setEditingEstadoPedido(imagen)
        setFormData({Estado:imagen.Estado})
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
        updateEstadoPedido(editingEstadoPedido.ID_EstadoPedido, fromData)
        fetchEstadoPedido()
        setEditingEstadoPedido(null)
    }
    const handleCancelEdit = () => {
        setEditingEstadoPedido(null);
      }
    return (
        <div >
        <div >
            <h1>Agregar al Estado</h1>
            <form onSubmit={handelSubmit}>
                <input
                type="text"
                placeholder="enter Estado"
                required
                name="Estado"
                value={estadoPedidoData.Estado}
                onChange={handleInputChange}
                />
                <button>Guardar Datos</button>
            </form>
        </div>
        <div>
            
            <div>
                <div>
                <h1>Lista de la imagenes</h1>
                {
                    estadoPedidos.map((user) =>(
                        <div key={user.ID_EstadoPedido}>
                            <p>Tipo de imgen: {user.Estado} </p>
                            <button onClick={()=> handleDelete(user.ID_EstadoPedido)}>❌👍</button>
                            <button onClick={()=> handleEditClick(user)}>👌✍️🗃️</button>
                        </div>
                    ))   
                }
                </div>
                {editingEstadoPedido && (
                  <div >
                    <div>
                      <span onClick={handleCancelEdit}>&times;</span>
                      <h3>Editar imagen</h3>
                      <input 
                        type="text"
                        name="Estado"
                        value={fromData.Estado}
                        onChange={handleInputChangeUpdate}
                        placeholder="Tipo de imagen"
                      />
                      <div>
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

export default EstadoPedidoFrom
