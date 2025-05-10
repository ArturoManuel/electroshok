import {
    registrarUsuario,
    loginUsuario,
    validarPreguntaSecreta,
    generarOtp,
    loginConOtp,
    cambiarContrasena,
    listarUsuarios,
    buscarUsuarioPorId,
} from "../services/usuarioService.js";
import { verifyRefreshToken, generateToken } from '../config/jwt.js';

export const registrarUsuarioController = async (req, res) => {
    try {
        const resultado = await registrarUsuario(req.body);
        res.status(201).json(resultado);
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar usuario', detalles: error });
    }
};

export const loginUsuarioController = async (req, res) => {
    try {
        const resultado = await loginUsuario(req.body);
        res.json(resultado);
    } catch (error) {
        res.status(401).json({ error: 'Error en login', detalles: error });
    }
};

export const refreshTokenController = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({ error: 'Refresh token requerido' });
        }

        const decoded = verifyRefreshToken(refreshToken);
        const usuario = await buscarUsuarioPorId(decoded.id_persona);

        if (!usuario) {
            return res.status(403).json({ error: 'Acceso no autorizado' });
        }

        const token = generateToken({
            id_persona: usuario.id_usuario,
            email: usuario.correo_electronico,
            rol: usuario.rol
        });

        res.json({
            token,
            user: {
                id_persona: usuario.id_usuario,
                email: usuario.correo_electronico,
                rol: usuario.rol
            }
        });
    } catch (error) {
        res.status(error.name === 'TokenExpiredError' ? 401 : 403)
           .json({ error: error.message });
    }
};

export const recuperarCuentaController = async (req, res) => {
    try {
        const usuario = await validarPreguntaSecreta(req.body);
        const resultado = await generarOtp(usuario.id_usuario);
        res.json(resultado);
    } catch (error) {
        res.status(401).json({ error: 'Error en recuperación de cuenta', detalles: error });
    }
};

export const loginConOtpController = async (req, res) => {
    try {
        const resultado = await loginConOtp(req.body);
        res.json(resultado);
    } catch (error) {
        res.status(401).json({ error: 'Error en login con OTP', detalles: error });
    }
};

export const cambiarContrasenaController = async (req, res) => {
    try {
        const { id_usuario, correo_electronico, otp, nuevaContrasena } = req.body;
        const resultado = await cambiarContrasena(id_usuario, correo_electronico, otp, nuevaContrasena);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: 'Error al cambiar contraseña', detalles: error });
    }
};

export const listarUsuariosController = async (req, res) => {
    try {
        const usuarios = await listarUsuarios();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: 'Error al listar usuarios', detalles: error });
    }
};

export const buscarUsuarioPorIdController = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const usuario = await buscarUsuarioPorId(id_usuario);
        res.json(usuario);
    } catch (error) {
        const status = error.mensaje ? 404 : 500;
        res.status(status).json({ error: 'Error al buscar usuario', detalles: error });
    }
};