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

  const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return { token, role };
};
