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

const router = express.Router();

router.get("/", obtenerProductos);

router.get("/buscar-id/:id_producto", buscarProductoPorIdController);

router.get("/buscar/:nombre", buscarProductoPorNombre);

router.get("/categoria/:nombreCategoria", obtenerProductosPorCategoria);

router.post("/", agregarProducto);

router.put("/:id", modificarProductoCompleto);

router.patch("/:id", modificarPrecioStockProducto);

router.delete("/:id", borrarProducto);


export default router;