import useImagenStore from "../../store/ImagenStore";
import sitloInicio from './inicio.module.css'

const Inicio = () => {
    const { imagens } = useImagenStore();

    // Encuentra la imagen tipo "Banner"
    const bannerImg = imagens.find(img => img.Tipo_Imagen === "Banner");

    return (
        <div className={sitloInicio.cuerpoBanner}>
            <div
                className={sitloInicio.inicio}
                style={{
                    backgroundImage: 
                    `linear-gradient(rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.3)),
                    url(${bannerImg?.URL})`,
                }}
            >
                <div className={sitloInicio.baner}>
                    <h1>Compra los mejores</h1>
                    <h1>productos</h1>
                    <h5>descubra la calidad de nuestros productos y los mejores servicios</h5>
                    <h4>"¡Compre ya!"</h4>
                </div>
            </div>  
            <div className={sitloInicio.contenidoPro}>
                <h5>Productos destacados ✨</h5>
                <div className={sitloInicio.productosDes}>
                    
                </div>
            </div>
        </div>  
    );
};

export default Inicio;
