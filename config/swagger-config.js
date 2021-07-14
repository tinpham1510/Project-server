var appRoot = require('app-root-path');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'IT Store',
            version: '1.0.0',
            description: 'Cửa hàng đồ công nghệ cũ',
            contact: {
                name: '',
                url: ''
            },
            servers: ["http://localhost:3001"]
        }
    },
    apis: [appRoot.path + "/routes/api/*.js"]
}
const swaggerDocs = swaggerJSDoc(swaggerOptions);


module.exports = {
    swaggerUI: swaggerUI,
    swaggerDocs: swaggerDocs
}