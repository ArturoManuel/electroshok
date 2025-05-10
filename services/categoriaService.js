import { Categoria } from '../models/index.js';

export const listarCategorias = async () => {
    try {
        const categorias = await Categoria.findAll({
            where: { esta_activa: true },
            attributes: ['id_categoria', 'nombre_categoria', 'tipo_categoria', 'fecha_creacion']
        });
        return categorias;
    } catch (error) {
        throw error;
    }
};

export const crearCategoria = async (data) => {
    try {
        const nuevaCategoria = await Categoria.create({
            nombre_categoria: data.nombre_categoria,
            tipo_categoria: data.tipo_categoria
        });

        return {
            mensaje: 'Categoría creada exitosamente',
            id: nuevaCategoria.id_categoria
        };
    } catch (error) {
        throw error;
    }
};

export const actualizarCategoria = async (id, data) => {
    try {
        const [numRows] = await Categoria.update({
            nombre_categoria: data.nombre_categoria,
            tipo_categoria: data.tipo_categoria
        }, {
            where: {
                id_categoria: id,
                esta_activa: true
            }
        });

        if (numRows === 0) {
            throw { mensaje: 'Categoría no encontrada o inactiva' };
        }

        return { mensaje: 'Categoría actualizada exitosamente' };
    } catch (error) {
        throw error;
    }
};

export const eliminarCategoria = async (id) => {
    try {
        const [numRows] = await Categoria.update({
            esta_activa: false
        }, {
            where: { id_categoria: id }
        });

        if (numRows === 0) {
            throw { mensaje: 'Categoría no encontrada' };
        }

        return { mensaje: 'Categoría eliminada exitosamente' };
    } catch (error) {
        throw error;
    }
};