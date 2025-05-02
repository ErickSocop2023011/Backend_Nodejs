import { Router } from "express"
import { updateMe, updatePassword, deleteMe, updateUser, deleteUser } from './user.controller.js';
import { updatePasswordValidator, updateUserValidator, deleteMeValidator, updateMeValidator, deleteUserValidator } from "../middlewares/user-validator.js"

const router = Router()

/**
 * @swagger
 * /user/updatePassword:
 *   patch:
 *     summary: Update user password
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated password
 *       400:
 *         description: Old password does not match or new password is the same as the old one
 *       500:
 *         description: Error updating password
 */
router.patch('/updatePassword', updatePasswordValidator, updatePassword)

/**
 * @swagger
 * /user/updateMe:
 *   put:
 *     summary: Update current user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               surname:
 *                 type: string
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated user
 *       500:
 *         description: Error updating user
 */
router.put('/updateMe', updateMeValidator, updateMe)

/**
 * @swagger
 * /user/updateUser/{uid}:
 *   put:
 *     summary: Update user by admin
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated user
 *       400:
 *         description: User not found
 *       403:
 *         description: You cannot modify another admin
 *       500:
 *         description: Error updating user
 */
router.put("/updateUser/:uid",updateUserValidator, updateUser)

/**
 * @swagger
 * /user/deleteMe:
 *   delete:
 *     summary: Delete current user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Deleted user
 *       500:
 *         description: Error deleting user
 */
router.delete('/deleteMe', deleteMeValidator, deleteMe )

/**
 * @swagger
 * /user/deleteUser/{uid}:
 *   delete:
 *     summary: Delete user by admin
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted
 *       400:
 *         description: User not found
 *       403:
 *         description: You cannot delete another admin
 *       500:
 *         description: Error deleting user
 */
router.delete("/deleteUser/:uid",deleteUserValidator, deleteUser )

export default router
