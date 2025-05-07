import express from "express";
import {
    agregarProductoCarritoController,
    listarProductosCarritoController,
    actualizarCantidadProductoCarritoController,
    eliminarProductoCarritoController,
    cancelarCarritoUsuarioController
} from "../controllers/carritoController.js";

const router = express.Router();

router.post("/", agregarProductoCarritoController);

router.get("/:id_usuario", listarProductosCarritoController);

router.patch("/:id_item", actualizarCantidadProductoCarritoController);

router.delete("/item/:id_item", eliminarProductoCarritoController);

router.delete("/usuario/:id_usuario", cancelarCarritoUsuarioController);

export default router;