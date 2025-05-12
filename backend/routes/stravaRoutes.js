const express = require("express");
const router = express.Router();
const stravaController = require("../controllers/stravaController");

router.get("/connect", stravaController.connectStrava);
router.get("/callback", stravaController.stravaCallback);

module.exports = router;
