const express = require("express");
const musicController = require("../controller/musicController");

const router = express.Router();

router.post("/upload", musicController.uploadMusic);
router.get("/:musicId", musicController.getMusicDetails);

module.exports = router;
