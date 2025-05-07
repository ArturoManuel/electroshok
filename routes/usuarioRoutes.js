import express from "express";
import {
    registrarUsuarioController,
    loginUsuarioController,
    recuperarCuentaController,
    loginConOtpController,
    cambiarContrasenaController,
    listarUsuariosController,
    buscarUsuarioPorIdController,
} from "../controllers/usuarioController.js";

const router = express.Router();

router.post("/", registrarUsuarioController);

router.post("/login", loginUsuarioController);

router.post("/recuperar", recuperarCuentaController);

router.post("/login-otp", loginConOtpController);

router.patch("/cambiar-contrasena", cambiarContrasenaController);

router.get("/", listarUsuariosController);

router.get("/:id_usuario", buscarUsuarioPorIdController);

export default router;