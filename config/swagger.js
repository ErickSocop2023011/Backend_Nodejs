import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options ={
    swaggerDefinition:{
        openapi: "3.0.0",
        info:{
            title: "COPEREX API",
            version: "1.0.0",
            description: "API for Warehouse Management",
            contact:{
                name: "Hack Force Team",
                email: "esocop-2023011@kinal.edu.gt"
            }
        },
        servers:[
            {
                url: "http://127.0.0.1:3001/hotelforce/v1"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis:[
        "./src/user/user.routes.js",
        "./src/auth/auth.routes.js",
    ]
}

const swaggerDocs = swaggerJSDoc(options)

export { swaggerDocs, swaggerUi }