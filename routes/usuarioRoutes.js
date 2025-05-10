import express from "express";
import {
    registrarUsuarioController,
    loginUsuarioController,
    recuperarCuentaController,
    loginConOtpController,
    cambiarContrasenaController,
    listarUsuariosController,
    buscarUsuarioPorIdController,
    refreshTokenController,
} from "../controllers/usuarioController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       required:
 *         - nombre
 *         - correo_electronico
 *         - contrasena
 *         - pregunta_secreta
 *         - respuesta_secreta
 *       properties:
 *         nombre:
 *           type: string
 *           description: Nombre completo del usuario
 *         correo_electronico:
 *           type: string
 *           description: Correo electrónico del usuario
 *         contrasena:
 *           type: string
 *           description: Contraseña del usuario
 *         rol:
 *           type: string
 *           description: Rol del usuario (cliente o admin)
 *           default: cliente
 *         pregunta_secreta:
 *           type: string
 *           description: Pregunta de seguridad para recuperación
 *         respuesta_secreta:
 *           type: string
 *           description: Respuesta a la pregunta de seguridad
 */

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 */
router.post("/", registrarUsuarioController);

/**
 * @swagger
 * /usuarios/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - correo_electronico
 *               - contrasena
 *             properties:
 *               correo_electronico:
 *                 type: string
 *               contrasena:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *                 user:
 *                   type: object
 */
router.post("/login", loginUsuarioController);

/**
 * @swagger
 * /usuarios/refresh-token:
 *   post:
 *     summary: Refrescar token de acceso
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Nuevo token generado exitosamente
 */
router.post("/refresh-token", refreshTokenController);

/**
 * @swagger
 * /usuarios/recuperar:
 *   post:
 *     summary: Recuperar cuenta mediante pregunta secreta
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - correo_electronico
 *               - pregunta_secreta
 *               - respuesta_secreta
 *             properties:
 *               correo_electronico:
 *                 type: string
 *               pregunta_secreta:
 *                 type: string
 *               respuesta_secreta:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP generado exitosamente
 */
router.post("/recuperar", recuperarCuentaController);

router.post("/login-otp", loginConOtpController);

/**
 * @swagger
 * /usuarios/cambiar-contrasena:
 *   patch:
 *     summary: Cambiar contraseña del usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nuevaContrasena
 *             properties:
 *               nuevaContrasena:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contraseña actualizada exitosamente
 */
router.patch("/cambiar-contrasena", authMiddleware(), cambiarContrasenaController);

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Listar todos los usuarios (solo admin)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
router.get("/", authMiddleware(['admin']), listarUsuariosController);

/**
 * @swagger
 * /usuarios/{id_usuario}:
 *   get:
 *     summary: Obtener usuario por ID (solo admin)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_usuario
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Detalles del usuario
 */
router.get("/:id_usuario", authMiddleware(['admin']), buscarUsuarioPorIdController);

export default router;