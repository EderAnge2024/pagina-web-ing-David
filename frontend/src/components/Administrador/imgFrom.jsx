import { useEffect, useState } from 'react'
import useImagenStore from '../../store/ImagenStore'
import styles from './imgFrom.module.css'

const ImagenFrom= ()=>{
    const {addImagen,fetchImagen,imagens,deleteImagen,updateImagen} = useImagenStore() 
    const [editingImagen, setEditingImagen]= useState(null)
    const [imagenData, setImagenData] = useState ({Tipo_Imagen:"",URL:""})
    const [fromData, setFormData] = useState ({Tipo_Imagen:"",URL:""})

    console.log(imagenData)
    useEffect(()=>{
        fetchImagen()
    },[])

    // escucha lo que se ecribe en los input de la interfaz creada.
    const handleInputChange = (e)=>{
       const {name, value} = e. target 
       setImagenData({
        ...imagenData,
        [name]:value
       })
    }

    // creamos la funcion que graba los datos de los input
    const handelSubmit = async(e)=>{
        e.preventDefault()      // previene algo por defecto nose
        addImagen(imagenData)
        setImagenData({
            Tipo_Imagen:"",
            URL:""
        })
        alert("se agrego a la imgen")
    }
    // elimina a la imagen
    const handleDelete = (ID_Imagen)=>{
        if(window.confirm("Are you sure")){
            deleteImagen(ID_Imagen)
            fetchImagen()
        }
    }
    //configura al estudinate para su edicion
    const handleEditClick = (imagen) => {
        setEditingImagen(imagen)
        setFormData({Tipo_Imagen:imagen.Tipo_Imagen, URL:imagen.URL})
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
        updateImagen(editingImagen.ID_Imagen, fromData)
        fetchImagen()
        setEditingImagen(null)
    }
    const handleCancelEdit = () => {
        setEditingImagen(null);
      }
    return (
        <div className={styles.ImagenFrom}>
        <div className={styles.AgregarImg}>
            <h1>Agregar Imgens para el logo y banner</h1>
            <form onSubmit={handelSubmit}>
                <input
                type="text"
                placeholder="enter Tipo_Imagen"
                required
                name="Tipo_Imagen"
                value={imagenData.Tipo_Imagen}
                onChange={handleInputChange}
                />
                <input
                type="text"
                placeholder="enter URL"
                required
                name="URL"
                value={imagenData.URL}
                onChange={handleInputChange}
                />
                <button>Guardar Datos</button>
            </form>
        </div>
        <div className={styles.lista}>
            
            <div className={styles.tabla}>
                <div className={styles.tablita}>
                <h1>Lista de la imagenes</h1>
                {
                    imagens.map((user) =>(
                        <div key={user.ID_Imagen}>
                            <p>Tipo de imgen: {user.Tipo_Imagen} </p>
                            <p>Ruta de la imgen: {user.URL}</p>
                            <button onClick={()=> handleDelete(user.ID_Imagen)}>❌👍</button>
                            <button onClick={()=> handleEditClick(user)}>👌✍️🗃️</button>
                        </div>
                    ))
                }
                </div>
                {editingImagen && (
                  <div className={styles.modal_overlay}>
                    <div className={styles.modal_window}>
                      <span className={styles.modal_close} onClick={handleCancelEdit}>&times;</span>
                      <h3>Editar imagen</h3>
                      <input 
                        type="text"
                        name="Tipo_Imagen"
                        value={fromData.Tipo_Imagen}
                        onChange={handleInputChangeUpdate}
                        placeholder="Tipo de imagen"
                      />
                      <input 
                        type="text"
                        name="URL"
                        value={fromData.URL}
                        onChange={handleInputChangeUpdate}
                        placeholder="URL o ruta"
                      />
                      <div className={styles.botones}>
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

export default ImagenFrom
