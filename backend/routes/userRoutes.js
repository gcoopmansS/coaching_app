/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User fetching routes
 */

const express = require("express");
const { getCoaches, getUserById } = require("../controllers/userController");

const router = express.Router();

/**
 * @swagger
 * /api/users/coaches:
 *   get:
 *     summary: Get all users who are coaches
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of coaches
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Server error
 */

router.get("/users/coaches", getCoaches); // ✅ Fetch all coaches

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user details by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

router.get("/users/:id", getUserById); // ✅ Fetch user by ID

module.exports = router;
