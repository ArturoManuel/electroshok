import express from "express";
import {
    agregarProductoCarritoController,
    listarProductosCarritoController,
    actualizarCantidadProductoCarritoController,
    eliminarProductoCarritoController,
    cancelarCarritoUsuarioController
} from "../controllers/carritoController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     ItemCarrito:
 *       type: object
 *       required:
 *         - id_usuario
 *         - id_producto
 *         - cantidad
 *       properties:
 *         id_item:
 *           type: integer
 *           description: ID auto-generado del item en el carrito
 *         id_usuario:
 *           type: integer
 *           description: ID del usuario dueño del carrito
 *         id_producto:
 *           type: integer
 *           description: ID del producto agregado
 *         cantidad:
 *           type: integer
 *           description: Cantidad del producto
 *         precio_unitario:
 *           type: number
 *           description: Precio del producto al momento de agregar al carrito
 */

/**
 * @swagger
 * /carrito:
 *   post:
 *     summary: Agregar producto al carrito
 *     tags: [Carrito]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_usuario
 *               - id_producto
 *               - cantidad
 *             properties:
 *               id_usuario:
 *                 type: integer
 *               id_producto:
 *                 type: integer
 *               cantidad:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Producto agregado al carrito exitosamente
 */
router.post("/", authMiddleware(), agregarProductoCarritoController);

/**
 * @swagger
 * /carrito/{id_usuario}:
 *   get:
 *     summary: Listar productos en el carrito de un usuario
 *     tags: [Carrito]
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
 *         description: Lista de productos en el carrito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ItemCarrito'
 */
router.get("/:id_usuario", authMiddleware(), listarProductosCarritoController);

/**
 * @swagger
 * /carrito/{id_item}:
 *   patch:
 *     summary: Actualizar cantidad de un producto en el carrito
 *     tags: [Carrito]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_item
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del item en el carrito
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cantidad
 *             properties:
 *               cantidad:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cantidad actualizada exitosamente
 */
router.patch("/:id_item", authMiddleware(), actualizarCantidadProductoCarritoController);

/**
 * @swagger
 * /carrito/item/{id_item}:
 *   delete:
 *     summary: Eliminar un producto del carrito
 *     tags: [Carrito]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_item
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del item en el carrito
 *     responses:
 *       200:
 *         description: Producto eliminado del carrito exitosamente
 */
router.delete("/item/:id_item", authMiddleware(), eliminarProductoCarritoController);

/**
 * @swagger
 * /carrito/usuario/{id_usuario}:
 *   delete:
 *     summary: Cancelar/vaciar el carrito de un usuario
 *     tags: [Carrito]
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
 *         description: Carrito vaciado exitosamente
 */
router.delete("/usuario/:id_usuario", authMiddleware(), cancelarCarritoUsuarioController);

export default router;