import { useState, useEffect, useMemo } from "react";
import useProductoStore from "../../store/ProductoStore";
import useBusquedaStore from "../../store/BusquedaStore";
import useCategoriaStore from "../../store/CategoriaStore";
import styles from './Menu.module.css';

const Menu = () => {
    const { productos, fetchProducto } = useProductoStore();
    const { searchQuery } = useBusquedaStore();
    const { categorias, fetchCategoria, loading } = useCategoriaStore();
    const [categoriaActiva, setCategoriaActiva] = useState('Todos');
    const [busquedaRealizada, setBusquedaRealizada] = useState(false);

    // Esta función es solo para depuración - muestra las categorías en la consola
    useEffect(() => {
        console.log("Categorías actuales:", categorias);
    }, [categorias]);

    useEffect(() => {
        if (searchQuery) {
            setBusquedaRealizada(true);
            const timer = setTimeout(() => setBusquedaRealizada(false), 1000);
            return () => clearTimeout(timer);
        }
    }, [searchQuery]);

    // Cargar productos y categorías al montar el componente
    useEffect(() => {
        console.log("Iniciando carga de datos...");
        
        const loadData = async () => {
            try {
                await Promise.all([fetchProducto(), fetchCategoria()]);
                console.log("Datos cargados correctamente");
            } catch (error) {
                console.error("Error al cargar datos:", error);
            }
        };
        
        loadData();
    }, []);

    // Preparar las categorías para el menú
    const categoriasMenu = useMemo(() => {
        // Asegurarnos de que tenemos categorías para trabajar
        if (!categorias || categorias.length === 0) {
            return ['Todos'];
        }
        
        // Extraer los nombres de las categorías y formatearlos
        const nombresCategorias = categorias.map(c => {
            // Verificar que la categoría tiene un nombre
            if (!c || (!c.Nombre_Categoria && !c.nombre_categoria)) {
                console.warn("Categoría sin nombre:", c);
                return "Sin nombre";
            }
            
            // Normalizar el nombre (puede venir en diferentes propiedades)
            const nombre = c.Nombre_Categoria || c.nombre_categoria || 'General';
            return nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();
        });
        
        // Eliminar duplicados y ordenar
        const categoriasUnicas = [...new Set(nombresCategorias)].sort();
        
        // Siempre incluir 'Todos' al principio
        return ['Todos', ...categoriasUnicas];
    }, [categorias]);

    // Filtrar productos según la categoría activa y la búsqueda
    const productosFiltrados = useMemo(() => {
        if (!productos || productos.length === 0) {
            return [];
        }
        
        // Primero filtrar por categoría
        let filtrados = productos;
        if (categoriaActiva !== 'Todos') {
            filtrados = productos.filter(p => {
                // Normalizar la categoría del producto (puede venir en diferentes propiedades)
                const productoCategoria = (
                    p.Categoria || 
                    p.categoria || 
                    'General'
                ).toLowerCase();
                
                return productoCategoria === categoriaActiva.toLowerCase();
            });
        }
        
        // Luego filtrar por búsqueda
        if (searchQuery) {
            const searchLower = searchQuery.toLowerCase();
            filtrados = filtrados.filter(p => (
                (p.Nombre_Producto && p.Nombre_Producto.toLowerCase().includes(searchLower)) ||
                (p.Descripcion && p.Descripcion.toLowerCase().includes(searchLower)) ||
                (p.Categoria && p.Categoria.toLowerCase().includes(searchLower)) ||
                (p.categoria && p.categoria.toLowerCase().includes(searchLower))
            ));
        }
        
        return filtrados;
    }, [productos, categoriaActiva, searchQuery]);

    const destacarTexto = (texto) => {
        if (!searchQuery || !texto) return texto || '';
        
        const regex = new RegExp(`(${searchQuery})`, 'gi');
        return texto.split(regex).map((part, i) => 
            i % 2 === 1 ? <span key={i} className={styles.destacarBusqueda}>{part}</span> : part
        );
    };

    return (
        <div className={styles.container}>
            <div className={`${styles.container} ${busquedaRealizada ? styles.busquedaEffect : ''}`}></div>
            <h1 className={styles.titulo}>Nuestro Menú</h1>
            
            {searchQuery && (
                <p className={styles.resultadosBusqueda}>
                    Resultados para: "{searchQuery}"
                </p>
            )}
            
            {/* Navbar de categorías */}
            <nav className={styles.navCategorias}>
                {loading ? (
                    <p>Cargando categorías...</p>
                ) : (
                    <ul className={styles.listaCategorias}>
                        {categoriasMenu.map(cat => (
                            <li key={cat}>
                                <button
                                    className={`${styles.botonCategoria} ${cat === categoriaActiva ? styles.activo : ''}`}
                                    onClick={() => setCategoriaActiva(cat)}
                                >
                                    {cat}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </nav>
            
            {/* Productos filtrados */}
            <div className={styles.contenedorProductos}>
                {productosFiltrados.length > 0 ? (
                    productosFiltrados.map(producto => (
                        <div key={producto.ID_Producto} className={styles.tarjetaProducto}>
                            <div className={styles.contenedorImagen}>
                                <img 
                                    src={producto.Url} 
                                    alt={producto.Nombre_Producto} 
                                    className={styles.imagenProducto}
                                />
                            </div>
                            <div className={styles.infoProducto}>
                                <h3>{destacarTexto(producto.Nombre_Producto)}</h3>
                                {producto.Descripcion && (
                                    <p className={styles.descripcion}>
                                        {destacarTexto(producto.Descripcion.substring(0, 100))}...
                                    </p>
                                )}
                                <p className={styles.precio}>S/ {Number(producto.Precio_Final).toFixed(2)}</p>
                                <p className={styles.stock}>
                                    {producto.cantidad_Disponible > 0 
                                        ? `Disponibles: ${producto.cantidad_Disponible}` 
                                        : 'Agotado'}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className={styles.sinProductos}>
                        No hay productos que coincidan con tu búsqueda
                        {searchQuery && `: "${searchQuery}"`}
                        {categoriaActiva !== 'Todos' && ` en la categoría ${categoriaActiva}`}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Menu;