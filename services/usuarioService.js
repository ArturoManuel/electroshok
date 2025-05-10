import bcrypt from 'bcrypt';
import { Usuario } from '../models/index.js';
import { generateToken, generateRefreshToken } from '../config/jwt.js';

export const registrarUsuario = async (data) => {
    try {
        const hashPassword = await bcrypt.hash(data.contrasena, 10);
        const hashRespuesta = await bcrypt.hash(data.respuesta_secreta, 10);

        const nuevoUsuario = await Usuario.create({
            nombre: data.nombre,
            correo_electronico: data.correo_electronico,
            contrasena: hashPassword,
            rol: data.rol || 'cliente',
            pregunta_secreta: data.pregunta_secreta,
            respuesta_secreta: hashRespuesta
        });

        return {
            mensaje: 'Usuario registrado exitosamente',
            id: nuevoUsuario.id_usuario
        };
    } catch (error) {
        throw error;
    }
};

export const loginUsuario = async (data) => {
    try {
        const usuario = await Usuario.findOne({
            where: { correo_electronico: data.correo_electronico }
        });

        if (!usuario) {
            throw { mensaje: 'Usuario no encontrado' };
        }

        if (!usuario.esta_activo) {
            throw { mensaje: 'Usuario bloqueado' };
        }

        const coincide = await bcrypt.compare(data.contrasena, usuario.contrasena);

        if (!coincide) {
            const nuevoIntentos = usuario.intentos_login + 1;
            await usuario.update({ intentos_login: nuevoIntentos });

            if (nuevoIntentos >= 3) {
                await usuario.update({ esta_activo: false });
                throw { mensaje: 'Usuario bloqueado por múltiples intentos fallidos' };
            }

            throw { mensaje: 'Contraseña incorrecta' };
        }

        await usuario.update({ intentos_login: 0 });

        const usuarioData = usuario.toJSON();
        delete usuarioData.contrasena;
        delete usuarioData.respuesta_secreta;

        // Generar tokens
        const token = generateToken({
            id_persona: usuarioData.id_usuario,
            email: usuarioData.correo_electronico,
            rol: usuarioData.rol
        });

        const refreshToken = generateRefreshToken({
            id_persona: usuarioData.id_usuario
        });

        return {
            token,
            refreshToken,
            user: {
                id_persona: usuarioData.id_usuario,
                email: usuarioData.correo_electronico,
                rol: usuarioData.rol
            }
        };
    } catch (error) {
        throw error;
    }
};

export const bloquearUsuario = async (id) => {
    try {
        const [numRows] = await Usuario.update(
            { esta_activo: false },
            { where: { id_usuario: id } }
        );

        if (numRows === 0) {
            throw { mensaje: 'Usuario no encontrado' };
        }

        return { mensaje: 'Usuario bloqueado exitosamente' };
    } catch (error) {
        throw error;
    }
};

export const validarPreguntaSecreta = async (data) => {
    try {
        const usuario = await Usuario.findOne({
            where: { correo_electronico: data.correo_electronico }
        });

        if (!usuario) {
            throw { mensaje: 'Usuario no encontrado' };
        }

        if (usuario.pregunta_secreta !== data.pregunta_secreta) {
            throw { mensaje: 'Pregunta secreta incorrecta' };
        }

        const coincide = await bcrypt.compare(data.respuesta_secreta, usuario.respuesta_secreta);

        if (!coincide) {
            throw { mensaje: 'Respuesta secreta incorrecta' };
        }

        return {
            mensaje: 'Validación exitosa',
            id_usuario: usuario.id_usuario
        };
    } catch (error) {
        throw error;
    }
};

export const generarOtp = async (id_usuario) => {
    try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otp_expira = new Date(Date.now() + 5 * 60000); // 5 minutos

        await Usuario.update(
            { otp, otp_expira },
            { where: { id_usuario } }
        );

        return {
            mensaje: 'OTP generado exitosamente',
            otp: otp
        };
    } catch (error) {
        throw error;
    }
};

export const loginConOtp = async (data) => {
    try {
        const usuario = await Usuario.findOne({
            where: { correo_electronico: data.correo_electronico }
        });

        if (!usuario) {
            throw { mensaje: 'Usuario no encontrado' };
        }

        if (usuario.otp !== data.otp) {
            throw { mensaje: 'OTP inválido' };
        }

        if (new Date() > new Date(usuario.otp_expira)) {
            throw { mensaje: 'OTP expirado' };
        }

        await usuario.update({
            otp: null,
            otp_expira: null
        });

        const usuarioData = usuario.toJSON();
        delete usuarioData.contrasena;
        delete usuarioData.respuesta_secreta;
        delete usuarioData.otp;
        delete usuarioData.otp_expira;

        return usuarioData;
    } catch (error) {
        throw error;
    }
};

export const cambiarContrasena = async (id_usuario, correo_electronico, otpIngresado, nuevaContrasena) => {
    try {
        const usuario = await Usuario.findOne({
            where: {
                id_usuario,
                correo_electronico
            }
        });

        if (!usuario) {
            throw { mensaje: 'Usuario no encontrado' };
        }

        if (usuario.otp !== otpIngresado) {
            throw { mensaje: 'OTP inválido' };
        }

        if (new Date() > new Date(usuario.otp_expira)) {
            throw { mensaje: 'OTP expirado' };
        }

        const hashPassword = await bcrypt.hash(nuevaContrasena, 10);

        await usuario.update({
            contrasena: hashPassword,
            otp: null,
            otp_expira: null
        });

        return { mensaje: 'Contraseña actualizada exitosamente' };
    } catch (error) {
        throw error;
    }
};

export const listarUsuarios = async () => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: ['id_usuario', 'nombre', 'correo_electronico', 'rol', 'esta_activo']
        });
        return usuarios;
    } catch (error) {
        throw error;
    }
};

export const buscarUsuarioPorId = async (id_usuario) => {
    try {
        const usuario = await Usuario.findOne({
            where: { id_usuario },
            attributes: ['id_usuario', 'nombre', 'correo_electronico', 'rol', 'esta_activo']
        });

        if (!usuario) {
            throw { mensaje: 'Usuario no encontrado' };
        }

        return usuario;
    } catch (error) {
        throw error;
    }
};