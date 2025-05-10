import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES } from "../utils/constantes.js";

export const generateToken = (user) => {
    return jwt.sign(
        { id_persona: user.id_persona, email: user.email, rol: user.rol },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES }
    );
};

export const generateRefreshToken = (user) => {
    return jwt.sign(
        { id_persona: user.id_persona },
        JWT_REFRESH_SECRET,
        { expiresIn: JWT_REFRESH_EXPIRES }
    );
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new Error('Token inválido o expirado');
    }
};

export const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, JWT_REFRESH_SECRET);
    } catch (error) {
        throw new Error('Token inválido o expirado');
    }
};
