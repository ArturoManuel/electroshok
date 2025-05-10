import _cors from "cors";
import { FRONTEND_URL } from "../utils/constantes.js";

const corsOptions = {
    origin: FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Agregado DELETE para operaciones de eliminación
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400 // Cache preflight request results for 24 hours
};

export default _cors(corsOptions);
