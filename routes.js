import express from "express";


import categoriaRoutes from "./routes/categoriaRoutes.js";
import productoRoutes from "./routes/productoRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import carritoRoutes from "./routes/carritoRoutes.js";
import pedidoRoutes from "./routes/pedidoRoutes.js";

const router = express.Router();

router.use('/categorias', categoriaRoutes);
router.use('/productos', productoRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/carrito', carritoRoutes);
router.use('/pedidos', pedidoRoutes);

export default router;