import 'dotenv/config';
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger.js';
import api from "./routes.js";

const corsOptions = {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

const app = express();

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Configuración de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

// Rutas de la API
app.use("/api/v1", api);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`API funcionando en el puerto ${PORT}`);
    console.log(`Documentación disponible en http://localhost:${PORT}/api-docs`);
});