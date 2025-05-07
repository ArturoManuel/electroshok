import {
    registrarUsuario,
    loginUsuario,
    validarPreguntaSecreta,
    generarOtp,
    loginConOtp,
    cambiarContrasena,
    listarUsuarios,
    buscarUsuarioPorId,
} from "../services/usuarioService.js";

function registrarUsuarioController(req, res) {
    const data = req.body;

    registrarUsuario(data)
        .then((resultado) => res.status(201).json(resultado))
        .catch((error) => res.status(500).json({ error: 'Error al registrar usuario', detalles: error }));
}

function loginUsuarioController(req, res) {
    const data = req.body;

    loginUsuario(data)
        .then((resultado) => res.json(resultado))
        .catch((error) => res.status(401).json({ error: 'Error en login', detalles: error }));
}

function recuperarCuentaController(req, res) {
    const data = req.body;

    validarPreguntaSecreta(data)
        .then((usuario) => {
            return generarOtp(usuario.id_usuario);
        })
        .then((resultado) => res.json(resultado))
        .catch((error) => res.status(401).json({ error: 'Error en recuperación de cuenta', detalles: error }));
}

function loginConOtpController(req, res) {
    const data = req.body;

    loginConOtp(data)
        .then((resultado) => res.json(resultado))
        .catch((error) => res.status(401).json({ error: 'Error en login con OTP', detalles: error }));
}

function cambiarContrasenaController(req, res) {
    const id_usuario = req.body.id_usuario;
    const correo_electronico = req.body.correo_electronico;
    const otp = req.body.otp;
    const nuevaContrasena = req.body.nuevaContrasena;

    cambiarContrasena(id_usuario, correo_electronico, otp, nuevaContrasena)
        .then((resultado) => res.json(resultado))
        .catch((error) => res.status(500).json({ error: 'Error al cambiar contraseña', detalles: error }));
}

function listarUsuariosController(req, res) {
    listarUsuarios()
        .then((usuarios) => res.json(usuarios))
        .catch((error) => res.status(500).json({ error: 'Error al listar usuarios', detalles: error }));
}

function buscarUsuarioPorIdController(req, res) {
    const id_usuario = req.params.id_usuario;

    buscarUsuarioPorId(id_usuario)
        .then((usuario) => res.json(usuario))
        .catch((error) => {
            const status = error.mensaje ? 404 : 500;
            res.status(status).json({ error: 'Error al buscar usuario', detalles: error });
        });
}

export {
    registrarUsuarioController,
    loginUsuarioController,
    recuperarCuentaController,
    loginConOtpController,
    cambiarContrasenaController,
    listarUsuariosController,
    buscarUsuarioPorIdController,
};