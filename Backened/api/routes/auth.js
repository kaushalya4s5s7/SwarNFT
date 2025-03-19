const express = require("express");
const authController = require("../controller/authController.js");

const router = express.Router();

router.post("/connect-wallet", authController.connectWallet);
router.post("/register-role", authController.registerRole);

module.exports = router;
