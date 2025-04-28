const express = require("express");
const { updateProfile } = require("../controllers/profileController");
const upload = require("../middlewares/upload");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post(
  "/profile",
  protect,
  upload.single("profilePicture"),
  updateProfile
);

module.exports = router;
