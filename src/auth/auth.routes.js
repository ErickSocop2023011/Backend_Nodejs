import { Router } from "express"
import { register, login} from "./auth.controller.js"
import { registerValidator, loginValidator } from "../middlewares/user-validator.js"


const router = Router()

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: Successfully created user
 *       400:
 *         description: The credentials are already in use
 *       500:
 *         description: Error creating user
 */

router.post("/register", registerValidator,register)

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - password
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid Credentials
 *       500:
 *         description: Login failed, server error
 */

router.post("/login",loginValidator, login)

export default router