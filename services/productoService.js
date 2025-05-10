import { Op } from 'sequelize';
import { Producto, Categoria } from '../models/index.js';

export const listarProductos = async () => {
    try {
        const productos = await Producto.findAll({
            where: { esta_activo: true },
            include: [{
                model: Categoria,
                attributes: ['nombre_categoria']
            }],
            attributes: ['id_producto', 'nombre', 'descripcion', 'precio', 'stock', 'url_imagen']
        });
        return productos.map(p => ({
            ...p.toJSON(),
            nombre_categoria: p.Categoria.nombre_categoria
        }));
    } catch (error) {
        throw error;
    }
};

export const buscarProductoPorId = async (id_producto) => {
    try {
        const producto = await Producto.findOne({
            where: {
                id_producto,
                esta_activo: true
            },
            include: [{
                model: Categoria,
                attributes: ['nombre_categoria']
            }],
            attributes: ['id_producto', 'nombre', 'descripcion', 'precio', 'stock', 'url_imagen']
        });

        if (!producto) {
            throw { mensaje: 'Producto no encontrado' };
        }

        return {
            ...producto.toJSON(),
            nombre_categoria: producto.Categoria.nombre_categoria
        };
    } catch (error) {
        throw error;
    }
};

export const buscarProductosPorNombre = async (nombre) => {
    try {
        const productos = await Producto.findAll({
            where: {
                nombre: { [Op.like]: `%${nombre}%` },
                esta_activo: true
            },
            include: [{
                model: Categoria,
                attributes: ['nombre_categoria']
            }],
            attributes: ['id_producto', 'nombre', 'descripcion', 'precio', 'stock', 'url_imagen']
        });

        return productos.map(p => ({
            ...p.toJSON(),
            nombre_categoria: p.Categoria.nombre_categoria
        }));
    } catch (error) {
        throw error;
    }
};

export const listarProductosPorCategoria = async (nombreCategoria) => {
    try {
        const productos = await Producto.findAll({
            where: { esta_activo: true },
            include: [{
                model: Categoria,
                where: { nombre_categoria: { [Op.like]: `%${nombreCategoria}%` } },
                attributes: ['nombre_categoria']
            }],
            attributes: ['id_producto', 'nombre', 'descripcion', 'precio', 'stock', 'url_imagen']
        });

        return productos.map(p => ({
            ...p.toJSON(),
            nombre_categoria: p.Categoria.nombre_categoria
        }));
    } catch (error) {
        throw error;
    }
};

export const crearProducto = async (data) => {
    try {
        const nuevoProducto = await Producto.create({
            nombre: data.nombre,
            descripcion: data.descripcion,
            precio: data.precio,
            stock: data.stock,
            url_imagen: data.url_imagen,
            id_categoria: data.id_categoria
        });

        return {
            mensaje: 'Producto creado exitosamente',
            id: nuevoProducto.id_producto
        };
    } catch (error) {
        throw error;
    }
};

export const actualizarProductoCompleto = async (id, data) => {
    try {
        const [numRows] = await Producto.update({
            nombre: data.nombre,
            descripcion: data.descripcion,
            precio: data.precio,
            stock: data.stock,
            url_imagen: data.url_imagen,
            id_categoria: data.id_categoria
        }, {
            where: {
                id_producto: id,
                esta_activo: true
            }
        });

        if (numRows === 0) {
            throw { mensaje: 'Producto no encontrado o inactivo' };
        }

        return { mensaje: 'Producto actualizado exitosamente' };
    } catch (error) {
        throw error;
    }
};

export const actualizarPrecioStockProducto = async (id, data) => {
    try {
        const [numRows] = await Producto.update({
            precio: data.precio,
            stock: data.stock
        }, {
            where: {
                id_producto: id,
                esta_activo: true
            }
        });

        if (numRows === 0) {
            throw { mensaje: 'Producto no encontrado o inactivo' };
        }

        return { mensaje: 'Precio y stock actualizados exitosamente' };
    } catch (error) {
        throw error;
    }
};

export const eliminarProducto = async (id) => {
    try {
        const [numRows] = await Producto.update({
            esta_activo: false
        }, {
            where: { id_producto: id }
        });

        if (numRows === 0) {
            throw { mensaje: 'Producto no encontrado' };
        }

        return { mensaje: 'Producto eliminado exitosamente' };
    } catch (error) {
        throw error;
    }
};