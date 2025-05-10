import {
    agregarAlCarrito,
    listarCarrito,
    actualizarCantidadCarrito,
    eliminarItemCarrito,
    cancelarCarritoUsuario
} from "../services/carritoService.js";

export const agregarProductoCarritoController = async (req, res) => {
    try {
        const resultado = await agregarAlCarrito(req.body);
        res.status(201).json(resultado);
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar producto al carrito', detalles: error });
    }
};

export const listarProductosCarritoController = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const productos = await listarCarrito(id_usuario);
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: 'Error al listar productos del carrito', detalles: error });
    }
};

export const actualizarCantidadProductoCarritoController = async (req, res) => {
    try {
        const { id_item } = req.params;
        const { cantidad } = req.body;
        const resultado = await actualizarCantidadCarrito(id_item, cantidad);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar cantidad', detalles: error });
    }
};

export const eliminarProductoCarritoController = async (req, res) => {
    try {
        const { id_item } = req.params;
        const resultado = await eliminarItemCarrito(id_item);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar producto del carrito', detalles: error });
    }
};

export const cancelarCarritoUsuarioController = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const resultado = await cancelarCarritoUsuario(id_usuario);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: 'Error al cancelar el carrito', detalles: error });
    }
};