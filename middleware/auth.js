import * as auth from "../config/jwt.js";

export const authMiddleware = (roles = []) => {
    return (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ 
                    error: 'Token no proporcionado',
                    message: 'Se requiere un token de autenticación válido'
                });
            }
            
            const token = authHeader.split(' ')[1];
            const decoded = auth.verifyToken(token);
            
            if (roles.length > 0 && !roles.includes(decoded.rol)) {
                return res.status(403).json({ 
                    error: 'Permisos insuficientes',
                    message: 'No tiene los permisos necesarios para acceder a este recurso'
                });
            }

            // Añade información del usuario al request
            req.user = decoded;
            next();
        } catch (error) {
            const status = error.name === 'TokenExpiredError' ? 401 : 403;
            const message = error.name === 'TokenExpiredError' 
                ? 'El token ha expirado' 
                : 'Token inválido';

            res.status(status).json({ 
                error: error.message,
                message: message
            });
        }
    };
};
