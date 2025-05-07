import pool from "../config/db.js";

function agregarAlCarrito(data) {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO CarritoItem (id_usuario, id_producto, cantidad)
            VALUES (?, ?, ?)
        `;
        const values = [data.id_usuario, data.id_producto, data.cantidad];

        pool.query(sql, values, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve({ mensaje: "Producto agregado al carrito exitosamente", id_item: result.insertId });
            }
        });
    });
}

function listarCarrito(id_usuario) {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT ci.id_item, p.nombre, p.precio, ci.cantidad, (p.precio * ci.cantidad) AS subtotal
            FROM CarritoItem ci
            INNER JOIN Producto p ON ci.id_producto = p.id_producto
            WHERE ci.id_usuario = ?
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

function actualizarCantidadCarrito(id_item, nuevaCantidad) {
    return new Promise((resolve, reject) => {
        const sql = `
            UPDATE CarritoItem
            SET cantidad = ?
            WHERE id_item = ?
        `;
        const values = [nuevaCantidad, id_item];

        pool.query(sql, values, (error) => {
            if (error) {
                reject(error);
            } else {
                resolve({ mensaje: "Cantidad actualizada exitosamente" });
            }
        });
    });
}

function eliminarItemCarrito(id_item) {
    return new Promise((resolve, reject) => {
        const sql = `
            DELETE FROM CarritoItem
            WHERE id_item = ?
        `;
        pool.query(sql, [id_item], (error) => {
            if (error) {
                reject(error);
            } else {
                resolve({ mensaje: "Producto eliminado del carrito" });
            }
        });
    });
}

function cancelarCarritoUsuario(id_usuario) {
    return new Promise((resolve, reject) => {
        const sql = `
            DELETE FROM CarritoItem
            WHERE id_usuario = ?
        `;
        pool.query(sql, [id_usuario], (error) => {
            if (error) {
                reject(error);
            } else {
                resolve({ mensaje: "Carrito cancelado exitosamente" });
            }
        });
    });
}

export {
    agregarAlCarrito,
    listarCarrito,
    actualizarCantidadCarrito,
    eliminarItemCarrito,
    cancelarCarritoUsuario
};