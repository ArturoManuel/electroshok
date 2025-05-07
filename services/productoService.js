import pool from "../config/db.js";

function listarProductos() {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT p.id_producto, p.nombre, p.descripcion, p.precio, p.stock, p.url_imagen, c.nombre_categoria
            FROM Producto p
            INNER JOIN Categoria c ON p.id_categoria = c.id_categoria
            WHERE p.esta_activo = true
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

function buscarProductoPorId(id_producto) {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT p.id_producto, p.nombre, p.descripcion, p.precio, p.stock, p.url_imagen, c.nombre_categoria
            FROM Producto p
            INNER JOIN Categoria c ON p.id_categoria = c.id_categoria
            WHERE p.id_producto = ? AND p.esta_activo = true
        `;
        pool.query(sql, [id_producto], (error, results) => {
            if (error) {
                reject(error);
            } else if (results.length === 0) {
                reject({ mensaje: 'Producto no encontrado' });
            } else {
                resolve(results[0]);
            }
        });
    });
}

function buscarProductosPorNombre(nombre) {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT p.id_producto, p.nombre, p.descripcion, p.precio, p.stock, p.url_imagen, c.nombre_categoria
            FROM Producto p
            INNER JOIN Categoria c ON p.id_categoria = c.id_categoria
            WHERE p.esta_activo = true AND p.nombre LIKE ?
        `;
        const value = [`%${nombre}%`];

        pool.query(sql, value, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

function listarProductosPorCategoria(nombreCategoria) {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT p.id_producto, p.nombre, p.descripcion, p.precio, p.stock, p.url_imagen, c.nombre_categoria
            FROM Producto p
            INNER JOIN Categoria c ON p.id_categoria = c.id_categoria
            WHERE p.esta_activo = true AND c.nombre_categoria LIKE ?
        `;
        const value = [`%${nombreCategoria}%`];

        pool.query(sql, value, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

function crearProducto(data) {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO Producto (nombre, descripcion, precio, stock, url_imagen, id_categoria)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const values = [
            data.nombre,
            data.descripcion,
            data.precio,
            data.stock,
            data.url_imagen,
            data.id_categoria
        ];

        pool.query(sql, values, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve({ mensaje: 'Producto creado exitosamente', id: result.insertId });
            }
        });
    });
}

function actualizarProductoCompleto(id, data) {
    return new Promise((resolve, reject) => {
        const sql = `
            UPDATE Producto
            SET nombre = ?, descripcion = ?, precio = ?, stock = ?, url_imagen = ?, id_categoria = ?
            WHERE id_producto = ? AND esta_activo = true
        `;
        const values = [
            data.nombre,
            data.descripcion,
            data.precio,
            data.stock,
            data.url_imagen,
            data.id_categoria,
            id
        ];

        pool.query(sql, values, (error, result) => {
            if (error) {
                reject(error);
            } else {
                if (result.affectedRows === 0) {
                    reject({ mensaje: 'Producto no encontrado o inactivo' });
                } else {
                    resolve({ mensaje: 'Producto actualizado exitosamente' });
                }
            }
        });
    });
}

function actualizarPrecioStockProducto(id, data) {
    return new Promise((resolve, reject) => {
        const sql = `
            UPDATE Producto
            SET precio = ?, stock = ?
            WHERE id_producto = ? AND esta_activo = true
        `;
        const values = [data.precio, data.stock, id];

        pool.query(sql, values, (error, result) => {
            if (error) {
                reject(error);
            } else {
                if (result.affectedRows === 0) {
                    reject({ mensaje: 'Producto no encontrado o inactivo' });
                } else {
                    resolve({ mensaje: 'Precio y stock actualizados exitosamente' });
                }
            }
        });
    });
}

function eliminarProducto(id) {
    return new Promise((resolve, reject) => {
        const sql = `
            UPDATE Producto
            SET esta_activo = false
            WHERE id_producto = ?
        `;
        const values = [id];

        pool.query(sql, values, (error, result) => {
            if (error) {
                reject(error);
            } else {
                if (result.affectedRows === 0) {
                    reject({ mensaje: 'Producto no encontrado' });
                } else {
                    resolve({ mensaje: 'Producto eliminado (inactivado) exitosamente' });
                }
            }
        });
    });
}

export {
    listarProductos,
    buscarProductoPorId,
    buscarProductosPorNombre,
    listarProductosPorCategoria,
    crearProducto,
    actualizarProductoCompleto,
    actualizarPrecioStockProducto,
    eliminarProducto
};