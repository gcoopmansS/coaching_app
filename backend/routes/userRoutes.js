const express = require("express");
const { getCoaches, getUserById } = require("../controllers/userController");

const router = express.Router();

router.get("/users/coaches", getCoaches); // ✅ Fetch all coaches
router.get("/users/:id", getUserById); // ✅ Fetch user by ID

module.exports = router;
