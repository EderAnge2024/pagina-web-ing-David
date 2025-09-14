import { useEffect, useState, useCallback } from 'react'
import useAdministradorStore from '../../store/AdministradorStore'
import style from './Administrador.module.css'

const Administrador = () => {
    const {addAdministrador, fetchAdministrador, administradors, deleteAdministrador, updateAdministrador} = useAdministradorStore() 
    const [editingAdministrador, setEditingAdministrador] = useState(null)
    const [administradorData, setAdministradorData] = useState({Nombre_Administrador:"", Usuario:"", Contrasena: "",NumAdministrador: "", Email: ""})
    const [formData, setFormData] = useState({Nombre_Administrador:"", Usuario:"", Contrasena: "",NumAdministrador: "", Email: ""})

    useEffect(()=>{
        fetchAdministrador()
    }, [fetchAdministrador])

    const handleInputChange = (e)=>{
       const {name, value} = e.target 
       setAdministradorData({
        ...administradorData,
        [name]:value
       })
    }

    const handelSubmit = async(e)=>{
        e.preventDefault()
        await addAdministrador(administradorData)
        setAdministradorData({Nombre_Administrador:"", Usuario:"", Contrasena: "",NumAdministrador: ""})
        fetchAdministrador()
    }

    const handleDelete = (ID_Administrador)=>{
        if(window.confirm("¿Estás seguro de eliminar este administrador?")){
            deleteAdministrador(ID_Administrador)
            fetchAdministrador()
        }
    }

    const handleEditClick = (administrador) => {
        setEditingAdministrador(administrador)
        setFormData({
            Nombre_Administrador: administrador.Nombre_Administrador, 
            Usuario: administrador.Usuario, 
            Contrasena: administrador.Contrasena,
            NumAdministrador: administrador.NumAdministrador,
            Email: administrador.Email || ""
        })
    }

    const handleInputChangeUpdate = (e) => {
        const {name, value} = e.target
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleUpdate = async () => {

        const updateData = {
            Nombre_Administrador: formData.Nombre_Administrador,
            Usuario: formData.Usuario,
            NumAdministrador: formData.NumAdministrador,
            Email: formData.Email
        };
    
        if (formData.Contrasena && formData.Contrasena !== editingAdministrador.Contrasena) {
            updateData.Contrasena = formData.Contrasena;
        }
    
        await updateAdministrador(editingAdministrador.ID_Administrador, updateData);
        fetchAdministrador();
        setEditingAdministrador(null);
    };

    const handleCancelEdit = () => {
        setEditingAdministrador(null)
    }

    return (
        <div className={style.container}>
            <div className={style.formContainer}>
                <h1>Agregar administradores</h1>
                <form onSubmit={handelSubmit}>
                    <input
                    type="text"
                    placeholder="Nombre del administrador"
                    required
                    name="Nombre_Administrador"
                    value={administradorData.Nombre_Administrador}
                    onChange={handleInputChange}
                    />
                    <input
                    type="text"
                    placeholder="Nombre de usuario"
                    required
                    name="Usuario"
                    value={administradorData.Usuario}
                    onChange={handleInputChange}
                    />
                    <input
                    type="password"
                    placeholder="Contraseña"
                    required
                    name="Contrasena"
                    value={administradorData.Contrasena}
                    onChange={handleInputChange}
                    />
                    <input
                    type="text"
                    placeholder="NumAdministrador"
                    required
                    name="NumAdministrador"
                    value={administradorData.NumAdministrador}
                    onChange={handleInputChange}
                    />
                    <input
                    type="email"
                    placeholder="Email"
                    required
                    name="Email"
                    value={administradorData.Email}
                    onChange={handleInputChange}
                    />
                    <button className={style.saveBtn}>Guardar Datos</button>
                </form>
            </div>
            <div className={style.listContainer}>
                <h1>Lista de administradores</h1>
                <div>
                    {administradors.map((user) =>(
                        <div className={style.adminCard} key={user.ID_Administrador}>
                            <div className={style.adminInfo}>
                                <p>Nombre: {user.Nombre_Administrador}</p>
                                <p>Usuario: {user.Usuario}</p>
                                <p>Contraseña: {user.Contrasena.replace(/./g, '*')}</p>
                                <p>Email: {user.Email}</p>
                            </div>
                            <div>
                                <button 
                                    className={style.deleteBtn} 
                                    onClick={()=> handleDelete(user.ID_Administrador)}
                                >
                                    Eliminar
                                </button>
                                <button 
                                    className={style.editBtn}
                                    onClick={()=> handleEditClick(user)}
                                >
                                    Editar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {editingAdministrador && (
                  <div className={style.modalOverlay}>
                    <div className={style.modalWindow}>
                      <span className={style.modalClose} onClick={handleCancelEdit}>&times;</span>
                      <h3>Editar administrador</h3>
                      <input 
                        type="text"
                        name="Nombre_Administrador"
                        value={formData.Nombre_Administrador}
                        onChange={handleInputChangeUpdate}
                        placeholder="Nombre del administrador"
                      />
                      <input 
                        type="text"
                        name="Usuario"
                        value={formData.Usuario}
                        onChange={handleInputChangeUpdate}
                        placeholder="Nombre de usuario"
                      />
                      <input 
                        type="password"
                        name="Contrasena"
                        value={formData.Contrasena}
                        onChange={handleInputChangeUpdate}
                        placeholder="Contraseña"
                      />
                      <input 
                        type="text"
                        name="NumAdministrador"
                        value={formData.NumAdministrador}
                        onChange={handleInputChangeUpdate}
                        placeholder="NumAdministrador"
                      />
                      <input 
                        type="email"
                        name="Email"
                        value={formData.Email}
                        onChange={handleInputChangeUpdate}
                        placeholder="Email"
                      />
                      <div className={style.botones}>
                        <button className={style.saveBtn} onClick={handleUpdate}>Guardar</button>
                        <button className={style.deleteBtn} onClick={handleCancelEdit}>Cancelar</button>
                      </div>
                     </div>
                  </div>
                )}
            </div>
        </div>
    )
}

export default Administrador