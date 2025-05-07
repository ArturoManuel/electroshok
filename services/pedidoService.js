import pool from "../config/db.js";
import { cancelarCarritoUsuario } from "./carritoService.js";

function crearPedido(id_usuario) {
    return new Promise((resolve, reject) => {

        const sqlCarrito = `
            SELECT ci.id_producto, ci.cantidad, p.precio
            FROM CarritoItem ci
            INNER JOIN Producto p ON ci.id_producto = p.id_producto
            WHERE ci.id_usuario = ?
        `;

        pool.query(sqlCarrito, [id_usuario], (error, carrito) => {
            if (error) return reject(error);

            if (carrito.length === 0) {
                return reject({ mensaje: "No se puede crear el pedido: el carrito está vacío." });
            }

            const total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

            const sqlPedido = `
                INSERT INTO Pedido (id_usuario, total, estado)
                VALUES (?, ?, 'pendiente')
            `;
            const valuesPedido = [id_usuario, total];

            pool.query(sqlPedido, valuesPedido, (error2, resultPedido) => {
                if (error2) return reject(error2);

                const id_pedido = resultPedido.insertId;

                const detalles = carrito.map(item => [
                    id_pedido,
                    item.id_producto,
                    item.cantidad,
                    item.precio
                ]);

                const sqlDetalles = `
                    INSERT INTO DetallePedido (id_pedido, id_producto, cantidad, precio_unitario)
                    VALUES ?
                `;

                pool.query(sqlDetalles, [detalles], (error3) => {
                    if (error3) return reject(error3);

                    cancelarCarritoUsuario(id_usuario)
                        .then(() => {
                            resolve({ mensaje: "Pedido creado exitosamente", id_pedido: id_pedido });
                        })
                        .catch((error4) => reject(error4));
                });
            });
        });
    });
}

function listarPedidos(id_usuario) {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT id_pedido, fecha_pedido, total, estado
            FROM Pedido
            WHERE id_usuario = ?
            ORDER BY fecha_pedido DESC
        `;
        pool.query(sql, [id_usuario], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

function listarDetallePedido(id_pedido) {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT p.nombre, dp.cantidad, dp.precio_unitario, (dp.cantidad * dp.precio_unitario) AS subtotal
            FROM DetallePedido dp
            INNER JOIN Producto p ON dp.id_producto = p.id_producto
            WHERE dp.id_pedido = ?
        `;
        pool.query(sql, [id_pedido], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

function cambiarEstadoPedido(id_pedido, nuevoEstado) {
    return new Promise((resolve, reject) => {
        const sql = `
            UPDATE Pedido
            SET estado = ?
            WHERE id_pedido = ?
        `;
        pool.query(sql, [nuevoEstado, id_pedido], (error) => {
            if (error) {
                reject(error);
            } else {
                resolve({ mensaje: "Estado del pedido actualizado exitosamente" });
            }
        });
    });
}

function listarTodosLosPedidos() {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT id_pedido, id_usuario, fecha_pedido, total, estado
            FROM Pedido
            ORDER BY fecha_pedido DESC
        `;
        pool.query(sql, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

function buscarPedidoPorId(id_pedido) {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT id_pedido, id_usuario, fecha_pedido, total, estado
            FROM Pedido
            WHERE id_pedido = ?
        `;
        pool.query(sql, [id_pedido], (error, results) => {
            if (error) {
                reject(error);
            } else if (results.length === 0) {
                reject({ mensaje: "Pedido no encontrado" });
            } else {
                resolve(results[0]);
            }
        });
    });
}

export {
    crearPedido,
    listarPedidos,
    listarDetallePedido,
    cambiarEstadoPedido,
    listarTodosLosPedidos,
    buscarPedidoPorId
};

