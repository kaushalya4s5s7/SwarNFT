const express = require("express");
const nftController = require("../controller/nftController");

const router = express.Router();

router.post("/mint", nftController.mintNFT);
router.get("/owner/:userId", nftController.getNFTsByOwner);

module.exports = router;
