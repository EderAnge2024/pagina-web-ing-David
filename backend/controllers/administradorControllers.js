const Administrador = require('../models/Administrador');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

let codigosRecuperacionEmail = {}; // { email: { codigo, expiracion } }

const createAdministradorController = async ({ ID_Administrador, Nombre_Administrador, Usuario, Contrasena, NumAdministrador, Email }) => {
    try {
        const hashedPassword = await bcrypt.hash(Contrasena, 10);
        const newAdministrador = await Administrador.create({
            ID_Administrador,
            Nombre_Administrador,
            Usuario,
            Contrasena: hashedPassword,
            NumAdministrador,
            Email
        });
        return newAdministrador;
    } catch (error) {
        throw new Error(error.message);
    }
};


const getAllAdministradorsController = async () => {
    try {
        const administradors = await Administrador.findAll();
        return administradors;
    } catch (error) {
        throw new Error(error.message);
    }
};


const updateAdministradorByIdController = async (ID_Administrador, administradorData) => {
    try {
        const administrador = await Administrador.findByPk(ID_Administrador);
        if (!administrador) {
            return null;
        }

        if (administradorData.Contrasena) {
            administradorData.Contrasena = await bcrypt.hash(administradorData.Contrasena, 10);
        }

        await administrador.update(administradorData);
        return administrador;
    } catch (error) {
        throw new Error(error.message);
    }
};


const deleteAdministradorByIdController = async (ID_Administrador) => {
    try {
        const administrador = await Administrador.findByPk(ID_Administrador);
        if (!administrador) {
            return null;
        }
        await administrador.destroy();
        return administrador;
    } catch (error) {
        throw new Error(error.message);
    }
};
const getAdministradorByUsuarioController = async (usuario) => {
    try {
        const admin = await Administrador.findOne({ where: { Usuario: usuario } });
        return admin;
    } catch (error) {
        throw new Error(error.message);
    }
};

// --- Recuperación de contraseña por WhatsApp ---
const crypto = require('crypto');
let codigosRecuperacion = {}; // { usuario: { codigo, expiracion } }

const generarCodigoRecuperacion = async (usuario) => {
    const admin = await Administrador.findOne({ where: { Usuario: usuario } });
    if (!admin) throw new Error('Administrador no encontrado');
    if (!admin.NumAdministrador) throw new Error('El administrador no tiene número de WhatsApp registrado');
    // Generar código de 6 dígitos
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    // Guardar en memoria (puedes usar BD en producción)
    codigosRecuperacion[usuario] = {
        codigo,
        expiracion: Date.now() + 10 * 60 * 1000 // 10 minutos
    };
    return { codigo, numero: admin.NumAdministrador };
};

const verificarCodigoRecuperacion = async (usuario, codigo, nuevaContrasena) => {
    const registro = codigosRecuperacion[usuario];
    if (!registro || registro.codigo !== codigo || Date.now() > registro.expiracion) {
        throw new Error('Código inválido o expirado');
    }
    // Actualizar contraseña
    const admin = await Administrador.findOne({ where: { Usuario: usuario } });
    if (!admin) throw new Error('Administrador no encontrado');
    admin.Contrasena = await bcrypt.hash(nuevaContrasena, 10);
    await admin.save();
    // Eliminar el código usado
    delete codigosRecuperacion[usuario];
    return true;
};

// Solicitar código de recuperación por email
const solicitarCodigoRecuperacionEmail = async (email) => {
    const admin = await Administrador.findOne({ where: { Email: email } });
    if (!admin) throw new Error('Administrador no encontrado');
    // Generar código de 6 dígitos
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    // Guardar en memoria
    codigosRecuperacionEmail[email] = {
        codigo,
        expiracion: Date.now() + 10 * 60 * 1000 // 10 minutos
    };
    // Configurar transporte de correo (ajusta con tus credenciales reales)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'prometieron66@gmail.com',
            pass: 'einl tzqj juwe ynsh'
        }
    });
    // Enviar correo
    await transporter.sendMail({
        from: 'Recuperación <TU_CORREO@gmail.com>',
        to: email,
        subject: 'Código de recuperación de contraseña',
        text: `Tu código de recuperación es: ${codigo}`
    });
    return true;
};

// Verificar código y cambiar contraseña
const verificarCodigoRecuperacionEmail = async (email, codigo, nuevaContrasena) => {
    const registro = codigosRecuperacionEmail[email];
    if (!registro || registro.codigo !== codigo || Date.now() > registro.expiracion) {
        throw new Error('Código inválido o expirado');
    }
    // Actualizar contraseña
    const admin = await Administrador.findOne({ where: { Email: email } });
    if (!admin) throw new Error('Administrador no encontrado');
    admin.Contrasena = await bcrypt.hash(nuevaContrasena, 10);
    await admin.save();
    // Eliminar el código usado
    delete codigosRecuperacionEmail[email];
    return true;
};


module.exports = {
    createAdministradorController,
    getAllAdministradorsController,
    updateAdministradorByIdController,
    deleteAdministradorByIdController,
    getAdministradorByUsuarioController,
    generarCodigoRecuperacion,
    verificarCodigoRecuperacion,
    solicitarCodigoRecuperacionEmail,
    verificarCodigoRecuperacionEmail
};