import {
    agregarAlCarrito,
    listarCarrito,
    actualizarCantidadCarrito,
    eliminarItemCarrito,
    cancelarCarritoUsuario
} from "../services/carritoService.js";

function agregarProductoCarritoController(req, res) {
    const data = req.body;

    agregarAlCarrito(data)
        .then((resultado) => res.status(201).json(resultado))
        .catch((error) => res.status(500).json({ error: 'Error al agregar producto al carrito', detalles: error }));
}

function listarProductosCarritoController(req, res) {
    const id_usuario = req.params.id_usuario;

    listarCarrito(id_usuario)
        .then((productos) => res.json(productos))
        .catch((error) => res.status(500).json({ error: 'Error al listar productos del carrito', detalles: error }));
}

function actualizarCantidadProductoCarritoController(req, res) {
    const id_item = req.params.id_item;
    const nuevaCantidad = req.body.cantidad;

    actualizarCantidadCarrito(id_item, nuevaCantidad)
        .then((resultado) => res.json(resultado))
        .catch((error) => res.status(500).json({ error: 'Error al actualizar cantidad', detalles: error }));
}

function eliminarProductoCarritoController(req, res) {
    const id_item = req.params.id_item;

    eliminarItemCarrito(id_item)
        .then((resultado) => res.json(resultado))
        .catch((error) => res.status(500).json({ error: 'Error al eliminar producto del carrito', detalles: error }));
}

function cancelarCarritoUsuarioController(req, res) {
    const id_usuario = req.params.id_usuario;

    cancelarCarritoUsuario(id_usuario)
        .then((resultado) => res.json(resultado))
        .catch((error) => res.status(500).json({ error: 'Error al cancelar el carrito', detalles: error }));
}

export {
    agregarProductoCarritoController,
    listarProductosCarritoController,
    actualizarCantidadProductoCarritoController,
    eliminarProductoCarritoController,
    cancelarCarritoUsuarioController
};