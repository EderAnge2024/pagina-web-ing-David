import { useEffect, useState } from 'react'
import useFacturaStore from '../../store/FacturaStore'
import useClienteStore from '../../store/ClienteStore'

const Factura= ()=>{
    const {addFactura,fetchFactura,facturas,deleteFactura,updateFactura} = useFacturaStore() 
    const {clientes,fetchCliente} = useClienteStore()
    const [editingFactura, setEditingFactura]= useState(null)
    const [facturaData, setFacturaData] = useState ({ID_Pedido:"",ID_Cliente:"",Fecha:"",Monto_Total:""})
    const [fromData, setFormData] = useState ({ID_Pedido:"",ID_Cliente:"",Fecha:"",Monto_Total:""})

    console.log(facturaData)
    useEffect(()=>{
        fetchFactura()
        fetchCliente()
    },[])

    // escucha lo que se ecribe en los input de la interfaz creada.
    const handleInputChange = (e)=>{
       const {name, value} = e. target 
       setFacturaData({
        ...facturaData,
        [name]:value
       })
    }

    // creamos la funcion que graba los datos de los input
    const handelSubmit = async(e)=>{
        e.preventDefault()      // previene algo por defecto nose
        addFactura(facturaData)
        setFacturaData({ID_Pedido:"",ID_Cliente:"",Fecha:"",Monto_Total:""})
        alert("se agrego nueva factura")
    }
    // elimina a la factura
    const handleDelete = (ID_Factura)=>{
        if(window.confirm("Are you sure")){
            deleteFactura(ID_Factura)
            fetchFactura()
        }
    }
    //configura al estudinate para su edicion
    const handleEditClick = (factura) => {
        setEditingFactura(factura)
        setFormData({ID_Pedido:factura.ID_Pedido, ID_Cliente:factura.ID_Cliente, Fecha:factura.Fecha,Monto_Total:factura.Monto_Total})
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
        updateFactura(editingFactura.ID_Factura, fromData)
        fetchFactura()
        setEditingFactura(null)
    }
    const handleCancelEdit = () => {
        setEditingFactura(null);
      }
    return (
        <div>
        <div>
            <h1>Agregar facturas</h1>
            <form onSubmit={handelSubmit}>
                <input
                type="text"
                placeholder="enter ID_Pedido"
                required
                name="ID_Pedido"
                value={facturaData.ID_Pedido}
                onChange={handleInputChange}
                />
                <select
                  name="ID_Cliente"
                  value={facturaData.ID_Cliente}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">-- Seleccionar Cliente --</option>
                  {clientes.map((cliente) => (
                    <option key={cliente.ID_Cliente} value={cliente.ID_Cliente}>
                      {cliente.Nombre}
                    </option>
                  ))}
                </select>
                <input
                type="text"
                placeholder="enter Fecha"
                required
                name="Fecha"
                value={facturaData.Fecha}
                onChange={handleInputChange}
                />
                <input
                type="text"
                placeholder="enter Monto_Total"
                required
                name="Monto_Total"
                value={facturaData.Monto_Total}
                onChange={handleInputChange}
                />
                <button>Guardar Datos</button>
            </form>
        </div>
        <div>
            
            <div>
                <div>
                <h1>Lista de la facturaes</h1>
                {
                    facturas.map((user) =>(
                        <div key={user.ID_Factura}>
                            <p>ID_Pedido: {user.ID_Pedido} </p>
                            <p>ID_Cliente: {user.ID_Cliente}</p>
                            <p>Fecha: {user.Fecha}</p>
                            <p>Monto Total: {user.Monto_Total}</p>
                            <button onClick={()=> handleDelete(user.ID_Factura)}>❌👍</button>
                            <button onClick={()=> handleEditClick(user)}>👌✍️🗃️</button>
                        </div>
                    ))
                }
                </div>
                {editingFactura && (
                  <div className="modal-overlay">
                    <div className="modal-window">
                      <span className="modal-close" onClick={handleCancelEdit}>&times;</span>
                      <h3>Editar factura</h3>
                      <input 
                        type="text"
                        name="ID_Pedido"
                        value={fromData.ID_Pedido}
                        onChange={handleInputChangeUpdate}
                        placeholder="Tipo de factura"
                      />
                      <input 
                        type="text"
                        name="ID_Cliente"
                        value={fromData.ID_Cliente}
                        onChange={handleInputChangeUpdate}
                        placeholder="ID_Cliente o ruta"
                      />
                      <input 
                        type="text"
                        name="Fecha"
                        value={fromData.Fecha}
                        onChange={handleInputChangeUpdate}
                        placeholder="Fecha"
                      />
                      <input 
                        type="text"
                        name="Monto_Total"
                        value={fromData.Monto_Total}
                        onChange={handleInputChangeUpdate}
                        placeholder="Monto_Total"
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

export default Factura
