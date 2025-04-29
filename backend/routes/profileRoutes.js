/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: Manage user profile (update info, upload picture)
 */

const express = require("express");
const { updateProfile } = require("../controllers/profileController");
const upload = require("../middlewares/upload");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/profile:
 *   post:
 *     summary: Update user's profile info and profile picture
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User ID
 *               city:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               bio:
 *                 type: string
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *                 description: Profile picture file (optional)
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

router.post(
  "/profile",
  protect,
  upload.single("profilePicture"),
  updateProfile
);

module.exports = router;
