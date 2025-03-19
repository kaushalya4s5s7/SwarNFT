const User = require("../../models/User");

exports.getUserProfile = async (userId) => {
  const user = await User.findById(userId).select("-__v");
  if (!user) throw new Error("User not found");
  return user;
};

exports.updatePreferences = async (userId, preferences) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { preferences },
    { new: true }
  );
  if (!user) throw new Error("User not found");
  return user;
};
