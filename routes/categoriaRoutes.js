import express from "express";
import { obtenerCategorias, agregarCategoria, modificarCategoria, borrarCategoria } from "../controllers/categoriaController.js";

const router = express.Router();

router.get("/", obtenerCategorias);

router.post("/", agregarCategoria);

router.put("/:id", modificarCategoria);

router.delete("/:id", borrarCategoria);

export default router;