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

function obtenerProductos(req, res) {
    listarProductos()
        .then((productos) => {
            res.json(productos);
        })
        .catch((error) => {
            res.status(500).json({ error: 'Error al listar los productos', detalles: error });
        });
}

function buscarProductoPorIdController(req, res) {
    const id_producto = req.params.id_producto;

    buscarProductoPorId(id_producto)
        .then((producto) => res.json(producto))
        .catch((error) => {
            const status = error.mensaje ? 404 : 500;
            res.status(status).json({ error: 'Error al buscar producto', detalles: error });
        });
}

function buscarProductoPorNombre(req, res) {
    const nombre = req.params.nombre;

    buscarProductosPorNombre(nombre)
        .then((productos) => {
            res.json(productos);
        })
        .catch((error) => {
            res.status(500).json({ error: 'Error al buscar productos por nombre', detalles: error });
        });
}

function obtenerProductosPorCategoria(req, res) {
    const nombreCategoria = req.params.nombreCategoria;

    listarProductosPorCategoria(nombreCategoria)
        .then((productos) => {
            res.json(productos);
        })
        .catch((error) => {
            res.status(500).json({ error: 'Error al listar productos por categoría', detalles: error });
        });
}

function agregarProducto(req, res) {
    const data = req.body;

    crearProducto(data)
        .then((resultado) => {
            res.status(201).json(resultado);
        })
        .catch((error) => {
            res.status(500).json({ error: 'Error al crear el producto', detalles: error });
        });
}

function modificarProductoCompleto(req, res) {
    const id = req.params.id;
    const data = req.body;

    actualizarProductoCompleto(id, data)
        .then((resultado) => {
            res.json(resultado);
        })
        .catch((error) => {
            res.status(500).json({ error: 'Error al actualizar el producto', detalles: error });
        });
}

function modificarPrecioStockProducto(req, res) {
    const id = req.params.id;
    const data = req.body;

    actualizarPrecioStockProducto(id, data)
        .then((resultado) => {
            res.json(resultado);
        })
        .catch((error) => {
            res.status(500).json({ error: 'Error al actualizar precio y stock', detalles: error });
        });
}

function borrarProducto(req, res) {
    const id = req.params.id;

    eliminarProducto(id)
        .then((resultado) => {
            res.json(resultado);
        })
        .catch((error) => {
            res.status(500).json({ error: 'Error al eliminar el producto', detalles: error });
        });
}

export {
    obtenerProductos,
    buscarProductoPorIdController,
    buscarProductoPorNombre,
    obtenerProductosPorCategoria,
    agregarProducto,
    modificarProductoCompleto,
    modificarPrecioStockProducto,
    borrarProducto
};