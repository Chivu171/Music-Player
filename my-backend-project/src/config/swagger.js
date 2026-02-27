const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Music Player API',
            version: '1.0.0',
            description: 'API documentation for the Music Player backend',
        },
        servers: [
            {
                url: 'http://localhost:8000',
                description: 'Development server',
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
    // Đường dẫn tới các file chứa annotation (routes, controllers, models)
    apis: ['./src/routes/*.js', './src/models/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
