const express = require("express");
const {
  getRecommendations,
} = require("../controller/recommendationController");
const router = express.Router();

router.get("/:userId", getRecommendations);

module.exports = router;
