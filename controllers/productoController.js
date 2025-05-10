import {
    listarProductos,
    buscarProductoPorId,
    buscarProductosPorNombre,
    listarProductosPorCategoria,
    crearProducto,
    actualizarProductoCompleto,
    actualizarPrecioStockProducto,
    eliminarProducto
} from "../services/productoService.js";

export const obtenerProductos = async (req, res) => {
    try {
        const productos = await listarProductos();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: 'Error al listar los productos', detalles: error });
    }
};

export const buscarProductoPorIdController = async (req, res) => {
    try {
        const { id_producto } = req.params;
        const producto = await buscarProductoPorId(id_producto);
        res.json(producto);
    } catch (error) {
        const status = error.mensaje ? 404 : 500;
        res.status(status).json({ error: 'Error al buscar producto', detalles: error });
    }
};

export const buscarProductoPorNombre = async (req, res) => {
    try {
        const { nombre } = req.params;
        const productos = await buscarProductosPorNombre(nombre);
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar productos por nombre', detalles: error });
    }
};

export const obtenerProductosPorCategoria = async (req, res) => {
    try {
        const { nombreCategoria } = req.params;
        const productos = await listarProductosPorCategoria(nombreCategoria);
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: 'Error al listar productos por categoría', detalles: error });
    }
};

export const agregarProducto = async (req, res) => {
    try {
        const resultado = await crearProducto(req.body);
        res.status(201).json(resultado);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el producto', detalles: error });
    }
};

export const modificarProductoCompleto = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await actualizarProductoCompleto(id, req.body);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto', detalles: error });
    }
};

export const modificarPrecioStockProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await actualizarPrecioStockProducto(id, req.body);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar precio y stock', detalles: error });
    }
};

export const borrarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await eliminarProducto(id);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto', detalles: error });
    }
};