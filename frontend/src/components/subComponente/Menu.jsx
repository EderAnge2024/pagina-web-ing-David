
import { useState, useEffect } from "react";
import useProductoStore from "../../store/ProductoStore";
import useCategoriaStore from "../../store/CategoriaStore";
import stiloMenu from './Menu.module.css'

const Menu = () =>{
    const { productos, fetchProducto } = useProductoStore();
    const { categorias, fetchCategoria } = useCategoriaStore();
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        fetchCategoria();
        fetchProducto(); // Cargar productos al iniciar
        const interval = setInterval(fetchProducto, 10000); // cada 10 segundos
        return () => clearInterval(interval);
    }, [fetchProducto]);

    const manejarCompra = (producto) => {
        // Obtener el carrito actual del localStorage
        const carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];

        // Verificar si el producto ya está en el carrito
        const productoExistente = carritoActual.find(p => p.ID_Producto === producto.ID_Producto);

        if (productoExistente) {
            // Si ya existe, incrementar la cantidad
            productoExistente.cantidad += 1;
        } else {
            // Si no, agregarlo al carrito con cantidad 1
            carritoActual.push({ ...producto, cantidad: 1 });
        }

        // Guardar el carrito actualizado en localStorage
        localStorage.setItem("carrito", JSON.stringify(carritoActual));

        // Mostrar mensaje de éxito
        setMensaje("✅ Producto agregado al carrito");

        // Limpiar el mensaje después de un tiempo
        setTimeout(() => {
            setMensaje("");
        }, 1500);
    };

    return (
        <div >
            {mensaje && <div className="toast">{mensaje}</div>} {/* Mostrar el mensaje de éxito */}

           

            <div>
                <div className={stiloMenu.contenedor}>{categorias 
                        .map((categoria)=>(
                    <div key={categoria.ID_Categoria} className={stiloMenu.contenedorCategorias}>
                        <button
                          onClick={() =>
                            setCategoriaSeleccionada(
                              categoriaSeleccionada === categoria.ID_Categoria ? null : categoria.ID_Categoria
                            )
                          }
                        >
                          {categoria.Tipo_Producto}
                        </button>
                    </div>
                    ))}
                </div>
                
                <div>
                    <div>
                        {productos 
                            .filter((producto) =>
                              categoriaSeleccionada === null || producto.ID_Categoria === categoriaSeleccionada
                            )
                            .map((producto) => (
                                <div key={producto.ID_Producto}>
                                    <img src={producto.Url} alt={producto.Nombre_Producto} width="150" height="150" />
                                    <p>Producto: {producto.Nombre_Producto}</p>
                                    <p>Precio: {producto.Precio_Final}</p>
                                    <p>Cantidad disponible: {producto.cantidad_Disponible}</p>
                                    <button onClick={() => manejarCompra(producto)}>Agregar a Carrito</button>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>  
    );
};

export default Menu