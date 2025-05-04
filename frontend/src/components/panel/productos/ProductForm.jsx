import { useState, useEffect } from "react";
import './productofrom.css';
import axios from 'axios';

const ProductoForm = () => {
    const [productoData, setProductoData] = useState({
        ID_Categoria: "",
        Codigo: "",
        Nombre_Producto: "",
        Descripcion: "",
        Descuento: "",
        Precio_Producto: "",
        Marca: "",
        Cantidad: "",
        cantidad_Disponible: "",
        Url: "",
        Precio_Final: ""
    });
    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        fetchCategorias();
    }, []);

    const fetchCategorias = async () => {
        try {
            const response = await axios.get('http://localhost:3001/categorias');
            setCategorias(response.data);
        } catch (error) {
            console.error("Error al obtener las categorías:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductoData({
            ...productoData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3001/productos', productoData);
            alert("PRODUCTO AGREGADO");
            setProductoData({
                ID_Categoria: "",
                Codigo: "",
                Nombre_Producto: "",
                Descripcion: "",
                Descuento: "",
                Precio_Producto: "",
                Marca: "",
                Cantidad: "",
                cantidad_Disponible: "",
                Url: "",
                Precio_Final: ""
            });
        } catch (error) {
            alert("Error al agregar producto");
            console.error(error);
        }
    };

    return (
        <div className="register">
            <h1>AGREGAR PRODUCTO</h1>
            <form onSubmit={handleSubmit}>
                <select name="ID_Categoria" required value={productoData.ID_Categoria} onChange={handleInputChange}>
                    <option value="">Seleccione la categoria</option>
                    {categorias.map((categoria) => (
                        <option key={categoria.ID_Categoria} value={categoria.ID_Categoria}>
                            {categoria.Tipo_Producto}
                        </option>
                    ))}
                </select>

                <input type="text" name="Codigo" placeholder="Código del Producto" required value={productoData.Codigo} onChange={handleInputChange} />
                <input type="text" name="Nombre_Producto" placeholder="Nombre del Producto" required value={productoData.Nombre_Producto} onChange={handleInputChange} />
                <textarea name="Descripcion" placeholder="Descripción" required value={productoData.Descripcion} onChange={handleInputChange} />
                <input type="number" name="Descuento" placeholder="Descuento (%)" required value={productoData.Descuento} onChange={handleInputChange} />
                <input type="number" name="Precio_Producto" placeholder="Precio Original" required value={productoData.Precio_Producto} onChange={handleInputChange} />
                <input type="text" name="Marca" placeholder="Marca" required value={productoData.Marca} onChange={handleInputChange} />
                <input type="number" name="Cantidad" placeholder="Cantidad Total" required value={productoData.Cantidad} onChange={handleInputChange} />
                <input type="number" name="cantidad_Disponible" placeholder="Cantidad Disponible" required value={productoData.cantidad_Disponible} onChange={handleInputChange} />
                <input type="text" name="Url" placeholder="URL de la imagen" required value={productoData.Url} onChange={handleInputChange} />
                <input type="number" name="Precio_Final" placeholder="Precio Final (con descuento)" required value={productoData.Precio_Final} onChange={handleInputChange} />
                <button type="submit">AGREGAR PRODUCTO</button>
            </form>
        </div>
    );
};

export default ProductoForm;
