import { listarCategorias, crearCategoria, actualizarCategoria, eliminarCategoria } from "../services/categoriaService.js";

export const obtenerCategorias = async (req, res) => {
    try {
        const categorias = await listarCategorias();
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las categorías', detalles: error });
    }
};

export const agregarCategoria = async (req, res) => {
    try {
        const resultado = await crearCategoria(req.body);
        res.status(201).json(resultado);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la categoría', detalles: error });
    }
};

export const modificarCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await actualizarCategoria(id, req.body);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la categoría', detalles: error });
    }
};

export const borrarCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await eliminarCategoria(id);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la categoría', detalles: error });
    }
};