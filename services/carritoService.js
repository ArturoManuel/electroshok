import { CarritoItem, Producto } from '../models/index.js';

export const agregarAlCarrito = async (data) => {
    try {
        const nuevoItem = await CarritoItem.create({
            id_usuario: data.id_usuario,
            id_producto: data.id_producto,
            cantidad: data.cantidad
        });

        return {
            mensaje: "Producto agregado al carrito exitosamente",
            id_item: nuevoItem.id_item
        };
    } catch (error) {
        throw error;
    }
};

export const listarCarrito = async (id_usuario) => {
    try {
        const items = await CarritoItem.findAll({
            where: { id_usuario },
            include: [{
                model: Producto,
                attributes: ['nombre', 'precio']
            }],
            attributes: ['id_item', 'cantidad']
        });

        return items.map(item => ({
            id_item: item.id_item,
            nombre: item.Producto.nombre,
            precio: item.Producto.precio,
            cantidad: item.cantidad,
            subtotal: item.Producto.precio * item.cantidad
        }));
    } catch (error) {
        throw error;
    }
};

export const actualizarCantidadCarrito = async (id_item, nuevaCantidad) => {
    try {
        await CarritoItem.update(
            { cantidad: nuevaCantidad },
            { where: { id_item } }
        );

        return { mensaje: "Cantidad actualizada exitosamente" };
    } catch (error) {
        throw error;
    }
};

export const eliminarItemCarrito = async (id_item) => {
    try {
        await CarritoItem.destroy({
            where: { id_item }
        });

        return { mensaje: "Producto eliminado del carrito" };
    } catch (error) {
        throw error;
    }
};

export const cancelarCarritoUsuario = async (id_usuario) => {
    try {
        await CarritoItem.destroy({
            where: { id_usuario }
        });

        return { mensaje: "Carrito cancelado exitosamente" };
    } catch (error) {
        throw error;
    }
};