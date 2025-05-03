import { useState } from 'react'
import useImagenStore from '../../store/ImagenStore'

const ImagenFrom= ()=>{
    const {addImagen} = useImagenStore() 
    const [imagenData, setImagenData] = useState ({
        Tipo_Imagen:"",
        URL:""
    })

    console.log(imagenData)

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
        alert("se agrego al profe")
    }

    return (
        <div>
        <div>
            <h1>Formulario de Profesores</h1>
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
        </div>
    )
}

export default ImagenFrom
