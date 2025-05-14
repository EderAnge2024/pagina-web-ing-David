import { useEffect, useState } from 'react'
import useProductoStore from '../../store/ProductoStore'
import useCategoriaStore from '../../store/CategoriaStore'

const ProductosFrom= ()=>{
    const {addProducto,fetchProducto,productos,deleteProducto,updateProducto} = useProductoStore() 
    const {categorias, fetchCategoria} = useCategoriaStore()
    const [editingProducto, setEditingProducto]= useState(null)
    const [productoData, setProductoData] = useState ({ID_Categoria:"",Codigo:"",Nombre_Producto:"",Descripcion:"",Descuento:"",Precio_Producto:"",Marca:"",Cantidad:"",cantidad_Disponible:"",Url:"",Precio_Final:""})
    const [formData, setFormData] = useState ({ID_Categoria:"",Codigo:"",Nombre_Producto:"",Descripcion:"",Descuento:"",Precio_Producto:"",Marca:"",Cantidad:"",cantidad_Disponible:"",Url:"",Precio_Final:""})

    console.log(productoData)
    useEffect(()=>{
        fetchProducto()
        fetchCategoria()
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
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    // actualiza a la imgen
    const handleUpdate = async()=>{
        updateProducto(editingProducto.ID_Producto, formData)
        setEditingProducto(null)
        fetchProducto()
    }
    const handleCancelEdit = () => {
        setEditingProducto(null);
      }
    return (
        <div>
        <div>
            <h1>Agregar productos</h1>
            <form onSubmit={handelSubmit}>
                <select
                  name="ID_Categoria"
  value={productoData.ID_Categoria}
  onChange={handleInputChange}
  required
                >
                  <option value="">-- Seleccionar categoría --</option>
                  {categorias.map((cat) => (
                    <option key={cat.ID_Categoria} value={cat.ID_Categoria}>
                      {cat.Tipo_Producto}
                    </option>
                  ))}
                </select>

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
                            <p>Marca: {user.Marca}</p>
                            <p>Cantidad: {user.Cantidad}</p>
                            <p>Cantidad disponible: {user.cantidad_Disponible}</p>
                            <p>Numero Descuento: {user.Descuento}</p>
                            <p>Numero Precio_Producto: {user.Precio_Producto}</p>
                            <p>Numero Precio_Final: {user.Precio_Final}</p>
                            <p>ruta: {user.Url}</p>
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
                      <select
                        name="ID_Categoria"
                        value={formData.ID_Categoria}
                        onChange={handleInputChangeUpdate}
                        required
                      >
                        <option value="">-- Seleccionar categoría --</option>
                        {categorias.map((cat) => (
                          <option key={cat.ID_Categoria} value={cat.ID_Categoria}>
                            {cat.Tipo_Producto}
                          </option>
                        ))}
                      </select>

                      <input 
                        type="text"
                        name="Codigo"
                        value={formData.Codigo}
                        onChange={handleInputChangeUpdate}
                        placeholder="Codigo o ruta"
                      />
                      <input 
                        type="text"
                        name="Nombre_Producto"
                        value={formData.Nombre_Producto}
                        onChange={handleInputChangeUpdate}
                        placeholder="Nombre_Producto"
                      />
                      <input 
                        type="text"
                        name="Descripcion"
                        value={formData.Descripcion}
                        onChange={handleInputChangeUpdate}
                        placeholder="Descripcion"
                      />
                      <input 
                        type="text"
                        name="Descuento"
                        value={formData.Descuento}
                        onChange={handleInputChangeUpdate}
                        placeholder="Descuento"
                      />
                      <input 
                        type="text"
                        name="Precio_Producto"
                        value={formData.Precio_Producto}
                        onChange={handleInputChangeUpdate}
                        placeholder="Precio_Producto"
                      />
                      <input 
                        type="text"
                        name="Marca"
                        value={formData.Marca}
                        onChange={handleInputChangeUpdate}
                        placeholder="Marca"
                      />
                      <input 
                        type="text"
                        name="Cantidad"
                        value={formData.Cantidad}
                        onChange={handleInputChangeUpdate}
                        placeholder="Cantidad"
                      />
                      <input 
                        type="text"
                        name="cantidad_Disponible"
                        value={formData.cantidad_Disponible}
                        onChange={handleInputChangeUpdate}
                        placeholder="cantidad_Disponible"
                      />
                      <input 
                        type="text"
                        name="Url"
                        value={formData.Url}
                        onChange={handleInputChangeUpdate}
                        placeholder="Url"
                      />
                      <input 
                        type="text"
                        name="Precio_Final"
                        value={formData.Precio_Final}
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
