import express from "express";
import {
    crearPedidoController,
    listarPedidosController,
    listarDetallePedidoController,
    cambiarEstadoPedidoController,
    listarTodosLosPedidosController,
    buscarPedidoPorIdController
} from "../controllers/pedidoController.js";

const router = express.Router();

router.post("/", crearPedidoController);

router.get("/:id_usuario", listarPedidosController);

router.get("/detalles/:id_pedido", listarDetallePedidoController);

router.patch("/:id_pedido", cambiarEstadoPedidoController);

router.get("/", listarTodosLosPedidosController);

router.get("/buscar/:id_pedido", buscarPedidoPorIdController);

export default router;