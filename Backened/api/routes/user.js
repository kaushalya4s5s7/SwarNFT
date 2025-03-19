const express = require("express");
const userController = require("../controller/userController");

const router = express.Router();

/**
 * @route   GET /api/user/:userId
 * @desc    Get user profile details
 * @access  Private (requires authentication)
 */
router.get("/:userId", userController.getUserProfile);

/**
 * @route   PUT /api/user/preferences
 * @desc    Update user preferences (e.g., favorite genres, artists)
 * @access  Private (requires authentication)
 */
router.put("/preferences", userController.updatePreferences);

/**
 * @route   DELETE /api/user/:userId
 * @desc    Delete a user account
 * @access  Private (requires authentication)
 */
router.delete("/:userId", userController.deleteUser); // Ensure deleteUser is correctly referenced

module.exports = router;
