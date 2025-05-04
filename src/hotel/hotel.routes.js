import { Router } from "express";
import { register, getHotels, getHotel, updateHotel, deleteHotel, filterHotels } from "./hotel.controller.js";
import { registerHotelValidator, getHotelsValidator, getHotelValidator, updateHotelValidator, deleteHotelValidator, filterHotelsValidator } from "../middlewares/hotel-validator.js";

const router = Router();

/**
 * @swagger
 * /hotel/register:
 *   post:
 *     summary: Register a new hotel
 *     tags: [Hotels]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               location:
 *                 type: string
 *               phone:
 *                 type: string
 *               category:
 *                 type: string
 *               starRating:
 *                 type: number
 *     responses:
 *       201:
 *         description: Successfully created hotel
 *       400:
 *         description: The credentials are already in use
 *       500:
 *         description: Error creating hotel
 */
router.post("/register", registerHotelValidator, register);

/**
 * @swagger
 * /hotel/gethotels:
 *   get:
 *     summary: Get a list of hotels
 *     tags: [Hotels]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of hotels to return
 *       - in: query
 *         name: from
 *         schema:
 *           type: integer
 *         description: Starting index
 *     responses:
 *       200:
 *         description: List of hotels
 *       500:
 *         description: Error getting hotels
 */
router.get("/gethotels", getHotelsValidator, getHotels);

/**
 * @swagger
 * /hotel/get/{hid}:
 *   get:
 *     summary: Get a specific hotel by ID
 *     tags: [Hotels]
 *     parameters:
 *       - in: path
 *         name: hid
 *         required: true
 *         schema:
 *           type: string
 *         description: Hotel ID
 *     responses:
 *       200:
 *         description: Hotel details
 *       400:
 *         description: Hotel not found
 *       500:
 *         description: Error getting hotel
 */
router.get("/get/:hid", getHotelValidator, getHotel);

/**
 * @swagger
 * /hotel/update/{hid}:
 *   put:
 *     summary: Update a hotel by ID
 *     tags: [Hotels]
 *     parameters:
 *       - in: path
 *         name: hid
 *         required: true
 *         schema:
 *           type: string
 *         description: Hotel ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               location:
 *                 type: string
 *               phone:
 *                 type: string
 *               category:
 *                 type: string
 *               starRating:
 *                 type: number
 *     responses:
 *       200:
 *         description: Hotel updated successfully
 *       400:
 *         description: The credentials are already in use
 *       500:
 *         description: Error updating hotel
 */
router.put("/update/:hid", updateHotelValidator, updateHotel);

/**
 * @swagger
 * /hotel/delete/{hid}:
 *   delete:
 *     summary: Delete a hotel by ID
 *     tags: [Hotels]
 *     parameters:
 *       - in: path
 *         name: hid
 *         required: true
 *         schema:
 *           type: string
 *         description: Hotel ID
 *     responses:
 *       200:
 *         description: Hotel deleted successfully
 *       400:
 *         description: Hotel previously deactivated
 *       500:
 *         description: Error deleting hotel
 */
router.delete("/delete/:hid", deleteHotelValidator, deleteHotel);

/**
 * @swagger
 * /hotel/filter:
 *   get:
 *     summary: Filter hotels based on criteria
 *     tags: [Hotels]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Hotel name
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Hotel location
 *       - in: query
 *         name: phone
 *         schema:
 *           type: string
 *         description: Hotel phone
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Hotel category
 *       - in: query
 *         name: starRating
 *         schema:
 *           type: string
 *         description: Star rating range (e.g., "3,5")
 *     responses:
 *       200:
 *         description: Filtered list of hotels
 *       500:
 *         description: Internal Server Error
 */
router.get("/filter", filterHotelsValidator, filterHotels);

export default router;