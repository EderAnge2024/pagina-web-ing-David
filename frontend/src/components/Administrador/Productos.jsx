import { useEffect, useState } from 'react'
import useProductoStore from '../../store/ProductoStore'

const ProductosFrom= ()=>{
    const {addProducto,fetchProducto,productos,deleteProducto,updateProducto} = useProductoStore() 
    const [editingProducto, setEditingProducto]= useState(null)
    const [productoData, setProductoData] = useState ({ID_Categoria:"",Codigo:"",Nombre_Producto:"",Descripcion:"",Descuento:"",Precio_Producto:"",Marca:"",Cantidad:"",cantidad_Disponible:"",Url:"",Precio_Final:""})
    const [fromData, setFormData] = useState ({ID_Categoria:"",Codigo:"",Nombre_Producto:"",Descripcion:"",Descuento:"",Precio_Producto:"",Marca:"",Cantidad:"",cantidad_Disponible:"",Url:"",Precio_Final:""})

    console.log(productoData)
    useEffect(()=>{
        fetchProducto()
    },[])

    // escucha lo que se ecribe en los input de la interfaz creada.
    const handleInputChange = (e)=>{
       const {name, value} = e. target 
       setProductoData({
        ...productoData,
        [name]:value
       })
    }

    // creamos la funcion que graba los datos de los input
    const handelSubmit = async(e)=>{
        e.preventDefault()      // previene algo por defecto nose
        addProducto(productoData)
        setProductoData({ID_Categoria:"",Codigo:"",Nombre_Producto:"",Descripcion:"",Descuento:"",Precio_Producto:"",Marca:"",Cantidad:"",cantidad_Disponible:"",Url:"",Precio_Final:""})
        alert("se agrego al profe")
    }
    // elimina a la producto
    const handleDelete = (Codigo)=>{
        if(window.confirm("Are you sure")){
            deleteProducto(Codigo)
            fetchProducto()
        }
    }
    //configura al estudinate para su edicion
    const handleEditClick = (producto) => {
        setEditingProducto(producto)
        setFormData({ID_Categoria:producto.ID_Categoria, Codigo:producto.Codigo, Nombre_Producto:producto.Nombre_Producto,Descripcion:producto.Descripcion,Descuento:producto.Descuento,Precio_Producto:producto.Precio_Producto,Marca:producto.Marca,Cantidad:producto.Cantidad,cantidad_Disponible:producto.cantidad_Disponible,Url:producto.Url,Precio_Final:producto.Precio_Final})
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
        updateProducto(editingProducto.ID_Producto, fromData)
        fetchProducto()
        setEditingProducto(null)
    }
    const handleCancelEdit = () => {
        setEditingProducto(null);
      }
    return (
        <div>
        <div>
            <h1>Agregar productos</h1>
            <form onSubmit={handelSubmit}>
                <input
                type="text"
                placeholder="enter ID_Categoria"
                required
                name="ID_Categoria"
                value={productoData.ID_Categoria}
                onChange={handleInputChange}
                />
                <input
                type="text"
                placeholder="enter Codigo"
                required
                name="Codigo"
                value={productoData.Codigo}
                onChange={handleInputChange}
                />
                <input
                type="text"
                placeholder="enter Nombre_Producto"
                required
                name="Nombre_Producto"
                value={productoData.Nombre_Producto}
                onChange={handleInputChange}
                />
                <input
                type="text"
                placeholder="enter Descripcion"
                required
                name="Descripcion"
                value={productoData.Descripcion}
                onChange={handleInputChange}
                />
                <input
                type="text"
                placeholder="enter Descuento"
                required
                name="Descuento"
                value={productoData.Descuento}
                onChange={handleInputChange}
                />
                <input
                type="text"
                placeholder="enter Precio_Producto"
                required
                name="Precio_Producto"
                value={productoData.Precio_Producto}
                onChange={handleInputChange}
                />
                <input
                type="text"
                placeholder="enter Marca"
                required
                name="Marca"
                value={productoData.Marca}
                onChange={handleInputChange}
                />
                <input
                type="text"
                placeholder="enter Cantidad"
                required
                name="Cantidad"
                value={productoData.Cantidad}
                onChange={handleInputChange}
                />
                <input
                type="text"
                placeholder="enter cantidad_Disponible"
                required
                name="cantidad_Disponible"
                value={productoData.cantidad_Disponible}
                onChange={handleInputChange}
                />
                <input
                type="text"
                placeholder="enter Url"
                required
                name="Url"
                value={productoData.Url}
                onChange={handleInputChange}
                />
                <input
                type="text"
                placeholder="enter Precio_Final"
                required
                name="Precio_Final"
                value={productoData.Precio_Final}
                onChange={handleInputChange}
                />
                <button>Guardar Datos</button>
            </form>
        </div>
        <div>
            
            <div>
                <div>
                <h1>Lista de la productoes</h1>
                {
                    productos.map((user) =>(
                        <div key={user.ID_Producto}>
                            <p>ID_Categoria: {user.ID_Categoria} </p>
                            <p>Codigo: {user.Codigo}</p>
                            <p>Numero Celular: {user.Nombre_Producto}</p>
                            <p>Descripcion: {user.Descripcion}</p>
                            <p>Numero Descuento: {user.Descuento}</p>
                            <p>Numero Precio_Producto: {user.Precio_Producto}</p>
                            <button onClick={()=> handleDelete(user.ID_Producto)}>❌👍</button>
                            <button onClick={()=> handleEditClick(user)}>👌✍️🗃️</button>
                        </div>
                    ))
                }
                </div>
                {editingProducto && (
                  <div className="modal-overlay">
                    <div className="modal-window">
                      <span className="modal-close" onClick={handleCancelEdit}>&times;</span>
                      <h3>Editar producto</h3>
                      <input 
                        type="text"
                        name="ID_Categoria"
                        value={fromData.ID_Categoria}
                        onChange={handleInputChangeUpdate}
                        placeholder="Tipo de producto"
                      />
                      <input 
                        type="text"
                        name="Codigo"
                        value={fromData.Codigo}
                        onChange={handleInputChangeUpdate}
                        placeholder="Codigo o ruta"
                      />
                      <input 
                        type="text"
                        name="Nombre_Producto"
                        value={fromData.Nombre_Producto}
                        onChange={handleInputChangeUpdate}
                        placeholder="Nombre_Producto"
                      />
                      <input 
                        type="text"
                        name="Descripcion"
                        value={fromData.Descripcion}
                        onChange={handleInputChangeUpdate}
                        placeholder="Descripcion"
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
                        name="Precio_Producto"
                        value={fromData.Precio_Producto}
                        onChange={handleInputChangeUpdate}
                        placeholder="Precio_Producto"
                      />
                      <input 
                        type="text"
                        name="Marca"
                        value={fromData.Marca}
                        onChange={handleInputChangeUpdate}
                        placeholder="Marca"
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
                        name="cantidad_Disponible"
                        value={fromData.cantidad_Disponible}
                        onChange={handleInputChangeUpdate}
                        placeholder="cantidad_Disponible"
                      />
                      <input 
                        type="text"
                        name="Url"
                        value={fromData.Url}
                        onChange={handleInputChangeUpdate}
                        placeholder="Url"
                      />
                      <input 
                        type="text"
                        name="Precio_Final"
                        value={fromData.Precio_Final}
                        onChange={handleInputChangeUpdate}
                        placeholder="Precio_Final"
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

export default ProductosFrom
