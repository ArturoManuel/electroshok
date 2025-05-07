import { listarCategorias, crearCategoria, actualizarCategoria, eliminarCategoria } from "../services/categoriaService.js";

function obtenerCategorias(req, res) {
    listarCategorias()
        .then((categorias) => {
            res.json(categorias);
        })
        .catch((error) => {
            res.status(500).json({ error: 'Error al obtener las categorías', detalles: error });
        });
}

function agregarCategoria(req, res) {
    const data = req.body;

    crearCategoria(data)
        .then((resultado) => {
            res.status(201).json(resultado);
        })
        .catch((error) => {
            res.status(500).json({ error: 'Error al crear la categoría', detalles: error });
        });
}

function modificarCategoria(req, res) {
    const id = req.params.id;
    const data = req.body;

    actualizarCategoria(id, data)
        .then((resultado) => {
            res.json(resultado);
        })
        .catch((error) => {
            res.status(500).json({ error: 'Error al actualizar la categoría', detalles: error });
        });
}

function borrarCategoria(req, res) {
    const id = req.params.id;

    eliminarCategoria(id)
        .then((resultado) => {
            res.json(resultado);
        })
        .catch((error) => {
            res.status(500).json({ error: 'Error al eliminar la categoría', detalles: error });
        });
}

export { obtenerCategorias, agregarCategoria, modificarCategoria, borrarCategoria };