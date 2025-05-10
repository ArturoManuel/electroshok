import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Electroshok',
            version: '1.0.0',
            description: 'Documentación de la API del sistema Electroshok',
        },
        servers: [
            {
                url: 'http://localhost:3000/api/v1',
                description: 'Servidor de desarrollo',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: ['./routes/*.js'], // archivos que contienen anotaciones
};

export const specs = swaggerJsdoc(options);
