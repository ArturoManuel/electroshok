import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import api from "./routes.js";

const corsOptions = {
    origin: "http://localhost:3000",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

console.log("Conexión exitosa a la base de datos");

const app = express();

app.use(bodyParser.json());
app.use("/api/v1", api);
app.use(cors(corsOptions));

app.listen(3000, () => {
    console.log('API funcionando en el puerto 3000');
});