import { useEffect, useState } from 'react'
import useDetallePedidoStore from '../../store/DetallePedidoStore'

const DetallePedidoFrom= ()=>{
    const {addDetallePedido,fetchDetallePedido,detallePedidos,deleteDetallePedido,updateDetallePedido} = useDetallePedidoStore() 
    const [editingDetallePedido, setEditingDetallePedido]= useState(null)
    const [detallePedidoData, setDetallePedidoData] = useState ({ID_Pedido:"",ID_Producto:"",Cantidad:"",Precio_Unitario:"",Descuento:"",Subtotal:""})
    const [fromData, setFormData] = useState ({ID_Pedido:"",ID_Producto:"",Cantidad:"",Precio_Unitario:"",Descuento:"",Subtotal:""})

    console.log(detallePedidoData)
    useEffect(()=>{
        fetchDetallePedido()
    },[])

    // escucha lo que se ecribe en los input de la interfaz creada.
    const handleInputChange = (e)=>{
       const {name, value} = e. target 
       setDetallePedidoData({
        ...detallePedidoData,
        [name]:value
       })
    }

    // creamos la funcion que graba los datos de los input
    const handelSubmit = async(e)=>{
        e.preventDefault()      // previene algo por defecto nose
        addDetallePedido(detallePedidoData)
        setDetallePedidoData({ID_Pedido:"",ID_Producto:"",Cantidad:"",Precio_Unitario:"",Descuento:"",Subtotal:""})
        alert("se agrego al profe")
    }
    // elimina a la detallePedido
    const handleDelete = (ID_Detalle)=>{
        if(window.confirm("Are you sure")){
            deleteDetallePedido(ID_Detalle)
            fetchDetallePedido()
        }
    }
    //configura al estudinate para su edicion
    const handleEditClick = (detallePedido) => {
        setEditingDetallePedido(detallePedido)
        setFormData({ID_Pedido:detallePedido.ID_Pedido, ID_Producto:detallePedido.ID_Producto, Cantidad:detallePedido.Cantidad,Precio_Unitario:detallePedido.Precio_Unitario,Descuento:detallePedido.Descuento,Subtotal:detallePedido.Subtotal})
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
        updateDetallePedido(editingDetallePedido.ID_Detalle, fromData)
        fetchDetallePedido()
        setEditingDetallePedido(null)
    }
    const handleCancelEdit = () => {
        setEditingDetallePedido(null);
      }
    return (
        <div>
        <div>
            <h1>Agregar detallePedidos</h1>
            <form onSubmit={handelSubmit}>
                <input
                type="text"
                placeholder="enter ID_Pedido"
                required
                name="ID_Pedido"
                value={detallePedidoData.ID_Pedido}
                onChange={handleInputChange}
                />
                <input
                type="text"
                placeholder="enter ID_Producto"
                required
                name="ID_Producto"
                value={detallePedidoData.ID_Producto}
                onChange={handleInputChange}
                />
                <input
                type="text"
                placeholder="enter Cantidad"
                required
                name="Cantidad"
                value={detallePedidoData.Cantidad}
                onChange={handleInputChange}
                />
                <input
                type="text"
                placeholder="enter Precio_Unitario"
                required
                name="Precio_Unitario"
                value={detallePedidoData.Precio_Unitario}
                onChange={handleInputChange}
                />
                <input
                type="text"
                placeholder="enter Descuento"
                required
                name="Descuento"
                value={detallePedidoData.Descuento}
                onChange={handleInputChange}
                />
                <input
                type="text"
                placeholder="enter Subtotal"
                required
                name="Subtotal"
                value={detallePedidoData.Subtotal}
                onChange={handleInputChange}
                />
                <button>Guardar Datos</button>
            </form>
        </div>
        <div>
            
            <div>
                <div>
                <h1>Lista de la detallePedidoes</h1>
                {
                    detallePedidos.map((user) =>(
                        <div key={user.ID_Detalle}>
                            <p>ID_Pedido: {user.ID_Pedido} </p>
                            <p>ID_Producto: {user.ID_Producto}</p>
                            <p>Numero Celular: {user.Cantidad}</p>
                            <p>Precio_Unitario: {user.Precio_Unitario}</p>
                            <p>Numero Descuento: {user.Descuento}</p>
                            <p>Numero Subtotal: {user.Subtotal}</p>
                            <button onClick={()=> handleDelete(user.ID_Detalle)}>❌👍</button>
                            <button onClick={()=> handleEditClick(user)}>👌✍️🗃️</button>
                        </div>
                    ))
                }
                </div>
                {editingDetallePedido && (
                  <div className="modal-overlay">
                    <div className="modal-window">
                      <span className="modal-close" onClick={handleCancelEdit}>&times;</span>
                      <h3>Editar detallePedido</h3>
                      <input 
                        type="text"
                        name="ID_Pedido"
                        value={fromData.ID_Pedido}
                        onChange={handleInputChangeUpdate}
                        placeholder="Tipo de detallePedido"
                      />
                      <input 
                        type="text"
                        name="ID_Producto"
                        value={fromData.ID_Producto}
                        onChange={handleInputChangeUpdate}
                        placeholder="ID_Producto o ruta"
                      />
                      <input 
                        type="text"
                        name="Cantidad"
                        value={fromData.Cantidad}
                        onChange={handleInputChangeUpdate}
                        placeholder="Cantidad"
                      />
                      <input 
                        type="text"
                        name="Precio_Unitario"
                        value={fromData.Precio_Unitario}
                        onChange={handleInputChangeUpdate}
                        placeholder="Precio_Unitario"
                      />
                      <input 
                        type="text"
                        name="Descuento"
                        value={fromData.Descuento}
                        onChange={handleInputChangeUpdate}
                        placeholder="Descuento"
                      />
                      <input 
                        type="text"
                        name="Subtotal"
                        value={fromData.Subtotal}
                        onChange={handleInputChangeUpdate}
                        placeholder="Subtotal"
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

export default DetallePedidoFrom
