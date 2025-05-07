import {
    crearPedido,
    listarPedidos,
    listarDetallePedido,
    cambiarEstadoPedido,
    listarTodosLosPedidos,
    buscarPedidoPorId
} from "../services/pedidoService.js";

function crearPedidoController(req, res) {
    const { id_usuario } = req.body;

    crearPedido(id_usuario)
        .then((resultado) => res.status(201).json(resultado))
        .catch((error) => {
            const status = error.mensaje ? 400 : 500;
            res.status(status).json({ error: 'Error al crear el pedido', detalles: error });
        });
}

function listarPedidosController(req, res) {
    const id_usuario = req.params.id_usuario;

    listarPedidos(id_usuario)
        .then((pedidos) => res.json(pedidos))
        .catch((error) => res.status(500).json({ error: 'Error al listar pedidos', detalles: error }));
}

function listarDetallePedidoController(req, res) {
    const id_pedido = req.params.id_pedido;

    listarDetallePedido(id_pedido)
        .then((detalles) => res.json(detalles))
        .catch((error) => res.status(500).json({ error: 'Error al listar detalle del pedido', detalles: error }));
}

function cambiarEstadoPedidoController(req, res) {
    const id_pedido = req.params.id_pedido;
    const { estado } = req.body;

    cambiarEstadoPedido(id_pedido, estado)
        .then((resultado) => res.json(resultado))
        .catch((error) => res.status(500).json({ error: 'Error al cambiar estado del pedido', detalles: error }));
}

function listarTodosLosPedidosController(req, res) {
    listarTodosLosPedidos()
        .then((pedidos) => res.json(pedidos))
        .catch((error) => res.status(500).json({ error: 'Error al listar todos los pedidos', detalles: error }));
}

function buscarPedidoPorIdController(req, res) {
    const id_pedido = req.params.id_pedido;

    buscarPedidoPorId(id_pedido)
        .then((pedidos) => res.json(pedidos))
        .catch((error) => {
            const status = error.mensaje ? 404 : 500;
            res.status(status).json({ error: 'Error al buscar pedido', detalles: error });
        });
}

export {
    crearPedidoController,
    listarPedidosController,
    listarDetallePedidoController,
    cambiarEstadoPedidoController,
    listarTodosLosPedidosController,
    buscarPedidoPorIdController
};