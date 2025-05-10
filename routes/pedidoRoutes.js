import express from "express";
import {
    crearPedidoController,
    listarPedidosController,
    listarDetallePedidoController,
    cambiarEstadoPedidoController,
    listarTodosLosPedidosController,
    buscarPedidoPorIdController
} from "../controllers/pedidoController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Pedido:
 *       type: object
 *       required:
 *         - id_usuario
 *         - items
 *       properties:
 *         id_pedido:
 *           type: integer
 *           description: ID auto-generado del pedido
 *         id_usuario:
 *           type: integer
 *           description: ID del usuario que realiza el pedido
 *         fecha:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora del pedido
 *         estado:
 *           type: string
 *           enum: [pendiente, en_proceso, enviado, entregado, cancelado]
 *           description: Estado actual del pedido
 *         total:
 *           type: number
 *           description: Monto total del pedido
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id_producto:
 *                 type: integer
 *               cantidad:
 *                 type: integer
 *               precio_unitario:
 *                 type: number
 */

/**
 * @swagger
 * /pedidos:
 *   post:
 *     summary: Crear nuevo pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pedido'
 *     responses:
 *       201:
 *         description: Pedido creado exitosamente
 */
router.post("/", authMiddleware(), crearPedidoController);

/**
 * @swagger
 * /pedidos/{id_usuario}:
 *   get:
 *     summary: Listar pedidos de un usuario
 *     tags: [Pedidos]
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
 *         description: Lista de pedidos del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pedido'
 */
router.get("/:id_usuario", authMiddleware(), listarPedidosController);

/**
 * @swagger
 * /pedidos/detalles/{id_pedido}:
 *   get:
 *     summary: Ver detalles de un pedido específico
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_pedido
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del pedido
 *     responses:
 *       200:
 *         description: Detalles del pedido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pedido'
 */
router.get("/detalles/:id_pedido", authMiddleware(), listarDetallePedidoController);

/**
 * @swagger
 * /pedidos/{id_pedido}:
 *   patch:
 *     summary: Cambiar estado de un pedido (solo admin)
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_pedido
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - estado
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: [pendiente, en_proceso, enviado, entregado, cancelado]
 *     responses:
 *       200:
 *         description: Estado del pedido actualizado exitosamente
 */
router.patch("/:id_pedido", authMiddleware(['admin']), cambiarEstadoPedidoController);

/**
 * @swagger
 * /pedidos:
 *   get:
 *     summary: Listar todos los pedidos (solo admin)
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todos los pedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pedido'
 */
router.get("/", authMiddleware(['admin']), listarTodosLosPedidosController);

/**
 * @swagger
 * /pedidos/buscar/{id_pedido}:
 *   get:
 *     summary: Buscar pedido por ID (solo admin)
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_pedido
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del pedido
 *     responses:
 *       200:
 *         description: Detalles del pedido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pedido'
 */
router.get("/buscar/:id_pedido", authMiddleware(['admin']), buscarPedidoPorIdController);

export default router;