const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.connectWallet = async (walletAddress) => {
  const user = await User.findOne({ walletAddress });
  if (user) {
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return { exists: true, token, role: user.role };
  }
  return { exists: false };
};

exports.registerRole = async (walletAddress, role) => {
  const existingUser = await User.findOne({ walletAddress });
  if (existingUser) {
    throw new Error("Wallet already registered!");
  }

  const newUser = new User({ walletAddress, role }); // Store the raw walletAddress
  await newUser.save();
  console.log(newUser);

  const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return { token, role };
};
exports.getUserByWallet = async (walletAddress) => {
  try {
    return await User.findOne({ walletAddress: walletAddress.toLowerCase() });
  } catch (error) {
    throw new Error("Error fetching user from database");
  }
};
