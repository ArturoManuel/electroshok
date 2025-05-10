import express from "express";
import {
    obtenerProductos,
    buscarProductoPorNombre,
    buscarProductoPorIdController,
    obtenerProductosPorCategoria,
    agregarProducto,
    modificarProductoCompleto,
    modificarPrecioStockProducto,
    borrarProducto
} from "../controllers/productoController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Producto:
 *       type: object
 *       required:
 *         - nombre
 *         - descripcion
 *         - precio
 *         - stock
 *         - id_categoria
 *       properties:
 *         id_producto:
 *           type: integer
 *           description: ID auto-generado del producto
 *         nombre:
 *           type: string
 *           description: Nombre del producto
 *         descripcion:
 *           type: string
 *           description: Descripción detallada del producto
 *         precio:
 *           type: number
 *           description: Precio del producto
 *         stock:
 *           type: integer
 *           description: Cantidad disponible del producto
 *         id_categoria:
 *           type: integer
 *           description: ID de la categoría a la que pertenece el producto
 */

/**
 * @swagger
 * /productos:
 *   get:
 *     summary: Obtener lista de productos
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Producto'
 */
router.get("/", obtenerProductos);

/**
 * @swagger
 * /productos/buscar-id/{id_producto}:
 *   get:
 *     summary: Buscar producto por ID
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id_producto
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Producto'
 */
router.get("/buscar-id/:id_producto", buscarProductoPorIdController);

/**
 * @swagger
 * /productos/buscar/{nombre}:
 *   get:
 *     summary: Buscar productos por nombre
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: nombre
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre o parte del nombre del producto
 *     responses:
 *       200:
 *         description: Lista de productos que coinciden con la búsqueda
 */
router.get("/buscar/:nombre", buscarProductoPorNombre);

/**
 * @swagger
 * /productos/categoria/{nombreCategoria}:
 *   get:
 *     summary: Obtener productos por categoría
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: nombreCategoria
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre de la categoría
 *     responses:
 *       200:
 *         description: Lista de productos de la categoría
 */
router.get("/categoria/:nombreCategoria", obtenerProductosPorCategoria);

/**
 * @swagger
 * /productos:
 *   post:
 *     summary: Agregar nuevo producto (solo admin)
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Producto'
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 */
router.post("/", authMiddleware(['admin']), agregarProducto);

/**
 * @swagger
 * /productos/{id}:
 *   put:
 *     summary: Modificar producto completo (solo admin)
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Producto'
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente
 */
router.put("/:id", authMiddleware(['admin']), modificarProductoCompleto);

/**
 * @swagger
 * /productos/{id}:
 *   patch:
 *     summary: Modificar precio y stock de producto (solo admin)
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               precio:
 *                 type: number
 *               stock:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente
 */
router.patch("/:id", authMiddleware(['admin']), modificarPrecioStockProducto);

/**
 * @swagger
 * /productos/{id}:
 *   delete:
 *     summary: Eliminar producto (solo admin)
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto eliminado exitosamente
 */
router.delete("/:id", authMiddleware(['admin']), borrarProducto);

export default router;