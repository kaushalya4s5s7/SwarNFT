const userService = require("../services/userService");

/**
 * @desc    Get user profile details
 */
exports.getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await userService.getUserProfile(userId);
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc    Update user preferences
 */
exports.updatePreferences = async (req, res) => {
  try {
    const { userId, preferences } = req.body;
    const updatedUser = await userService.updatePreferences(
      userId,
      preferences
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc    Delete a user account
 */
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await userService.deleteUser(userId);
    res.status(200).json({ message: "User account deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
