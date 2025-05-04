import { useEffect, useState } from 'react'
import useCategoriaStore from '../../store/CategoriaStore'

const CategoriaFrom= ()=>{
    const {addCategoria,fetchCategoria,categorias,deleteCategoria,updateCategoria} = useCategoriaStore() 
    const [editindCategoria, setEditingCategoria]= useState(null)
    const [categoriaData, setCategoriaData] = useState ({Tipo_Producto:"",Descripcion:""})
    const [fromData, setFormData] = useState ({Tipo_Producto:"",Descripcion:""})

    console.log(categoriaData)
    useEffect(()=>{
        fetchCategoria()
    },[])

    // escucha lo que se ecribe en los input de la interfaz creada.
    const handleInputChange = (e)=>{
       const {name, value} = e. target 
       setCategoriaData({
        ...categoriaData,
        [name]:value
       })
    }

    // creamos la funcion que graba los datos de los input
    const handelSubmit = async(e)=>{
        e.preventDefault()      // previene algo por defecto nose
        addCategoria(categoriaData)
        setCategoriaData({Tipo_Producto:"",Descripcion:""})
        alert("se agrego al profe")
    }
    // elimina a la categoria
    const handleDelete = (ID_Categoria)=>{
        if(window.confirm("Are you sure")){
            deleteCategoria(ID_Categoria)
            fetchCategoria()
        }
    }
    //configura al estudinate para su edicion
    const handleEditClick = (categoria) => {
        setEditingCategoria(categoria)
        setFormData({Tipo_Producto:categoria.Tipo_Producto, Descripcion:categoria.Descripcion})
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
        updateCategoria(editindCategoria.ID_Categoria, fromData)
        fetchCategoria()
        setEditingCategoria(null)
    }
    const handleCancelEdit = () => {
        setEditingCategoria(null);
      }
    return (
        <div>
        <div>
            <h1>Agregar categorias</h1>
            <form onSubmit={handelSubmit}>
                <input
                type="text"
                placeholder="enter Tipo_Producto"
                required
                name="Tipo_Producto"
                value={categoriaData.Tipo_Producto}
                onChange={handleInputChange}
                />
                <input
                type="text"
                placeholder="enter Descripcion"
                required
                name="Descripcion"
                value={categoriaData.Descripcion}
                onChange={handleInputChange}
                />
                <button>Guardar Datos</button>
            </form>
        </div>
        <div>
            
            <div>
                <div>
                <h1>Lista de la categoriaes</h1>
                {
                    categorias.map((user) =>(
                        <div key={user.ID_Categoria}>
                            <p>Nombre: {user.Tipo_Producto} </p>
                            <p>Descripcion: {user.Descripcion}</p>
                            <button onClick={()=> handleDelete(user.ID_Categoria)}>❌👍</button>
                            <button onClick={()=> handleEditClick(user)}>👌✍️🗃️</button>
                        </div>
                    ))
                }
                </div>
                {editindCategoria && (
                  <div className="modal-overlay">
                    <div className="modal-window">
                      <span className="modal-close" onClick={handleCancelEdit}>&times;</span>
                      <h3>Editar categoria</h3>
                      <input 
                        type="text"
                        name="Tipo_Producto"
                        value={fromData.Tipo_Producto}
                        onChange={handleInputChangeUpdate}
                        placeholder="Tipo de categoria"
                      />
                      <input 
                        type="text"
                        name="Descripcion"
                        value={fromData.Descripcion}
                        onChange={handleInputChangeUpdate}
                        placeholder="Descripcion o ruta"
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

export default CategoriaFrom
