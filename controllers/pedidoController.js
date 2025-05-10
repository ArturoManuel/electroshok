import {
    crearPedido,
    listarPedidos,
    listarDetallePedido,
    cambiarEstadoPedido,
    listarTodosLosPedidos,
    buscarPedidoPorId
} from "../services/pedidoService.js";

export const crearPedidoController = async (req, res) => {
    try {
        const { id_usuario } = req.body;
        const resultado = await crearPedido(id_usuario);
        res.status(201).json(resultado);
    } catch (error) {
        const status = error.mensaje ? 400 : 500;
        res.status(status).json({ error: 'Error al crear el pedido', detalles: error });
    }
};

export const listarPedidosController = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const pedidos = await listarPedidos(id_usuario);
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ error: 'Error al listar pedidos', detalles: error });
    }
};

export const listarDetallePedidoController = async (req, res) => {
    try {
        const { id_pedido } = req.params;
        const detalles = await listarDetallePedido(id_pedido);
        res.json(detalles);
    } catch (error) {
        res.status(500).json({ error: 'Error al listar detalle del pedido', detalles: error });
    }
};

export const cambiarEstadoPedidoController = async (req, res) => {
    try {
        const { id_pedido } = req.params;
        const { estado } = req.body;
        const resultado = await cambiarEstadoPedido(id_pedido, estado);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: 'Error al cambiar estado del pedido', detalles: error });
    }
};

export const listarTodosLosPedidosController = async (req, res) => {
    try {
        const pedidos = await listarTodosLosPedidos();
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ error: 'Error al listar todos los pedidos', detalles: error });
    }
};

export const buscarPedidoPorIdController = async (req, res) => {
    try {
        const { id_pedido } = req.params;
        const pedido = await buscarPedidoPorId(id_pedido);
        res.json(pedido);
    } catch (error) {
        const status = error.mensaje ? 404 : 500;
        res.status(status).json({ error: 'Error al buscar pedido', detalles: error });
    }
};