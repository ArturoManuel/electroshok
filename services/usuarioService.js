import pool from "../config/db.js";
import bcrypt from "bcrypt";

function registrarUsuario(data) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(data.contrasena, 10, (err, hashPassword) => {
            if (err) return reject(err);

            bcrypt.hash(data.respuesta_secreta, 10, (err2, hashRespuesta) => {
                if (err2) return reject(err2);

                const sql = `
                    INSERT INTO Usuario (nombre, correo_electronico, contrasena, rol, pregunta_secreta, respuesta_secreta)
                    VALUES (?, ?, ?, ?, ?, ?)
                `;
                const values = [
                    data.nombre,
                    data.correo_electronico,
                    hashPassword,
                    data.rol || 'cliente',
                    data.pregunta_secreta,
                    hashRespuesta
                ];

                pool.query(sql, values, (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve({ mensaje: 'Usuario registrado exitosamente', id: result.insertId });
                    }
                });
            });
        });
    });
}

function loginUsuario(data) {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT * FROM Usuario
            WHERE correo_electronico = ?
        `;
        pool.query(sql, [data.correo_electronico], (error, results) => {
            if (error) return reject(error);

            if (results.length === 0) {
                return reject({ mensaje: 'Usuario no encontrado' });
            }

            const usuario = results[0];

            if (!usuario.esta_activo) {
                return reject({ mensaje: 'Cuenta bloqueada. Contacte soporte o recupere su cuenta.' });
            }

            bcrypt.compare(data.contrasena, usuario.contrasena, (err, esCorrecta) => {
                if (err) return reject(err);

                if (esCorrecta) {

                    const resetIntentosSql = `
                        UPDATE Usuario SET intentos_login = 0 WHERE id_usuario = ?
                    `;
                    pool.query(resetIntentosSql, [usuario.id_usuario], () => {
                        resolve({ mensaje: 'Login exitoso', usuario: usuario });
                    });
                } else {

                    const aumentarIntentosSql = `
                        UPDATE Usuario SET intentos_login = intentos_login + 1 WHERE id_usuario = ?
                    `;
                    pool.query(aumentarIntentosSql, [usuario.id_usuario], (error2) => {
                        if (error2) return reject(error2);


                        const verificarIntentosSql = `
                            SELECT intentos_login FROM Usuario WHERE id_usuario = ?
                        `;
                        pool.query(verificarIntentosSql, [usuario.id_usuario], (error3, intentos) => {
                            if (error3) return reject(error3);

                            if (intentos[0].intentos_login >= 3) {
                                bloquearUsuario(usuario.id_usuario)
                                    .then(() => reject({ mensaje: 'Cuenta bloqueada por intentos fallidos.' }))
                                    .catch((e) => reject(e));
                            } else {
                                reject({ mensaje: 'Contraseña incorrecta' });
                            }
                        });
                    });
                }
            });
        });
    });
}

function bloquearUsuario(id) {
    return new Promise((resolve, reject) => {
        const sql = `
            UPDATE Usuario
            SET esta_activo = false
            WHERE id_usuario = ?
        `;
        pool.query(sql, [id], (error) => {
            if (error) {
                reject(error);
            } else {
                resolve({ mensaje: 'Usuario bloqueado correctamente' });
            }
        });
    });
}

function validarPreguntaSecreta(data) {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT * FROM Usuario
            WHERE correo_electronico = ?
        `;
        pool.query(sql, [data.correo_electronico], (error, results) => {
            if (error) return reject(error);

            if (results.length === 0) {
                return reject({ mensaje: 'Usuario no encontrado' });
            }

            const usuario = results[0];

            bcrypt.compare(data.respuesta_secreta, usuario.respuesta_secreta, (err, esCorrecta) => {
                if (err) return reject(err);

                if (esCorrecta) {
                    resolve(usuario);
                } else {
                    reject({ mensaje: 'Respuesta secreta incorrecta' });
                }
            });
        });
    });
}

function generarOtp(id_usuario) {
    return new Promise((resolve, reject) => {
        const otp = Math.floor(100000 + Math.random() * 900000); // OTP de 6 dígitos
        const ahora = new Date();
        const cincoMinutosDespues = new Date(ahora.getTime() + 5 * 60000); // 5 minutos

        const sql = `
            UPDATE Usuario
            SET otp = ?, otp_expira = ?, esta_activo = true
            WHERE id_usuario = ?
        `;
        const values = [otp, cincoMinutosDespues, id_usuario];

        pool.query(sql, values, (error) => {
            if (error) {
                reject(error);
            } else {
                resolve({ mensaje: 'OTP generado exitosamente', otp: otp });
            }
        });
    });
}

function loginConOtp(data) {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT * FROM Usuario
            WHERE correo_electronico = ? AND esta_activo = true
        `;
        pool.query(sql, [data.correo_electronico], (error, results) => {
            if (error) return reject(error);

            if (results.length === 0) {
                return reject({ mensaje: 'Usuario no encontrado o inactivo' });
            }

            const usuario = results[0];

            const ahora = new Date();
            const expira = new Date(usuario.otp_expira);

            if (usuario.otp !== data.otp) {
                return reject({ mensaje: 'OTP incorrecto' });
            }
            if (ahora > expira) {
                return reject({ mensaje: 'OTP expirado' });
            }

            resolve({ mensaje: 'Login OTP exitoso', usuario: usuario });
        });
    });
}

function cambiarContrasena(id_usuario, correo_electronico, otpIngresado, nuevaContrasena) {
    return new Promise((resolve, reject) => {

        const sqlVerificacion = `
            SELECT otp, otp_expira FROM Usuario
            WHERE id_usuario = ? AND correo_electronico = ? AND esta_activo = true
        `;
        const valuesVerificacion = [id_usuario, correo_electronico];

        pool.query(sqlVerificacion, valuesVerificacion, (error, results) => {
            if (error) return reject(error);

            if (results.length === 0) {
                return reject({ mensaje: 'Usuario no encontrado o inactivo' });
            }

            const usuario = results[0];
            const ahora = new Date();
            const expira = new Date(usuario.otp_expira);

            if (usuario.otp !== otpIngresado) {
                return reject({ mensaje: 'OTP incorrecto' });
            }
            if (ahora > expira) {
                return reject({ mensaje: 'OTP expirado' });
            }

            bcrypt.hash(nuevaContrasena, 10, (err, hashPassword) => {
                if (err) return reject(err);

                const sql = `
                    UPDATE Usuario
                    SET contrasena = ?, otp = NULL, otp_expira = NULL
                    WHERE id_usuario = ?
                `;
                const values = [hashPassword, id_usuario];

                pool.query(sql, values, (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve({ mensaje: 'Contraseña cambiada exitosamente' });
                    }
                });
            });
        });
    });
}

function listarUsuarios() {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT id_usuario, nombre, correo_electronico, rol, fecha_creacion, esta_activo
            FROM Usuario
            ORDER BY fecha_creacion DESC
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

function buscarUsuarioPorId(id_usuario) {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT id_usuario, nombre, correo_electronico, rol, fecha_creacion, esta_activo
            FROM Usuario
            WHERE id_usuario = ?
        `;
        pool.query(sql, [id_usuario], (error, results) => {
            if (error) {
                reject(error);
            } else if (results.length === 0) {
                reject({ mensaje: "Usuario no encontrado" });
            } else {
                resolve(results[0]);
            }
        });
    });
}

export {
    registrarUsuario,
    loginUsuario,
    bloquearUsuario,
    validarPreguntaSecreta,
    generarOtp,
    loginConOtp,
    cambiarContrasena,
    listarUsuarios,
    buscarUsuarioPorId
};