import { Router } from 'express';
import { registerAmenityValidator, updateAmenityValidator, deleteAmenityValidator } from '../middlewares/amenity-validator.js';
import { register, update, deleteA, getA } from './amenity.controller.js';

const router = Router();

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new amenity
 *     tags: [Amenity]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *             required:
 *               - name
 *     responses:
 *       201:
 *         description: Successfully created amenity
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post('/register', registerAmenityValidator, register);

/**
 * @swagger
 * /update/{aid}:
 *   put:
 *     summary: Update an existing amenity
 *     tags: [Amenity]
 *     parameters:
 *       - in: path
 *         name: aid
 *         required: true
 *         schema:
 *           type: string
 *         description: Amenity ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully updated amenity
 *       400:
 *         description: Validation error
 *       404:
 *         description: Amenity not found
 *       500:
 *         description: Server error
 */
router.put('/update/:aid', updateAmenityValidator, update);

/**
 * @swagger
 * /delete/{aid}:
 *   delete:
 *     summary: Delete an amenity
 *     tags: [Amenity]
 *     parameters:
 *       - in: path
 *         name: aid
 *         required: true
 *         schema:
 *           type: string
 *         description: Amenity ID
 *     responses:
 *       200:
 *         description: Successfully deleted amenity
 *       404:
 *         description: Amenity not found
 *       500:
 *         description: Server error
 */
router.delete('/delete/:aid', deleteAmenityValidator, deleteA);

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get all amenities
 *     tags: [Amenity]
 *     responses:
 *       200:
 *         description: List of amenities
 *       500:
 *         description: Server error
 */
router.get('/', getA);

export default router;
