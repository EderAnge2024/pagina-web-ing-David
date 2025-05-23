import { useEffect, useState } from 'react'
import usePedidoStore from '../../store/PedidoStore'

const Pedido= ()=>{
    const {addPedido,fetchPedido,pedidos,deletePedido,updatePedido} = usePedidoStore() 
    const [editingPedido, setEditingPedido]= useState(null)
    const [pedidoData, setPedidoData] = useState ({ID_Cliente:"",Fecha_Pedido:"",Fecha_Entrega:""})
    const [fromData, setFormData] = useState ({ID_Cliente:"",Fecha_Pedido:"",Fecha_Entrega:""})

    console.log(pedidoData)
    useEffect(()=>{
        fetchPedido()
    },[])

    // escucha lo que se ecribe en los input de la interfaz creada.
    const handleInputChange = (e)=>{
       const {name, value} = e. target 
       setPedidoData({
        ...pedidoData,
        [name]:value
       })
    }

    // creamos la funcion que graba los datos de los input
    const handelSubmit = async(e)=>{
        e.preventDefault()      // previene algo por defecto nose
        addPedido(pedidoData)
        setPedidoData({ID_Cliente:"",Fecha_Pedido:"",Fecha_Entrega:""})
        alert("se agrego pedido")
    }
    // elimina a la pedido
    const handleDelete = (ID_Pedido)=>{
        if(window.confirm("Are you sure")){
            deletePedido(ID_Pedido)
            fetchPedido()
        }
    }
    //configura al estudinate para su edicion
    const handleEditClick = (pedido) => {
        setEditingPedido(pedido)
        setFormData({ID_Cliente:pedido.ID_Cliente, Fecha_Pedido:pedido.Fecha_Pedido, Fecha_Entrega:pedido.Fecha_Entrega})
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
        updatePedido(editingPedido.ID_Pedido, fromData)
        fetchPedido()
        setEditingPedido(null)
    }
    const handleCancelEdit = () => {
        setEditingPedido(null);
      }
    return (
        <div>
        <div>
            <h1>Agregar pedidos</h1>
            <form onSubmit={handelSubmit}>
                <input
                type="text"
                placeholder="enter ID_Cliente"
                required
                name="ID_Cliente"
                value={pedidoData.ID_Cliente}
                onChange={handleInputChange}
                />
                <input
                type="text"
                placeholder="enter Fecha_Pedido"
                required
                name="Fecha_Pedido"
                value={pedidoData.Fecha_Pedido}
                onChange={handleInputChange}
                />
                <input
                type="text"
                placeholder="enter Fecha_Entrega"
                required
                name="Fecha_Entrega"
                value={pedidoData.Fecha_Entrega}
                onChange={handleInputChange}
                />
                <button>Guardar Datos</button>
            </form>
        </div>
        <div>
            
            <div>
                <div>
                <h1>Lista de la pedidoes</h1>
                {
                    pedidos.map((user) =>(
                        <div key={user.ID_Pedido}>
                            <p>id: {user.ID_Pedido}</p>
                            <p>ID_Cliente: {user.ID_Cliente} </p>
                            <p>Fecha_Pedido: {user.Fecha_Pedido}</p>
                            <p>Fecha_Entrega: {user.Fecha_Entrega}</p>
                            <button onClick={()=> handleDelete(user.ID_Pedido)}>❌👍</button>
                            <button onClick={()=> handleEditClick(user)}>👌✍️🗃️</button>
                        </div>
                    ))
                }
                </div>
                {editingPedido && (
                  <div className="modal-overlay">
                    <div className="modal-window">
                      <span className="modal-close" onClick={handleCancelEdit}>&times;</span>
                      <h3>Editar pedido</h3>
                      <input 
                        type="text"
                        name="ID_Cliente"
                        value={fromData.ID_Cliente}
                        onChange={handleInputChangeUpdate}
                        placeholder="Tipo de pedido"
                      />
                      <input 
                        type="text"
                        name="Fecha_Pedido"
                        value={fromData.Fecha_Pedido}
                        onChange={handleInputChangeUpdate}
                        placeholder="Fecha_Pedido o ruta"
                      />
                      <input 
                        type="text"
                        name="Fecha_Entrega"
                        value={fromData.Fecha_Entrega}
                        onChange={handleInputChangeUpdate}
                        placeholder="Fecha_Entrega"
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

export default Pedido
