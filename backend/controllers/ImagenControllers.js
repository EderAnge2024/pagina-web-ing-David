const Imagen = require('../models/Imagen');


const createImagenController = async ({ ID_Imagen, Tipo_Imagen, URL}) => {
    try {
        const newImagen = await Imagen.create({ID_Imagen, Tipo_Imagen, URL});
        return newImagen;
    } catch (error) {
        throw new Error(error.message);
    }
};


const getAllImagensController = async () => {
    try {
        const imagens = await Imagen.findAll();
        return imagens;
    } catch (error) {
        throw new Error(error.message);
    }
};


const updateImagenByIdController = async (ID_Imagen, imagenData) => {
    try {
        const updateImagen = await Imagen.findByPk(ID_Imagen);
        if (!updateImagen) {
            return null;
        }
        await updateImagen.update(imagenData);
        return updateImagen;
    } catch (error) {
        throw new Error(error.message);
    }
};


const deleteImagenByIdController = async (ID_Imagen) => {
    try {
        const deleteImagen = await Imagen.findByPk(ID_Imagen);
        if (!deleteImagen) {
            return null;
        }
        await deleteImagen.destroy();
        return deleteImagen;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    createImagenController,
    getAllImagensController,
    updateImagenByIdController,
    deleteImagenByIdController
};