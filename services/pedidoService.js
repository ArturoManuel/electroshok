import { Pedido, DetallePedido, CarritoItem, Producto, Usuario } from '../models/index.js';
import { cancelarCarritoUsuario } from './carritoService.js';
import sequelize from '../config/database.js';

export const crearPedido = async (id_usuario) => {
    const t = await sequelize.transaction();

    try {
        // Obtener items del carrito
        const carrito = await CarritoItem.findAll({
            where: { id_usuario },
            include: [{
                model: Producto,
                attributes: ['precio']
            }],
            transaction: t
        });

        if (carrito.length === 0) {
            throw { mensaje: "No se puede crear el pedido: el carrito está vacío." };
        }

        // Calcular total
        const total = carrito.reduce((acc, item) => 
            acc + (item.Producto.precio * item.cantidad), 0);

        // Crear pedido
        const nuevoPedido = await Pedido.create({
            id_usuario,
            total,
            estado: 'pendiente'
        }, { transaction: t });

        // Crear detalles del pedido
        await DetallePedido.bulkCreate(
            carrito.map(item => ({
                id_pedido: nuevoPedido.id_pedido,
                id_producto: item.id_producto,
                cantidad: item.cantidad,
                precio_unitario: item.Producto.precio
            })),
            { transaction: t }
        );

        // Limpiar carrito
        await cancelarCarritoUsuario(id_usuario);

        await t.commit();
        return { mensaje: "Pedido creado exitosamente", id_pedido: nuevoPedido.id_pedido };

    } catch (error) {
        await t.rollback();
        throw error;
    }
};

export const listarPedidos = async (id_usuario) => {
    try {
        const pedidos = await Pedido.findAll({
            where: { id_usuario },
            attributes: ['id_pedido', 'fecha_pedido', 'total', 'estado'],
            order: [['fecha_pedido', 'DESC']]
        });
        return pedidos;
    } catch (error) {
        throw error;
    }
};

export const listarDetallePedido = async (id_pedido) => {
    try {
        const detalles = await DetallePedido.findAll({
            where: { id_pedido },
            include: [{
                model: Producto,
                attributes: ['nombre']
            }],
            attributes: [
                'id_detalle',
                'cantidad',
                'precio_unitario',
                [sequelize.literal('cantidad * precio_unitario'), 'subtotal']
            ]
        });

        return detalles.map(detalle => ({
            id_detalle: detalle.id_detalle,
            nombre: detalle.Producto.nombre,
            cantidad: detalle.cantidad,
            precio_unitario: detalle.precio_unitario,
            subtotal: detalle.getDataValue('subtotal')
        }));
    } catch (error) {
        throw error;
    }
};

export const cambiarEstadoPedido = async (id_pedido, nuevoEstado) => {
    try {
        const [numRows] = await Pedido.update({
            estado: nuevoEstado
        }, {
            where: { id_pedido }
        });

        if (numRows === 0) {
            throw { mensaje: 'Pedido no encontrado' };
        }

        return { mensaje: 'Estado del pedido actualizado exitosamente' };
    } catch (error) {
        throw error;
    }
};

export const listarTodosLosPedidos = async () => {
    try {
        const pedidos = await Pedido.findAll({
            include: [{
                model: Usuario,
                attributes: ['nombre']
            }],
            attributes: ['id_pedido', 'fecha_pedido', 'total', 'estado'],
            order: [['fecha_pedido', 'DESC']]
        });

        return pedidos.map(pedido => ({
            ...pedido.toJSON(),
            nombre_usuario: pedido.Usuario.nombre
        }));
    } catch (error) {
        throw error;
    }
};

export const buscarPedidoPorId = async (id_pedido) => {
    try {
        const pedido = await Pedido.findOne({
            where: { id_pedido },
            include: [{
                model: Usuario,
                attributes: ['nombre']
            }],
            attributes: ['id_pedido', 'fecha_pedido', 'total', 'estado']
        });

        if (!pedido) {
            throw { mensaje: 'Pedido no encontrado' };
        }

        return {
            ...pedido.toJSON(),
            nombre_usuario: pedido.Usuario.nombre
        };
    } catch (error) {
        throw error;
    }
};
