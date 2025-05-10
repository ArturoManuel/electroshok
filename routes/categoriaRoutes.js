import express from "express";
import { obtenerCategorias, agregarCategoria, modificarCategoria, borrarCategoria } from "../controllers/categoriaController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Categoria:
 *       type: object
 *       required:
 *         - nombre
 *         - descripcion
 *       properties:
 *         id_categoria:
 *           type: integer
 *           description: ID auto-generado de la categoría
 *         nombre:
 *           type: string
 *           description: Nombre de la categoría
 *         descripcion:
 *           type: string
 *           description: Descripción de la categoría
 */

/**
 * @swagger
 * /categorias:
 *   get:
 *     summary: Obtener todas las categorías
 *     tags: [Categorias]
 *     responses:
 *       200:
 *         description: Lista de categorías
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Categoria'
 */
router.get("/", obtenerCategorias);

/**
 * @swagger
 * /categorias:
 *   post:
 *     summary: Crear nueva categoría (solo admin)
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Categoria'
 *     responses:
 *       201:
 *         description: Categoría creada exitosamente
 */
router.post("/", authMiddleware(['admin']), agregarCategoria);

/**
 * @swagger
 * /categorias/{id}:
 *   put:
 *     summary: Modificar categoría (solo admin)
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la categoría
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Categoria'
 *     responses:
 *       200:
 *         description: Categoría actualizada exitosamente
 */
router.put("/:id", authMiddleware(['admin']), modificarCategoria);

/**
 * @swagger
 * /categorias/{id}:
 *   delete:
 *     summary: Eliminar categoría (solo admin)
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la categoría
 *     responses:
 *       200:
 *         description: Categoría eliminada exitosamente
 */
router.delete("/:id", authMiddleware(['admin']), borrarCategoria);

export default router;