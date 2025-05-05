import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import authRoutes from "../src/auth/auth.routes.js"
import useRoutes from "../src/user/user.routes.js"
import hotelRoutes from "../src/hotel/hotel.routes.js"
import amenityRoutes from "../src/amenity/amenity.routes.js"
import apiLimiter from "../src/middlewares/rate-limit-validator.js"
import { dbConnection } from "./mongo.js"
import {createDefaultAdmin} from "./default-data.js"
import { swaggerDocs, swaggerUi } from "./swagger.js"


const middlewares = (app) => {
    app.use(express.urlencoded({extended: false}))
    app.use(express.json())
    app.use(cors())
    app.use(helmet())
    app.use(morgan("dev"))
    app.use(apiLimiter)
}

const routes = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
    app.use("/hotelforce/v1/auth", authRoutes);
    app.use("/hotelforce/v1/user", useRoutes)
    app.use("/hotelforce/v1/hotel", hotelRoutes)
    app.use("/hotelforce/v1/amenity", amenityRoutes)
}

const ConnectDB = async () => {
    try {
        await dbConnection()
        await createDefaultAdmin()
    } catch (err) {
        console.log(`Error connecting to database: ${err}`)
        process.exit(1)
    }
}

export const initServer = () =>{
    const app = express()
    try{
        middlewares(app)
        ConnectDB()
        routes(app)
        app.listen(process.env.PORT)
        console.log(`server running on port ${process.env.PORT}`)
    }catch(err){
        console.log(`server inti failed ${err}`)
    }
}