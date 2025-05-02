import { useState } from "react";
import './categoriaForm.css';
import axios from 'axios';

const CategoriaForm = () => {
    const [categoriaData, setCategoriaData] = useState({
        Tipo_Producto: "",
        Descripcion: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCategoriaData({
            ...categoriaData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3001/categorias', categoriaData);
            alert("CATEGORÍA AGREGADA");
            setCategoriaData({
                Tipo_Producto: "",
                Descripcion: ""
            });
        } catch (error) {
            alert("Error al agregar categoría");
            console.error(error);
        }
    };

    return (
        <div className="register">
            <h1>AGREGAR CATEGORÍA</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="Tipo_Producto"
                    placeholder="Tipo de Producto"
                    required
                    value={categoriaData.Tipo_Producto}
                    onChange={handleInputChange}
                />
                <textarea
                    name="Descripcion"
                    placeholder="Descripción"
                    required
                    value={categoriaData.Descripcion}
                    onChange={handleInputChange}
                />
                <button type="submit">AGREGAR CATEGORÍA</button>
            </form>
        </div>
    );
};

export default CategoriaForm;
