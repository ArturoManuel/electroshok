import pool from "../config/db.js";

function listarCategorias() {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id_categoria, nombre_categoria, tipo_categoria, fecha_creacion FROM Categoria WHERE esta_activa = true';
        pool.query(sql, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

function crearCategoria(data) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO Categoria (nombre_categoria, tipo_categoria) VALUES (?, ?)';
        const values = [data.nombre_categoria, data.tipo_categoria];

        pool.query(sql, values, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve({ mensaje: 'Categoría creada exitosamente', id: result.insertId });
            }
        });
    });
}

function actualizarCategoria(id, data) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE Categoria SET nombre_categoria = ?, tipo_categoria = ? WHERE id_categoria = ? AND esta_activa = true';
        const values = [data.nombre_categoria, data.tipo_categoria, id];

        pool.query(sql, values, (error, result) => {
            if (error) {
                reject(error);
            } else {
                if (result.affectedRows === 0) {
                    reject({ mensaje: 'Categoría no encontrada o inactiva' });
                } else {
                    resolve({ mensaje: 'Categoría actualizada exitosamente' });
                }
            }
        });
    });
}

function eliminarCategoria(id) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE Categoria SET esta_activa = false WHERE id_categoria = ?';
        const values = [id];

        pool.query(sql, values, (error, result) => {
            if (error) {
                reject(error);
            } else {
                if (result.affectedRows === 0) {
                    reject({ mensaje: 'Categoría no encontrada' });
                } else {
                    resolve({ mensaje: 'Categoría eliminada (inactivada) exitosamente' });
                }
            }
        });
    });
}

export { listarCategorias, crearCategoria, actualizarCategoria, eliminarCategoria };